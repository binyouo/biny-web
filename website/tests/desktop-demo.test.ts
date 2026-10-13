import assert from "node:assert/strict";
import test from "node:test";
import { createDesktopDemo } from "../src/demo/desktopDemo.ts";
import { computerScenario, computerPage } from "../src/demo/computerScenario.ts";
import type { DesktopAgentEventEnvelope } from "../vendor/biny/src/desktop/protocol.ts";

function fixture() {
  const pending = new Set<() => void>();
  const demo = createDesktopDemo({ schedule(callback) { pending.add(callback); return () => pending.delete(callback); } });
  const events: DesktopAgentEventEnvelope[] = [];
  demo.api.onAgentEvent(event => events.push(event));
  const tick = () => { const callback = pending.values().next().value; if (callback) { pending.delete(callback); callback(); } };
  const flush = () => { for (let i = 0; pending.size && i < 500; i++) tick(); assert.equal(pending.size, 0); };
  return { demo, events, tick, flush };
}

test("桌面启动快照使用实际外观设置，会话正文通过原生文档协议提供", async () => {
  const { demo } = fixture();
  const boot = await demo.api.bootstrap();
  assert.equal(boot.appearancePreference?.darkTheme, "vscode_dark");
  assert.deepEqual(boot.fontPreference, { family: "system", size: 15 });
  assert.equal(boot.sidebarWidth, 250);
  assert.equal(boot.workspace?.memory?.enabled, true);
  const doc = await demo.api.openSession(boot.activeProjectId!, boot.selectedSessionId!);
  assert.ok(doc.events.some(event => event.type === "user_message"));
  assert.ok(doc.events.some(event => event.type === "assistant_message"));
});

test("重播等待桌面提交选中会话，旧计时回调不会污染新一轮", async () => {
  const { demo, events, flush } = fixture();
  demo.replay("memory");
  flush();
  assert.equal(events.length, 0);
  await demo.api.commitSelection("demo", "memory", "chat");
  demo.replay("flow");
  flush();
  assert.equal(events.filter(e => e.event?.type === "run.completed").length, 0);
  assert.equal(events.at(-1)?.event?.type, "run.cancelled");
  await demo.api.commitSelection("demo", "flow", "chat");
  flush();
  assert.equal(events.at(-1)?.event?.sessionId, "flow");
  assert.equal(events.at(-1)?.event?.type, "run.completed");
});

test("高风险演示等待完整确认，拒绝后不会继续成功结果", async () => {
  const { demo, events, flush } = fixture();
  demo.replay("risky");
  await demo.api.commitSelection("demo", "risky", "chat");
  demo.skip(); flush();
  const request = events.find(e => e.event?.type === "permission.requested")!.event!;
  assert.equal(request.type, "permission.requested");
  if (request.type !== "permission.requested") return;
  assert.equal(events.some(e => e.event?.type === "run.completed"), false);
  await assert.rejects(demo.api.resolvePermission("demo", request.requestId, { approved: true }), /yes/);
  await demo.api.resolvePermission("demo", request.requestId, { approved: false });
  flush();
  assert.equal(events.some(e => e.event?.type === "tool.completed" && e.event.toolCallId === request.toolCallId), false);
  assert.equal(events.at(-1)?.event?.type, "run.completed");
});

test("未支持的系统能力明确拒绝，取消后不再产生工具事件", async () => {
  const { demo, events, flush } = fixture();
  await assert.rejects(demo.api.openProjectTerminal("demo"), /演示/);
  await assert.rejects(demo.api.sendPrompt("demo", "memory", "任意新问题", []), /预置/);
  demo.replay("memory");
  await demo.api.commitSelection("demo", "memory", "chat");
  await demo.api.cancelRun("demo", events[0]!.event!.runId);
  const length = events.length;
  flush();
  assert.equal(events.length, length);
  assert.equal(events.at(-1)?.event?.type, "run.cancelled");
});


test("完整确认只推进当前请求；重播重新询问，不沿用之前的批准", async () => {
  const { demo, events, flush } = fixture();
  demo.replay("risky");
  await demo.api.commitSelection("demo", "risky", "chat");
  demo.skip();
  const request = events.find(e => e.event?.type === "permission.requested")!.event!;
  assert.ok(request.type === "permission.requested");
  await demo.api.resolvePermission("demo", request.requestId, { approved: true, confirmation: "yes" });
  flush();
  assert.ok(events.some(e => e.event?.type === "tool.completed" && e.event.toolCallId === request.toolCallId));
  demo.replay("risky");
  await demo.api.commitSelection("demo", "risky", "chat");
  demo.skip();
  assert.equal(demo.status, "waiting");
  await assert.rejects(demo.api.resolvePermission("demo", request.requestId, { approved: true, confirmation: "yes" }), /已结束/);
});

test("右栏数据边界提供文件、Git、终端、浏览器和引用样例，展开面板无需真实系统服务", async () => {
  const { demo } = fixture();
  const git = await demo.api.projectGitStatus("demo");
  assert.equal(git.branch, "main");
  assert.ok(git.files.some(file => file.path === "weekly-plan.md"));
  const file = await demo.api.readWorkspaceFile("demo", "weekly-plan.md");
  assert.match(file.content!, /本周计划/);
  const terminal = await demo.api.createTerminal("demo", 80, 24);
  assert.match(terminal.replay, /pnpm test/);
  assert.match(terminal.replay, /passed/);
  assert.equal((await demo.api.listTerminals("demo"))[0]?.terminalId, terminal.terminalId);
  const browser = await demo.api.browserSnapshot("demo");
  assert.equal(browser.tabs[0]?.title, "本周计划 · 示例");
  assert.equal(browser.tabs[0]?.error, undefined);
  assert.equal((await demo.api.projectPreviewAvailability("demo")).available, true);
  const capture = await demo.api.browserCapture("demo", browser.activeId!);
  assert.equal((await demo.api.referenceResolve("demo", capture.uri)).content, capture.content);
  const refs = await demo.api.referenceSearch("demo", "本周");
  assert.ok(refs.length > 0);
  assert.match((await demo.api.referenceResolve("demo", refs[0]!.uri)).content, /本周/);
  demo.dispose();
});

test("写文件样例生成真实变更事件，历史与重播都能驱动右栏变更视图", async () => {
  const { demo, events, flush } = fixture();
  const doc = await demo.api.openSession("demo", "memory");
  assert.ok(doc.events.some(event => event.type === "tool_execution" && event.change?.path === "docs/weekly/本周进展.md"));
  demo.replay("memory");
  await demo.api.commitSelection("demo", "memory", "chat");
  flush();
  assert.ok(events.some(({ event }) => event?.type === "tool.change_committed" && event.change.path === "docs/weekly/本周进展.md"));
  demo.dispose();
});

test("右栏交互只改变本次演示，浏览器隐藏与销毁清除预览，终端输入只回显", async () => {
  const bounds: unknown[] = [];
  const demo = createDesktopDemo({ onBrowserBounds: value => bounds.push(value) });
  const initial = await demo.api.projectGitStatus("demo");
  await demo.api.commitProjectFiles("demo", { message: "整理计划", paths: ["weekly-plan.md"], revision: initial.revision });
  assert.deepEqual((await demo.api.projectGitStatus("demo")).files.map(file => file.path), ["docs/weekly/本周进展.md"]);
  const fresh = createDesktopDemo();
  assert.equal((await fresh.api.projectGitStatus("demo")).files.length, 2);
  const events: unknown[] = [];
  demo.api.onTerminalEvent(event => events.push(event));
  const terminal = await demo.api.createTerminal("demo", 80, 24);
  demo.api.writeTerminal(terminal.terminalId, "touch unexpected.txt\r");
  assert.ok(JSON.stringify(events).includes("不执行命令"));
  await assert.rejects(demo.api.readWorkspaceFile("demo", "unexpected.txt"), /不存在/);
  const rect = { x: 10, y: 40, width: 350, height: 600 };
  await demo.api.browserBounds("demo", "demo-page-1", rect);
  assert.deepEqual(bounds.at(-1), rect);
  await demo.api.browserBounds("demo", "demo-page-1");
  assert.equal(bounds.at(-1), undefined);
  await demo.api.browserBounds("demo", "demo-page-1", rect);
  demo.dispose(); fresh.dispose();
  assert.equal(bounds.at(-1), undefined);
});

test("电脑场景暂停不会推进，继续与重播仍使用本轮事件和原始参数", async () => {
  const pending = new Set<() => void>();
  const demo = createDesktopDemo({ scenarios: [computerScenario], initialSessionId: "computer", browserPage: computerPage,
    schedule(callback) { pending.add(callback); return () => pending.delete(callback); }
  });
  const events: DesktopAgentEventEnvelope[] = [];
  demo.api.onAgentEvent(event => events.push(event));
  demo.start();
  await demo.api.commitSelection("demo", "computer", "chat");
  demo.pause();
  const count = events.length;
  assert.equal(demo.status, "paused");
  assert.equal(pending.size, 0);
  assert.equal(events.length, count);
  demo.resume();
  assert.ok(events.length > count);
  demo.pause();
  demo.replay();
  assert.equal(pending.size, 0);
  assert.equal(events.at(-1)?.event?.type, "run.cancelled");
  await demo.api.commitSelection("demo", "computer", "chat");
  demo.skip();
  assert.equal(demo.status, "done");
  const action = events.find(({ event }) => event?.type === "tool.started" && event.tool === "ComputerAction")?.event;
  assert.ok(action?.type === "tool.started");
  assert.equal(action.args.text, "安静的咖啡馆");
  const browser = await demo.api.browserSnapshot("demo");
  assert.equal(browser.tabs[0]?.title, computerPage.title);
  await assert.rejects(demo.api.browserAction("demo", { type: "navigate", tabId: browser.activeId!, url: "https://example.com" }), /示例网页/);
  demo.dispose();
});
