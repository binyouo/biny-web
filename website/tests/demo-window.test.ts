import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { act, createElement } from "react";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");
const { build } = require("esbuild");

type Observers = { callback: IntersectionObserverCallback }[];

async function setup(context: test.TestContext, compact: boolean) {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/", pretendToBeVisual: true });
  const observers: Observers = [];
  class Observer {
    callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) { this.callback = callback; observers.push({ callback }); }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  class Resize { observe() {} unobserve() {} disconnect() {} }
  dom.window.matchMedia = (media: string) => ({
    matches: media.includes("reduced-motion") || (compact && media.includes("640px")),
    media, addEventListener() {}, removeEventListener() {},
  }) as MediaQueryList;
  dom.window.IntersectionObserver = Observer as unknown as typeof IntersectionObserver;
  dom.window.ResizeObserver = Resize as unknown as typeof ResizeObserver;
  // 加载超时挂在 window.setTimeout 上；转交给全局计时器，mock.timers 才能推进它。
  dom.window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) =>
    setTimeout(handler as () => void, timeout, ...args)) as typeof setTimeout;
  dom.window.clearTimeout = ((id?: number) => clearTimeout(id)) as typeof clearTimeout;
  const globals = {
    window: dom.window, self: dom.window, document: dom.window.document, location: dom.window.location,
    navigator: dom.window.navigator, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element,
    Node: dom.window.Node, MutationObserver: dom.window.MutationObserver,
    requestAnimationFrame: dom.window.requestAnimationFrame, cancelAnimationFrame: dom.window.cancelAnimationFrame,
    IntersectionObserver: Observer, ResizeObserver: Resize, getComputedStyle: dom.window.getComputedStyle,
    fetch: async () => ({ status: 404 }), IS_REACT_ACT_ENVIRONMENT: true,
  };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  const directory = await mkdtemp(fileURLToPath(new URL("../.demo-window-test-", import.meta.url)));
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(dom.window.document.getElementById("root"));
  context.after(async () => {
    await act(async () => root.unmount());
    dom.window.close();
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
    await rm(directory, { recursive: true, force: true });
  });
  await build({
    entryPoints: [fileURLToPath(new URL("../src/demo/BinyWindow.tsx", import.meta.url))],
    outfile: `${directory}/window.mjs`, bundle: true, platform: "browser", format: "esm", jsx: "automatic",
    external: ["react", "react/*", "react-dom", "react-dom/*"],
    loader: { ".css": "empty", ".png": "dataurl", ".webp": "dataurl" }, logLevel: "silent",
  });
  const { BinyWindow } = await import(pathToFileURL(`${directory}/window.mjs`).href);
  const fire = async () => act(async () => {
    for (const { callback } of observers) callback([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver);
  });
  return { dom, root, BinyWindow, fire };
}

test("客户端演示进入视口才挂载 iframe，加载超时只在挂载后计时", async context => {
  context.mock.timers.enable({ apis: ["setTimeout"], now: Date.now() });
  const { dom, root, BinyWindow, fire } = await setup(context, false);
  await act(async () => { root.render(createElement(BinyWindow)); });
  const doc = dom.window.document;
  assert.equal(doc.querySelector("iframe"), null);
  assert.equal(doc.querySelector<HTMLImageElement>(".client-demo-poster")?.getAttribute("src"), "/demo/client-poster.webp");
  await act(async () => { context.mock.timers.tick(13_000); });
  assert.equal(doc.body.textContent?.includes("演示未能完成加载") ?? false, false);
  await fire();
  const frame = doc.querySelector("iframe");
  assert.ok(frame);
  assert.ok(frame.getAttribute("src")?.endsWith("/client-demo.html"));
  await act(async () => { context.mock.timers.tick(12_000); });
  assert.ok(doc.body.textContent?.includes("演示未能完成加载"));
});

test("窄屏使用紧凑画布与紧凑海报，不提供放大按钮", async context => {
  const { dom, root, BinyWindow, fire } = await setup(context, true);
  await act(async () => { root.render(createElement(BinyWindow)); });
  const doc = dom.window.document;
  assert.equal(doc.querySelector<HTMLImageElement>(".client-demo-poster")?.getAttribute("src"), "/demo/client-poster-compact.webp");
  await fire();
  const frame = doc.querySelector("iframe");
  assert.ok(frame);
  assert.ok(frame.getAttribute("src")?.endsWith("/client-demo.html?layout=compact"));
  assert.equal(doc.querySelector('button[aria-label="放大查看"]'), null);
});

test("画廊窄屏裁切仅用于缩略图，放大后显示完整截图", async context => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/", pretendToBeVisual: true });
  class Observer { observe() {} unobserve() {} disconnect() {} }
  dom.window.IntersectionObserver = Observer as unknown as typeof IntersectionObserver;
  dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  dom.window.HTMLDialogElement.prototype.show = function () { this.setAttribute("open", ""); };
  const globals = {
    window: dom.window, self: dom.window, document: dom.window.document, location: dom.window.location,
    navigator: dom.window.navigator, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element,
    Node: dom.window.Node, IntersectionObserver: Observer, IS_REACT_ACT_ENVIRONMENT: true,
  };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  const directory = await mkdtemp(fileURLToPath(new URL("../.demo-window-test-", import.meta.url)));
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(dom.window.document.getElementById("root"));
  context.after(async () => {
    await act(async () => root.unmount());
    dom.window.close();
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
    await rm(directory, { recursive: true, force: true });
  });
  await build({
    entryPoints: [fileURLToPath(new URL("../src/components/CapabilityGallery.tsx", import.meta.url))],
    outfile: `${directory}/gallery.mjs`, bundle: true, platform: "browser", format: "esm", jsx: "automatic",
    external: ["react", "react/*", "react-dom", "react-dom/*"],
    loader: { ".css": "empty", ".png": "dataurl", ".webp": "dataurl" }, logLevel: "silent",
  });
  const { CapabilityGallery } = await import(pathToFileURL(`${directory}/gallery.mjs`).href);
  const slides = [{ caption: "Code Mode", src: "/features/code-mode.png", width: 1353, height: 828, alt: "脚本与结果", mobile: { src: "/features/code-mode-mobile.webp", width: 545, height: 660 } }];
  await act(async () => { root.render(createElement(CapabilityGallery, { title: "能力", slides })); });
  const doc = dom.window.document;
  const source = doc.querySelector<HTMLSourceElement>('source[media="(max-width: 640px)"]');
  assert.ok(source);
  assert.equal(source.getAttribute("srcset") ?? source.getAttribute("srcSet"), "/features/code-mode-mobile.webp");
  const trigger = doc.querySelector<HTMLButtonElement>('button[aria-label="放大查看能力"]');
  assert.ok(trigger);
  await act(async () => { trigger.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, button: 0 })); });
  const stage = doc.querySelector(".capability-gallery-stage");
  assert.ok(stage);
  assert.equal(stage.querySelector("source"), null);
  assert.equal(stage.querySelector("img")?.getAttribute("src"), "/features/code-mode.png");
});
