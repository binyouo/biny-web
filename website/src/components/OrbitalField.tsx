import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/** A small, local canvas scene. No textures, network requests, or WebGL context. */
export function OrbitalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !host || !context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0, height = 0, frame = 0, time = timeRef.current, previous = 0;
    let visible = true, dark = false;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    const particles = Array.from({ length: 3000 }, (_, i) => ({
      angle: i * 2.39996323,
      band: (i % 53) / 52,
      size: .7 + (i % 7) * .14,
    }));

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const scale = Math.min(width, height) * .35;
      const tilt = -.44 + y * .18;
      const rotation = time * .12 + x * .22;
      const cos = Math.cos(tilt), sin = Math.sin(tilt);
      const centerX = width * .5, centerY = height * .49;
      const stride = width < 500 ? 2 : 1;
      // A twisted torus: the same points form a continuous, slowly turning ribbon.
      for (let i = 0; i < particles.length; i += stride) {
        const p = particles[i];
        const a = p.angle + rotation;
        const b = p.band * Math.PI * 2;
        const radius = 1 + .28 * Math.cos(b);
        const px = Math.cos(a) * radius;
        const py = Math.sin(a) * radius;
        const pz = .28 * Math.sin(b) + .2 * Math.sin(a * 3 + time * .22);
        const ry = py * cos - pz * sin;
        const rz = py * sin + pz * cos;
        const perspective = 2.8 / (2.8 - rz);
        const sx = centerX + (px * .88 - ry * .3) * scale * perspective;
        const sy = centerY + (px * .32 + ry * .8) * scale * perspective;
        const alpha = Math.max(.12, Math.min(.9, .48 + rz * .42));
        context.fillStyle = i % 11 === 0
          ? `rgba(${dark ? "240,240,240" : "48,48,48"},${alpha + .1})`
          : `rgba(${dark ? "205,205,205" : "65,65,65"},${alpha})`;
        const size = p.size * perspective;
        context.fillRect(sx, sy, size, size);
      }
      // A quiet orbital path and its travelling point give the shape a second depth plane.
      context.save();
      context.translate(centerX, centerY);
      context.rotate(-.4);
      context.strokeStyle = dark ? "rgba(240,240,240,.18)" : "rgba(50,50,50,.2)";
      context.lineWidth = .75;
      context.beginPath();
      context.ellipse(0, 0, scale * 1.42, scale * .58, 0, 0, Math.PI * 2);
      context.stroke();
      const angle = time * .23;
      context.fillStyle = dark ? "#eeeeee" : "#484848";
      context.beginPath();
      context.arc(Math.cos(angle) * scale * 1.42, Math.sin(angle) * scale * .58, 3, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };
    const animate = (now: number) => {
      frame = 0;
      time += previous ? Math.min((now - previous) / 1000, .05) : 0;
      previous = now;
      x += (targetX - x) * .045;
      y += (targetY - y) * .045;
      draw();
      frame = requestAnimationFrame(animate);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      setReduced(motion.matches);
      dark = document.documentElement.dataset.theme === "dark";
      draw();
      if (visible && !document.hidden && !motion.matches && !paused) frame = requestAnimationFrame(animate);
    };
    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      sync();
    };
    const move = (event: PointerEvent) => {
      if (!pointer.matches || motion.matches || paused) return;
      const bounds = host.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / width - .5;
      targetY = (event.clientY - bounds.top) / height - .5;
    };
    const leave = () => { targetX = 0; targetY = 0; };
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const themeObserver = new MutationObserver(sync);
    resizeObserver.observe(host);
    intersection.observe(host);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    resize();
    return () => {
      timeRef.current = time;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [paused]);

  return <div className="orbital-field">
    <canvas ref={canvasRef} aria-hidden="true" />
    {!reduced && <button className="orbit-pause" type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "播放背景动效" : "暂停背景动效"} aria-pressed={paused}>
      <span className="t-icon-swap" data-state={paused ? "a" : "b"} aria-hidden="true">
        <span className="t-icon" data-icon="a"><Icon name="play" size={13} /></span>
        <span className="t-icon" data-icon="b"><Icon name="pause" size={13} /></span>
      </span>
    </button>}
  </div>;
}
