import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { act, createElement } from "react";
import { BrowserRouter } from "react-router-dom";

const requireRoot = createRequire(new URL("../package.json", import.meta.url));
const { JSDOM } = requireRoot("jsdom");
const { build } = requireRoot("esbuild");

test("下载与首页共享文档，旧地址保留参数和锚点，重复点击仍定位下载区", async (context) => {
  const directory = await mkdtemp(fileURLToPath(new URL("../.navigation-test-", import.meta.url)));
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/zh/download?from=old", pretendToBeVisual: true });
  const keys = ["window", "self", "document", "location", "navigator", "HTMLElement", "Element", "Node", "MutationObserver", "requestAnimationFrame", "cancelAnimationFrame", "ResizeObserver", "IntersectionObserver", "fetch", "IS_REACT_ACT_ENVIRONMENT"];
  const saved = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const anchors: string[] = [];
  const tops: unknown[] = [];
  class Observer { observe() {} unobserve() {} disconnect() {} }
  dom.window.matchMedia = (media: string) => ({ matches: media.includes("reduced-motion"), media, addEventListener() {}, removeEventListener() {} });
  dom.window.ResizeObserver = Observer;
  dom.window.IntersectionObserver = Observer;
  dom.window.HTMLElement.prototype.scrollIntoView = function () { anchors.push(this.id); };
  dom.window.scrollTo = (options: unknown) => { tops.push(options); };
  for (const key of keys) Object.defineProperty(globalThis, key, {
    configurable: true, writable: true,
    value: key === "IS_REACT_ACT_ENVIRONMENT" ? true : key === "fetch" ? async () => ({ status: 404 }) : dom.window[key],
  });
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
    entryPoints: [fileURLToPath(new URL("../src/App.tsx", import.meta.url))],
    outfile: `${directory}/app.mjs`, bundle: true, platform: "browser", format: "esm", jsx: "automatic",
    external: ["react", "react/*", "react-dom", "react-dom/*", "react-router-dom"],
    loader: { ".css": "empty", ".png": "dataurl" }, logLevel: "silent",
  });
  const { App } = await import(pathToFileURL(`${directory}/app.mjs`).href);
  const nextFrame = () => act(async () => { await new Promise(resolve => dom.window.requestAnimationFrame(resolve)); });
  await act(async () => { root.render(createElement(BrowserRouter, null, createElement(App))); });
  await nextFrame();
  assert.equal(dom.window.location.pathname, "/zh");
  assert.equal(dom.window.location.search, "?from=old");
  assert.equal(dom.window.location.hash, "#download");
  assert.equal(dom.window.document.querySelectorAll("main").length, 1);
  assert.ok(dom.window.document.querySelector("main #home-title"));
  assert.ok(dom.window.document.querySelector("main #download #download-title"));
  assert.equal(anchors.at(-1), "download");

  const click = async (selector: string) => {
    const link = dom.window.document.querySelector(selector);
    assert.ok(link, selector);
    await act(async () => { link.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, button: 0 })); });
    await nextFrame();
  };
  const downloadLink = 'nav[aria-label="主导航"] a.site-nav-link[href="/zh#download"]';
  await click(downloadLink);
  const before = anchors.length;
  await click(downloadLink);
  assert.equal(anchors.length, before + 1);
  assert.equal(anchors.at(-1), "download");
  await click('a[aria-label="Biny 首页"]');
  assert.equal(dom.window.location.hash, "");
  assert.deepEqual(tops.at(-1), { top: 0 });

  await click('nav[aria-label="主导航"] a[href="/zh/docs"]');
  assert.equal(dom.window.location.pathname, "/zh/docs");
  await click(downloadLink);
  assert.ok(dom.window.document.querySelector("#home-title"));
  assert.equal(anchors.at(-1), "download");

  await act(async () => {
    dom.window.history.pushState(null, "", "/download?from=terminal#terminal");
    dom.window.dispatchEvent(new dom.window.PopStateEvent("popstate"));
  });
  await nextFrame();
  assert.equal(dom.window.location.pathname, "/zh");
  assert.equal(dom.window.location.search, "?from=terminal");
  assert.equal(dom.window.location.hash, "#terminal");
  assert.equal(anchors.at(-1), "terminal");
});
