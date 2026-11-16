import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { HomeCapabilities } from "../components/HomeCapabilities";
import { BinyPortrait } from "../components/BinyPortrait";
import { useScrollChoreography, useScrollReveal } from "../components/interaction";
import { useI18n } from "../i18n";
import "./home.css";

export function HomePage() {
  const { t } = useI18n();
  const copy = t.home;
  const pageRef = useScrollReveal();
  const scrollRef = useScrollChoreography();
  return (
    <main className="home-page" id="main-content" ref={(node) => { pageRef.current = node; scrollRef.current = node; }} tabIndex={-1}>

      {/* 封面 */}
      <section className="home-opening" aria-labelledby="home-title">
        <div className="home-hero">
          <BinyPortrait size={200} />
          <h1 id="home-title">你好，<br />我是 Biny。</h1>
          <p className="home-intro">{copy.intro}</p>
          <div className="home-hero-actions">
            <Link className="home-pill home-pill-solid" to="/#download">带它回家<Icon name="arrowRight" size={16} /></Link>
            <a className="home-pill home-pill-outline" href="#features">看看它的一天<Icon name="chevronDown" size={15} /></a>
          </div>
        </div>
      </section>

      <HomeCapabilities />
    </main>
  );
}
