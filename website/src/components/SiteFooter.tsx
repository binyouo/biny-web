import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { localePath, useI18n } from "../i18n";

export function SiteFooter() {
  const { locale } = useI18n();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-main">
        <Link className="site-brand" to={localePath("/", locale)}><Logo size={22} /><span>Biny</span></Link>
        <p className="site-footer-tagline">它住在你电脑上。下次见。</p>
        <p className="site-footer-copy">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
