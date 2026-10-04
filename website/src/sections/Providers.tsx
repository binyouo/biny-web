import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useI18n, localePath } from "../i18n";

export function Providers() {
  const { t, locale } = useI18n();

  return (
    <section aria-labelledby="home-providers-title" className="home-providers" id="providers">
      <div className="home-wrap">
        <div className="home-section-heading">
          <p className="home-eyebrow">{t.providers.eyebrow}</p>
          <h2 id="home-providers-title">{t.providers.title}</h2>
          <p>{t.providers.subtitle}</p>
        </div>
        <ul className="home-provider-list" aria-label={t.providers.listLabel}>
          {t.providers.items.map((provider) => (
            <li key={provider.name}>
              <span className="home-provider-mark" aria-hidden="true">{provider.mark}</span>
              <span>{provider.name}</span>
            </li>
          ))}
        </ul>
        <Link className="home-text-link" to={localePath("/docs/providers", locale)}>
          {t.providers.link}
          <Icon name="arrowRight" size={15} />
        </Link>
      </div>
    </section>
  );
}
