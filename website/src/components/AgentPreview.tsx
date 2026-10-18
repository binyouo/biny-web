import { useState } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { Logo } from "./Logo";

const examples: { label: string; prompt: string; context: string; reply: string; result: string; detail: string; icon: IconName }[] = [
  {
    label: "整理周报",
    prompt: "按老规矩，帮我整理这周的项目进展。",
    context: "记得你的习惯：中文、先写结论、五条以内。",
    reply: "这周完成了订单搜索、报表导出和两项体验修复。周报已经整理好，下一步也一起列在了文末。",
    result: "本周进展.md",
    detail: "项目文件 · docs/weekly",
    icon: "file",
  },
  {
    label: "找回网页",
    prompt: "刚才看过的那家京都旅馆叫什么？",
    context: "从 Computer History 找回看过的网页线索。",
    reply: "是「鸭川边的小旅馆」。你刚才看过它的位置和房间介绍，网页线索在这里，可以接着看。",
    result: "鸭川边的小旅馆",
    detail: "浏览记录 · 京都住宿",
    icon: "search",
  },
  {
    label: "记住偏好",
    prompt: "下次帮我找住宿，还是选安静一点的小旅馆。",
    context: "把聊定的偏好留在本机记忆里。",
    reply: "记住了：住宿优先找安静的小旅馆。下次聊到新的旅行计划时，我会带上这个偏好。",
    result: "住宿偏好",
    detail: "本机记忆 · 可以查看和管理",
    icon: "brain",
  },
];

export function AgentPreview() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];

  return <div className="agent-preview" role="region" aria-label="Biny 任务对话示意">
    <div className="agent-preview-window">
      <div className="agent-preview-header">
        <Logo size={32} />
        <span>Biny</span>
        <span className="agent-preview-caption">预置对话</span>
      </div>
      <div className="agent-preview-conversation" aria-live="polite" aria-atomic="true">
        <p className="agent-preview-prompt">{example.prompt}</p>
        <div className="agent-preview-reply">
          <span className="agent-preview-author">Biny</span>
          <p className="agent-preview-context"><Icon name="check" size={14} />{example.context}</p>
          <p>{example.reply}</p>
          <div className="agent-preview-result">
            <Icon name={example.icon} size={21} />
            <div><strong>{example.result}</strong><span>{example.detail}</span></div>
          </div>
        </div>
      </div>
      <a className="agent-preview-demo" href="#demo">查看完整桌面演示<Icon name="arrowRight" size={15} /></a>
    </div>
    <div className="agent-preview-examples" role="group" aria-label="切换任务示例">
      {examples.map((item, index) => <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}</button>)}
    </div>
    <p className="agent-preview-note">功能示意 · 点击切换，按你的节奏看</p>
  </div>;
}
