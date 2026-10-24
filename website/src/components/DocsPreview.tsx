import { useCallback, useEffect, useRef, useState } from "react";
import { hasTrustedSender } from "../demo/bridge";
import type { RenderDemoState, RenderMode } from "../demo/renderSamples";
import "./docs-preview.css";

/**
 * 文档里的真实渲染示例：复用网站现有的聊天渲染宿主（/render-demo.html）。
 * 与 FeatureShowcase 共用同一套 iframe 协议，但使用文档自己的高度与边框样式。
 */

const captions: Record<RenderMode, string> = {
  mermaid: "Mermaid 流程图",
  infographic: "Infographic 信息图",
  math: "KaTeX 公式",
  table: "Markdown 表格",
  music: "Strudel 音乐"
};

export function DocsPreview({ mode }: { mode: RenderMode }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const initialMode = useRef(mode);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const send = useCallback(() => {
    frame.current?.contentWindow?.postMessage(
      { source: "biny-render-host", mode, active: true, theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light" } satisfies RenderDemoState,
      location.origin
    );
  }, [mode]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (!hasTrustedSender(event, frame.current?.contentWindow, location.origin) || event.data?.source !== "biny-render-demo") return;
      if (event.data.event === "ready") {
        setLoaded(true);
        setFailed(false);
        send();
      }
    };
    window.addEventListener("message", receive);
    const observer = new MutationObserver(send);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      window.removeEventListener("message", receive);
      observer.disconnect();
    };
  }, [send]);

  useEffect(() => {
    if (loaded) send();
  }, [mode, loaded, send]);

  useEffect(() => {
    if (loaded) return;
    const timer = window.setTimeout(() => setFailed(true), 15000);
    return () => window.clearTimeout(timer);
  }, [loaded, attempt]);

  return (
    <figure className={`docs-preview docs-preview-${mode}`} aria-label={`${captions[mode]}渲染示例`}>
      <figcaption className="docs-preview-caption">{captions[mode]}<span>真实渲染 · 可交互</span></figcaption>
      <div className="docs-preview-frame">
        <iframe
          key={attempt}
          ref={frame}
          src={`/render-demo.html?mode=${initialMode.current}`}
          title={`Biny ${captions[mode]}示例`}
          onLoad={send}
          onError={() => setFailed(true)}
          aria-hidden={!loaded}
          tabIndex={loaded ? 0 : -1}
        />
        {!loaded && (
          <div className="docs-preview-loading" role="status">
            {failed ? (
              <>
                <span>示例暂未加载</span>
                <button type="button" onClick={() => { setFailed(false); setAttempt((value) => value + 1); }}>重新加载</button>
              </>
            ) : "正在加载渲染示例…"}
          </div>
        )}
      </div>
    </figure>
  );
}
