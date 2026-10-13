import type { DesktopApi, DesktopBrowserBounds, DesktopBrowserSnapshot, DesktopGitStatus, DesktopTerminalEvent, DesktopTerminalHandle } from "../../vendor/biny/src/desktop/protocol.ts";
import type { LocalReferenceResult } from "../../vendor/biny/src/session/localReferences.ts";
import { zh } from "../i18n/zh.ts";

export const demoPreviewHtml = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{box-sizing:border-box}body{margin:0;padding:32px 24px;background:#f5f4f0;color:#292926;font:14px/1.8 system-ui,sans-serif}small{color:#74746d}h1{font-size:28px;line-height:1.4;margin:24px 0 12px}p{color:#60605a}article{padding:18px 0;border-top:1px solid #ddddd5}strong{display:block;font-weight:550}span{font-size:12px;color:#77776e}footer{margin-top:28px;font-size:11px;color:#77776e}</style>
<small>Workspace / 本周计划</small><h1>留出专注的时间。</h1><p>三件想推进的事，也给休息留一点空间。</p><article><strong>完成阅读记录原型</strong><span>周一、周二 · 上午专注时段</span></article><article><strong>整理研究笔记</strong><span>周三 · 汇总阅读与想法</span></article><article><strong>午后散步</strong><span>每天 · 离开屏幕二十分钟</span></article><footer>Biny 预置示例</footer></html>`;
const previewUrl = "https://workspace.example/weekly-plan";

const files: Record<string, string> = {
  "README.md": "# Workspace\n\nBiny 预置工作区。\n\n- weekly-plan.md：本周计划\n- docs/weekly/本周进展.md：工作进展\n- src/：代码示例\n",
  "weekly-plan.md": "# 本周计划\n\n- 完成阅读记录原型\n- 整理研究笔记\n- 午后散步\n",
  "docs/weekly/本周进展.md": "# 本周进展\n\n## 已完成\n\n- 阅读记录的页面与数据结构\n- 登录超时问题定位\n\n## 下一步\n\n- 补充边界用例\n- 整理研究笔记\n",
  "index.html": demoPreviewHtml,
};
for (const scenario of zh.demoScenarios) for (const step of scenario.steps) {
  if (step.kind === "tool" && step.diff) files[step.diff.path] = step.diff.lines.filter(line => line.sign !== "-").map(line => line.text).join("\n");
}

export const demoFiles: Readonly<Record<string, string>> = Object.freeze(files);

/** 用内存对象替代 Git、PTY、文件系统与原生浏览器视图。 */
export function createInspectorDemo(emit: (channel: string, value: unknown) => void, onBrowserBounds?: (bounds?: DesktopBrowserBounds) => void, browserPage?: { title: string; url: string }): Partial<DesktopApi> {
  const normalize = (path: string) => path.replace(/^\/Biny\/Workspace\/?/, "").replace(/^\.\//, "");
  const references: LocalReferenceResult[] = Object.entries(files).map(([path, content]) => ({ kind: "file", uri: `biny://file/${encodeURIComponent(path)}`, label: path === "weekly-plan.md" ? "本周计划" : path, content, projectId: "demo" }));
  const capturedPage: LocalReferenceResult = { kind: "snippet", uri: "biny://snippet/demo-page", label: browserPage?.title ?? "本周计划 · 示例", content: browserPage ? "慢慢逛：河畔咖啡、巷口书屋。Biny 本地预置地点示例。" : files["weekly-plan.md"]!, projectId: "demo" };
  references.push(capturedPage);
  const git: DesktopGitStatus = { branch: "main", revision: "0", files: [{ path: "weekly-plan.md", status: " M" }, { path: "docs/weekly/本周进展.md", status: "??" }] };
  const page = browserPage ?? { title: "本周计划 · 示例", url: previewUrl };
  const browser: DesktopBrowserSnapshot = { projectId: "demo", revision: 0, activeId: "demo-page-1", tabs: [{ id: "demo-page-1", ...page, loading: false, canGoBack: false, canGoForward: false }] };
  let tabIndex = 1;
  let previewRunning = false;
  const terminals = new Map<string, DesktopTerminalHandle>();
  const terminalInputs = new Map<string, string>();
  const terminal = (slotId: string) => {
    let handle = terminals.get(slotId);
    if (!handle) {
      handle = { terminalId: `demo-terminal-${slotId}`, sequence: 0, replay: "Biny 预置终端 · 不执行真实命令\r\n\r\nWorkspace % pnpm test\r\n\r\n ✓ sortIds · 6 passed\r\n ✓ openSession · 4 passed\r\n\r\n Tests  10 passed\r\n\r\nWorkspace % " };
      terminals.set(slotId, handle);
    }
    return structuredClone(handle);
  };
  const browserResult = () => { browser.revision++; const result = structuredClone(browser); emit("onBrowserState", result); return result; };
  return {
    listWorkspaceDirectory: async (_id, input) => {
      const path = normalize(input);
      const prefix = path && path !== "." ? `${path}/` : "";
      const entries = new Map<string, { name: string; path: string; kind: "file" | "directory" }>();
      for (const file of Object.keys(files)) if (file.startsWith(prefix)) {
        const rest = file.slice(prefix.length), name = rest.split("/")[0]!;
        entries.set(name, { name, path: `${prefix}${name}`, kind: rest.includes("/") ? "directory" : "file" });
      }
      return { path: path || ".", entries: [...entries.values()] };
    },
    readWorkspaceFile: async (_id, input) => {
      const path = normalize(input), content = files[path];
      if (content === undefined) throw new Error("预置文件不存在。");
      return { path, content, bytes: new TextEncoder().encode(content).length, binary: false, truncated: false };
    },
    projectGitStatus: async () => structuredClone(git),
    commitProjectFiles: async (_id, input) => { git.files = git.files.filter(file => !input.paths.includes(file.path)); git.revision = String(Number(git.revision) + 1); return structuredClone(git); },
    projectGitRemote: async () => structuredClone(git),
    listTerminals: async () => { if (!terminals.size) terminal("default"); return [...terminals].map(([slotId, handle]) => ({ slotId, terminalId: handle.terminalId })); },
    createTerminal: async (_id, _cols, _rows, slotId = "default") => terminal(slotId),
    resizeTerminal: () => {},
    disposeTerminal: async id => { for (const [slot, handle] of terminals) if (handle.terminalId === id) terminals.delete(slot); terminalInputs.delete(id); },
    writeTerminal: (id, input) => {
      const handle = [...terminals.values()].find(item => item.terminalId === id);
      if (!handle) return;
      let buffer = terminalInputs.get(id) ?? "", output = "";
      for (const char of input) {
        if (char === "\r" || char === "\n") { output += "\r\n预置演示，不执行命令。\r\nWorkspace % "; buffer = ""; }
        else if (char === "\u007f") { if (buffer) { buffer = buffer.slice(0, -1); output += "\b \b"; } }
        else if (char >= " " && char !== "\u001b") { if (buffer.length < 200) { buffer += char; output += char; } }
      }
      terminalInputs.set(id, buffer);
      handle.replay = (handle.replay + output).slice(-12000);
      emit("onTerminalEvent", { terminalId: id, type: "data", data: output, sequence: ++handle.sequence } satisfies DesktopTerminalEvent);
    },
    browserSnapshot: async () => structuredClone(browser),
    browserBounds: async (_id, tabId, bounds) => { onBrowserBounds?.(browser.activeId === tabId && browser.tabs.some(tab => tab.id === tabId && tab.url) ? bounds : undefined); },
    browserAction: async (_id, action) => {
      if (browserPage && (action.type === "navigate" || action.type === "new") && action.url && action.url !== browserPage.url) throw new Error("此演示仅浏览本地示例网页。请在 Biny 桌面端打开其他网址。");
      if (action.type === "new") { const id = `demo-page-${++tabIndex}`; browser.tabs.push({ id, ...page, url: action.url || page.url, loading: false, canGoBack: false, canGoForward: false }); browser.activeId = id; }
      else if (action.type === "close") { browser.tabs = browser.tabs.filter(tab => tab.id !== action.tabId); if (browser.activeId === action.tabId) browser.activeId = browser.tabs[0]?.id; onBrowserBounds?.(); }
      else if (action.type === "select") browser.activeId = action.tabId;
      else if (action.type === "navigate") { const tab = browser.tabs.find(tab => tab.id === action.tabId); if (tab) tab.url = action.url; }
      return browserResult();
    },
    browserInspect: async (_id, tabId, enabled) => { const tab = browser.tabs.find(tab => tab.id === tabId); if (tab) { tab.inspecting = enabled; tab.selection = enabled ? { tag: "h1", selector: "h1", text: browserPage ? "今天，想去哪儿坐坐？" : "留出专注的时间。" } : undefined; } return browserResult(); },
    browserCapture: async () => structuredClone(capturedPage),
    projectPreviewAvailability: async () => ({ available: true, kind: "static", entry: "index.html", entries: ["index.html"] }),
    projectPreviewStatus: async () => previewRunning ? { kind: "static", url: previewUrl } : { kind: "stopped" },
    startProjectPreview: async () => { previewRunning = true; return { kind: "static", url: previewUrl }; },
    stopProjectPreview: async () => { previewRunning = false; },
    htmlPreviewUrl: async () => ({ url: previewUrl }),
    listBrowserProfiles: async () => [],
    referenceKinds: async () => [{ kind: "file", label: "文件" }],
    referenceSearch: async (_id, query, kind) => structuredClone(references.filter(ref => (!kind || ref.kind === kind) && `${ref.label}\n${ref.content}`.toLowerCase().includes(query.toLowerCase()))),
    referenceResolve: async (_id, uri) => { const ref = references.find(ref => ref.uri === uri); if (!ref) throw new Error("预置引用不存在。"); return structuredClone(ref); },
  };
}
