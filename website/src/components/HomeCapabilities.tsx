import type { ReactNode } from "react";
import { Reveal } from "./interaction";
import { BinyPortrait } from "./BinyPortrait";
import { BinyWindow } from "../demo/BinyWindow";
import { CapabilityGallery } from "./CapabilityGallery";
import { DownloadSection } from "./DownloadSection";
import { FileShelf } from "./FileShelf";
import { PrivacyStory } from "./PrivacyStory";
import type { CapabilitySlide } from "./CapabilityGallery";
import "./home-capabilities.css";

const toolSlides: CapabilitySlide[] = [
  { caption: "Code Mode", src: "/features/code-mode.png", width: 1353, height: 828, mobile: { src: "/features/code-mode-mobile.webp", width: 545, height: 660 }, alt: "Biny 用 Code Mode 脚本汇总本周提交，展开查看脚本参数与执行结果" },
  { caption: "工具调用", src: "/features/tool-calls.png", width: 1353, height: 828, mobile: { src: "/features/tool-calls-mobile.webp", width: 545, height: 660 }, alt: "Biny 展开工具记录，查看 src/utils/sort.ts 的文件差异与 pnpm test 执行结果" },
];

const searchSlides: CapabilitySlide[] = [
  { caption: "联网搜索", src: "/features/web-research.png", width: 1357, height: 828, alt: "Biny 的 MDN 网页抓取记录、Grid 与 Flexbox 对比表格及来源链接" },
];

const historySlides: CapabilitySlide[] = [
  { caption: "Computer History", src: "/features/computer-history.png", width: 759, height: 683, mobile: { src: "/features/computer-history-mobile.webp", width: 420, height: 470 }, alt: "Computer History 的会话与存储统计、macOS 授权状态和排除应用设置" },
];

function Entry({ id, time, title, body, biny, children }: { id: string; time: string; title: string; body: string; biny?: boolean; children: ReactNode }) {
  return (
    <Reveal as="article" className={biny ? "home-entry is-sleepy" : "home-entry"} id={id}>
      <div className="home-entry-side">
        <time dateTime={time}>{time}</time>
        {biny ? <BinyPortrait className="home-entry-biny" size={56} sleepy /> : null}
      </div>
      <div className="home-entry-body">
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="home-entry-visual">{children}</div>
      </div>
    </Reveal>
  );
}

export function HomeCapabilities() {
  return <section id="features" aria-labelledby="features-title">
    <div className="home-phase home-phase-day">
      <Reveal as="header" className="home-day-head"><h2 id="features-title">Biny 的一天</h2></Reveal>
      <div className="home-phase-inner">
        <Entry id="demo" time="09:30" title="上午，帮你把事做完。" body="读文件、跑命令、改代码，每一步都摊开给你看。">
          <div className="home-stage-inner"><BinyWindow /></div>
        </Entry>
        <Entry id="tools" time="11:00" title="活多的时候，写段脚本一次跑完。" body="用 Code Mode 把多步操作串成一段脚本；展开工具记录，参数、文件变更和结果都看得到。">
          <CapabilityGallery title="工具调用" slides={toolSlides} />
        </Entry>
        <Entry id="web-search" time="14:00" title="下午，替你查资料。" body="搜网页、读原文，回答附上来源。">
          <CapabilityGallery title="联网搜索" slides={searchSlides} />
        </Entry>
      </div>
    </div>
    <div className="home-phase home-phase-evening">
      <div className="home-phase-inner">
        <Entry id="computer-history" time="18:00" title="傍晚，帮你想起来。" body="开启 Computer History 并授权后，白天看过却忘了名字的页面，描述一下我就沿着线索找回来。">
          <div className="home-visual-narrow"><CapabilityGallery title="Computer History" slides={historySlides} /></div>
        </Entry>
      </div>
    </div>
    <div className="home-phase home-phase-night theme-night" data-nav-tone="night">
      <div className="home-phase-inner">
        <Entry id="local" time="03:00" title="凌晨三点，把记忆理一遍。" body="合并重复的，归档过期的。我记住的都写在这些文件里，你随时能翻、能改。" biny>
          <FileShelf />
        </Entry>
      </div>
    </div>
    <div className="home-phase home-phase-dawn">
      <section className="home-plain" id="privacy" aria-labelledby="privacy-title">
        <Reveal className="home-plain-head">
          <h2 id="privacy-title">不管几点，敏感信息都不出门。</h2>
          <p className="home-plain-lede">打开隐私脱敏后，每条发给模型的请求都先在本机过一遍：密码、密钥、邮箱换成占位符，回复回来再换回原值。</p>
        </Reveal>
        <Reveal className="home-plain-visual" delay={80}><PrivacyStory /></Reveal>
      </section>
      <DownloadSection />
    </div>
  </section>;
}
