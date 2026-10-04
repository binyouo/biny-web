import { BinyWindow } from "../demo/BinyWindow";
import { useI18n } from "../i18n";

export function DemoSection() {
  const { t } = useI18n();

  return (
    <section aria-labelledby="home-demo-title" className="home-demo" id="demo">
      <div className="home-wrap">
        <div className="home-section-heading home-demo-heading">
          <p className="home-eyebrow">{t.demo.eyebrow}</p>
          <h2 id="home-demo-title">{t.demo.title}</h2>
          <p>{t.demo.subtitle}</p>
        </div>
        <div className="home-demo-window">
          <BinyWindow />
        </div>
        <p className="home-demo-caption">{t.demo.hint}</p>
      </div>
    </section>
  );
}
