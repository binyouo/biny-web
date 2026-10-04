import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRelease } from "../src/lib/releases.ts";

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
