import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { useI18n } from "../i18n";
import { RenderChatPreview } from "./RenderChatPreview";
import { Reveal as ScrollReveal } from "./interaction";
import { BinyWindow } from "../demo/BinyWindow";
import { renderModes } from "../demo/renderSamples";
import "./feature-showcase.css";

type FeatureId = "history" | "memory" | "markdown";

const phases: Record<FeatureId, string[]> = {
  history: ["看过", "问一句", "找回来"],
  memory: ["记住偏好", "进入 Sleep", "整理记忆", "再次想起"],
  markdown: ["Mermaid 图表", "Infographic 信息图", "LaTeX 公式", "可导出表格", "Strudel 音乐"],
};

const markdownModes = ["Mermaid", "信息图", "公式", "表格", "音乐"];

function WindowFrame({ title, icon, status, children }: { title: string; icon: IconName; status: string; children: ReactNode }) {
  return <div className="feature-window">
    <div className="feature-window-bar">
      <span className="feature-window-dots"><i /><i /><i /></span>
      <span><Icon name={icon} size={12} />{title}</span>
      <span className="feature-window-status">{status}</span>
    </div>
    {children}
  </div>;
}

function Reveal({ open, className = "", children }: { open: boolean; className?: string; children: ReactNode }) {
  return <div className={`t-panel-slide ${className}`} data-open={open}>{children}</div>;
}

function HistoryScene({ phase }: { phase: number }) {
  return <div className="history-story">
    <div className="history-story-heading"><span>刚才，照常浏览</span><span><i />后台记录中</span></div>
    <div className="history-seen"><div><Icon name="search" size={15} /><span>Safari · 京都旅行</span></div><strong>鸭川边的小旅馆</strong><p>安静的房间，推窗就能看见河。</p></div>
    <Reveal open={phase >= 1} className="history-ask"><span>现在，问一句</span><div className="feature-question">刚才那家京都旅馆叫什么？</div></Reveal>
    <Reveal open={phase >= 2} className="history-found"><span className="feature-biny-mark">b.</span><div><p>是<strong>「鸭川边的小旅馆」</strong>。</p><span className="history-source"><Icon name="search" size={12} />Safari · 你刚才看过的网页<Icon name="external" size={12} /></span></div></Reveal>
  </div>;
}

function MemoryScene({ phase }: { phase: number }) {
  return <WindowFrame title="Memory" icon="brain" status={phase === 1 || phase === 2 ? "Sleep 整理中" : "本地记忆"}>
    <div className="memory-demo" data-consolidated={phase >= 2}>
      <div className="memory-heading"><span className="memory-moon"><Icon name={phase === 3 ? "sun" : "moon"} size={20} /></span><div><strong>{phase === 3 ? "换段对话，接着聊。" : "整理记忆，留住有用的。"}</strong><span>{phase === 0 ? "从对话里记住你的偏好" : phase === 3 ? "用得上时，再想起" : "Sleep · 合并重复，归档过期"}</span></div></div>
      <div className="memory-stack">
        <div className="memory-note memory-note-a"><Icon name="message" size={13} /><span>“我喜欢安静的小旅馆。”</span><small>你的偏好</small></div>
        <div className="memory-note memory-note-b"><Icon name="message" size={13} /><span>“住处还是安静一点好。”</span><small>再次提起</small></div>
        <div className="memory-note memory-note-merged"><Icon name="brain" size={17} /><div><strong>旅行时的住宿偏好</strong><p>喜欢安静的小旅馆</p></div><Icon name="check" size={15} /></div>
      </div>
      <div className="memory-process"><span data-done={phase >= 1}><Icon name={phase >= 1 ? "check" : "layers"} size={12} />检查重复</span><i /><span data-done={phase >= 2}><Icon name={phase >= 2 ? "check" : "folder"} size={12} />整理归档</span><i /><span data-done={phase >= 3}><Icon name={phase >= 3 ? "check" : "brain"} size={12} />按需召回</span></div>
      <Reveal open={phase >= 3} className="memory-recall"><Icon name="message" size={15} /><p>几天后，新开一段对话：想去海边住两天。<br /><strong>记得你喜欢安静的小旅馆。</strong></p></Reveal>
    </div>
  </WindowFrame>;
}
function FeatureCard({ id, label, title, summary }: {
  id: FeatureId; label: string; title: string; summary: string;
}) {
  const card = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [replay, setReplay] = useState(0);
  const [visited, setVisited] = useState(false);
  const [renderReady, setRenderReady] = useState(false);
  const realRender = id === "markdown";
  const stepCount = phases[id].length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPhase(Math.max(0, stepCount - 1));
    };
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncMotion();
    syncVisibility();
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting;
      setVisible(inView);
      if (inView) setVisited(true);
    }, { threshold: 0.2 });
    if (card.current) observer.observe(card.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [stepCount]);

  const playing = !(realRender && renderModes[phase] === "music") && !paused && !reducedMotion && (!realRender || renderReady);
  const phaseDuration = id === "history" ? [1200, 1300, 6000][phase] : id === "markdown" ? 8000 : phase === 3 ? 5000 : 3200;
  useEffect(() => {
    if (!playing || !visible || !pageVisible) return;
    const timer = window.setTimeout(() => setPhase(current => (current + 1) % stepCount), phaseDuration);
    return () => window.clearTimeout(timer);
  }, [phase, phaseDuration, playing, visible, pageVisible, replay, stepCount]);

  return <article className={`feature-card feature-${id}`} style={{ "--phase-duration": `${phaseDuration}ms` } as CSSProperties} data-playing={playing && visible && pageVisible} data-reveal="" data-revealed="false" ref={card} aria-labelledby={`feature-${id}-title`}>
    <div className="feature-card-copy">
      <h3 id={`feature-${id}-title`}>{title}</h3>
    </div>
    <figure className="feature-player" aria-label={`${label} ${realRender ? "真实聊天渲染" : "功能示意"}`}>
      <div className="feature-scene" aria-hidden={realRender ? undefined : true} data-phase={phase}>
        {realRender
          ? visited && <RenderChatPreview mode={renderModes[phase]} active={visible && pageVisible} onInteract={() => setPaused(true)} onReady={() => setRenderReady(true)} />
          : id === "history" ? <HistoryScene phase={phase} /> : <MemoryScene phase={phase} />}
      </div>
      <figcaption className="sr-only">{summary}</figcaption>
      <div className="feature-playback">
        <div className={`feature-phases${id === "markdown" ? " feature-mode-tabs" : ""}`} role="group" aria-label={`${label} 演示步骤`}>
          {phases[id].map((name, index) => <button key={name} type="button" aria-label={`${label}：${name}`} aria-pressed={phase === index} title={name} data-complete={phase > index} onClick={() => { setPhase(index); setPaused(true); }}>
            {id === "markdown" && <span className="feature-mode-name">{markdownModes[index]}</span>}
            <span className="feature-step-track" key={replay}><span className="feature-step-fill" /></span>
          </button>)}
        </div>
        {id !== "markdown" && <span className="feature-phase-label">{phases[id][phase]}</span>}
        {!reducedMotion && <button className="feature-player-button" type="button" aria-label={`${playing ? "暂停" : "播放"}${label}动画`} title={playing ? "暂停动画" : "播放动画"} onClick={() => setPaused(current => !current)}><Icon name={playing ? "pause" : "play"} size={13} /></button>}
        <button className="feature-player-button" type="button" aria-label={reducedMotion ? `从头查看${label}演示` : `重播${label}动画`} title="从头查看" onClick={() => { setPhase(0); setPaused(false); setReplay(current => current + 1); }}><Icon name="rotate" size={13} /></button>
      </div>
    </figure>
  </article>;
}

export function FeatureShowcase() {
  const { t } = useI18n();
  // 四张卡等分两列。Computer Use 的演示是 1000×690 的固定画布，
  // 放进横幅会把卡片撑到 800px 以上；等分宽度下按比例缩放正好完整显示。
  return <div className="home-feature-grid">
    <ComputerCard />
    {t.home.features.map(feature => <FeatureCard key={feature.id} {...feature} />)}
  </div>;
}

function ComputerCard() {
  const card = useRef<HTMLElement>(null);
  const [visited, setVisited] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisited(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    if (card.current) observer.observe(card.current);
    return () => observer.disconnect();
  }, []);
  return <article className="feature-card feature-computer" data-reveal="" data-revealed="false" ref={card} aria-labelledby="feature-computer-title">
    <div className="feature-card-copy">
      <h3 id="feature-computer-title">让它操作，随时接手。</h3>
    </div>
    <div className="feature-computer-player">
      <div className="feature-computer-crop">
        {visited ? <BinyWindow variant="computer" /> : <div className="feature-computer-placeholder" />}
      </div>
    </div>
  </article>;
}

export function ProviderStrip() {
  const { t } = useI18n();
  return <ScrollReveal className="home-models" id="providers">
    <div className="home-models-heading"><span>{t.home.providersTitle}</span></div>
    <ul aria-label="支持的模型服务和接口">{t.home.providers.map(name => <li key={name} data-brand={name.toLowerCase()}>
      {name === "兼容 API" ? <Icon name="plug" size={17} /> : <span className="home-provider-mark" style={{ maskImage: `url(/providers/${name.toLowerCase()}.svg)` }} aria-hidden="true" />}
      <span>{name}</span>
    </li>)}</ul>
  </ScrollReveal>;
}
