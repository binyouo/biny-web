import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { act, createElement, Fragment } from "react";
import type { DesktopApi } from "../vendor/biny/src/desktop/protocol.ts";
import { createDesktopDemo } from "../src/demo/desktopDemo.ts";
const requireRoot = createRequire(new URL("../package.json", import.meta.url));
const { JSDOM } = requireRoot("jsdom");
const { build } = requireRoot("esbuild");

test("真实 Desktop App 通过演示 preload 启动并读取会话，不替换 Sidebar、Composer 或时间线", { timeout: 30000 }, async (context) => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/client-demo.html", pretendToBeVisual: true });
  const keys = ["window", "self", "document", "DOMParser", "CSS", "SVGElement", "HTMLCanvasElement", "navigator", "HTMLElement", "Element", "Node", "MutationObserver", "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame", "ResizeObserver", "IntersectionObserver", "IS_REACT_ACT_ENVIRONMENT"];
  const saved = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  class Observer { observe() {} unobserve() {} disconnect() {} }
  dom.window.matchMedia = (media: string) => ({ matches: media.includes("reduced-motion"), media, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  dom.window.CSS = { supports: () => false, escape: (value: string) => value };
  dom.window.document.fonts = { addEventListener() {}, removeEventListener() {} };
  dom.window.HTMLCanvasElement.prototype.getContext = () => null;
  dom.window.ResizeObserver = Observer;
  dom.window.IntersectionObserver = Observer;
  dom.window.HTMLElement.prototype.scrollTo = function () {};
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  for (const key of keys) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: key === "IS_REACT_ACT_ENVIRONMENT" ? true : dom.window[key] });
  const demo = createDesktopDemo();
  let receiveMenu: Parameters<DesktopApi["onMenuAction"]>[0] | undefined;
  demo.api.onMenuAction = listener => { receiveMenu = listener; return () => { receiveMenu = undefined; }; };
  dom.window.biny = demo.api;
  const directory = await mkdtemp(fileURLToPath(new URL("../.mount-test-", import.meta.url)));
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(dom.window.document.getElementById("root"));
  context.after(async () => {
    context.mock.timers.reset();
    await act(async () => root.unmount());
    demo.dispose();
    await rm(directory, { recursive: true, force: true });
    dom.window.close();
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  await build({
    stdin: {
      contents: 'export { App } from "./vendor/biny/src/desktop/renderer/src/App.tsx"; export { ThreadBriefProvider } from "./vendor/biny/src/desktop/renderer/src/threadBrief/ThreadBriefProvider.tsx"; export { WorkspaceCommitPanel } from "./vendor/biny/src/desktop/renderer/src/components/workspace/WorkspaceCommitPanel.tsx"; export { WorkspaceBrowserPanel } from "./vendor/biny/src/desktop/renderer/src/components/workspace/WorkspaceBrowserPanel.tsx"; export { WorkspaceReferencesPanel } from "./vendor/biny/src/desktop/renderer/src/components/workspace/WorkspaceReferencesPanel.tsx"; export { SessionChangesPanel } from "./vendor/biny/src/desktop/renderer/src/components/workspace/SessionChangesPanel.tsx"; export { buildSessionTimeline } from "./vendor/biny/src/desktop/renderer/src/sessionTimeline.ts"; export { collectSessionChanges } from "./vendor/biny/src/desktop/renderer/src/sessionChanges.ts";',
      resolveDir: fileURLToPath(new URL("..", import.meta.url)), loader: "tsx"
    },
    outfile: `${directory}/app.mjs`, bundle: true, platform: "browser", format: "esm",
    banner: { js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);' },
    jsx: "automatic", external: ["react", "react/*", "react-dom", "react-dom/*"],
    loader: { ".css": "empty", ".png": "dataurl", ".svg": "dataurl" }, logLevel: "silent",
    plugins: [{
      name: "raw-imports",
      setup(builder: any) {
        builder.onResolve({ filter: /\?raw$/ }, async (args: any) => {
          const resolved = await builder.resolve(args.path.slice(0, -4), { resolveDir: args.resolveDir, kind: args.kind });
          return { path: resolved.path, namespace: "raw" };
        });
        builder.onLoad({ filter: /.*/, namespace: "raw" }, async (args: any) => ({
          contents: `export default ${JSON.stringify(await readFile(args.path, "utf8"))}`, loader: "js"
        }));
      }
    }]
  });
  const { App, ThreadBriefProvider, WorkspaceCommitPanel, WorkspaceBrowserPanel, WorkspaceReferencesPanel, SessionChangesPanel, buildSessionTimeline, collectSessionChanges } = await import(pathToFileURL(`${directory}/app.mjs`).href);
  await act(async () => { root.render(createElement(ThreadBriefProvider, null, createElement(App, { settingsEnabled: false }))); });
  assert.equal(dom.window.document.querySelector('button[aria-label="设置"]').disabled, true, "网页演示保留设置入口，但禁用未接入服务的设置面板");
  assert.ok(receiveMenu);
  for (const action of ["settings", "activity-settings"] as const) {
    await act(async () => { receiveMenu!(action); });
    assert.equal(dom.window.document.querySelector('[aria-label="Biny 设置"]'), null, "菜单事件也不能绕过网页演示的设置限制");
  }
  const text = dom.window.document.body.textContent;
  assert.ok(text.includes("Workspace"), text);
  assert.ok(dom.window.document.querySelector("textarea"), "真实输入框应已挂载");
  assert.ok(text.includes("本周") || text.includes("这周"), text);
  assert.ok(!text.includes("无法加载") && !text.includes("此操作需要桌面端"), text);
  assert.equal(dom.window.document.documentElement.dataset.base46Theme, "vscode_dark");
  assert.equal(dom.window.document.documentElement.style.getPropertyValue("--app-font-size"), "15");
  context.mock.timers.enable({ apis: ["setTimeout"] });
  await act(async () => { demo.replay("risky"); });
  await act(async () => { demo.skip(); context.mock.timers.tick(20); });
  assert.ok(dom.window.document.querySelector('[aria-label="工具授权"]'), "Desktop 的真实权限卡应响应 preload 事件");
  assert.ok(dom.window.document.querySelector('input[placeholder*="yes"]'), "使用实际强确认输入框");
  const doc = await demo.api.openSession("demo", "risky");
  const request = doc.liveEvents.find(event => event.type === "permission.requested");
  assert.ok(request?.type === "permission.requested");
  await act(async () => { await demo.api.resolvePermission("demo", request.requestId, { approved: false }); demo.skip(); context.mock.timers.tick(300); });
  assert.ok(dom.window.document.body.textContent.includes("已拒绝"), "拒绝结果由真实权限卡渲染");
  context.mock.timers.reset();
  await act(async () => { root.render(createElement(ThreadBriefProvider, null, createElement(App))); });
  assert.equal(dom.window.document.querySelector('button[aria-label="设置"]').disabled, false, "桌面端默认保留设置入口");
  const reference = (await demo.api.referenceSearch("demo", "本周"))[0]!;
  const history = await demo.api.openSession("demo", "memory");
  const changes = collectSessionChanges(buildSessionTimeline(history.events, history.liveEvents));
  assert.equal(changes[0]?.path, "docs/weekly/本周进展.md");
  const warnings: string[] = [];
  await act(async () => { root.render(createElement(Fragment, null,
    createElement(WorkspaceCommitPanel, { projectId: "demo", active: true, onCount() {}, onSwitchBranch: async () => {}, onPreviewFile() {} }),
    createElement(WorkspaceBrowserPanel, { projectId: "demo", active: true, onWarning: (message: string) => warnings.push(message), onOpenTerminal() {} }),
    createElement(WorkspaceReferencesPanel, { projectId: "demo", reference, onSelect() {} }),
    createElement(SessionChangesPanel, { changes, onPreviewFile() {} })
  )); });
  assert.deepEqual(warnings, []);
  assert.equal(dom.window.document.querySelector('[role="alert"]'), null, "真实右栏组件应加载样例，不显示适配器错误");
  assert.ok(dom.window.document.body.textContent.includes("本周计划 · 示例"));
  assert.ok(dom.window.document.body.textContent.includes("变更（2）"));
  assert.ok(dom.window.document.body.textContent.includes("本周进展.md"));

});
