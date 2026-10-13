import { createInspectorDemo, demoFiles } from "./inspectorDemo.ts";
import type { DesktopBrowserBounds } from "../../vendor/biny/src/desktop/protocol.ts";
import packageInfo from "../../vendor/biny/package.json" with { type: "json" };
import type { DesktopApi, DesktopAgentEventEnvelope, DesktopBootstrap, DesktopSessionDocument, DesktopSessionSummary, DesktopWorkspaceSnapshot } from "../../vendor/biny/src/desktop/protocol.ts";
import type { AgentHostEvent, InteractiveRuntimeSnapshot } from "../../vendor/biny/src/runtime/agentEvents.ts";
import { reduceInteractiveRunState } from "../../vendor/biny/src/runtime/agentEvents.ts";
import type { SessionEvent } from "../../vendor/biny/src/session/recorder.ts";
import { memoryPolicySchema } from "../../vendor/biny/src/personalization/index.ts";
import { isFullYesConfirmation } from "../../vendor/biny/src/permission/confirmation.ts";
import type { AppearanceSnapshot } from "../../vendor/biny/src/appearance/types.ts";
import type { DemoScenario, DemoStep, DemoToolStep } from "./types.ts";
import { zh } from "../i18n/zh.ts";

export const demoAppearance: AppearanceSnapshot = {
  themePreference: "dark", fontPreference: { family: "system", size: 15 },
  appearancePreference: { darkTheme: "vscode_dark", lightTheme: null, win98Trail: true, customThemes: [] }
};
const timestamp = "2026-10-12T08:00:00.000Z";
const project = { id: "demo", path: "/Biny/Workspace", name: "Workspace", branch: "main", dirty: false, missing: false, pinned: false, addedAt: timestamp, lastOpenedAt: timestamp };
const models: DesktopWorkspaceSnapshot["models"] = ["Claude Sonnet 4.6", "GPT-5.4"].map((name, index) => ({
  alias: index ? "gpt-5.4" : "claude-sonnet-4-6", displayName: name, provider: index ? "OpenAI" : "Anthropic", providerType: index ? "openai" : "anthropic", model: name, modelKey: name,
  efforts: ["low", "medium", "high"], defaultThinking: "medium", thinkingLevelMap: {}, available: true, source: "configured", contextWindow: 200000
}));
const passiveChannels = new Set(["onAgentEvent", "onSessionHandoff", "onAppearanceChanged", "onApplicationImportsChanged", "onBrowserOpenRequest", "onBrowserState", "onMenuAction", "onSettingsCloseRequest", "onReferenceOpen", "onThreadBriefChanged", "onActivityEvent", "onTerminalEvent", "onQuickChatContext", "onQuickChatFocusInput", "onQuickChatClickThroughChanged"]);
const briefConfig = { enabled: true, autoTodo: true, projectSuggestions: true, minUserTurns: 2, minNewChars: 400, cluster: { threads: 3, spread: 2 } };

function toolName(step: DemoToolStep): string {
  if (step.command) return "Bash";
  if (step.diff) return "Write";
  return ({ "读取文件": "Read", "搜索内容": "Grep", "列出文件": "Glob", "写入文件": "Write", "编辑文件": "Edit" } as Record<string, string>)[step.name] ?? step.name;
}
function toolArgs(step: DemoToolStep): Record<string, unknown> {
  if (step.args) return step.args;
  return step.command ? { command: step.command.text } : { path: step.diff?.path ?? step.filePath ?? step.summary, content: step.diff?.lines.filter(line => line.sign !== "-").map(line => line.text).join("\n") };
}
function toolResult(step: DemoToolStep): unknown {
  return step.command ? { stdout: step.command.output.join("\n"), stderr: "", exitCode: 0 } : step.payload?.join("\n") ?? step.diff?.lines.map(line => `${line.sign}${line.text}`).join("\n") ?? step.filePath ?? "完成";
}
function fileChange(step: DemoToolStep) {
  const path = step.diff?.path ?? (toolName(step) === "Write" ? step.filePath : undefined);
  if (!path) return undefined;
  const lines = step.diff?.lines.map(line => `${line.sign}${line.text}`) ?? (demoFiles[path] ?? "").split("\n").map(line => `+${line}`);
  return { operation: step.diff ? "update" as const : "create" as const, path, committed: true as const, diff: `@@\n${lines.join("\n")}` };
}
function history(scenario: DemoScenario): SessionEvent[] {
  const events: SessionEvent[] = [];
  for (const [index, step] of scenario.steps.entries()) {
    if (step.kind === "user") events.push({ type: "user_message", content: step.text, messageId: `${scenario.id}-${index}`, time: timestamp });
    if (step.kind === "assistant") events.push({ type: "assistant_message", content: step.text, time: timestamp });
    if (step.kind === "tool") {
      // 需要用户决定的场景从请求前开始，不能预先显示一次批准后的成功。
      if (step.permission) break;
      events.push({ type: "tool_call", tool: toolName(step), args: toolArgs(step), toolCallId: `${scenario.id}-tool-${index}`, time: timestamp });
      const change = fileChange(step);
      if (change) events.push({ type: "tool_execution", tool: toolName(step), toolCallId: `${scenario.id}-tool-${index}`, operationId: `${scenario.id}-change-${index}`, sequence: index, state: "side_effect_committed", change, time: timestamp });
      events.push({ type: "tool_result", tool: toolName(step), result: toolResult(step), toolCallId: `${scenario.id}-tool-${index}`, time: timestamp });
    }
  }
  return events;
}

type EventBody = AgentHostEvent extends infer E ? E extends AgentHostEvent ? Omit<E, "sessionId" | "runId" | "timestamp"> : never : never;
interface Options {
  onBrowserBounds?: (bounds?: DesktopBrowserBounds) => void;
  schedule?: (callback: () => void, delay: number) => () => void;
  onState?: (status: "idle" | "playing" | "paused" | "waiting" | "done") => void;
  scenarios?: DemoScenario[];
  initialSessionId?: string;
  filePanelWidth?: number;
  browserPage?: { title: string; url: string };
}

/** 只替换 preload 的数据边界，所有布局、交互和事件归约仍由 Desktop 负责。 */
export function createDesktopDemo(options: Options = {}) {
  const schedule = options.schedule ?? ((callback, delay) => { const timer = setTimeout(callback, delay); return () => clearTimeout(timer); });
  const listeners = new Map<string, Set<(value: unknown) => void>>();
  const scenarios = options.scenarios ?? zh.demoScenarios;
  const documents = new Map<string, DesktopSessionDocument>();
  let selectedId: string | undefined = options.initialSessionId ?? "memory";
  let model = models[0]!;
  let permissionMode: DesktopWorkspaceSnapshot["permissionMode"] = "ask";
  let cancelTimer: (() => void) | undefined;
  let epoch = 0;
  let pendingReplay: string | undefined;
  let status: "idle" | "playing" | "paused" | "waiting" | "done" = "idle";
  let run: { scenario: DemoScenario; id: string; index: number; queue: EventBody[]; snapshot: InteractiveRuntimeSnapshot; permission?: DemoToolStep; requestId?: string; toolCallId?: string } | undefined;
  const emit = (channel: string, value?: unknown) => { for (const listener of listeners.get(channel) ?? []) listener(structuredClone(value)); };
  const setStatus = (next: typeof status) => { status = next; options.onState?.(next); };
  const info = (sessionId: string) => ({ workspaceRoot: project.path, sessionId, sessionFile: `${sessionId}.jsonl`, provider: model.provider, modelLabel: model.displayName, reasoningLabel: "中", modelAlias: model.alias, thinking: model.defaultThinking, contextWindow: model.contextWindow });
  const snapshot = (sessionId: string): InteractiveRuntimeSnapshot => ({ revision: 0, info: info(sessionId), permissionMode, state: { kind: "idle" } });
  for (const scenario of scenarios) {
    const events = history(scenario);
    const session: DesktopSessionSummary = { id: scenario.id, projectId: project.id, fileName: `${scenario.id}.jsonl`, title: scenario.title, firstUserMessage: scenario.steps.find(step => step.kind === "user")?.text ?? "", lastAssistantMessage: "", eventCount: events.length, createdAt: timestamp, updatedAt: timestamp, pinned: false, status: "completed", metadataRevision: "0" };
    documents.set(scenario.id, { session, events, liveEvents: [], runtimeSnapshot: snapshot(scenario.id) });
  }
  const document = (id: string) => { const value = documents.get(id); if (!value) throw new Error("演示会话不存在。"); return value; };
  const sessions = () => [...documents.values()].map(item => item.session);
  const workspace = (): DesktopWorkspaceSnapshot => structuredClone({ project, sessions: sessions(), selectedSessionId: selectedId, runtime: selectedId ? document(selectedId).runtimeSnapshot : undefined, permissionMode, memory: memoryPolicySchema.parse(undefined), capabilityDefaults: { tools: "auto", skills: "auto" }, requiresModelConfiguration: false, models, pickerModels: models, connections: [] });
  const bootstrap = (): DesktopBootstrap => ({ version: packageInfo.version, platform: "darwin", projects: [project], sidebarSessions: sessions(), activeProjectId: project.id, selectedSessionId: selectedId, activeView: "chat", workspace: workspace(), sidebarWidth: 250, filePanelWidth: options.filePanelWidth ?? 372, ...demoAppearance });
  function publish(body: EventBody) {
    if (!run) return;
    const event = { ...body, sessionId: run.scenario.id, runId: run.id, timestamp: new Date().toISOString() } as AgentHostEvent;
    run.snapshot = { ...run.snapshot, revision: run.snapshot.revision + 1, state: reduceInteractiveRunState(run.snapshot.state, event) };
    const doc = document(event.sessionId);
    doc.liveEvents.push(event);
    doc.runtimeSnapshot = run.snapshot;
    doc.session.status = event.type === "run.cancelled" ? "cancelled" : run.snapshot.state.kind === "runs" ? run.snapshot.state.activeRun.status === "thinking" ? "running" : run.snapshot.state.activeRun.status : "completed";
    const envelope: DesktopAgentEventEnvelope = { projectId: project.id, sessionId: event.sessionId, primary: true, event, snapshot: run.snapshot };
    emit("onAgentEvent", envelope);
  }
  function stop() { epoch++; cancelTimer?.(); cancelTimer = undefined; pendingReplay = undefined; run = undefined; }
  function enqueueStep(step: DemoStep, index: number) {
    if (!run) return;
    if (step.kind === "user") run.queue.push({ type: "message.user", messageId: `${run.id}-${index}`, content: step.text });
    if (step.kind === "assistant") {
      for (let offset = 0; offset < step.text.length; offset += 12) run.queue.push({ type: "assistant.delta", content: step.text.slice(offset, offset + 12) });
      run.queue.push({ type: "assistant.completed", content: step.text });
    }
    if (step.kind === "reasoning") run.queue.push({ type: "reasoning.started", phase: "initial" }, { type: "reasoning.delta", content: step.text }, { type: "reasoning.completed" });
    if (step.kind === "model") { model = models.find(item => step.model.includes("GPT") === item.displayName.includes("GPT")) ?? model; run.snapshot.info = info(run.scenario.id); }
    if (step.kind === "tool") {
      const toolCallId = `${run.id}-tool-${index}`;
      run.queue.push({ type: "tool.started", toolCallId, tool: toolName(step), args: toolArgs(step) });
      if (step.permission) {
        const requestId = `${toolCallId}-permission`;
        run.permission = step; run.requestId = requestId; run.toolCallId = toolCallId;
        run.queue.push({ type: "permission.requested", requestId, toolCallId, request: { toolCallId, tool: toolName(step), title: step.permission.title, details: step.permission.details, requireFullYes: step.permission.requireFullYes, preview: step.permission.preview, actionType: step.command ? "shell" : "write", riskLevel: step.permission.risk, targetPath: step.permission.target, command: step.command?.text } });
      } else {
        const change = fileChange(step);
        if (change) run.queue.push({ type: "tool.change_committed", toolCallId, tool: toolName(step), operationId: `${toolCallId}-change`, change });
        run.queue.push({ type: "tool.completed", toolCallId, tool: toolName(step), result: toolResult(step), durationMs: 300 });
      }
    }
  }
  function advance(fast = false) {
    cancelTimer = undefined;
    if (!run || status !== "playing") return;
    while (!run.queue.length && run.index < run.scenario.steps.length) enqueueStep(run.scenario.steps[run.index]!, run.index++);
    const event = run.queue.shift();
    if (!event) { publish({ type: "run.completed", durationMs: 12000 }); setStatus("done"); return; }
    publish(event);
    if (event.type === "permission.requested") { setStatus("waiting"); return; }
    if (!fast) { const current = epoch; cancelTimer = schedule(() => { if (epoch === current) advance(); }, event.type.endsWith("delta") ? 45 : 450); }
  }
  function begin(scenario: DemoScenario) {
    const id = `demo-run-${++epoch}`;
    run = { scenario, id, index: 0, queue: [], snapshot: snapshot(scenario.id) };
    setStatus("playing");
    publish({ type: "run.started", messageId: `${id}-0`, input: scenario.steps.find(step => step.kind === "user")?.text ?? "", model: { alias: model.alias, provider: model.provider, label: model.displayName, reasoning: "中" }, skills: [] });
    advance();
    return { sessionId: scenario.id, runId: id, messageId: `${id}-0` };
  }
  function replay(id = selectedId ?? "memory") {
    const scenario = scenarios.find(item => item.id === id);
    if (!scenario) throw new Error("请选择预置演示会话。");
    if (run && ["playing", "paused", "waiting"].includes(status)) publish({ type: "run.cancelled", durationMs: 0, reason: "重新播放" });
    stop(); selectedId = id; pendingReplay = id;
    const doc = document(id); doc.events = []; doc.liveEvents = []; doc.runtimeSnapshot = snapshot(id);
    setStatus("idle");
    emit("onSessionHandoff", { projectId: project.id, sessionId: id });
  }
  const implemented: Partial<DesktopApi> = {
    ...createInspectorDemo(emit, options.onBrowserBounds, options.browserPage),
    bootstrap: async () => structuredClone(bootstrap()),
    selectProject: async () => workspace(), refreshProject: async () => workspace(),
    openSession: async (_projectId, id) => structuredClone(document(id)),
    readSessionTrace: async (_projectId, id) => structuredClone(document(id).events),
    commitSelection: async (_projectId, id) => { selectedId = id; if (pendingReplay === id && id) { pendingReplay = undefined; begin(scenarios.find(item => item.id === id)!); } else options.onState?.(status); },
    setActiveView: async () => {},
    startDraft: async () => { selectedId = undefined; return workspace(); },
    listSessionTreePage: async (_id, options) => ({ projectId: project.id, parentSessionId: options?.parentSessionId, revision: "demo", sessions: options?.parentSessionId ? [] : structuredClone(sessions()) }),
    listProjectBranches: async () => [{ name: "main", current: true }],
    sendPrompt: async (_projectId, _id, input, attachments) => {
      if (attachments.length) throw new Error("演示不读取上传文件，请在桌面端使用附件。");
      if (run && ["playing", "paused", "waiting"].includes(status)) throw new Error("请先停止当前演示。");
      const scenario = scenarios.find(item => item.steps.some(step => step.kind === "user" && step.text === input.trim()));
      if (!scenario) throw new Error("这里只播放预置场景。请在侧栏选择会话后点重播，或下载 Biny 开始真实对话。");
      stop(); selectedId = scenario.id;
      const doc = document(scenario.id); doc.events = []; doc.liveEvents = [];
      return begin(scenario);
    },
    cancelRun: async (_projectId, id) => { if (run?.id !== id) return; publish({ type: "run.cancelled", durationMs: 0, reason: "用户停止" }); stop(); setStatus("done"); },
    resolvePermission: async (_projectId, id, result) => {
      if (!run || status !== "waiting" || run.requestId !== id || !run.permission?.permission) throw new Error("这次权限请求已结束。");
      const step = run.permission;
      if (result.approved && step.permission!.requireFullYes && !isFullYesConfirmation(result.confirmation ?? "")) throw new Error("请输入完整的 yes 确认。");
      publish({ type: "permission.resolved", requestId: id, toolCallId: run.toolCallId!, tool: toolName(step), approved: result.approved, action: result.action, scope: result.scope, message: result.message });
      if (result.approved) {
        const change = fileChange(step);
        if (change) run.queue.push({ type: "tool.change_committed", toolCallId: run.toolCallId!, tool: toolName(step), operationId: `${run.toolCallId}-change`, change });
        run.queue.push({ type: "tool.completed", toolCallId: run.toolCallId!, tool: toolName(step), result: toolResult(step), durationMs: 300 });
      }
      else { run.index = run.scenario.steps.length; run.queue.push({ type: "tool.failed", toolCallId: run.toolCallId!, tool: toolName(step), error: "用户拒绝执行" }, { type: "assistant.completed", content: step.permission!.deniedReply }); }
      run.permission = undefined; setStatus("playing"); advance();
    },
    setPermissionMode: async (_id, mode) => { permissionMode = mode; return workspace(); },
    switchModel: async (_id, alias, thinking) => { const next = models.find(item => item.alias === alias); if (!next) throw new Error("模型不在演示列表中。"); model = { ...next, defaultThinking: thinking }; return info(selectedId ?? "memory"); },
    renameSession: async (_id, id, title) => { document(id).session.title = title; return workspace(); },
    pinSession: async (_id, id, pinned) => { document(id).session.pinned = pinned; return workspace(); },
    markSessionRead: async () => workspace(),
    saveChatPersonalization: async (_projectId, id, input, expectedRevision) => {
      const session = document(id).session;
      if (session.metadataRevision !== expectedRevision) throw new Error("聊天状态已更新，请重试。");
      session.personalization = input; session.metadataRevision = String(Number(expectedRevision) + 1);
      return workspace();
    },
    resolveDroppedFile: () => { throw new Error("网页演示不读取本机文件，请在桌面端使用附件。"); },
    toolCatalog: async () => ["Read", "Write", "Bash", "Grep"].map(name => ({ name, description: name, source: "builtin" })),
    skillCatalog: async () => ({ skills: [], inventory: [], unmanagedSkills: [], plugins: [], managedSources: [], warnings: [], diagnostics: [] }),
    skillSettings: async () => ({ projectId: project.id, projectKey: "demo", globalDefaults: {}, projectOverrides: {}, activations: [] }),
    planProjection: async (_id, sessionId) => ({ sessionId, plans: [] }),
    runtimeProjection: async () => ({ tasks: [], automations: [], pendingFires: [], graphs: [], capabilities: {}, worktrees: [] }),
    recipeSuggestions: async () => [], activitySuggestions: async () => [],
    threadBriefRequest: async (request) => { if (request.action !== "overview") throw new Error("演示不生成真实会话摘要。"); return { config: briefConfig, defaults: briefConfig, enabledAt: timestamp, briefs: [], suggestions: [], projects: [] }; },
    previewAppearance: async (appearance) => emit("onAppearanceChanged", appearance ?? demoAppearance),
    setSidebarWidth: async () => {}, setFilePanelWidth: async () => {},
  };
  const api = new Proxy(implemented, { get(target, property: string) {
    if (property in target) return Reflect.get(target, property);
    if (passiveChannels.has(property)) return (listener: (value: unknown) => void) => { const channel = listeners.get(property) ?? new Set(); listeners.set(property, channel); channel.add(listener); return () => { channel.delete(listener); }; };
    return async () => { throw new Error("此操作需要桌面端；网页演示不连接系统、模型或真实文件。"); };
  } }) as DesktopApi;
  return {
    api, replay, get status() { return status; },
    showBrowser() { emit("onBrowserOpenRequest", project.id); },
    toggleSidebar() { emit("onMenuAction", "toggle-sidebar"); },
    start() { if (status === "idle" && !pendingReplay) replay(); },
    pause() { if (status !== "playing") return; cancelTimer?.(); cancelTimer = undefined; setStatus("paused"); },
    resume() { if (status !== "paused") return; setStatus("playing"); advance(); },
    skip() { cancelTimer?.(); if (status === "paused") setStatus("playing"); while (run && status === "playing") advance(true); },
    dispose() { stop(); options.onBrowserBounds?.(); listeners.clear(); }
  };
}
