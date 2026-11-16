import { Link } from "react-router-dom";
import { AppleMark, Icon } from "./Icon";
import { CodeBlock } from "./CodeBlock";
import { SITE } from "../lib/site";
import { platformAssets, useLatestRelease, type ReleaseAsset } from "../lib/releases";

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

export function DownloadSection() {
  const release = useLatestRelease();
  const assets = release.status === "ready" ? platformAssets(release.release.assets, "macos") : [];
  const display = assets.length ? assets : fallbackMacosAssets;
  return <section className="download-section home-plain" id="download" aria-labelledby="download-title">
    <header className="download-heading">
      <h2 id="download-title">带它回家。</h2>
    </header>
    <section className="download-card" aria-labelledby="macos-title">
      <h3 id="macos-title"><AppleMark size={26} />macOS</h3>
      <div className="download-assets">
        {display.map(asset => <a className="download-asset" href={asset.url} key={asset.name} aria-label={`下载 Biny macOS ${architecture(asset)} ${asset.kind}`}>
          <span>下载 macOS 版</span>
          <span className="download-asset-meta">{architecture(asset)} · .{asset.kind}</span>
        </a>)}
      </div>
    </section>
    <p className="download-platforms-note">Windows 和 Linux 版本还在准备中。</p>
    <div className="download-alternatives">
      <details className="download-source" id="terminal">
        <summary>终端安装<Icon name="chevronDown" size={16} /></summary>
        <div className="download-source-content"><p>需要 Node.js 22.12 或更新版本。</p><CodeBlock lines={terminalCommands} /><Link className="site-text-link" to={"/docs/quick-start"}>配置模型与快速开始<Icon name="arrowRight" size={14} /></Link></div>
      </details>
      <details className="download-source">
        <summary>从源码运行<Icon name="chevronDown" size={16} /></summary>
        <div className="download-source-content"><p>需要 Node.js 22.12+ 和 pnpm 10.6.5。</p><CodeBlock lines={sourceCommands} /><Link className="site-text-link" to={"/docs/installation"}>完整安装指南<Icon name="arrowRight" size={14} /></Link></div>
      </details>
    </div>
  </section>;
}
