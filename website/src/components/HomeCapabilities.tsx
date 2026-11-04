import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { Reveal } from "./interaction";
import { CapabilityGallery } from "./CapabilityGallery";
import { PrivacyDemo } from "./PrivacyDemo";
import type { CapabilitySlide } from "./CapabilityGallery";
import "./home-capabilities.css";

const features: { id: string; icon: IconName; title: string; body: string; slides: CapabilitySlide[] }[] = [
  {
    id: "tools", icon: "terminal", title: "工具调用，过程看得见。",
    body: "读文件、写报告、运行命令。也可以交给 Code Mode 用一段脚本串起多步操作；展开工具记录，就能查看参数、文件变更和执行结果。",
    slides: [
      { caption: "Code Mode", src: "/features/code-mode.png", width: 1353, height: 828, alt: "Biny 用 Code Mode 脚本汇总本周提交，展开查看脚本参数与执行结果" },
      { caption: "工具调用", src: "/features/tool-calls.png", width: 1353, height: 828, alt: "Biny 展开工具记录，查看 src/utils/sort.ts 的文件差异与 pnpm test 执行结果" },
    ],
  },
  {
    id: "web-search", icon: "search", title: "联网查资料，回答带来源。",
    body: "搜索网页、阅读原文，再整理成回答。工具记录和来源链接留在对话里，方便核对和继续阅读。",
    slides: [
      { caption: "联网搜索", src: "/features/web-research.png", width: 1357, height: 828, alt: "Biny 的 MDN 网页抓取记录、Grid 与 Flexbox 对比表格及来源链接" },
    ],
  },
  {
    id: "computer-history", icon: "eye", title: "看过的内容，问一句找回。",
    body: "开启 Computer History 并授权后，Biny 会整理应用活动和屏幕文字。忘了页面叫什么、在哪看过？描述一下，就能沿着线索找回来。",
    slides: [
      { caption: "Computer History", src: "/features/computer-history.png", width: 759, height: 683, alt: "Computer History 的会话与存储统计、macOS 授权状态和排除应用设置" },
    ],
  },
  {
    id: "privacy", icon: "shield", title: "隐私脱敏，记录留在本机。",
    body: "查看请求中的敏感信息替换记录，按提供商、会话和信息类型筛选，了解哪些内容经过了脱敏。",
    slides: [],
  },
];

export function HomeCapabilities() {
  return <section id="features" aria-labelledby="features-title">
    <div className="home-section">
      <Reveal className="home-section-head"><p className="home-kicker">能力</p><h2 id="features-title">它会做什么</h2><p className="capability-section-note">点击截图可放大查看。</p></Reveal>
      <div className="home-capabilities">
        {features.map((feature, i) => <Reveal as="article" className={`home-capability${i % 2 ? " is-reverse" : ""}`} id={feature.id} key={feature.id}>
          <div className="home-capability-copy"><h3><Icon name={feature.icon} size={20} />{feature.title}</h3><p>{feature.body}</p></div>
          {feature.id === "privacy" ? <PrivacyDemo /> : <CapabilityGallery title={feature.title} slides={feature.slides} />}
        </Reveal>)}
      </div>
    </div>
  </section>;
}
