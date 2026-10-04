import { Link } from "react-router-dom";
import { AppleMark, GithubMark, Icon } from "../components/Icon";
import { CodeBlock } from "../components/CodeBlock";
import { localePath, useI18n } from "../i18n";
import { SITE } from "../lib/site";
import { formatDate, formatSize, useLatestRelease, useNpmVersion, type Arch } from "../lib/releases";

const architecture: Record<Arch, string> = { arm64: "Apple 芯片", x64: "Intel 芯片", universal: "通用版本" };
const terminalCommands = ["npm install -g @biny012/biny", "biny init", "# 配置模型后，在你的项目目录启动", "biny"];
const sourceCommands = [
  `git clone ${SITE.repo}.git`, "cd Biny-Agent", "pnpm install --frozen-lockfile", "pnpm dev -- init",
  "# 配置模型后，启动桌面端或终端", "pnpm desktop:dev", "# pnpm dev -- tui"
];

export function DownloadPage() {
  const { locale } = useI18n();
  const release = useLatestRelease();
  const npm = useNpmVersion();
  return (
    <main className="download-page" id="main-content" tabIndex={-1}>
      <div className="wrap">
        <header className="download-heading">
          <h1>开始和 Biny 一起工作</h1>
          <p>选择 macOS 桌面端，或在熟悉的终端里开始。<br />连接自己的模型服务，让工作留在你的项目中。</p>
        </header>
        <div className="download-grid">
          <section aria-labelledby="desktop-title" className="download-card" id="desktop">
            <div className="download-card-heading">
              <span className="download-platform"><AppleMark size={25} /></span>
              <div><h2 id="desktop-title">macOS 桌面端</h2><div className="download-version">项目、会话、文件与工具过程，一个窗口。</div></div>
            </div>
            {release.status === "ready" ? (
              <>
                <p>{release.release.version ? `v${release.release.version}` : "最新发布"}{release.release.publishedAt ? ` · ${formatDate(release.release.publishedAt)}` : ""}</p>
                <div className="download-assets">
                  {release.release.assets.map((asset) => (
                    <a className="download-asset" href={asset.url} key={asset.name} rel="noreferrer" target="_blank">
                      <div><div className="download-asset-name">{architecture[asset.arch]} · {asset.kind.toUpperCase()}</div><div className="download-asset-meta">{asset.name}{asset.size ? ` · ${formatSize(asset.size)}` : ""}</div></div>
                      <Icon name="download" size={17} />
                    </a>
                  ))}
                </div>
                <p>在「关于本机」查看芯片类型，选择对应安装包。</p>
                <h3>安装后</h3>
                <ol className="download-steps">
                  <li>打开 DMG 并将 Biny 拖入「应用程序」，或解压 ZIP 后移动 Biny.app。</li>
                  <li>打开「设置 → 模型供应商」，连接模型并测试连接。</li>
                  <li>添加项目，检查权限模式，开始第一次任务。</li>
                </ol>
              </>
            ) : release.status === "loading" ? (
              <div className="download-state" role="status"><Icon className="spinner" name="refresh" size={19} /><p>正在获取最新桌面安装包…</p></div>
            ) : (
              <div className="download-state" role="status">
                <strong>{release.status === "error" ? "暂时无法获取最新版本" : "暂未找到桌面安装包"}</strong>
                <p>{release.status === "error" ? "你可以重试，或直接查看 GitHub Releases。" : "当前可访问的最新发布未提供可识别的 macOS 安装包。可查看全部发布记录，或从源码启动。"}</p>
                <div className="download-state-actions"><button className="site-button site-button-secondary" onClick={release.retry} type="button"><Icon name="refresh" size={14} />重试</button><a className="site-text-link" href={SITE.releases} rel="noreferrer" target="_blank">查看发布记录<Icon name="external" size={13} /></a></div>
              </div>
            )}
            <a className="site-text-link" href={SITE.releases} rel="noreferrer" target="_blank"><GithubMark size={15} />所有版本与发布说明<Icon name="arrowRight" size={14} /></a>
          </section>
          <section aria-labelledby="terminal-title" className="download-card" id="terminal">
            <div className="download-card-heading"><span className="download-platform"><Icon name="terminal" size={23} /></span><div><h2 id="terminal-title">终端工具</h2><div className="download-version">TUI 交互与 CLI 命令</div></div></div>
            <p>需要 Node.js 22.12 或更新版本。安装后先初始化配置，再连接模型服务。</p>
            <CodeBlock lines={terminalCommands} />
            <p>CLI 和桌面端共享本机工作区的会话与记忆。使用前检查当前目录与权限模式。</p>
            <Link className="site-text-link" to={localePath("/docs/quick-start", locale)}>查看模型配置与首次任务<Icon name="arrowRight" size={14} /></Link>
            <a className="site-text-link" href={SITE.npmPage} rel="noreferrer" target="_blank">{npm.status === "ready" ? `npm · v${npm.version}` : npm.status === "loading" ? "npm · 正在获取版本" : "在 npm 查看当前版本"}<Icon name="external" size={13} /></a>
          </section>
        </div>
        <details className="download-source">
          <summary>从源码运行 Biny</summary>
          <div className="download-source-content"><p>开发者可以在 macOS 上直接运行桌面端。需要 Node.js 22.12 或更新版本、pnpm 10.6.5；初始化后按文档配置模型。</p><CodeBlock lines={sourceCommands} /><Link className="site-text-link" to={localePath("/docs/installation", locale)}>完整安装指南<Icon name="arrowRight" size={14} /></Link></div>
        </details>
        <div className="download-next"><p>安装完成后，从一次小而明确的任务开始。</p><Link className="site-button site-button-secondary" to={localePath("/docs/quick-start", locale)}>阅读快速开始<Icon name="arrowRight" size={15} /></Link></div>
      </div>
    </main>
  );
}
