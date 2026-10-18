import { Link } from "react-router-dom";
import { AppleMark, Icon } from "./Icon";
import { CodeBlock } from "./CodeBlock";
import { localePath, useI18n } from "../i18n";
import { SITE } from "../lib/site";
import { platformAssets, useLatestRelease, type Platform, type ReleaseAsset } from "../lib/releases";

const platforms: { id: Platform; name: string }[] = [
  { id: "macos", name: "macOS" }, { id: "windows", name: "Windows" }, { id: "linux", name: "Linux" }
];
const terminalCommands = ["npm install -g @biny012/biny", "biny init", "biny"];
const sourceCommands = [`git clone ${SITE.repo}.git`, "cd Biny-Agent", "pnpm install --frozen-lockfile", "pnpm dev -- init", "pnpm desktop:dev"];

function architecture(asset: ReleaseAsset) {
  if (asset.platform === "macos") return { arm64: "Apple Silicon", x64: "Intel", universal: "Universal" }[asset.arch];
  return asset.arch === "arm64" ? "ARM64" : "x64";
}

function PlatformMark({ platform }: { platform: Platform }) {
  if (platform === "macos") return <AppleMark size={26} />;
  if (platform === "windows") return <span className="platform-windows" aria-hidden="true"><i /><i /><i /><i /></span>;
  return <span className="platform-linux" aria-hidden="true" />;
}

export function DownloadSection() {
  const { locale } = useI18n();
  const release = useLatestRelease();
  const ready = release.status === "ready";
  return <section className="download-section" id="download" aria-labelledby="download-title">
    <div className="wrap download-wrap">
      <header className="download-heading">
        <h2 id="download-title">下载 Biny</h2>
        <div className="download-heading-meta">
          <p>选择你的操作系统。</p>
          {ready && release.release.version && <a className="download-version" href={`${SITE.releases}/tag/v${release.release.version}`} target="_blank" rel="noreferrer">v{release.release.version}</a>}
        </div>
      </header>
      <div className="download-grid">
        {platforms.map(platform => {
          const assets = ready ? platformAssets(release.release.assets, platform.id) : [];
          return <section className="download-card" aria-labelledby={`${platform.id}-title`} key={platform.id}>
            <h3 id={`${platform.id}-title`}><PlatformMark platform={platform.id} />{platform.name}</h3>
            <div className="download-assets">
              {assets.map(asset => <a className="download-asset" href={asset.url} key={asset.name} aria-label={`下载 Biny ${platform.name} ${architecture(asset)} ${asset.kind}`}>
                <span>下载{platform.id === "linux" ? ` ${asset.kind}` : ""}</span>
                <span className="download-asset-meta">{architecture(asset)}{platform.id === "linux" ? "" : ` · .${asset.kind}`}</span>
              </a>)}
              {!assets.length && <p className="download-unavailable">{release.status === "loading" ? "正在获取版本…" : ready || release.status === "unpublished" ? "暂未发布" : "版本信息暂不可用"}</p>}
            </div>
          </section>;
        })}
      </div>
      <div className="download-notes">
        {ready && release.cached && <p role="status">当前显示已收录版本。<button onClick={release.retry} type="button">刷新版本</button></p>}
        {(release.status === "error" || release.status === "unpublished") && <p role="status">{release.status === "error" ? "无法获取版本信息。" : "暂无可下载的安装包。"}<button onClick={release.retry} type="button">重试</button></p>}
        <div className="download-links"><a href={SITE.releases} rel="noreferrer" target="_blank">所有版本与更新说明<Icon name="arrowRight" size={14} /></a><Link to={localePath("/docs/installation", locale)}>安装帮助<Icon name="arrowRight" size={14} /></Link></div>
      </div>
      <div className="download-alternatives">
        <details className="download-source" id="terminal">
          <summary>终端安装</summary>
          <div className="download-source-content"><p>需要 Node.js 22.12 或更新版本。</p><CodeBlock lines={terminalCommands} /><Link className="site-text-link" to={localePath("/docs/quick-start", locale)}>配置模型与快速开始<Icon name="arrowRight" size={14} /></Link></div>
        </details>
        <details className="download-source">
          <summary>从源码运行</summary>
          <div className="download-source-content"><p>需要 Node.js 22.12+ 和 pnpm 10.6.5。</p><CodeBlock lines={sourceCommands} /><Link className="site-text-link" to={localePath("/docs/installation", locale)}>完整安装指南<Icon name="arrowRight" size={14} /></Link></div>
        </details>
      </div>
    </div>
  </section>;
}
