import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { act, createElement } from "react";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");
const { build } = require("esbuild");

test("脱敏演示保留真实筛选与请求对照，清除后可恢复虚构数据", async context => {
  const dom = new JSDOM('<div class="preview-scroll privacy-settings" id="root"></div>', { url: "http://localhost/privacy-demo.html" });
  class Observer { observe() {} disconnect() {} }
  dom.window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  dom.window.HTMLElement.prototype.scrollTo = function () {};
  const globals = { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
    Element: dom.window.Element, Node: dom.window.Node, ResizeObserver: Observer, IntersectionObserver: Observer,
    IS_REACT_ACT_ENVIRONMENT: true };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  const directory = await mkdtemp(fileURLToPath(new URL("../.privacy-test-", import.meta.url)));
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(dom.window.document.getElementById("root"));
  context.after(async () => {
    await act(async () => root.unmount());
    await rm(directory, { recursive: true, force: true });
    dom.window.close();
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  await build({ stdin: { contents: 'export { PrivacyRecords } from "./src/demo/privacy/PrivacyRecords.tsx"; export { createExamples, resetExamples } from "./src/demo/privacy/data.ts";',
    resolveDir: fileURLToPath(new URL("..", import.meta.url)), loader: "tsx" }, outfile: `${directory}/privacy.mjs`,
    loader: { ".svg": "dataurl" }, bundle: true, format: "esm", platform: "browser", jsx: "automatic", external: ["react", "react/*", "react-dom", "react-dom/*"], logLevel: "silent" });
  const { PrivacyRecords, createExamples, resetExamples } = await import(pathToFileURL(`${directory}/privacy.mjs`).href);
  const midnight = new Date(2026, 10, 1, 0, 0, 1);
  assert.ok(createExamples(midnight).slice(0, 26).every((record: { time: string }) => new Date(record.time).getDate() === 1), "午夜时也保持今天 26 条记录");
  const doc = dom.window.document;
  const button = (text: string) => [...doc.querySelectorAll("button")].find((node: any) => node.textContent === text) as HTMLButtonElement;
  const click = async (node: Element) => { assert.ok(node); await act(async () => (node as HTMLButtonElement).click()); };
  await act(async () => root.render(createElement(PrivacyRecords, { projectId: "test", enabled: true })));
  assert.match(doc.querySelector(".privacy-summary").textContent, /19处替换26 次请求/);
  await click(button("30 天"));
  assert.match(doc.querySelector(".privacy-summary").textContent, /23处替换32 次请求/);
  await click(doc.querySelector(".privacy-history button"));
  assert.equal(doc.querySelector(".privacy-empty").textContent, "无匹配记录");
  await click(button("重置筛选"));
  await click(doc.querySelector(".privacy-record-list button"));
  assert.equal(doc.querySelector(".privacy-records > div[hidden]") !== null, true);
  assert.match(doc.querySelector(".privacy-request-detail").textContent, /hello@example.com/);
  assert.match(doc.querySelector(".privacy-request-detail").textContent, /\{\{EMAIL_abcd2345\}\}/);
  assert.equal(doc.querySelector(".privacy-unchanged").open, false, "未改动字段默认收起");
  await click(button("厂商看到的样子"));
  assert.ok(!doc.querySelector(".privacy-comparison").textContent.includes("hello@example.com"));
  await click(button("‹ 返回列表"));
  await click(button("清除"));
  assert.equal(doc.querySelector(".privacy-empty").textContent, "暂无请求记录。");
  await act(async () => { resetExamples(); root.render(createElement(PrivacyRecords, { key: "reset", projectId: "reset", enabled: true })); });
  assert.match(doc.querySelector(".privacy-summary").textContent, /19处替换26 次请求/);
});
