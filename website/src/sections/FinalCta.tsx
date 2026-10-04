import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useI18n, localePath } from "../i18n";

export function FinalCta() {
  const { t, locale } = useI18n();

  return (
    <section aria-labelledby="home-cta-title" className="home-cta">
      <div className="home-wrap">
        <h2 id="home-cta-title">{t.cta.title}</h2>
        <p>{t.cta.subtitle}</p>
        <div className="home-actions">
          <Link className="site-button site-button-primary" to={localePath("/download", locale)}>
            <Icon name="download" size={17} />
            {t.cta.primary}
          </Link>
          <Link className="site-button site-button-secondary" to={localePath("/docs/quick-start", locale)}>
            {t.cta.secondary}
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
        <span className="home-cta-note">{t.cta.note}</span>
      </div>
    </section>
  );
}
