import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { act, createElement } from "react";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");
const { build } = require("esbuild");

import { STORY_END, storyRequest, storySecrets, storySteps, storyString } from "../src/demo/privacyStory.ts";

test("演示数据使用真实规则能识别的值，占位符形状与实现一致", () => {
  for (const secret of storySecrets) assert.match(secret.placeholder, /^\{\{[A-Z][A-Z0-9_]*_[a-z2-7]{8}\}\}$/);
  assert.equal(
    storyString(storyRequest, "masked"),
    "帮我把测试库配置写进 .env，再跑一下迁移。\nDB_PASSWORD={{PASSWORD_r6mzq3wd}}\n告警邮箱：{{EMAIL_t4hn2vbe}}"
  );
  assert.equal(
    storyString(storyRequest, "plain"),
    "帮我把测试库配置写进 .env，再跑一下迁移。\nDB_PASSWORD=Tulip-2049\n告警邮箱：lin@biny.online"
  );
  for (const secret of storySecrets) assert.ok(!/@example\.(com|org|net)$/i.test(secret.value), "示例值不能是脱敏规则跳过的域名");
  for (let i = 1; i < storySteps.length; i++) assert.ok(storySteps[i].at > storySteps[i - 1].at, "步骤起点必须递增");
  assert.ok(storySteps.every(s => s.at < STORY_END));
});

test("时间轴任意位置模型服务面板都不出现原值", async context => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/", pretendToBeVisual: true });
  class Observer { observe() {} unobserve() {} disconnect() {} }
  dom.window.matchMedia = (media: string) => ({ matches: media.includes("reduced-motion"), media, addEventListener() {}, removeEventListener() {} });
  dom.window.IntersectionObserver = Observer;
  const globals = {
    window: dom.window, self: dom.window, document: dom.window.document, navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, Node: dom.window.Node,
    IntersectionObserver: Observer, ResizeObserver: Observer, IS_REACT_ACT_ENVIRONMENT: true
  };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  const directory = await mkdtemp(fileURLToPath(new URL("../.privacy-story-test-", import.meta.url)));
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
    entryPoints: [fileURLToPath(new URL("../src/components/PrivacyStory.tsx", import.meta.url))],
    outfile: `${directory}/story.mjs`, bundle: true, platform: "browser", format: "esm", jsx: "automatic",
    external: ["react", "react/*", "react-dom", "react-dom/*"],
    loader: { ".css": "empty", ".png": "dataurl", ".webp": "dataurl" }, logLevel: "silent",
  });
  const { PrivacyStory } = await import(pathToFileURL(`${directory}/story.mjs`).href);
  await act(async () => { root.render(createElement(PrivacyStory)); });

  const doc = dom.window.document;
  const chips = [...doc.querySelectorAll(".story-chip")];
  assert.equal(chips.length, 8);
  const provText = () => doc.querySelector('[data-k="prov"]').textContent;
  const raw = ["Tulip-2049", "lin@biny.online"];
  for (const [i, chip] of chips.entries()) {
    await act(async () => (chip as HTMLButtonElement).click());
    assert.ok(doc.querySelector(".story-caption").textContent.includes(`${i + 1}/8`), `步骤 ${i} 计数`);
    assert.ok(doc.querySelector(".story-caption").textContent.includes(storySteps[i].title), `步骤 ${i} 标题`);
    assert.ok(!raw.some(v => provText().includes(v)), `${storySteps[i].id}: provider 面板不应出现原值`);
    assert.equal(doc.querySelector(".story-play").getAttribute("aria-label"), "播放演示", "点步骤后保持暂停");
  }

  const scrubber = doc.querySelector(".story-range") as HTMLInputElement;
  assert.ok(scrubber);
  for (let v = 0; v <= 1000; v += 100) {
    await act(async () => {
      scrubber.value = String(v);
      scrubber.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
      scrubber.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
    assert.ok(!raw.some(x => provText().includes(x)), `t=${(v / 1000 * STORY_END).toFixed(1)} 时 provider 不应出现原值`);
  }
  await act(async () => {
    scrubber.value = "600";
    scrubber.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    scrubber.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  });
  assert.ok(doc.querySelector(".story-caption").textContent.includes("6/8"), "t≈16.8 显示第 6 步");

  await act(async () => (chips[7] as HTMLButtonElement).click());
  const execText = doc.querySelector('[data-k="exec"]').textContent;
  assert.ok(execText.includes("DB_PASSWORD=Tulip-2049"), "record 时 .env 已写入真实值");
  assert.ok(execText.includes("✓ 3 个迁移已执行"), "record 时迁移输出可见");
  await act(async () => (chips[0] as HTMLButtonElement).click());
  assert.ok(!doc.querySelector('[data-k="exec"]').textContent.includes("Tulip-2049"), "ask 时 .env 尚未写入");
  await act(async () => (chips[1] as HTMLButtonElement).click());
  assert.equal(doc.querySelector('[data-k="req"]').textContent.replace("你说", ""), storyString(storyRequest, "plain"), "scan 时请求已打完");
});
