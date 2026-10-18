import { useCallback, useEffect, useState } from "react";
import { SITE } from "./site.ts";
import releaseSnapshot from "./release-snapshot.json" with { type: "json" };

export type Arch = "arm64" | "x64" | "universal";
export type Platform = "macos" | "windows" | "linux";
export type AssetKind = "dmg" | "zip" | "exe" | "msi" | "AppImage" | "deb" | "rpm";

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
  arch: Arch;
  platform: Platform;
  kind: AssetKind;
}

export interface ReleaseInfo {
  version: string;
  publishedAt: string | null;
  assets: ReleaseAsset[];
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function classify(name: string): { arch: Arch; kind: AssetKind; platform: Platform } | null {
  const lower = name.toLowerCase();
  if (!/^biny[-_. ]/.test(lower)) return null;
  const extension = lower.split(".").pop();
  const kind = extension === "appimage" ? "AppImage" : extension;
  let platform: Platform;
  if (kind === "exe" || kind === "msi") platform = "windows";
  else if (kind === "AppImage" || kind === "deb" || kind === "rpm") platform = "linux";
  else if ((kind === "dmg" || kind === "zip") && !/(?:windows|linux|win32)/.test(lower)) platform = "macos";
  else return null;
  const architecture = lower.match(/(?:^|[-_. ])(arm64|aarch64|universal|x86_64|x64|intel|amd64)(?=[-_. ]|$)/)?.[1];
  if (!architecture || (architecture === "universal" && platform !== "macos")) return null;
  const arch: Arch = architecture === "arm64" || architecture === "aarch64" ? "arm64" : architecture === "universal" ? "universal" : "x64";
  return { arch, kind, platform };
}

/** Prefer the macOS installer to a second ZIP download of the same architecture. */
export function platformAssets(assets: ReleaseAsset[], platform: Platform): ReleaseAsset[] {
  const matches = assets.filter(asset => asset.platform === platform);
  return matches.filter(asset => asset.kind !== "zip" || !matches.some(other => other.arch === asset.arch && other.kind === "dmg"));
}

export function parseRelease(value: unknown): ReleaseInfo {
  if (Array.isArray(value)) {
    for (const candidate of value) {
      if (!record(candidate)) throw new TypeError("Invalid release response");
      if (candidate.draft === true) continue;
      const release = parseRelease(candidate);
      if (release.assets.length) return release;
    }
    return { version: "", publishedAt: null, assets: [] };
  }
  if (!record(value) || typeof value.tag_name !== "string" || !Array.isArray(value.assets)) {
    throw new TypeError("Invalid release response");
  }
  const assets: ReleaseAsset[] = [];
  for (const asset of value.assets) {
    if (!record(asset) || typeof asset.name !== "string" || typeof asset.browser_download_url !== "string"
      || typeof asset.size !== "number" || !Number.isFinite(asset.size) || asset.size < 0) continue;
    const classified = classify(asset.name);
    if (!classified) continue;
    try {
      if (new URL(asset.browser_download_url).protocol !== "https:") continue;
    } catch {
      continue;
    }
    assets.push({ name: asset.name, url: asset.browser_download_url, size: asset.size, ...classified });
  }
  const order: Record<Arch, number> = { arm64: 0, universal: 1, x64: 2 };
  const kindOrder: Record<AssetKind, number> = { dmg: 0, zip: 1, exe: 0, msi: 1, AppImage: 0, deb: 1, rpm: 2 };
  assets.sort((a, b) => order[a.arch] - order[b.arch] || kindOrder[a.kind] - kindOrder[b.kind] || a.name.localeCompare(b.name));
  return {
    version: value.tag_name.replace(/^v/, ""),
    publishedAt: typeof value.published_at === "string" ? value.published_at : null,
    assets
  };
}

export type ReleaseState =
  | { status: "loading" }
  | { status: "ready"; release: ReleaseInfo; cached?: boolean }
  | { status: "unpublished" }
  | { status: "error" };

class NotPublished extends Error {}

export function useLatestRelease(): ReleaseState & { retry: () => void } {
  const [state, setState] = useState<ReleaseState>({ status: "loading" });
  const [request, setRequest] = useState(0);
  const retry = useCallback(() => {
    setState({ status: "loading" });
    setRequest((current) => current + 1);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = window.setTimeout(() => controller.abort(), 10_000);
    fetch(SITE.releasesApi, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((response) => {
        if (response.status === 404) throw new NotPublished();
        if (!response.ok) throw new Error(`GitHub 返回 ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        const release = parseRelease(data);
        if (active) setState(release.assets.length ? { status: "ready", release } : { status: "unpublished" });
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof NotPublished) setState({ status: "unpublished" });
        else {
          // An API rate limit must not hide installers already published on GitHub.
          const release = parseRelease(releaseSnapshot);
          setState(release.assets.length ? { status: "ready", release, cached: true } : { status: "error" });
        }
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [request]);
  return { ...state, retry };
}

export type NpmState = { status: "loading" } | { status: "ready"; version: string } | { status: "error" };

export function useNpmVersion(): NpmState {
  const [state, setState] = useState<NpmState>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = window.setTimeout(() => controller.abort(), 10_000);
    fetch(SITE.npmApi, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`npm 返回 ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        if (active) setState(record(data) && typeof data.version === "string" && data.version.length
          ? { status: "ready", version: data.version } : { status: "error" });
      })
      .catch(() => { if (active) setState({ status: "error" }); })
      .finally(() => window.clearTimeout(timer));
    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);
  return state;
}

export function formatSize(bytes: number): string {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(date);
}
