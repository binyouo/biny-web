import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useI18n, localePath } from "../i18n";

export function Faq() {
  const { t, locale } = useI18n();

  return (
    <section aria-labelledby="home-faq-title" className="home-faq" id="faq">
      <div className="home-wrap home-faq-layout">
        <div className="home-section-heading">
          <p className="home-eyebrow">{t.faq.eyebrow}</p>
          <h2 id="home-faq-title">{t.faq.title}</h2>
          <p>{t.faq.subtitle}</p>
          <Link className="home-text-link" to={localePath("/docs", locale)}>
            {t.faq.docsLink}
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>
        <div className="home-faq-list">
          {t.faq.items.map((item) => (
            <details className="home-faq-item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <Icon name="plus" size={18} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
