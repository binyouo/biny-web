import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const html = await readFile("dist/index.html", "utf8");
const sitemap = await readFile("dist/sitemap.xml", "utf8");
// 旧 /zh 前缀地址和 /download 由 SPA 在客户端重定向，也需要实际文件。
const routes = new Set(["/zh", "/download", "/zh/download"]);
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const route = new URL(match[1]).pathname;
  if (route === "/") continue;
  routes.add(route);
  routes.add(`/zh${route}`);
}
// 每个公开路由有实际文件，直接访问和刷新不依赖托管方的 rewrite。
for (const route of routes) {
  const directory = path.join("dist", route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}
await writeFile("dist/404.html", html);
console.log(`Prepared ${routes.size} Pages routes and the not-found entry.`);
