import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { MarkdownContent } from "../../vendor/biny/src/desktop/renderer/src/components/MarkdownContent";
import { AppearanceContext } from "../../vendor/biny/src/desktop/renderer/src/appearanceContext";
import { appearanceVariables } from "../../vendor/biny/src/desktop/renderer/src/appearance";
import { DEFAULT_APPEARANCE } from "../../vendor/biny/src/appearance/preferences";
import { resolveAppearance } from "../../vendor/biny/src/appearance/resolve";
import { hasTrustedSender } from "./bridge";
import { isRenderDemoState, isRenderMode, renderSamples, type RenderDemoState } from "./renderSamples";
import "../../vendor/biny/src/desktop/renderer/src/styles/layers.css";
import "katex/dist/katex.min.css";
import "./render-chat.css";

const modeParam = new URLSearchParams(location.search).get("mode");
const report = (event: "ready" | "interact") => window.parent.postMessage({ source: "biny-render-demo", event }, location.origin);
const openExternal = (url: string) => { if (/^https?:\/\//.test(url)) window.open(url, "_blank", "noopener,noreferrer"); };
const previewFile = () => {};

function RenderChat() {
  const [state, setState] = useState<RenderDemoState>({ source: "biny-render-host", mode: isRenderMode(modeParam) ? modeParam : "mermaid", theme: "light", active: true });
  const appearance = useMemo(() => resolveAppearance(DEFAULT_APPEARANCE, state.theme, false), [state.theme]);
  const sample = renderSamples[state.mode];

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.classList.toggle("dark", state.theme === "dark");
    root.classList.toggle("light", state.theme === "light");
    for (const [name, value] of Object.entries(appearanceVariables(appearance))) root.style.setProperty(name, value);
  }, [appearance, state.theme]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (hasTrustedSender(event, window.parent, location.origin) && isRenderDemoState(event.data)) setState(event.data);
    };
    const interact = () => report("interact");
    window.addEventListener("message", receive);
    document.addEventListener("pointerdown", interact);
    document.addEventListener("focusin", interact);
    report("ready");
    return () => {
      window.removeEventListener("message", receive);
      document.removeEventListener("pointerdown", interact);
      document.removeEventListener("focusin", interact);
    };
  }, []);

  return <AppearanceContext.Provider value={appearance}>
    <main className="render-chat biny-chat-scroll" aria-label="Biny 聊天渲染示例" data-mode={state.mode}>
      <div className="chat-message user-message"><div className="user-bubble"><MarkdownContent content={sample.question} projectId="website-render-demo" onPreviewFile={previewFile} onOpenExternal={openExternal} /></div></div>
      <div className="chat-message desktop-assistant-message">
        <div className="render-chat-author"><img src="/icon.png" alt="" /><span>Biny</span></div>
        {state.mode !== "music" || state.active
          ? <MarkdownContent key={state.mode} content={sample.answer} projectId="website-render-demo" onPreviewFile={previewFile} onOpenExternal={openExternal} />
          : <p className="render-chat-idle">音乐已停止。回到这里后可再次播放。</p>}
      </div>
    </main>
  </AppearanceContext.Provider>;
}

const root = createRoot(document.getElementById("root")!);
root.render(<RenderChat />);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
