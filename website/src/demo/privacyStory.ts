export type StorySecret = { kind: "PASSWORD" | "EMAIL"; label: string; value: string; placeholder: string };
export const storySecrets: readonly StorySecret[] = [
  { kind: "PASSWORD", label: "密码", value: "Tulip-2049", placeholder: "{{PASSWORD_r6mzq3wd}}" },
  { kind: "EMAIL", label: "邮箱", value: "lin@biny.online", placeholder: "{{EMAIL_t4hn2vbe}}" }
];

export type StoryText = readonly (string | { secret: number })[];

export const storyRequest: StoryText = ["帮我把测试库配置写进 .env，再跑一下迁移。\nDB_PASSWORD=", { secret: 0 }, "\n告警邮箱：", { secret: 1 }];

export const storyNote = "附加说明：{{类型_哈希}} 代表留在用户电脑上的值，回复和工具参数里原样照抄，执行前由本机还原；不要猜测原值。";

export const storyToolCalls: readonly { name: string; target: string; args: StoryText }[] = [
  { name: "写入文件", target: ".env", args: ["DB_PASSWORD=", { secret: 0 }, "\nALERT_EMAIL=", { secret: 1 }] },
  { name: "Bash", target: "pnpm db:migrate", args: [] }
];

export const storyRunOutput = ["$ pnpm db:migrate", "✓ 3 个迁移已执行"];

export const storyRecord = "刚刚 · 2 处替换 · 密码 1 · 邮箱 1";

export type StoryStep = { id: "ask" | "scan" | "mask" | "send" | "reply" | "restore" | "run" | "record"; chip: string; title: string; body: string; biny: string; at: number };

export const STORY_END = 28;

export const storySteps: readonly StoryStep[] = [
  { id: "ask", chip: "你发出请求", title: "你交代一件事", body: "消息里带着测试库密码和告警邮箱。", biny: "收到，我先看看要带出门的东西。", at: 0 },
  { id: "scan", chip: "本机检查", title: "发出前先在本机检查", body: "整条请求都会扫一遍：消息、工具结果、系统提示。密码、密钥、邮箱、手机号这类都认得。", biny: "这两样不能带出门。", at: 3.0 },
  { id: "mask", chip: "换成占位符", title: "换成占位符", body: "每个值换成「类型 + 8 位哈希」。哈希用只存在本机的密钥算出，同一会话里同一个值总是同一个占位符；原值只留在内存里。", biny: "原样的我先收好。", at: 5.2 },
  { id: "send", chip: "发给模型", title: "发给模型服务", body: "模型服务收到的只有占位符；需要时还会附上一句说明，请它原样照抄。", biny: "出门只带占位符。", at: 10.2 },
  { id: "reply", chip: "模型回复", title: "模型照着占位符回复", body: "它写好两个工具调用：把配置写进 .env，再跑迁移。参数里还是占位符。", biny: "它不知道密码，也不需要知道。", at: 12.8 },
  { id: "restore", chip: "本机还原", title: "回到本机再换回来", body: "回复一边流回来，一边把占位符换回原值。工具拿到的是真实参数。", biny: "认得，是我收好的那两个。", at: 16.2 },
  { id: "run", chip: "在本机执行", title: "在你的电脑上执行", body: ".env 写进了真实的密码和邮箱，迁移跑通。模型服务从头到尾只见过占位符。", biny: "办好了。", at: 20.6 },
  { id: "record", chip: "留下记录", title: "每次请求都有记录", body: "Desktop 设置里能看到每次请求替换了几处、是哪些类型；记录只留在本机。", biny: "想查随时翻。", at: 25.0 }
];

export function storyString(text: StoryText, mode: "plain" | "masked"): string {
  return text.map(part => typeof part === "string" ? part : storySecrets[part.secret][mode === "plain" ? "value" : "placeholder"]).join("");
}
