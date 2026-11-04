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

/**
 * macOS 直链兜底：GitHub API 在当前网络不可用时，仍然保证 macOS 能直接下载。
 * GitHub API 可用时会自动换成最新 Release 的资产；这里不展示版本号，避免过期信息。
 */
const fallbackMacosAssets: ReleaseAsset[] = [
  {
    name: "Biny-0.0.1-arm64.dmg",
    url: "https://github.com/binyouo/Biny-Agent/releases/download/v0.0.1/Biny-0.0.1-arm64.dmg",
    size: 0,
    arch: "arm64",
    platform: "macos",
    kind: "dmg"
  }
];

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
  return <section className="download-section" id="download" aria-labelledby="download-title">
    <div className="wrap download-wrap">
      <header className="download-heading">
        <h2 id="download-title">下载 Biny</h2>
        <div className="download-heading-meta">
          <p>选择你的操作系统。</p>
        </div>
      </header>
      <div className="download-grid">
        {platforms.map(platform => {
          const released = platform.id === "macos";
          const assets = released && release.status === "ready" ? platformAssets(release.release.assets, platform.id) : [];
          const display = assets.length ? assets : released ? fallbackMacosAssets : [];
          return <section className="download-card" aria-labelledby={`${platform.id}-title`} key={platform.id}>
            <h3 id={`${platform.id}-title`}><PlatformMark platform={platform.id} />{platform.name}</h3>
            <div className="download-assets">
              {display.map(asset => <a className="download-asset" href={asset.url} key={asset.name} aria-label={`下载 Biny ${platform.name} ${architecture(asset)} ${asset.kind}`}>
                <span>下载{platform.id === "linux" ? ` ${asset.kind}` : ""}</span>
                <span className="download-asset-meta">{architecture(asset)}{platform.id === "linux" ? "" : ` · .${asset.kind}`}</span>
              </a>)}
              {!display.length && <p className="download-unavailable">待发布</p>}
            </div>
          </section>;
        })}
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
