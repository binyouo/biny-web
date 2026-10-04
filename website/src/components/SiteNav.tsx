import { Link, useLocation } from "react-router-dom";
import { GithubMark, Icon } from "./Icon";
import { Logo } from "./Logo";
import { localePath, useI18n } from "../i18n";
import { SITE } from "../lib/site";
import { useTheme } from "../lib/theme";

export function SiteNav() {
  const { locale } = useI18n();
  const [theme, toggleTheme] = useTheme();
  const { pathname, hash } = useLocation();
  const home = localePath("/", locale);
  const links = [
    { label: "功能", to: `${home}#features` },
    { label: "模型服务", to: `${home}#providers` },
    { label: "文档", to: localePath("/docs", locale) }
  ];
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <nav aria-label="主导航" className="site-nav wrap">
        <Link aria-label="Biny 首页" className="site-brand" to={home}><Logo size={32} /><span>Biny</span></Link>
        <div className="site-nav-links">
          {links.map((link) => (
            <Link className="site-nav-link" data-active={link.to.includes("#") ? `${pathname}${hash}` === link.to : pathname.startsWith(link.to)} key={link.label} to={link.to}>{link.label}</Link>
          ))}
        </div>
        <div className="site-nav-actions">
          <button aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"} className="site-icon-button" onClick={toggleTheme} type="button">
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>
          <a aria-label="GitHub 仓库" className="site-icon-button site-nav-github" href={SITE.repo} rel="noreferrer" target="_blank"><GithubMark size={19} /></a>
          <Link className="site-button site-button-primary site-nav-download" to={localePath("/download", locale)}><Icon name="download" size={15} />下载</Link>
        </div>
        <details className="site-mobile-nav" key={pathname}>
          <summary aria-label="导航菜单" className="site-icon-button"><Icon name="menu" size={21} /></summary>
          <div className="site-mobile-menu">
            {links.map((link) => (
              <Link key={link.label} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")} to={link.to}>
                {link.label}<Icon name="arrowRight" size={16} />
              </Link>
            ))}
            <Link to={localePath("/download", locale)}>下载 Biny<Icon name="download" size={16} /></Link>
            <a href={SITE.repo} rel="noreferrer" target="_blank">GitHub<GithubMark size={16} /></a>
          </div>
        </details>
      </nav>
    </header>
  );
}
