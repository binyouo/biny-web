import { Component, lazy, Suspense, useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { NotFoundPage } from "./pages/NotFoundPage";
import { DEFAULT_LOCALE, I18nContext, isLocale, locales } from "./i18n";

const HomePage = lazy(() => import("./pages/HomePage").then((page) => ({ default: page.HomePage })));
const DownloadPage = lazy(() => import("./pages/DownloadPage").then((page) => ({ default: page.DownloadPage })));
const DocsPage = lazy(() => import("./pages/DocsPage").then((page) => ({ default: page.DocsPage })));

class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="site-route-error" id="main-content" tabIndex={-1}>
        <h1>页面暂时无法加载</h1>
        <p>请刷新页面重试，也可以通过导航打开其他页面。</p>
        <button className="site-button site-button-secondary" onClick={() => window.location.reload()} type="button">刷新页面</button>
      </main>
    );
  }
}

function PageEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    let anchorId = hash.slice(1);
    try { anchorId = decodeURIComponent(anchorId); } catch { /* 无效转义保留原始锚点。 */ }
    const anchor = anchorId ? document.getElementById(anchorId) : null;
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo({ top: 0 });
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://biny.online${pathname}`);
    if (/^\/[^/]+\/docs(?:\/|$)/.test(pathname)) return;
    const downloading = pathname.endsWith("/download");
    const home = pathname === "/zh" || pathname === "/zh/";
    document.title = downloading ? "下载 Biny" : home ? "Biny · 一个记得你的 AI 伙伴" : "页面未找到 · Biny";
    document.querySelector('meta[name="description"]')?.setAttribute("content", downloading
      ? "安装 Biny 终端工具，查看 macOS 桌面安装包，或从源码运行。"
      : "Biny 是在你电脑上的 AI 伙伴。记住聊过的偏好，找回看过的内容，用你喜欢的模型聊天、写作和做事。支持 macOS 桌面端与终端。");
  }, [pathname, hash]);
  return null;
}

function DocsRedirect() {
  const { "*": slug } = useParams();
  const { hash, search } = useLocation();
  return <Navigate replace to={`/${DEFAULT_LOCALE}/docs${slug ? `/${slug}` : ""}${search}${hash}`} />;
}

function LocaleLayout() {
  const { locale } = useParams();
  const { pathname } = useLocation();
  if (!isLocale(locale)) return <Navigate replace to={`/${DEFAULT_LOCALE}`} />;
  return (
    <I18nContext.Provider value={{ locale, t: locales[locale] }}>
      <SiteNav />
      <PageBoundary key={pathname}>
        <Suspense fallback={<main className="site-loading" id="main-content" role="status">正在加载页面…</main>}>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<DownloadPage />} path="/download" />
            <Route element={<DocsPage />} path="/docs/*" />
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
          <PageEffects />
        </Suspense>
      </PageBoundary>
      <SiteFooter />
    </I18nContext.Provider>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to={`/${DEFAULT_LOCALE}`} />} path="/" />
      <Route element={<DocsRedirect />} path="/docs/*" />
      <Route element={<Navigate replace to={`/${DEFAULT_LOCALE}/download`} />} path="/download" />
      <Route element={<LocaleLayout />} path="/:locale/*" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}
