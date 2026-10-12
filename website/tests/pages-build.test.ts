import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

// Pages 没有服务器 rewrite；发布文件必须让下载和文档深链接直接返回网站入口。
test("Pages artifacts serve sitemap routes, old entry links and unknown-route handling", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "biny-pages-build-"));
  const html = '<!doctype html><div id="root"></div><script src="/assets/main.js"></script>';
  try {
    await mkdir(path.join(root, "dist"));
    await writeFile(path.join(root, "dist/index.html"), html);
    await writeFile(path.join(root, "dist/sitemap.xml"), '<urlset><url><loc>https://biny.online/zh/</loc></url><url><loc>https://biny.online/zh/download</loc></url><url><loc>https://biny.online/zh/docs/memory</loc></url></urlset>');
    const result = spawnSync(process.execPath, [path.resolve("scripts/prepare-pages.mjs")], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    for (const route of ["zh", "zh/download", "zh/docs/memory", "download", "docs", "docs/memory"]) {
      assert.equal(await readFile(path.join(root, "dist", route, "index.html"), "utf8"), html, route);
    }
    assert.equal(await readFile(path.join(root, "dist/404.html"), "utf8"), html);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
