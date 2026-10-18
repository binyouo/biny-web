import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, GithubMark, AppleMark } from "../components/Icon";
import { BinyWindow } from "../demo/BinyWindow";
import { FeatureShowcase, ProviderStrip } from "../components/FeatureShowcase";
import { Reveal, useScrollChoreography, useScrollReveal } from "../components/interaction";
import { AgentPreview } from "../components/AgentPreview";
import { Logo } from "../components/Logo";
import { DownloadSection } from "../components/DownloadSection";
import { localePath, useI18n } from "../i18n";
import { SITE } from "../lib/site";
import "./home.css";

/**
 * 首页的终端演示条：可以输入，但只做本地回显，不连接模型、不读写文件。
 * 目的是让"终端入口"不是一句静态描述，而是能点、能按回车的真东西。
 */
function TerminalPeek({ docsHref }: { docsHref: string }) {
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const command = value.trim();
    if (!command) return;
    if (command === "clear") { setLines([]); setValue(""); return; }
    setLines((current) => [...current.slice(-2), command, terminalReplies[command] ?? `bash: ${command}: command not found（演示只回显预设命令）`]);
    setValue("");
  };
  return <div className="home-terminal" data-reveal="" data-revealed="false">
    <div className="home-entry-title"><Icon name="terminal" size={20} /><h3>终端</h3><span>TUI / CLI</span></div>
    <p>在项目根目录直接开聊，读文件、改代码、跑命令，权限模式由你决定。</p>
    <div className="home-terminal-window">
      <div className="home-terminal-titlebar"><i /><i /><i /><span>biny — zsh</span></div>
      <div className="home-terminal-output" aria-live="polite">
        {lines.length === 0
          ? <p className="home-terminal-hint">试着输入 <code>biny chat</code> 或 <code>help</code>，回车看看。</p>
          : lines.map((line, index) => <p key={`${line}-${index}`} className={line.startsWith("bash:") ? "is-error" : undefined}>{line}</p>)}
      </div>
      <form className="home-terminal-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="home-terminal-input">演示终端输入</label>
        <span aria-hidden="true">$</span>
        <input
          autoComplete="off"
          id="home-terminal-input"
          onChange={(event) => setValue(event.target.value)}
          placeholder="biny chat"
          spellCheck={false}
          value={value}
        />
        <button type="submit">运行</button>
      </form>
    </div>
    <div className="home-terminal-foot">
      <Link className="home-link" to={docsHref}>安装终端入口<Icon name="arrowRight" size={15} /></Link>
      <span className="home-terminal-note">演示只回显预设命令，不会真的执行</span>
    </div>
  </div>;
}

const terminalReplies: Record<string, string> = {
  "biny": "Biny TUI 会在这里打开。演示环境只回显，不会真的启动会话。",
  "biny chat": "✓ 已进入项目目录的会话（演示）。试试让它「整理这周的提交」。",
  "biny init": "✓ 已创建默认配置与运行目录（演示）。下一步：在设置里连接模型。",
  "help": "可用：biny init · biny chat · biny --version · clear",
  "biny --version": "biny 0.1.x（演示版本号，实际以发布页为准）",
  "clear": "",
};

export function HomePage() {
  const { locale, t } = useI18n();
  const copy = t.home;
  const pageRef = useScrollReveal();
  const scrollRef = useScrollChoreography();
  return (
    <main className="home-page" id="main-content" ref={(node) => { pageRef.current = node; scrollRef.current = node; }} tabIndex={-1}>
      <section className="home-opening" aria-labelledby="home-title">
        <div className="home-hero" data-hero>
          <div className="wrap home-hero-layout">
            <div className="home-hero-content">
              <h1 id="home-title">{copy.title}</h1>
              <div className="home-hero-meta">
                <p className="home-intro">{copy.intro}</p>
                <div className="home-hero-side">
                  <div className="home-hero-actions">
                    <Link className="home-pill home-pill-solid" to={`${localePath("/", locale)}#download`}>下载 Biny<Icon name="arrowRight" size={17} /></Link>
                    <a className="home-pill home-pill-outline" href="#demo">看看它怎么做<Icon name="play" size={15} /></a>
                  </div>
                  <p className="home-platform-note">
                    <span className="home-platform-note-fact"><AppleMark size={13} />macOS</span>
                    <span className="home-platform-note-fact">终端 TUI</span>
                    <span className="home-platform-note-fact"><code>npx {SITE.npm.split("/").pop()}</code></span>
                  </p>
                </div>
              </div>
            </div>
            <AgentPreview />
          </div>
        </div>
      </section>

      <section className="home-stage" id="demo" aria-label="Biny 桌面端交互演示">
        <Reveal className="home-stage-heading"><h2>看它把事情，一步步做好。</h2><p>从一段对话开始，文件、工具和每一步进展都在眼前。</p></Reveal>
        <div className="home-stage-inner">
          <BinyWindow />
        </div>
      </section>

      <section className="home-features" id="features" aria-labelledby="features-title">
        <div className="home-features-inner">
          <Reveal className="home-features-head">
            <div className="home-features-title">
              <h2 id="features-title">{copy.featuresTitle}</h2>
            </div>
            <p className="home-section-lede">{copy.featuresIntro}</p>
          </Reveal>
          <FeatureShowcase />
          <ProviderStrip />
        </div>
      </section>

      <section className="home-workspace-band" id="workspace" aria-labelledby="workspace-title">
        <div className="home-section home-workspace-layout">
          <Reveal className="home-workspace-heading">
            <h2 id="workspace-title">{copy.workspaceTitle}</h2>
            <p className="home-section-lede">{copy.workspaceIntro}</p>
          </Reveal>

          <Reveal as="article" className="home-desktop" delay={60}>
            <div className="home-desktop-copy">
              <div className="home-entry-title"><Icon name="panelRight" size={20} /><h3>桌面端</h3><span>macOS</span></div>
              <p>会话、文件、工具过程和浏览器侧栏同屏。适合边看边聊，也适合检查它改了什么。</p>
              <ul className="home-desktop-facts">
                <li><span>会话</span><strong>本机保存，可回看</strong></li>
                <li><span>右栏</span><strong>文件 · 变更 · 浏览器</strong></li>
                <li><span>权限</span><strong>每次询问 / 自动允许</strong></li>
              </ul>
              <Link className="home-pill home-pill-outline" to={`${localePath("/", locale)}#download`}>获取安装包<Icon name="arrowRight" size={15} /></Link>
            </div>
            <div className="home-desktop-art" aria-hidden="true">
              <span className="home-desktop-art-bar"><i /><i /><i /></span>
              <span className="home-desktop-art-side">
                <i data-line="1" /><i data-line="2" /><i data-line="3" /><i data-line="4" /><i data-line="5" />
              </span>
              <span className="home-desktop-art-stream">
                <i data-msg="user" />
                <i data-msg="tool" />
                <i data-msg="text" />
                <i data-msg="tool" />
                <i data-msg="text" />
              </span>
              <span className="home-desktop-art-chip">
                <i /><i /><i />
              </span>
              <span className="home-desktop-art-cursor" />
            </div>
          </Reveal>

          <TerminalPeek docsHref={localePath("/docs/installation", locale)} />
        </div>
      </section>

      <DownloadSection />

      <section className="home-start" aria-labelledby="start-title">
        <Reveal className="wrap home-start-inner">
          <Logo size={56} />
          <h2 id="start-title">{copy.startTitle}</h2>
          <p className="home-start-lede">{copy.startIntro}</p>
          <div className="home-start-actions">
            <Link className="home-pill home-pill-solid" to={`${localePath("/", locale)}#download`}>下载 Biny<Icon name="download" size={17} /></Link>
            <a className="home-source-link" href={SITE.repo} rel="noreferrer" target="_blank"><GithubMark size={18} />从源码运行</a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
