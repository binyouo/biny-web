import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { GithubMark, Icon } from "./Icon";
import { localePath, useI18n } from "../i18n";
import { SITE } from "../lib/site";

export function SiteFooter() {
  const { locale } = useI18n();
  const home = localePath("/", locale);
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-main">
        <div>
          <Link className="site-brand" to={home}><Logo size={28} /><span>Biny</span></Link>
          <p className="site-footer-tagline">在你的电脑里，和你的项目一起工作。</p>
        </div>
        <nav aria-label="页脚导航" className="site-footer-links">
          <Link to={localePath("/docs/quick-start", locale)}>开始使用</Link>
          <Link to={localePath("/docs", locale)}>文档</Link>
          <Link to={localePath("/download", locale)}>下载</Link>
          <a href={SITE.issues} rel="noreferrer" target="_blank">问题反馈<Icon name="external" size={12} /></a>
          <a href={SITE.repo} rel="noreferrer" target="_blank"><GithubMark size={15} />GitHub</a>
        </nav>
      </div>
      <div className="wrap site-footer-bottom"><span>© {new Date().getFullYear()} Biny</span><span>本地优先 · 模型自选 · 执行可控</span></div>
    </footer>
  );
}
