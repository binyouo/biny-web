import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRelease, platformAssets } from "../src/lib/releases.ts";

const asset = (name: string) => ({
  name,
  browser_download_url: `https://github.com/binyouo/Biny-Agent/releases/download/v1.0.0/${name}`,
  size: 1024
});

test("download catalog keeps explicit macOS architectures and orders the installers", () => {
  const release = parseRelease({
    tag_name: "v1.0.0",
    name: "Biny 1.0.0",
    published_at: "2026-10-02T00:00:00Z",
    assets: [
      asset("Biny-1.0.0-x64.zip"),
      asset("Biny-1.0.0-arm64.zip"),
      asset("Biny-1.0.0-universal.dmg"),
      asset("Biny-1.0.0-arm64.dmg"),
      asset("Biny-1.0.0-x64.dmg"),
      asset("Biny-1.0.0.zip"),
      asset("Biny-1.0.0-Windows-x64.zip"),
      asset("checksums.txt")
    ]
  });
  assert.equal(release.version, "1.0.0");
  assert.deepEqual(release.assets.map(({ arch, kind }) => [arch, kind]), [
    ["arm64", "dmg"], ["arm64", "zip"], ["universal", "dmg"], ["x64", "dmg"], ["x64", "zip"]
  ]);
});

test("an empty release has no invented version or installation package", () => {
  const release = parseRelease({ tag_name: "", name: null, published_at: null, assets: [] });
  assert.equal(release.version, "");
  assert.deepEqual(release.assets, []);
});

test("invalid API payloads are errors rather than unpublished releases", () => {
  for (const value of [null, {}, { tag_name: "v1.0.0", assets: "not-an-array" }]) {
    assert.throws(() => parseRelease(value as never), /release/i);
  }
});

test("malformed download assets are omitted without hiding valid installers", () => {
  const release = parseRelease({
    tag_name: "v1.0.0", name: null, published_at: null,
    assets: [
      asset("Biny-1.0.0-arm64.dmg"),
      { ...asset("Biny-1.0.0-x64.dmg"), browser_download_url: "javascript:alert(1)" },
      { ...asset("Biny-1.0.0-universal.zip"), size: -1 },
      null
    ]
  } as never);
  assert.deepEqual(release.assets.map(({ name }) => name), ["Biny-1.0.0-arm64.dmg"]);
});

test("a public Beta is available even when no stable release exists", () => {
  const release = parseRelease([
    { tag_name: "v0.0.1-beta.2", draft: false, prerelease: true, published_at: "2026-10-11T21:37:32Z", assets: [asset("Biny-0.0.1-beta.2-arm64.dmg"), asset("Biny-0.0.1-beta.2-x64.dmg")] }
  ]);
  assert.equal(release.version, "0.0.1-beta.2");
  assert.deepEqual(release.assets.map(({ arch }) => arch), ["arm64", "x64"]);
});

test("release discovery skips drafts and releases without installers; an empty list stays unpublished", () => {
  const release = parseRelease([
    { tag_name: "v9", draft: true, assets: [asset("Biny-9-arm64.dmg")] },
    { tag_name: "v2", draft: false, assets: [] },
    { tag_name: "v1", draft: false, assets: [asset("Biny-1-arm64.dmg")] }
  ]);
  assert.equal(release.version, "1");
  assert.deepEqual(parseRelease([]), { version: "", publishedAt: null, assets: [] });
  assert.throws(() => parseRelease([null]), /release/i);
});


test("desktop downloads classify real platform formats without inventing architectures", () => {
  const release = parseRelease({ tag_name: "v1", assets: [
    asset("Biny-1-x64.exe"), asset("Biny-1-arm64.msi"),
    asset("Biny-1-x86_64.AppImage"), asset("Biny_1_amd64.deb"), asset("Biny-1-aarch64.rpm"),
    asset("Biny-1.exe"), asset("Biny-1-universal.deb"), asset("Biny-1-x64.AppImage.blockmap")
  ] });
  assert.deepEqual(platformAssets(release.assets, "windows").map(({ arch, kind }) => [arch, kind]), [["arm64", "msi"], ["x64", "exe"]]);
  assert.deepEqual(platformAssets(release.assets, "linux").map(({ arch, kind }) => [arch, kind]), [["arm64", "rpm"], ["x64", "AppImage"], ["x64", "deb"]]);
  assert.deepEqual(platformAssets(release.assets, "macos"), []);
});

test("macOS presents one installer per architecture and keeps ZIP when no DMG exists", () => {
  const release = parseRelease({ tag_name: "v1", assets: [
    asset("Biny-1-arm64.zip"), asset("Biny-1-arm64.dmg"), asset("Biny-1-x64.zip")
  ] });
  assert.deepEqual(platformAssets(release.assets, "macos").map(asset => asset.name), ["Biny-1-arm64.dmg", "Biny-1-x64.zip"]);
});
