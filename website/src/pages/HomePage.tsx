import { Link } from "react-router-dom";
import { Icon, AppleMark } from "../components/Icon";
import { HomeCapabilities } from "../components/HomeCapabilities";
import { BinyPortrait } from "../components/BinyPortrait";
import { FileShelf } from "../components/FileShelf";
import { BinyWindow } from "../demo/BinyWindow";
import { Reveal, useScrollChoreography, useScrollReveal } from "../components/interaction";
import { DownloadSection } from "../components/DownloadSection";
import { localePath, useI18n } from "../i18n";
import { SITE } from "../lib/site";
import "./home.css";

const localFacts = "不用注册，没有账号。所有记忆都在你自己电脑上，联网的只有你自己接的模型。";

export function HomePage() {
  const { locale, t } = useI18n();
  const copy = t.home;
  const pageRef = useScrollReveal();
  const scrollRef = useScrollChoreography();
  return (
    <main className="home-page" id="main-content" ref={(node) => { pageRef.current = node; scrollRef.current = node; }} tabIndex={-1}>

      {/* 封面 */}
      <section className="home-opening" aria-labelledby="home-title">
        <div className="home-hero">
          <BinyPortrait size={200} />
          <h1 id="home-title">你好，<br />我是 <em>Biny</em>。</h1>
          <p className="home-intro">{copy.intro}</p>
          <div className="home-hero-actions">
            <Link className="home-pill home-pill-solid" to={`${localePath("/", locale)}#download`}>带它回家<Icon name="arrowRight" size={16} /></Link>
            <a className="home-pill home-pill-outline" href="#demo">先看它做事<Icon name="chevronDown" size={15} /></a>
          </div>
          <p className="home-platform-note">
            <span className="home-platform-note-fact"><AppleMark size={13} />macOS</span>
            <span className="home-platform-note-fact">终端 TUI</span>
            <span className="home-platform-note-fact"><code>npx {SITE.npm.split("/").pop()}</code></span>
          </p>
          <div className="home-hero-bubble">
            <p className="home-hero-bubble-q">「……还记得我周报要怎么写吗？」</p>
            <p className="home-hero-bubble-a">记得。<strong>中文、先写结论、五条以内。</strong></p>
          </div>
        </div>
      </section>

      {/* 看它做事 */}
      <section className="home-stage" id="demo" aria-label="Biny 桌面端交互演示">
        <Reveal className="home-stage-heading">
          <h2>看它把一件事做完。</h2>
        </Reveal>
        <div className="home-stage-inner">
          <BinyWindow />
        </div>
      </section>

      <HomeCapabilities />

      {/* 它住在哪 */}
      <section className="home-home" id="local" aria-labelledby="local-title">
        <div className="home-section home-home-layout">
          <Reveal className="home-section-head home-home-head">
            <p className="home-kicker">本地</p>
            <h2 id="local-title">它的家，你随时能翻。</h2>
            <p className="home-local-facts">{localFacts}</p>
          </Reveal>
          <Reveal className="home-home-shelf" delay={80}>
            <FileShelf />
          </Reveal>
        </div>
      </section>

      <DownloadSection />
    </main>
  );
}
