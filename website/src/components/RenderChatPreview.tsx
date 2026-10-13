import { useCallback, useEffect, useRef, useState } from "react";
import { hasTrustedSender } from "../demo/bridge";
import type { RenderDemoState, RenderMode } from "../demo/renderSamples";

export function RenderChatPreview({ mode, active, onInteract, onReady }: { mode: RenderMode; active: boolean; onInteract(): void; onReady(): void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const initialMode = useRef(mode);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const latest = useRef({ mode, active, onInteract, onReady });
  latest.current = { mode, active, onInteract, onReady };
  const send = useCallback(() => {
    const { mode, active } = latest.current;
    frame.current?.contentWindow?.postMessage({ source: "biny-render-host", mode, active, theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light" } satisfies RenderDemoState, location.origin);
  }, []);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (!hasTrustedSender(event, frame.current?.contentWindow, location.origin) || event.data?.source !== "biny-render-demo") return;
      if (event.data.event === "ready") { setLoaded(true); setFailed(false); latest.current.onReady(); send(); }
      if (event.data.event === "interact") latest.current.onInteract();
    };
    window.addEventListener("message", receive);
    const observer = new MutationObserver(send);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { window.removeEventListener("message", receive); observer.disconnect(); };
  }, [send]);
  useEffect(() => { if (loaded) send(); }, [mode, active, loaded, send]);
  useEffect(() => {
    if (loaded) return;
    const timer = window.setTimeout(() => setFailed(true), 15000);
    return () => window.clearTimeout(timer);
  }, [loaded, attempt]);
  return <div className="render-chat-preview">
    <iframe key={attempt} ref={frame} src={`/render-demo.html?mode=${initialMode.current}`} title={initialMode.current === "music" ? "Biny 真实音乐聊天示例" : "Biny 真实 Markdown 聊天示例"} onLoad={send} onError={() => setFailed(true)} aria-hidden={!loaded} tabIndex={loaded ? 0 : -1} />
    {!loaded && <div className="render-chat-loading" role="status">{failed ? <><span>聊天示例暂未加载</span><button type="button" onClick={() => { setFailed(false); setAttempt(value => value + 1); }}>重新加载</button></> : "正在加载聊天…"}</div>}
  </div>;
}
