import assert from "node:assert/strict";
import test from "node:test";
import { DOC_PAGES, getDocPage } from "../src/docs/content.ts";
import { searchDocs } from "../src/docs/search.ts";

test("文档页支持已知路径，并拒绝未知或嵌套路径", () => {
  assert.equal(getDocPage("quick-start")?.title, "快速开始");
  assert.equal(getDocPage("memory/")?.title, "记忆");
  assert.equal(getDocPage("missing"), undefined);
  assert.equal(getDocPage("memory/missing"), undefined);
});

test("文档目录中每个页面与章节都有独立的可跳转标识", () => {
  assert.ok(DOC_PAGES.length >= 8);
  assert.equal(new Set(DOC_PAGES.map((page) => page.slug)).size, DOC_PAGES.length);
  for (const page of DOC_PAGES) {
    assert.ok(page.sections.length > 0);
    assert.equal(new Set(page.sections.map((section) => section.id)).size, page.sections.length);
  }
});

test("按文章标题查找文档", () => {
  assert.equal(searchDocs("快速开始")[0]?.slug, "quick-start");
});

test("按关键词和正文中的配置项查找文档，不区分大小写", () => {
  assert.ok(searchDocs("模型服务商").some((page) => page.slug === "providers"));
  assert.ok(searchDocs("apikeyenv").some((page) => page.slug === "providers"));
  assert.ok(searchDocs("未知外部副作用").some((page) => page.slug === "tasks"));
});

test("中文多词搜索要求每个词都出现在同一篇文章", () => {
  const matches = searchDocs("  工具   权限  ");
  assert.ok(matches.some((page) => page.slug === "tools"));
  assert.equal(searchDocs("安装 不存在的关键字").length, 0);
});

test("空输入与无匹配内容返回空结果", () => {
  assert.deepEqual(searchDocs(""), []);
  assert.deepEqual(searchDocs("  \n  "), []);
  assert.deepEqual(searchDocs("没有对应文档的词"), []);
});

test("搜索不会改变文档目录的阅读顺序", () => {
  const before = DOC_PAGES.map((page) => page.slug);
  searchDocs("Biny");
  assert.deepEqual(DOC_PAGES.map((page) => page.slug), before);
});
