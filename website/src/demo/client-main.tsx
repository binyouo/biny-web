import { demoPreviewHtml } from "./inspectorDemo";
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

let ready = false;
const report = (status: DemoState["status"]) => { if (ready) window.parent.postMessage({ source: "biny-client-demo", status } satisfies DemoState, window.location.origin); };
const browserPage = document.createElement("iframe");
browserPage.className = "demo-browser-page";
browserPage.title = "本周计划预置网页";
browserPage.setAttribute("sandbox", "");
browserPage.srcdoc = demoPreviewHtml;
browserPage.hidden = true;
document.body.append(browserPage);
const demo = createDesktopDemo({ onState: report, onBrowserBounds(bounds) {
  browserPage.hidden = !bounds;
  if (bounds) Object.assign(browserPage.style, { left: `${bounds.x}px`, top: `${bounds.y}px`, width: `${bounds.width}px`, height: `${bounds.height}px` });
} });
const commitSelection = demo.api.commitSelection;
demo.api.commitSelection = async (...args) => { ready = true; await commitSelection(...args); };
window.biny = demo.api;
applyAppearance(document.documentElement, demoAppearance);

const receive = (event: MessageEvent) => {
  if (!hasTrustedSender(event, window.parent, window.location.origin) || !isDemoCommand(event.data)) return;
  if (event.data.command === "start") demo.start();
  if (event.data.command === "replay") demo.replay();
  if (event.data.command === "skip") demo.skip();
  if (event.data.command === "state") report(demo.status);
};
window.addEventListener("message", receive);
const dispose = () => { window.removeEventListener("message", receive); demo.dispose(); };
window.addEventListener("pagehide", dispose, { once: true });

// iframe 隔离官网样式，演示入口禁用需要真实配置服务的设置面板。
document.documentElement.dataset.platform = "darwin";
const container = document.getElementById("root");
if (!container) throw new Error("Biny demo root is missing.");
const root = createRoot(container);
root.render(<StrictMode><ThreadBriefProvider><App settingsEnabled={false} /></ThreadBriefProvider></StrictMode>);
const traffic = document.createElement("div");
traffic.className = "demo-window-traffic";
traffic.setAttribute("aria-hidden", "true");
traffic.append(...Array.from({ length: 3 }, () => document.createElement("i")));
document.body.append(traffic);
if (import.meta.hot) import.meta.hot.dispose(() => { root.unmount(); dispose(); window.removeEventListener("pagehide", dispose); traffic.remove(); browserPage.remove(); });
