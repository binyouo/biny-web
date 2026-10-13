import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { useI18n } from "../i18n";
import { useInView } from "../lib/utils";
import { CLIENT_HEIGHT, CLIENT_WIDTH, clientScale, hasTrustedSender, isDemoState, type DemoCommand, type DemoState } from "./bridge";
import "./preview.css";

function focusableElements(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [tabindex], iframe")]
    .filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && !element.closest("[inert]") && element.getClientRects().length > 0);
}

export function BinyWindow({ variant }: { variant?: "computer" }) {
  const computer = variant === "computer";
  const width = computer ? 1000 : CLIENT_WIDTH;
  const height = computer ? 690 : CLIENT_HEIGHT;
  const { t } = useI18n();
  const [viewRef, inView] = useInView<HTMLDivElement>("-15% 0px");
  const previewRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const replayButtonRef = useRef<HTMLButtonElement>(null);
  const visibleRef = useRef(inView);
  const expandedRef = useRef(false);
  const readyRef = useRef(false);
  const loadTimerRef = useRef<number | null>(null);
  const frameListenerCleanupRef = useRef<(() => void) | null>(null);
  const pendingReadyFocusRef = useRef(false);
  const [scale, setScale] = useState(0);
  const [status, setStatus] = useState<DemoState["status"]>("idle");
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const autoPaused = useRef(false);
  const active = (computer ? onScreen : inView) || expanded;
  visibleRef.current = active && pageVisible;
  expandedRef.current = expanded;

  const send = useCallback((command: DemoCommand["command"]) => {
    iframeRef.current?.contentWindow?.postMessage({ source: "biny-website", command } satisfies DemoCommand, window.location.origin);
  }, []);

  const clearLoadTimer = useCallback(() => {
    if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current);
    loadTimerRef.current = null;
  }, []);

  const frameDocument = useCallback(() => {
    try {
      return iframeRef.current?.contentDocument ?? null;
    } catch {
      return null;
    }
  }, []);

  function handleFrameLoad() {
    frameListenerCleanupRef.current?.();
    const childDocument = frameDocument();
    if (childDocument) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (!expandedRef.current || event.defaultPrevented) return;
        if (event.key === "Escape") {
          event.preventDefault();
          setExpanded(false);
          return;
        }
        if (event.key !== "Tab") return;
        const childItems = focusableElements(childDocument);
        const parentItems = previewRef.current ? focusableElements(previewRef.current).filter((item) => item !== iframeRef.current) : [];
        if (!childItems.length) {
          event.preventDefault();
          (event.shiftKey ? parentItems.at(-1) : parentItems[0])?.focus();
        } else if (!event.shiftKey && childDocument.activeElement === childItems.at(-1)) {
          event.preventDefault();
          parentItems[0]?.focus();
        } else if (event.shiftKey && childDocument.activeElement === childItems[0]) {
          event.preventDefault();
          parentItems.at(-1)?.focus();
        }
      };
      childDocument.addEventListener("keydown", onKeyDown);
      frameListenerCleanupRef.current = () => childDocument.removeEventListener("keydown", onKeyDown);
    }
    send("state");
  }

  function retryLoad() {
    readyRef.current = false;
    pendingReadyFocusRef.current = true;
    setReady(false);
    setStatus("idle");
    setLoadError(null);
    frameListenerCleanupRef.current?.();
    frameListenerCleanupRef.current = null;
    setLoadAttempt((attempt) => attempt + 1);
    if (expanded) expandButtonRef.current?.focus();
  }

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const resize = () => setScale(computer ? Math.min(1, stage.clientWidth / width) : clientScale(stage.clientWidth));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [computer, width]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0 });
    if (stageRef.current) observer.observe(stageRef.current);
    const sync = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (!hasTrustedSender(event, iframeRef.current?.contentWindow, window.location.origin) || !isDemoState(event.data)) return;
      readyRef.current = true;
      clearLoadTimer();
      setLoadError(null);
      setReady(true);
      setStatus(event.data.status);
      if (event.data.status === "idle" && visibleRef.current) send("start");
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [clearLoadTimer, send]);

  useEffect(() => {
    if (!readyRef.current) {
      loadTimerRef.current = window.setTimeout(() => {
        setLoadError("演示未能完成加载，请检查网络后重试。");
      }, 12_000);
    }
    return clearLoadTimer;
  }, [clearLoadTimer, loadAttempt]);

  useEffect(() => () => frameListenerCleanupRef.current?.(), []);
  useEffect(() => {
    if (!ready) return;
    if (active && pageVisible) {
      if (status === "idle") send("start");
      if (status === "paused" && autoPaused.current) { autoPaused.current = false; send("resume"); }
      if (computer && status === "playing" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) send("skip");
    } else if (computer && status === "playing") { autoPaused.current = true; send("pause"); }
  }, [active, pageVisible, ready, status, computer, send]);

  useEffect(() => {
    if (!ready || !pendingReadyFocusRef.current) return;
    pendingReadyFocusRef.current = false;
    if (document.activeElement === document.body || previewRef.current?.contains(document.activeElement)) {
      replayButtonRef.current?.focus({ preventScroll: true });
    }
  }, [ready]);

  useEffect(() => {
    if (!expanded) return;
    const preview = previewRef.current;
    if (!preview) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : expandButtonRef.current;
    const inertSiblings: { element: HTMLElement; previous: boolean }[] = [];
    let branch: HTMLElement | null = preview;
    while (branch?.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling === branch || !(sibling instanceof HTMLElement)) continue;
        inertSiblings.push({ element: sibling, previous: sibling.inert });
        sibling.inert = true;
      }
      branch = branch.parentElement;
      if (branch === document.body) break;
    }
    document.body.style.overflow = "hidden";
    expandButtonRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setExpanded(false);
      } else if (event.key === "Tab") {
        const items = focusableElements(preview);
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          const childLast = readyRef.current ? frameDocument() : null;
          const target = childLast ? focusableElements(childLast).at(-1) : items.at(-1);
          (target ?? items.at(-1))?.focus();
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault();
          items[0]?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      for (const { element, previous } of inertSiblings) element.inert = previous;
      window.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      else expandButtonRef.current?.focus({ preventScroll: true });
    };
  }, [expanded, frameDocument]);

  return (
    <div className="client-demo-anchor" ref={viewRef}>
      <div
        aria-label={expanded ? "客户端交互演示" : undefined}
        aria-modal={expanded ? true : undefined}
        className={`client-demo-preview${computer ? " client-demo-computer" : ""}${expanded ? " is-expanded" : ""}`}
        ref={previewRef}
        role={expanded ? "dialog" : undefined}
      >
        <div className="client-demo-controls">
          <span aria-live="polite" className="client-demo-status sr-only">{loadError ? "演示加载失败" : !ready ? "正在加载演示…" : status === "paused" ? "演示已暂停" : status === "waiting" ? t.demo.controls.waiting : status === "done" ? t.demo.controls.done : status === "idle" ? "准备播放" : computer ? "Biny 正在操作" : t.demo.controls.playing}</span>
          <button disabled={!ready} aria-label="重播" title="重播" onClick={() => send("replay")} ref={replayButtonRef} type="button"><Icon name="refresh" size={13} /></button>
          {!computer && <button disabled={!ready || status === "done"} aria-label={t.demo.controls.skip} title={t.demo.controls.skip} onClick={() => send("skip")} type="button"><Icon name="chevronRight" size={13} /></button>}
          {!computer && <button aria-expanded={expanded} aria-label={expanded ? "收起演示" : "放大查看"} title={expanded ? "收起演示" : "放大查看"} onClick={() => setExpanded((value) => !value)} ref={expandButtonRef} type="button"><Icon name={expanded ? "close" : "panelRight"} size={13} /></button>}
        </div>
        <div className="client-demo-stage" ref={stageRef} role={computer && ready ? "img" : undefined} aria-label={computer && ready ? "Biny 在浏览器中搜索咖啡馆并打开结果的预置动画" : undefined} style={{ aspectRatio: `${width} / ${height}` }}>
          <iframe
            className="client-demo-frame"
            inert={computer || !ready}
            aria-hidden={computer || undefined}
            key={loadAttempt}
            onError={() => { clearLoadTimer(); readyRef.current = false; setReady(false); setLoadError("演示加载失败，请重试。"); }}
            onLoad={handleFrameLoad}
            ref={iframeRef}
            src={computer ? "/client-demo.html?scene=computer" : "/client-demo.html"}
            style={{ width, height, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
            tabIndex={ready && !computer ? 0 : -1}
            title={computer ? "Biny 电脑操作预置演示" : "Biny 客户端预置交互演示"}
          />
          {!ready ? <div className="client-demo-feedback" role="status">
            <p>{loadError ?? "正在加载客户端演示…"}</p>
            {loadError ? <button onClick={retryLoad} type="button"><Icon name="refresh" size={14} />重试加载</button> : null}
          </div> : null}
        </div>
      </div>
    </div>
  );
}
