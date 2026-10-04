/**
 * 首页可交互演示的脚本类型。
 *
 * 结构对齐桌面端的真实时间线：权限请求、命令输出和文件 Diff 都挂在发起它们的那次
 * 工具调用下面，而不是时间线上的平级条目。演示窗口是纯前端复刻，不连接真实 Agent。
 */

export type DemoToolStatus = "running" | "success" | "error";

export interface DemoDiffLine {
  sign: "+" | "-" | " ";
  text: string;
  /** 行号，对应产品里的 code-line-number。 */
  line: number;
}

export interface DemoPermission {
  title: string;
  details: string;
  target: string;
  risk: "low" | "medium" | "high";
  riskLabel: string;
  preview?: string;
  /** 高风险操作要求完整输入 yes，与桌面端一致。 */
  requireFullYes: boolean;
  /** 访客拒绝时 Agent 的回应。 */
  deniedReply: string;
}

export interface DemoToolStep {
  kind: "tool";
  /** 工具的展示名，与产品里 toolLabel() 的映射一致：读取文件、搜索内容、Bash…… */
  name: string;
  /** 等宽字体的摘要行，通常是路径或命令。 */
  summary: string;
  status?: DemoToolStatus;
  durationLabel?: string;
  permission?: DemoPermission;
  /** 结果原文，渲染成 tool-payload。 */
  payload?: string[];
  /** 只有路径没有内容时显示的 file-path-row。 */
  filePath?: string;
  command?: { text: string; output: string[] };
  diff?: { path: string; added: number; removed: number; lines: DemoDiffLine[] };
}

export interface DemoUserStep {
  kind: "user";
  text: string;
  /** 为 true 时，这句话先在输入区里逐字打出来，再进入时间线——用来演示从输入到聊天的完整过程。 */
  viaComposer?: boolean;
}

/** 剧本里的模型切换只更新输入区的模型选择器。 */
export interface DemoModelStep {
  kind: "model";
  /** 输入区展示的预置模型名。 */
  model: string;
  label: string;
  note?: string;
}

export type DemoStep =
  | DemoUserStep
  | { kind: "reasoning"; label: string; text: string }
  | { kind: "assistant"; text: string }
  | DemoModelStep
  | DemoToolStep;

export interface DemoScenario {
  id: string;
  /** 会话列表里显示的标题。 */
  title: string;
  /** 该场景运行时展示的权限模式。 */
  permissionMode: string;
  steps: DemoStep[];
  /** 播放结束后输入区展示的用量。 */
  usage: string;
}
