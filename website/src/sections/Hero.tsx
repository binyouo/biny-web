import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { useI18n, localePath } from "../i18n";

export function Hero() {
  const { t, locale } = useI18n();

  return (
    <section aria-labelledby="home-title" className="home-hero">
      <div className="home-wrap home-hero-inner">
        <Logo className="home-hero-icon" size={88} />
        <p className="home-eyebrow">{t.hero.eyebrow}</p>
        <h1 id="home-title">{t.hero.title}</h1>
        <p className="home-hero-description">{t.hero.subtitle}</p>
        <div className="home-actions">
          <Link className="site-button site-button-primary" to={localePath("/download", locale)}>
            <Icon name="download" size={17} />
            {t.hero.primaryCta}
          </Link>
          <Link className="site-button site-button-secondary" to={localePath("/docs/quick-start", locale)}>
            {t.hero.secondaryCta}
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
        <p className="home-hero-note">{t.hero.platformNote}</p>
      </div>
    </section>
  );
}
