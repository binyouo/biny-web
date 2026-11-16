import { Link } from "react-router-dom";
import { BinyPortrait } from "../components/BinyPortrait";
import { useI18n } from "../i18n";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <main className="not-found" id="main-content" tabIndex={-1}>
      <BinyPortrait size={96} />
      <span className="not-found-code">404</span>
      <h1>{t.common.notFoundTitle}</h1>
      <p>{t.common.notFoundBody}</p>
      <div className="not-found-actions">
        <Link className="site-button site-button-primary" to="/">{t.common.backHome}</Link>
        <Link className="site-button site-button-secondary" to="/docs">去看文档</Link>
      </div>
    </main>
  );
}
