import { Link } from "react-router-dom";
import { Icon, GithubMark } from "../components/Icon";
import { CodeBlock } from "../components/CodeBlock";
import { BinyWindow } from "../demo/BinyWindow";
import { FeatureShowcase, ProviderStrip } from "../components/FeatureShowcase";
import { localePath, useI18n } from "../i18n";
import { SITE } from "../lib/site";
import "./home.css";

export function HomePage() {
  const { locale, t } = useI18n();
  const copy = t.home;
  return (
    <main className="home-page" id="main-content" tabIndex={-1}>
      <section className="home-opening" aria-labelledby="home-title">
        <div className="home-sky">
          <div className="home-hero-content">
            <h1 id="home-title">{copy.title}</h1>
            <p className="home-intro">{copy.intro}</p>
            <div className="home-hero-actions">
              <Link className="home-pill home-pill-solid" to={localePath("/download", locale)}>下载 Biny<Icon name="arrowRight" size={17} /></Link>
              <Link className="home-pill home-pill-outline" to={localePath("/docs/quick-start", locale)}>查看使用指南<Icon name="external" size={15} /></Link>
            </div>
            <p className="home-platform-note">macOS Desktop · TUI · CLI</p>
          </div>
        </div>
        <div className="home-showcase" id="demo" aria-label="Biny 桌面端交互演示">
          <BinyWindow />
        </div>
      </section>

      <section className="home-section home-continuity" id="features" aria-label="功能亮点">
        <FeatureShowcase />
        <ProviderStrip />
      </section>

      <section className="home-workspace-band" aria-labelledby="workspace-title">
        <div className="home-section home-workspace-layout">
          <div className="home-workspace-heading">
            <p className="home-kicker">在你自己的电脑上</p>
            <h2 id="workspace-title">桌面或终端，<br />按你的习惯来。</h2>
            <p>对话和记忆保存在本机。桌面里聊日常，终端里做项目，选择顺手的方式开始。</p>
            <Link className="home-link" to={localePath("/docs/sessions", locale)}>了解工作区与会话<Icon name="arrowRight" size={15} /></Link>
          </div>
          <div className="home-entry-list">
            <article className="home-entry">
              <div className="home-entry-title"><Icon name="panelRight" size={24} /><h3>桌面端</h3><span>macOS</span></div>
              <p>聊天、回顾电脑活动、查看图表，在一个窗口里完成。</p>
              <Link className="home-link" to={localePath("/download", locale)}>获取桌面版<Icon name="arrowRight" size={15} /></Link>
            </article>
            <article className="home-entry">
              <div className="home-entry-title"><Icon name="terminal" size={24} /><h3>终端</h3><span>TUI / CLI</span></div>
              <p>进入项目目录，直接提问、改代码、跑命令。</p>
              <CodeBlock lines={["biny chat"]} />
              <Link className="home-link" to={localePath("/docs/installation", locale)}>安装与运行<Icon name="arrowRight" size={15} /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section home-start" aria-labelledby="start-title">
        <h2 id="start-title">从你正想做的事开始。</h2>
        <p>装好 Biny，连接模型，把第一件事交给它。</p>
        <div className="home-start-actions">
          <Link className="home-pill home-pill-solid" to={localePath("/download", locale)}>下载 Biny<Icon name="download" size={17} /></Link>
          <a className="home-source-link" href={SITE.repo} target="_blank" rel="noreferrer"><GithubMark size={18} />查看源代码</a>
        </div>
      </section>
    </main>
  );
}
