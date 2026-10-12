import { Link } from "react-router-dom";
import { Icon, GithubMark } from "../components/Icon";
import { CodeBlock } from "../components/CodeBlock";
import { BinyWindow } from "../demo/BinyWindow";
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
              <Link className="home-pill home-pill-light" to={localePath("/download", locale)}>下载 Biny<Icon name="arrowRight" size={17} /></Link>
              <Link className="home-pill home-pill-outline" to={localePath("/docs/quick-start", locale)}>开始使用<Icon name="external" size={15} /></Link>
            </div>
            <p className="home-platform-note">macOS Desktop · TUI · CLI</p>
          </div>
        </div>
        <div className="home-showcase" id="demo" aria-label="Biny 桌面端交互演示">
          <BinyWindow />
          <p className="home-demo-caption">{t.demo.hint}</p>
        </div>
      </section>

      <section className="home-section home-continuity" id="features" aria-labelledby="continuity-title">
        <div className="home-section-intro">
          <p className="home-kicker">从对话，到日常工作</p>
          <h2 id="continuity-title">熟悉你的习惯，<br />也熟悉手头的事情。</h2>
          <p>背景不用反复交代，过程可以随时查看。让每次协作，都从已有的工作继续。</p>
        </div>
        <div className="home-capabilities">
          {copy.capabilities.map(item => (
            <article className="home-capability" key={item.doc}>
              <Icon name={item.icon} size={25} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <blockquote>{item.example}</blockquote>
              <Link className="home-link" to={localePath(`/docs/${item.doc}`, locale)}>{item.link}<Icon name="arrowRight" size={15} /></Link>
            </article>
          ))}
        </div>
        <div className="home-models" id="providers">
          <span>连接你自己的模型</span>
          <ul aria-label="支持的模型服务和接口">{copy.providers.map(name => <li key={name}>{name}</li>)}</ul>
          <Link className="home-link" to={localePath("/docs/providers", locale)}>配置指南<Icon name="arrowRight" size={15} /></Link>
        </div>
      </section>

      <section className="home-workspace-band" aria-labelledby="workspace-title">
        <div className="home-section home-workspace-layout">
          <div className="home-workspace-heading">
            <p className="home-kicker">在你自己的电脑上</p>
            <h2 id="workspace-title">你的工作区，<br />你习惯的方式。</h2>
            <p>会话和记忆保存在本机。打开桌面端，或留在终端里，都能围绕同一个项目继续工作。</p>
            <Link className="home-link" to={localePath("/docs/sessions", locale)}>了解工作区与会话<Icon name="arrowRight" size={15} /></Link>
          </div>
          <div className="home-entry-list">
            <article className="home-entry">
              <div className="home-entry-title"><Icon name="panelRight" size={24} /><h3>桌面端</h3><span>macOS</span></div>
              <p>项目、对话、工具过程和文件，在同一个窗口里。</p>
              <Link className="home-link" to={localePath("/download", locale)}>获取桌面版<Icon name="arrowRight" size={15} /></Link>
            </article>
            <article className="home-entry">
              <div className="home-entry-title"><Icon name="terminal" size={24} /><h3>终端</h3><span>TUI / CLI</span></div>
              <p>打开项目目录，用熟悉的键盘开始工作。</p>
              <CodeBlock lines={["biny chat"]} />
              <Link className="home-link" to={localePath("/docs/installation", locale)}>安装与运行<Icon name="arrowRight" size={15} /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section home-start" aria-labelledby="start-title">
        <h2 id="start-title">在你的电脑上，开始协作。</h2>
        <p>连接模型，打开项目，说说你想做什么。</p>
        <div className="home-start-actions">
          <Link className="home-pill home-pill-solid" to={localePath("/download", locale)}>下载 Biny<Icon name="download" size={17} /></Link>
          <a className="home-source-link" href={SITE.repo} target="_blank" rel="noreferrer"><GithubMark size={18} />查看源代码</a>
        </div>
      </section>
    </main>
  );
}
