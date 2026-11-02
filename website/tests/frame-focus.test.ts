import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { containFrameFocus } from "../src/demo/frameFocus.ts";
const { JSDOM } = createRequire(import.meta.url)("jsdom");

test("嵌入演示仍能聚焦输入框，自动聚焦不能请求滚动主页", () => {
  const parent = new JSDOM('<input id="outside">');
  const preview = new JSDOM('<textarea></textarea>');
  const parentFocus = parent.window.HTMLElement.prototype.focus;
  const original = preview.window.HTMLElement.prototype.focus;
  let received: FocusOptions | undefined;
  preview.window.HTMLElement.prototype.focus = function (options: FocusOptions) { received = options; original.call(this, options); };
  const before = preview.window.HTMLElement.prototype.focus;
  const restore = containFrameFocus(preview.window.HTMLElement);
  try {
    const input = preview.window.document.querySelector("textarea");
    input.focus();
    assert.equal(preview.window.document.activeElement, input);
    assert.equal(received?.preventScroll, true);
    input.focus({ preventScroll: false });
    assert.equal(received?.preventScroll, true);
    assert.equal(parent.window.HTMLElement.prototype.focus, parentFocus, "主页的原生聚焦行为不受影响");
    restore();
    assert.equal(preview.window.HTMLElement.prototype.focus, before);
  } finally { parent.window.close(); preview.window.close(); }
});
