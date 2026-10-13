import assert from "node:assert/strict";
import test from "node:test";
import { CLIENT_WIDTH, clientScale, hasTrustedSender, isDemoCommand, isDemoState } from "../src/demo/bridge.ts";

test("演示只接受明确标记的播放器命令", () => {
  for (const command of ["start", "replay", "skip", "state", "pause", "resume"]) assert.equal(isDemoCommand({ source: "biny-website", command }), true);
  for (const value of [null, "replay", {}, { source: "other", command: "replay" }, { source: "biny-website", command: "send" }]) assert.equal(isDemoCommand(value), false);
});

test("演示只向父页面报告播放器的公开状态", () => {
  for (const status of ["idle", "playing", "paused", "waiting", "done"]) assert.equal(isDemoState({ source: "biny-client-demo", status }), true);
  for (const value of [null, {}, { source: "biny-client-demo", status: "ready" }, { source: "other", status: "playing" }]) assert.equal(isDemoState(value), false);
});

test("相同来源仍必须来自对应 iframe 或父窗口", () => {
  const peer = {};
  const origin = "http://localhost:5173";
  assert.equal(hasTrustedSender({ source: peer, origin }, peer, origin), true);
  assert.equal(hasTrustedSender({ source: {}, origin }, peer, origin), false);
  assert.equal(hasTrustedSender({ source: peer, origin: "https://example.test" }, peer, origin), false);
  assert.equal(hasTrustedSender({ source: null, origin }, null, origin), false);
});

test("窄页面整体等比缩小客户端，不单独改变字体与侧栏比例", () => {
  assert.equal(clientScale(CLIENT_WIDTH), 1);
  assert.equal(clientScale(CLIENT_WIDTH / 2), 0.5);
  assert.equal(clientScale(CLIENT_WIDTH * 2), 1);
  for (const width of [0, -10, Number.NaN, Number.POSITIVE_INFINITY]) assert.equal(clientScale(width), 0);
});
