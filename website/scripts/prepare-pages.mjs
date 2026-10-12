import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const html = await readFile("dist/index.html", "utf8");
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const routes = new Set(["/download", "/docs"]);
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const route = new URL(match[1]).pathname;
  routes.add(route);
  if (route.startsWith("/zh/docs/")) routes.add(route.slice(3));
}
// 每个公开路由有实际文件，直接访问和刷新不依赖托管方的 rewrite。
for (const route of routes) {
  const directory = path.join("dist", route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}
await writeFile("dist/404.html", html);
console.log(`Prepared ${routes.size} Pages routes and the not-found entry.`);
