import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { GithubMark } from "./Icon";
import { localePath, useI18n } from "../i18n";
import { SITE } from "../lib/site";

export function SiteFooter() {
  const { locale } = useI18n();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-main">
        <div className="site-footer-identity">
          <Link className="site-brand" to={localePath("/", locale)}><Logo size={30} /><span>Biny</span></Link>
          <p className="site-footer-tagline">从上一次，<br />继续往前。</p>
        </div>
        <nav aria-label="页脚导航" className="site-footer-links">
          <div><h2>产品</h2><Link to={localePath("/download", locale)}>下载 Biny</Link><a href={SITE.releases} rel="noreferrer" target="_blank">更新日志</a><a href={SITE.repo} rel="noreferrer" target="_blank">源代码</a></div>
          <div><h2>使用指南</h2><Link to={localePath("/docs/quick-start", locale)}>快速开始</Link><Link to={localePath("/docs/providers", locale)}>连接模型</Link><Link to={localePath("/docs/extensions", locale)}>扩展能力</Link></div>
          <div><h2>了解更多</h2><Link to={localePath("/docs/memory", locale)}>本地记忆</Link><Link to={localePath("/docs/tools", locale)}>工具与权限</Link><a href={SITE.issues} rel="noreferrer" target="_blank">反馈问题</a></div>
        </nav>
      </div>
      <div className="wrap site-footer-bottom"><span>© {new Date().getFullYear()} Biny</span><a aria-label="GitHub 仓库" href={SITE.repo} rel="noreferrer" target="_blank"><GithubMark size={19} /></a></div>
    </footer>
  );
}
