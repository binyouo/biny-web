"""Generate Biny's pixel-art hero scenes.

Style notes (kept in one place so all three scenes match):
- Everything is drawn on a small logical canvas, then upscaled with NEAREST so
  the pixel grid survives. No anti-aliasing anywhere.
- Light is expressed with ordered (Bayer 4x4) dithering, the way the reference
  sites do it: a handful of grey levels, arranged in a 4x4 matrix, never a
  smooth gradient.
- Palettes are strictly monochrome. Dark scene = light-on-black; the light
  scene is the same drawing inverted for the day theme.

Output: PNG with alpha, ~1440x900 logical -> 4x upscale for retina.
"""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image

W, H = 720, 450          # logical pixels
SCALE = 3                # export scale -> 2160x1350
OUT = Path(__file__).resolve().parents[1] / "public" / "scenes"

# 4x4 ordered dither matrix, normalised to 0..1
BAYER4 = np.array([
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
], dtype=float) / 16.0


def dither_mask(level: np.ndarray) -> np.ndarray:
    """Turn a 0..1 luminance field into a 1-bit ordered-dither mask."""
    h, w = level.shape
    tile = np.tile(BAYER4, (h // 4 + 1, w // 4 + 1))[:h, :w]
    return level > tile


def canvas() -> np.ndarray:
    return np.zeros((H, W), dtype=float)


def disc(cx: float, cy: float, r: float, soft: float = 0.0) -> np.ndarray:
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.hypot(xx - cx, yy - cy)
    if soft <= 0:
        return (d <= r).astype(float)
    return np.clip((r - d) / soft + 0.5, 0, 1)


def ridge(y_base: float, amp: float, freq: float, phase: float = 0.0, octave: float = 0.0) -> np.ndarray:
    """A horizon line as a 0..1 field above the line."""
    xs = np.arange(W)
    line = y_base + amp * np.sin(xs / W * math.tau * freq + phase)
    if octave:
        line += octave * np.sin(xs / W * math.tau * freq * 2.7 + phase * 1.7)
    yy = np.arange(H)[:, None]
    return (yy > line[None, :]).astype(float)


def stars(rng: np.random.Generator, count: int, y_max: float) -> np.ndarray:
    field = canvas()
    ys = rng.integers(0, int(y_max), count)
    xs = rng.integers(0, W, count)
    for x, y in zip(xs, ys):
        field[y, x] = 1.0
        if rng.random() < 0.12:  # a few bright ones get a plus shape
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if 0 <= y + dy < H and 0 <= x + dx < W:
                    field[y + dy, x + dx] = max(field[y + dy, x + dx], 0.6)
    return field


def compose(layers: list[tuple[np.ndarray, float]]) -> np.ndarray:
    """Additively stack (field, strength) pairs, clamped to 1."""
    out = canvas()
    for field, strength in layers:
        out = np.maximum(out, field * strength)
    return np.clip(out, 0, 1)


def to_image(level: np.ndarray, fg=(255, 255, 255), levels: int = 5) -> Image.Image:
    """Quantise to a few grey levels, then order-dither the edges between them."""
    quant = np.round(level * (levels - 1)) / (levels - 1)
    # dither the residual so the steps read as texture rather than banding
    residual = (level - quant)
    mask = dither_mask(np.clip(residual * 3 + 0.5, 0, 1))
    stepped = np.clip(quant + np.where(mask, 1.0 / (levels - 1), 0), 0, 1)
    rgba = np.zeros((H, W, 4), dtype=np.uint8)
    for i in range(3):
        rgba[..., i] = (stepped * fg[i]).astype(np.uint8)
    rgba[..., 3] = (np.clip(stepped * 1.35, 0, 1) * 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def save(img: Image.Image, name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    img.resize((W * SCALE, H * SCALE), Image.NEAREST).save(OUT / name, optimize=True)
    print("wrote", name, img.size, "->", (W * SCALE, H * SCALE))


# ── Scene 1: window at night ────────────────────────────────────────────────
# A room seen from inside. The window sits high and off-centre so the headline
# never fights it; the desk and lamp stay in the lower corners.
def scene_window() -> Image.Image:
    rng = np.random.default_rng(7)
    field = canvas()

    cx, cy, r = W * 0.60, H * 0.40, 96

    # room walls: vertical dither, brighter near the window
    yy, xx = np.mgrid[0:H, 0:W]
    wall = np.clip(1 - np.hypot((xx - cx) / (W * 0.62), (yy - cy) / (H * 0.72)), 0, 1)
    field = np.maximum(field, wall * 0.20)

    # window glass: a slightly lighter disc with a hard rim
    glass = disc(cx, cy, r)
    field = np.maximum(field, glass * 0.07)
    rim = np.clip(disc(cx, cy, r + 2) - disc(cx, cy, r - 1), 0, 1)
    field = np.maximum(field, rim * 0.62)

    # mullions: one vertical, one horizontal, a pixel wide
    mull = np.zeros_like(field)
    mull[int(cy - r):int(cy + r), int(cx):int(cx + 1)] = 1
    mull[int(cy):int(cy + 1), int(cx - r):int(cx + r)] = 1
    field = np.maximum(field, mull * 0.5 * glass)

    # moon low inside the window
    field = np.maximum(field, disc(cx + 26, cy + 34, 15) * 0.95)
    field = np.maximum(field, disc(cx + 26, cy + 34, 26, soft=12) * 0.22 * glass)

    # floor line
    floor = ridge(H * 0.84, 3, 1.0, 0.6)
    field = np.maximum(field, floor * 0.12)

    # desk in the lower left corner, lamp on it
    desk = np.zeros_like(field)
    desk[int(H * 0.80):int(H * 0.82), 0:int(W * 0.30)] = 1
    field = np.maximum(field, desk * 0.42)
    lamp = np.zeros_like(field)
    lamp[int(H * 0.62):int(H * 0.80), int(W * 0.10):int(W * 0.105)] = 1
    field = np.maximum(field, lamp * 0.42)
    field = np.maximum(field, disc(W * 0.102, H * 0.605, 9) * 0.8)
    field = np.maximum(field, disc(W * 0.102, H * 0.605, 26, soft=16) * 0.2)

    # shelf in the lower right, small
    shelf = np.zeros_like(field)
    shelf[int(H * 0.72):int(H * 0.73), int(W * 0.78):int(W * 0.99)] = 1
    shelf[int(H * 0.88):int(H * 0.89), int(W * 0.78):int(W * 0.99)] = 1
    field = np.maximum(field, shelf * 0.36)
    for i, (x, h) in enumerate(((0.80, 0.07), (0.85, 0.10), (0.90, 0.05), (0.94, 0.08))):
        book = np.zeros_like(field)
        book[int(H * (0.72 - h)):int(H * 0.72), int(W * x):int(W * x + 7)] = 1
        field = np.maximum(field, book * (0.32 + i * 0.04))

    # a few stars outside the window, never inside it
    sky = stars(rng, 170, H * 0.86)
    field = np.maximum(field, sky * 0.55 * (1 - disc(cx, cy, r + 8)))

    return to_image(field)


# ── Scene 2: star field and horizon ────────────────────────────────────────
# Wide open sky, a distant range of hills, and a small moon low on the left.
def scene_horizon() -> Image.Image:
    rng = np.random.default_rng(11)
    field = canvas()

    sky = stars(rng, 520, H * 0.72)
    # density falls off toward the horizon
    fade = np.clip((H * 0.72 - np.arange(H)[:, None]) / (H * 0.72), 0, 1)
    field = np.maximum(field, sky * (0.35 + 0.65 * fade))

    # a faint band of denser stars, like a milky way strip
    band = np.exp(-((np.arange(H)[:, None] - H * 0.3) ** 2) / (2 * (H * 0.09) ** 2))
    field = np.maximum(field, band * stars(rng, 420, H * 0.7) * 0.55)

    # moon low left
    field = np.maximum(field, disc(W * 0.2, H * 0.66, 34) * 0.9)
    craters = [
        (W * 0.19, H * 0.65, 7), (W * 0.23, H * 0.69, 5), (W * 0.17, H * 0.70, 4),
    ]
    for cx, cy, r in craters:
        field = np.maximum(field, disc(cx, cy, r) * 0.45)

    # two ranges of hills
    far = ridge(H * 0.80, 14, 1.6, 1.2, octave=5)
    near = ridge(H * 0.90, 10, 2.4, 0.3, octave=4)
    field = np.maximum(field, far * 0.18)
    field = np.maximum(field, near * 0.30)

    return to_image(field)


# ── Scene 3: orbit ─────────────────────────────────────────────────────────
# A planet limb across the bottom, a small satellite, ring arcs.
def scene_orbit() -> Image.Image:
    rng = np.random.default_rng(23)
    field = canvas()

    field = np.maximum(field, stars(rng, 380, H) * 0.45)

    # planet limb bottom-left
    planet = disc(W * 0.28, H * 1.55, H * 0.95)
    field = np.maximum(field, planet * 0.22)
    # terminator: darker toward the lower right
    yy, xx = np.mgrid[0:H, 0:W]
    shade = np.clip((xx / W * 0.7 + yy / H * 0.5) - 0.35, 0, 1)
    field = np.maximum(field, planet * shade * 0.28)
    # rim light on the planet edge
    rim = np.clip(disc(W * 0.28, H * 1.55, H * 0.95) - disc(W * 0.28, H * 1.55, H * 0.95 - 3), 0, 1)
    field = np.maximum(field, rim * 0.6)

    # orbit arcs around a small satellite
    cx, cy = W * 0.68, H * 0.42
    for r, strength in ((78, 0.22), (108, 0.16), (140, 0.1)):
        ring = np.clip(disc(cx, cy, r + 0.8) - disc(cx, cy, r - 0.8), 0, 1)
        field = np.maximum(field, ring * strength)

    # satellite: a tiny pixel cube
    sx, sy = int(cx), int(cy)
    field[sy - 6:sy + 6, sx - 6:sx + 6] = 0.85
    field[sy - 3:sy + 3, sx - 3:sx + 3] = 0.3
    field[sy - 10:sy - 6, sx - 1:sx + 1] = 0.6
    field[sy + 6:sy + 10, sx - 1:sx + 1] = 0.6

    return to_image(field)




# ── Scene 4: distant range (parallax backdrop) ──────────────────────────────
# A low, wide mountain range that sits behind everything and moves slower than
# the page. Kept deliberately faint so text can sit on top of it.
def scene_range() -> Image.Image:
    rng = np.random.default_rng(41)
    field = canvas()

    field = np.maximum(field, stars(rng, 240, H * 0.62) * 0.32)

    # three ranges, farther = fainter
    far = ridge(H * 0.74, 18, 1.1, 2.0, octave=6)
    mid = ridge(H * 0.83, 24, 1.7, 0.7, octave=8)
    near = ridge(H * 0.93, 16, 2.9, 3.1, octave=5)
    field = np.maximum(field, far * 0.10)
    field = np.maximum(field, mid * 0.16)
    field = np.maximum(field, near * 0.24)

    # a thin moon far right, almost lost
    field = np.maximum(field, disc(W * 0.86, H * 0.28, 16) * 0.7)
    field = np.maximum(field, disc(W * 0.86, H * 0.28, 30, soft=14) * 0.14)

    return to_image(field)


# ── Scene 5: screen (the interlude / screensaver) ───────────────────────────
# An old monitor, front-on, floating in the dark. The screen holds a starfield
# and a prompt line. No desk plane: the whole frame is the room.
def scene_screen() -> Image.Image:
    rng = np.random.default_rng(53)
    field = canvas()

    cx, cy = W * 0.5, H * 0.47
    sw, sh = W * 0.235, H * 0.235       # screen half-size
    bx, by = sw + 14, sh + 14           # bezel

    yy, xx = np.mgrid[0:H, 0:W]
    outer = (np.abs(xx - cx) < bx) & (np.abs(yy - cy) < by)
    inner = (np.abs(xx - cx) < sw) & (np.abs(yy - cy) < sh)

    # bezel body, slightly lighter than the void
    field = np.maximum(field, outer.astype(float) * 0.22)
    # hard rim on the bezel
    rim = outer & ~((np.abs(xx - cx) < bx - 2) & (np.abs(yy - cy) < by - 2))
    field = np.maximum(field, rim.astype(float) * 0.55)

    # screen interior: near-black with stars
    star = stars(rng, 90, H)
    inside = np.zeros_like(field)
    y0, y1 = int(cy - sh), int(cy + sh)
    x0, x1 = int(cx - sw), int(cx + sw)
    inside[y0:y1, x0:x1] = star[y0:y1, x0:x1]
    field = np.maximum(field, inside * 0.9)

    # two prompt lines inside the screen
    line = np.zeros_like(field)
    line[int(cy + sh * 0.30):int(cy + sh * 0.30) + 3, int(cx - sw * 0.62):int(cx - sw * 0.62) + 4] = 1
    line[int(cy + sh * 0.30):int(cy + sh * 0.30) + 3, int(cx - sw * 0.50):int(cx - sw * 0.50) + 26] = .55
    line[int(cy + sh * 0.54):int(cy + sh * 0.54) + 3, int(cx - sw * 0.62):int(cx - sw * 0.62) + 4] = 1
    line[int(cy + sh * 0.54):int(cy + sh * 0.54) + 3, int(cx - sw * 0.50):int(cx - sw * 0.50) + 40] = .38
    field = np.maximum(field, line)

    # stand: a narrow neck and a short foot
    neck = np.zeros_like(field)
    neck[int(cy + by):int(cy + by + 16), int(cx - 7):int(cx + 7)] = 1
    neck[int(cy + by + 16):int(cy + by + 20), int(cx - 30):int(cx + 30)] = 1
    field = np.maximum(field, neck * 0.28)

    # faint spill of light around the monitor
    field = np.maximum(field, disc(cx, cy, max(bx, by) * 1.9, soft=max(bx, by) * 1.1) * 0.12)

    return to_image(field)


if __name__ == "__main__":
    save(scene_window(), "window.png")
    save(scene_horizon(), "horizon.png")
    save(scene_orbit(), "orbit.png")
    save(scene_range(), "range.png")
    save(scene_screen(), "screen.png")
