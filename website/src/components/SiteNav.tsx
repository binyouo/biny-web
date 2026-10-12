import { Link, useLocation } from "react-router-dom";
import { GithubMark, Icon } from "./Icon";
import { Logo } from "./Logo";
import { localePath, useI18n } from "../i18n";
import { SITE } from "../lib/site";
import { useTheme } from "../lib/theme";

export function SiteNav() {
  const { locale } = useI18n();
  const [theme, toggleTheme] = useTheme();
  const { pathname } = useLocation();
  const home = localePath("/", locale);
  const isHome = pathname.replace(/\/$/, "") === home;
  return (
    <header className="site-header" data-home={isHome}>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <nav aria-label="主导航" className="site-nav wrap">
        <Link aria-label="Biny 首页" className="site-brand" to={home}><Logo size={30} /><span>Biny</span></Link>
        <div className="site-nav-links">
          <Link className="site-nav-link" data-active={pathname.includes("/docs")} to={localePath("/docs", locale)}>文档</Link>
          <Link className="site-nav-link" data-active={pathname.endsWith("/download")} to={localePath("/download", locale)}>下载</Link>
          <a className="site-nav-link" href={SITE.releases} rel="noreferrer" target="_blank">更新日志</a>
          <a className="site-nav-link" href={SITE.issues} rel="noreferrer" target="_blank">帮助</a>
        </div>
        <div className="site-nav-actions">
          <a aria-label="GitHub 仓库" className="site-icon-button site-nav-github" href={SITE.repo} rel="noreferrer" target="_blank"><GithubMark size={19} /></a>
          <button aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"} className="site-icon-button" onClick={toggleTheme} type="button"><Icon name={theme === "dark" ? "sun" : "moon"} size={18} /></button>
        </div>
        <details className="site-mobile-nav" key={pathname} onClick={(event) => { if ((event.target as Element).closest("a")) event.currentTarget.open = false; }}>
          <summary aria-label="导航菜单" className="site-icon-button"><Icon name="menu" size={21} /></summary>
          <div className="site-mobile-menu">
            <Link to={localePath("/docs", locale)}>文档<Icon name="arrowRight" size={16} /></Link>
            <Link to={localePath("/download", locale)}>下载 Biny<Icon name="download" size={16} /></Link>
            <a href={SITE.releases} rel="noreferrer" target="_blank">更新日志<Icon name="external" size={15} /></a>
            <a href={SITE.issues} rel="noreferrer" target="_blank">帮助<Icon name="external" size={15} /></a>
            <a href={SITE.repo} rel="noreferrer" target="_blank">GitHub<GithubMark size={16} /></a>
          </div>
        </details>
      </nav>
    </header>
  );
}
