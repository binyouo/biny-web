import { demoPreviewHtml } from "./inspectorDemo";
import { computerScenario, computerPage, computerPageHtml } from "./computerScenario";
import { placeBrowserSurface } from "./browserSurface";
import { createDesktopDemo, demoAppearance } from "./desktopDemo";
import { hasTrustedSender, isDemoCommand, type DemoState } from "./bridge";
import { applyAppearance } from "../../vendor/biny/src/desktop/renderer/src/appearance";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "../../vendor/biny/src/desktop/renderer/src/App";
import { ThreadBriefProvider } from "../../vendor/biny/src/desktop/renderer/src/threadBrief/ThreadBriefProvider";
import "../../vendor/biny/src/desktop/renderer/src/styles/layers.css";
import "katex/dist/katex.min.css";
import "./client-adapter.css";

const computer = new URLSearchParams(window.location.search).get("scene") === "computer";
let ready = false;
let pageStage = 0;
const report = (status: DemoState["status"]) => { if (ready) window.parent.postMessage({ source: "biny-client-demo", status } satisfies DemoState, window.location.origin); };
const browserPage = document.createElement("iframe");
browserPage.className = "demo-browser-page";
browserPage.title = computer ? "慢慢逛 · 预置网页动画" : "本周计划预置网页";
browserPage.setAttribute("sandbox", computer ? "allow-scripts" : "");
browserPage.srcdoc = computer ? computerPageHtml(window.location.origin) : demoPreviewHtml;
browserPage.hidden = true;
// The local page has an opaque sandbox origin, so the target origin must be '*'.
// Only preset scene state is sent; incoming messages also require this exact frame.
const sendPage = () => browserPage.contentWindow?.postMessage({ source: "biny-computer-scene", event: "stage", stage: pageStage }, "*");
const demo = createDesktopDemo({
  ...(computer ? { scenarios: [computerScenario], initialSessionId: "computer", filePanelWidth: 510, browserPage: computerPage,
    schedule(callback: () => void, delay: number) { const timer = window.setTimeout(callback, delay === 45 ? 55 : 800); return () => window.clearTimeout(timer); }
  } : {}),
  onState: report, onBrowserBounds(bounds) {
  placeBrowserSurface(browserPage, document, Boolean(bounds));
} });
const unsubscribe = computer ? demo.api.onAgentEvent(({ event }) => {
  if (!event) return;
  if (event.type === "run.started") { pageStage = 0; demo.showBrowser(); }
  if (event.type === "tool.started" && event.tool === "ComputerAction" && event.args && typeof event.args === "object" && "action" in event.args && event.args.action === "type_text") pageStage = 1;
  if (event.type === "tool.completed" && event.tool === "ComputerAction") pageStage = Math.min(3, pageStage + 1);
  if (event.type === "run.started" || event.type === "tool.started" || event.type === "tool.completed") sendPage();
}) : undefined;
const commitSelection = demo.api.commitSelection;
let sidebarPrepared = false;
demo.api.commitSelection = async (...args) => {
  ready = true;
  await commitSelection(...args);
  if (computer) {
    if (!sidebarPrepared) { sidebarPrepared = true; demo.toggleSidebar(); }
    demo.showBrowser();
  }
};
window.biny = demo.api;
applyAppearance(document.documentElement, demoAppearance);

const receive = (event: MessageEvent) => {
  if (computer && hasTrustedSender(event, browserPage.contentWindow, "null") && event.data?.source === "biny-computer-page") {
    if (event.data.event === "ready") sendPage();
    return;
  }
  if (!hasTrustedSender(event, window.parent, window.location.origin) || !isDemoCommand(event.data)) return;
  if (event.data.command === "start") demo.start();
  if (event.data.command === "replay") { pageStage = 0; sendPage(); demo.replay(); }
  if (event.data.command === "skip") demo.skip();
  if (event.data.command === "pause") demo.pause();
  if (event.data.command === "resume") demo.resume();
  if (event.data.command === "state") report(demo.status);
};
window.addEventListener("message", receive);
const dispose = () => { window.removeEventListener("message", receive); unsubscribe?.(); demo.dispose(); };
window.addEventListener("pagehide", dispose, { once: true });

// iframe 隔离官网样式，演示入口禁用需要真实配置服务的设置面板。
document.documentElement.dataset.platform = "darwin";
if (computer) document.documentElement.dataset.demo = "computer";
const container = document.getElementById("root");
if (!container) throw new Error("Biny demo root is missing.");
container.inert = computer;
const root = createRoot(container);
root.render(<StrictMode><ThreadBriefProvider><App settingsEnabled={false} /></ThreadBriefProvider></StrictMode>);
const traffic = document.createElement("div");
traffic.className = "demo-window-traffic";
traffic.setAttribute("aria-hidden", "true");
traffic.append(...Array.from({ length: 3 }, () => document.createElement("i")));
document.body.append(traffic);
if (import.meta.hot) import.meta.hot.dispose(() => { root.unmount(); dispose(); window.removeEventListener("pagehide", dispose); traffic.remove(); browserPage.remove(); });
