import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { placeBrowserSurface } from "../src/demo/browserSurface.ts";

const { JSDOM } = createRequire(new URL("../package.json", import.meta.url))("jsdom");

test("网页预览留在实际浏览器内容槽内，布局移动不会留下独立覆盖层", () => {
  const dom = new JSDOM('<div class="inspector-browser-slot"></div>');
  const document = dom.window.document;
  const frame = document.createElement("iframe");
  const slot = document.querySelector(".inspector-browser-slot")!;
  placeBrowserSurface(frame, document, true);
  assert.equal(frame.parentElement, slot);
  assert.equal(frame.hidden, false);
  slot.style.transform = "translateX(160px)";
  slot.style.width = "420px";
  placeBrowserSurface(frame, document, true);
  assert.equal(frame.parentElement, slot, "侧栏移动时预览随内容槽一起移动");
  assert.equal(frame.getAttribute("style"), null, "不保存会过期的窗口坐标");
  placeBrowserSurface(frame, document, false);
  assert.equal(frame.hidden, true);
  slot.remove();
  placeBrowserSurface(frame, document, true);
  assert.equal(frame.hidden, true, "面板被移除时不留下可见的浮层");
  const replacement = document.createElement("div");
  replacement.className = "inspector-browser-slot";
  document.body.append(replacement);
  placeBrowserSurface(frame, document, true);
  assert.equal(frame.parentElement, replacement);
  assert.equal(frame.hidden, false);
  dom.window.close();
});
