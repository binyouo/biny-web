export const renderModes = ["mermaid", "infographic", "math", "table", "music"] as const;
export type RenderMode = typeof renderModes[number];
export const isRenderMode = (value: unknown): value is RenderMode => typeof value === "string" && renderModes.includes(value as RenderMode);

// These are Markdown messages, parsed by the unmodified Desktop MarkdownContent component.
export const renderSamples: Record<RenderMode, { question: string; answer: string }> = {
  mermaid: {
    question: "把周末的安排画成一张图。",
    answer: "留一点空白，走到哪算哪。\n\n```mermaid\ngraph LR\n A[出门散步] --> B[逛间书店]\n B --> C[喝杯咖啡]\n```",
  },
  infographic: {
    question: "把这三个安排做成信息图。",
    answer: "```infographic\ninfographic sequence-steps-simple\ndata\n  items\n    - label 散步\n      desc 沿河走走\n    - label 书店\n      desc 翻本新书\n    - label 咖啡\n      desc 慢慢坐会儿\n```",
  },
  math: {
    question: "用一个公式解释「期望值」。",
    answer: "把每个结果，乘以它出现的概率，再加起来。\n\n$$\n\\mathbb{E}[X] = \\sum_{i=1}^{n} x_i P(x_i)\n$$\n\n例如，公平骰子的期望点数是 **3.5**。",
  },
  table: {
    question: "比较一下周末的三个去处。",
    answer: "| 去处 | 节奏 | 适合 |\n| --- | --- | --- |\n| 山间小屋 | 慢一点 | 读书、发呆 |\n| 海边小城 | 随心走 | 散步、看日落 |\n| 街角书店 | 半天就好 | 找本新书 |",
  },
  music: {
    question: "写一小段，适合雨天听的旋律。",
    answer: "用轻柔的三角波，慢慢走过四个音。\n\n```strudel\nnote(\"c4 eb4 g4 bb4\")\n  .s(\"triangle\")\n  .slow(2)\n  .gain(0.12)\n```\n\n点播放试听，再让 Biny 调整旋律。",
  },
};

export interface RenderDemoState { source: "biny-render-host"; mode: RenderMode; theme: "light" | "dark"; active: boolean }
export function isRenderDemoState(value: unknown): value is RenderDemoState {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<RenderDemoState>;
  return message.source === "biny-render-host" && isRenderMode(message.mode)
    && (message.theme === "light" || message.theme === "dark") && typeof message.active === "boolean";
}
