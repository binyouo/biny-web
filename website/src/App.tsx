import { Component, lazy, Suspense, useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { NotFoundPage } from "./pages/NotFoundPage";
import { DEFAULT_LOCALE, I18nContext, locales } from "./i18n";

const HomePage = lazy(() => import("./pages/HomePage").then((page) => ({ default: page.HomePage })));
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
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    let anchorId = hash.slice(1);
    try { anchorId = decodeURIComponent(anchorId); } catch { /* 无效转义保留原始锚点。 */ }
    const frame = requestAnimationFrame(() => {
      const anchor = anchorId ? document.getElementById(anchorId) : null;
      if (anchor) anchor.scrollIntoView();
      else window.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
  useEffect(() => {
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://biny.online${pathname}`);
    if (/^\/docs(?:\/|$)/.test(pathname)) return;
    const home = pathname === "/";
    document.title = home ? "Biny · 一只住在你电脑里的 AI 伙伴" : "页面未找到 · Biny";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Biny 是住在你电脑里的 AI 伙伴。聊过的事、看过的网页、说好的规矩都记在本机，不用账号。支持 macOS 桌面端与终端。");
  }, [pathname]);
  return null;
}

function LegacyRedirect() {
  const { "*": rest = "" } = useParams();
  const { hash, search } = useLocation();
  return <Navigate replace to={`/${rest.replace(/^\/+/, "")}${search}${hash}`} />;
}

function DownloadRedirect() {
  const { hash, search } = useLocation();
  return <Navigate replace to={`/${search}${hash || "#download"}`} />;
}

export function App() {
  const { pathname } = useLocation();
  return (
    <I18nContext.Provider value={{ locale: DEFAULT_LOCALE, t: locales[DEFAULT_LOCALE] }}>
      <div className="site-backdrop" aria-hidden="true" />
      <SiteNav />
      <Suspense fallback={<main className="site-loading" id="main-content" role="status">正在加载页面…</main>}>
        <PageBoundary key={pathname}>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<DownloadRedirect />} path="/download" />
            <Route element={<DocsPage />} path="/docs/*" />
            <Route element={<LegacyRedirect />} path="/zh/*" />
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
          <PageEffects />
        </PageBoundary>
      </Suspense>
      <SiteFooter />
    </I18nContext.Provider>
  );
}
