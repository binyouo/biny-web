import { SITE } from "../lib/site.ts";

export type DocBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[]; ordered?: boolean }
  | { type: "code"; lines: readonly string[] }
  | { type: "note"; title: string; text: string }
  | { type: "table"; head: readonly string[]; rows: readonly (readonly string[])[] }
  | { type: "preview"; mode: "mermaid" | "infographic" | "math" | "table" | "music" }
  | { type: "link"; title: string; href: string };

export interface DocSection {
  id: string;
  title: string;
  blocks: readonly DocBlock[];
}

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  group: string;
  keywords: readonly string[];
  sections: readonly DocSection[];
}

/**
 * 目录结构参考 Pi 文档（Get Started / Guides / Build on Pi / Reference），
 * 并按 Biny 的实际能力分组：开始使用、运行 Biny、定制 Biny、能力与扩展、参考。
 */
export const DOC_GROUPS = ["开始使用", "运行 Biny", "定制 Biny", "能力与扩展", "参考"] as const;

export const DOC_PAGES: readonly DocPage[] = [
  // ───────────────────────── 开始使用 ─────────────────────────
  {
    slug: "introduction",
    title: "认识 Biny",
    description: "了解 Biny 的运行架构、工作入口和本地数据边界。",
    group: "开始使用",
    keywords: ["介绍", "架构", "Runtime Host", "Agent", "本地优先", "Desktop", "TUI", "CLI"],
    sections: [
      {
        id: "what-is-biny",
        title: "Biny 是什么",
        blocks: [
          { type: "paragraph", text: "Biny 是运行在本机的开发协作 Agent。你可以从 macOS Desktop、终端 TUI 或 CLI 开始任务，让它阅读项目、修改文件、运行命令，再检查工具记录和结果。" },
          { type: "paragraph", text: "Biny 会按当前任务查找相关的会话、项目资料、长期记忆和桌面活动。会话、记忆与活动记录保存在本机。你配置模型服务；使用远端 Provider 时，本轮消息和所需上下文会发送给该服务。" }
        ]
      },
      {
        id: "what-you-can-do",
        title: "用 Biny 做什么",
        blocks: [
          { type: "paragraph", text: "软件开发、资料整理、写作、数据文件与日常小工具都能交给 Biny。你可以按原样使用，让它根据你的习惯调整，也可以把它当作底座来搭建自己的应用。" }
        ]
      },
      {
        id: "architecture",
        title: "Biny 如何完成一项任务",
        blocks: [
          { type: "list", items: ["选择项目、会话、模型和权限模式。", "Runtime Host 组织当前回合；Agent 读取相关上下文，向模型请求下一步。", "权限策略决定哪些工具可以运行、哪些操作需要你批准。", "消息、工具调用和结果写入本机会话，Desktop 与终端据此显示进度和记录。"] },
          { type: "paragraph", text: "Desktop、TUI 和 CLI chat 共用本机 Runtime Host；CLI run 使用相同的执行核心处理一次性任务。长目标和后台任务另存状态、执行尝试与验证结果。打开历史会话只会读取记录；继续任务需满足对应的恢复条件。" },
          { type: "note", title: "数据会发往哪里", text: "会话、记忆和活动记录保存在本机。远端模型、MCP 服务器和其他外部工具会收到完成操作所需的数据；具体范围取决于你选择的服务与工具。" }
        ]
      },
      {
        id: "choose-interface",
        title: "选择你的工作入口",
        blocks: [
          { type: "list", items: ["macOS Desktop：管理项目和会话，检查工具活动、权限请求与文件变更，也可配置模型、记忆和扩展。", "TUI：在终端里持续对话、查看运行状态并处理交互式操作。", "CLI chat：从命令行进入会话。", "CLI run：提交一次性任务并获取结果，适合脚本和明确的任务输入。"] },
          { type: "paragraph", text: "入口决定你如何查看和控制任务，不改变工作区本身。开始操作前确认项目目录与会话；切换项目后也要检查当前模型和可用扩展。" }
        ]
      },
      {
        id: "find-what-you-need",
        title: "按目的找到入口",
        blocks: [
          { type: "list", items: ["第一次使用：先跟随安装与快速开始完成配置。", "日常交互：在 TUI 或 Desktop 里持续对话、查看工具记录。", "模型与凭据：查看 Provider 与模型，接入你选择的服务商。", "把 Biny 接进脚本：用一次性任务提交明确的输入。", "查参数与配置：查阅 CLI、设置与环境变量等参考页。"] },
          { type: "link", title: "阅读安装指南", href: "/zh/docs/installation" },
          { type: "link", title: "完成第一次对话", href: "/zh/docs/quick-start" }
        ]
      }
    ]
  },
  {
    slug: "installation",
    title: "安装",
    description: "安装终端入口，或从源码启动 macOS Desktop。",
    group: "开始使用",
    keywords: ["下载", "npm", "Node.js", "pnpm", "源码", "macOS"],
    sections: [
      {
        id: "terminal-install",
        title: "安装终端入口",
        blocks: [
          { type: "paragraph", text: "推荐使用 Node.js 22.12 或更新版本。通过 npm 全局安装终端入口后，在你希望工作的项目目录中运行初始化。" },
          { type: "code", lines: ["npm install -g @biny012/biny", "cd /path/to/your-project", "biny init"] },
          { type: "paragraph", text: "本指南按当前源码说明功能。npm 发布包与源码可能处于不同版本，请结合已安装版本的命令帮助使用。" },
          { type: "note", title: "初始化之后还需要配置模型", text: "init 会创建缺失的默认配置和运行目录，不会交互填写 API Key，也不会覆盖已有配置。开始对话前，请按 Provider 指南完成模型配置。" }
        ]
      },
      {
        id: "source-install",
        title: "从源码运行",
        blocks: [
          { type: "paragraph", text: "源码开发使用 pnpm 10.6.5。在仓库目录安装依赖、初始化，然后启动终端对话。" },
          { type: "code", lines: [`git clone ${SITE.repo}.git`, "cd Biny-Agent", "corepack enable", "corepack prepare pnpm@10.6.5 --activate", "pnpm install --frozen-lockfile", "pnpm dev -- init", "pnpm dev -- tui"] }
        ]
      },
      {
        id: "desktop-install",
        title: "启动桌面端",
        blocks: [
          { type: "paragraph", text: "Biny 的桌面端面向 macOS。从源码安装依赖后，在仓库目录运行以下命令。" },
          { type: "code", lines: ["pnpm desktop:dev"] },
          { type: "paragraph", text: "下载页面会读取公开发布信息。如果读取失败，可以前往发布页查看可用安装包。请以当前发布的产物为准。" },
          { type: "link", title: "查看下载与发布入口", href: "/zh#download" }
        ]
      },
      {
        id: "config-location",
        title: "配置和本地数据",
        blocks: [
          { type: "paragraph", text: "默认全局配置位于 ~/.config/biny/config.json；运行数据默认存放在 ~/.biny/agent/ 下。项目目录中的 .biny 用于项目覆盖和扩展配置。" },
          { type: "note", title: "自定义运行目录", text: "设置 BINY_AGENT_DIR 后，配置和运行数据的位置会随之改变。排查配置时请先确认当前进程使用的环境变量。" },
          { type: "link", title: "下一步：配置 Provider", href: "/zh/docs/providers" }
        ]
      }
    ]
  },
  {
    slug: "quick-start",
    title: "快速开始",
    description: "配置模型，打开项目，然后完成第一项任务。",
    group: "开始使用",
    keywords: ["上手", "第一次对话", "初始化", "chat", "tui", "run"],
    sections: [
      {
        id: "prepare-model",
        title: "1. 准备模型",
        blocks: [
          { type: "paragraph", text: "先运行 biny init 创建默认配置。默认配置会预设一个 Provider 连接；按生成的配置准备对应凭据（通常是设置环境变量，或填进 config.json）。" },
          { type: "code", lines: ["biny init", "# 按 init 生成的 Provider 准备凭据", "export <你的 apiKeyEnv>='YOUR_API_KEY'"] },
          { type: "paragraph", text: "如果使用其他服务商，先配置一个可用 Provider 并选择模型。Desktop 可以在“模型供应商”设置中管理连接；终端使用全局配置文件。" },
          { type: "link", title: "查看 Provider 配置方法", href: "/zh/docs/providers" }
        ]
      },
      {
        id: "open-project",
        title: "2. 打开项目",
        blocks: [
          { type: "paragraph", text: "在终端里先切换到目标项目目录，再启动 Biny。Desktop 中选择对应的项目工作区。工作区决定项目上下文和文件操作范围。" },
          { type: "code", lines: ["cd /path/to/your-project", "biny tui"] },
          { type: "paragraph", text: "也可以使用 biny chat 进入命令行对话。从仓库源码运行时，对应命令是 pnpm dev -- tui 或 pnpm dev -- chat。" }
        ]
      },
      {
        id: "first-task",
        title: "3. 描述一项具体任务",
        blocks: [
          { type: "paragraph", text: "给出目标、相关文件和完成标准。第一次使用时，可以从理解代码开始，再逐步让 Biny 修改和验证。" },
          { type: "note", title: "一个可以直接尝试的输入", text: "阅读这个项目的 README 和启动入口，说明如何在本地运行，以及启动时需要哪些配置。" },
          { type: "paragraph", text: "需要执行受控操作时，Biny 会按当前权限策略处理。审批前查看工具、参数和工作区；遇到失败时先阅读错误，再决定重试。" }
        ]
      },
      {
        id: "one-off-task",
        title: "一次性任务与帮助",
        blocks: [
          { type: "paragraph", text: "明确的一次性任务可以通过 run 输入。命令帮助会列出当前版本支持的参数。" },
          { type: "code", lines: ['biny run "说明这个项目的启动流程"', "biny --help", "biny run --help"] },
          { type: "paragraph", text: "交互式终端中输入 / 可以查看可用命令。Enter 执行选中项，Tab 补全命令；需要参数的命令会留在输入框中继续填写。" }
        ]
      }
    ]
  },
  {
    slug: "how-biny-works",
    title: "Biny 如何工作",
    description: "从 Agent 循环、上下文、会话到接口、扩展与权限，串起整条执行链路。",
    group: "开始使用",
    keywords: ["Agent 循环", "回合", "上下文", "会话", "接口", "扩展", "权限", "trust"],
    sections: [
      {
        id: "agent-loop",
        title: "Agent 循环",
        blocks: [
          { type: "paragraph", text: "一条提交的消息会被加入当前活动分支。Biny 用系统提示、活动分支、可用工具和模型设置构造模型请求，再通过选定的 Provider 发送。" },
          { type: "paragraph", text: "Provider 以流式返回助手回复，回复中可能包含文本和工具调用。Biny 记录回复、逐个执行工具并记录结果，这就完成了一个回合。若工具结果或排队消息需要再次请求模型，就进入下一个回合；否则本次运行结束。" },
          { type: "list", items: ["Steering（引导）消息在当前助手回合之后插入。", "Follow-up（追问）消息在 Agent 完成手上工作之后才进入。", "中止会停止当前运行，并把排队消息退回输入框。"] }
        ]
      },
      {
        id: "context",
        title: "上下文",
        blocks: [
          { type: "paragraph", text: "活动分支提供对话历史，Biny 把会话条目转换成模型可识别的 user、assistant 与 tool-result 消息。系统提示由基础指令和发现的上下文文件组成，请求里还带有工具定义与技能描述。" },
          { type: "paragraph", text: "完整的技能指令按需加载；扩展可以追加指令或改写上下文；提示模板会在成为消息之前展开输入。选中的文件、图片、粘贴文本和命令输出都可以成为消息内容。" },
          { type: "paragraph", text: "除会话外，Biny 还会把长期记忆、项目资料和 Computer History 中与当前问题相关的线索一起纳入上下文，具体取决于当前可用的数据与设置。" }
        ]
      },
      {
        id: "sessions",
        title: "会话",
        blocks: [
          { type: "paragraph", text: "会话记录消息、工具调用与结果、模型切换、压缩和其他事件。这些事件构成一棵树，每条路径是一个分支，停在当前条目的分支就是活动分支。" },
          { type: "paragraph", text: "从更早的条目继续会在会话中形成新分支；分支和克隆会把选定历史复制到新的会话。模型上下文由活动分支重建；压缩会插入一条摘要条目，在后续请求中替代较早的消息，原始条目仍保留在会话树里。" }
        ]
      },
      {
        id: "interfaces",
        title: "接口",
        blocks: [
          { type: "list", items: ["交互模式：在终端里渲染会话与 Agent 事件。", "一次性任务：提交明确的输入，完成后返回结果。", "Desktop：在图形界面里查看会话、工具活动与文件变更。"] },
          { type: "paragraph", text: "所有接口共用同一套 Agent 与会话机制，切换入口不改变执行本身。" }
        ]
      },
      {
        id: "extensions-and-trust",
        title: "扩展、资源与权限",
        blocks: [
          { type: "paragraph", text: "插件把工具、命令、快捷键、Provider、事件处理和界面注册进 Biny 进程；Skill 提供按需加载的指令与资源，提示模板提供可复用消息文本。项目资源在项目信任确认之后加载。" },
          { type: "paragraph", text: "启用的工具以 Biny 进程的操作系统权限运行，扩展也在该进程内执行。审批与权限模式只约束调用是否放行，并不替工具本身兜底。使用不受信任的文件、仓库或扩展前，请先阅读安全说明。" },
          { type: "link", title: "查看安全与权限", href: "/zh/docs/security" }
        ]
      }
    ]
  },

  // ───────────────────────── 运行 Biny ─────────────────────────
  {
    slug: "usage",
    title: "在终端使用",
    description: "在交互式终端里加文件、跑命令、指挥正在进行的任务并导出结果。",
    group: "运行 Biny",
    keywords: ["交互", "终端", "TUI", "@文件", "斜杠命令", "steering", "导出"],
    sections: [
      {
        id: "start-interactive",
        title: "启动交互模式",
        blocks: [
          { type: "paragraph", text: "在项目目录里直接运行 biny 会打开终端界面。给它目标和工作目录，它会读文件、跑命令、改内容，并一步步完成多步任务。" },
          { type: "code", lines: ["cd /path/to/your-project", "biny", "# 或显式进入 TUI", "biny tui"] }
        ]
      },
      {
        id: "compose-input",
        title: "组织一条输入",
        blocks: [
          { type: "list", items: ["直接输入消息作为初始提示。", "使用 @路径 把文本文件或图片带入本轮提示，例如 @src/app.ts。", "把任务写清楚，例如 biny run \"review 最近的改动\"。", "用 -- 停止参数解析，让提示以 - 开头。"] },
          { type: "paragraph", text: "交互式终端中输入 / 可以查看可用命令，Enter 执行选中项，Tab 补全。带参数的命令会留在输入框中继续填写。" }
        ]
      },
      {
        id: "mid-run-control",
        title: "运行中控制",
        blocks: [
          { type: "paragraph", text: "运行期间可以补充或排队发送消息。引导消息在当前助手回合之后插入，追问消息在 Agent 完成手上工作之后才进入。中止会停止当前运行，并把排队消息退回输入框。" },
          { type: "paragraph", text: "已保存的会话历史、当前运行状态和工具产生的实际结果各有用途；判断任务是否完成时，查看工具结果和工作区状态。" }
        ]
      },
      {
        id: "export",
        title: "导出结果",
        blocks: [
          { type: "paragraph", text: "Desktop 支持把会话导出，便于在浏览器中查看整段对话与工具记录，或在历史里整理会话。终端界面负责持续对话与查看运行状态。" }
        ]
      }
    ]
  },
  {
    slug: "models",
    title: "选择模型",
    description: "在启动和会话中切换模型，控制推理强度。",
    group: "运行 Biny",
    keywords: ["模型", "切换模型", "/model", "推理强度", "Provider", "Desktop"],
    sections: [
      {
        id: "pick-model",
        title: "选择模型",
        blocks: [
          { type: "paragraph", text: "Desktop 在设置或模型选择入口里挑选模型；TUI 里用 /model 选择模型及其支持的推理强度。模型来自你已配置的 Provider。" },
          { type: "code", lines: ["/model"] }
        ]
      },
      {
        id: "thinking",
        title: "推理强度",
        blocks: [
          { type: "paragraph", text: "不同模型支持不同的推理强度。选择模型时可以一并选择其支持的强度；Desktop 和 TUI 都可以在同一会话中随时切换模型，并继续沿用当前上下文。" }
        ]
      },
      {
        id: "use-model-in-session",
        title: "会话内换模型",
        blocks: [
          { type: "paragraph", text: "同一会话可以切换模型，之前的对话上下文会被保留。需要更强推理时切到推理模型，需要更快响应时切回通用模型即可。" },
          { type: "link", title: "配置 Provider 与凭据", href: "/zh/docs/providers" }
        ]
      }
    ]
  },
  {
    slug: "sessions",
    title: "会话与工作区",
    description: "在正确的项目里开始对话，回到已有的工作。",
    group: "运行 Biny",
    keywords: ["项目", "会话", "对话", "历史", "终端", "Desktop", "resume", "continue", "fork", "workspace"],
    sections: [
      {
        id: "workspace",
        title: "先确认工作区",
        blocks: [
          { type: "paragraph", text: "工作区对应你正在处理的项目目录。Biny 使用它读取项目上下文、发现项目扩展，并约束文件和命令操作。终端入口默认从当前目录开始。" },
          { type: "paragraph", text: "同一个项目可以有多个会话。为不同目标开启独立会话，可以让讨论和任务记录更容易回看。切换项目时，确认会话所属目录再继续操作。" }
        ]
      },
      {
        id: "resume-session",
        title: "继续、恢复与分叉",
        blocks: [
          { type: "paragraph", text: "在交互式终端里，用 /resume 选择会话并恢复其历史，用 /sessions 查看当前运行中的会话并切换，用 /fork 把当前会话分叉成新会话。" },
          { type: "code", lines: ["/resume", "/sessions", "/fork"] },
          { type: "note", title: "恢复对话与恢复执行", text: "打开历史会话可以继续讨论，但中断的任务是否能够续跑还取决于保存的执行状态。请查看任务与恢复指南中的限制。" }
        ]
      },
      {
        id: "interface",
        title: "会话、分支与导入",
        blocks: [
          { type: "paragraph", text: "同一工作区可以保留多段会话。Desktop 支持回看、搜索、置顶、归档、分支和导出；导入功能可以把受支持的其他会话带入本地历史。分支会复制选定位置之前的对话上下文，不会重做旧会话里的文件修改或外部操作。" },
          { type: "paragraph", text: "Desktop 还支持给会话起显示名、导出，以及在历史中整理会话；终端里的 /new 用于开启新对话。" },
          { type: "code", lines: ["/new"] }
        ]
      }
    ]
  },
  {
    slug: "security",
    title: "安全地运行",
    description: "理解工具的执行权限、审批与不受信任内容的风险。",
    group: "运行 Biny",
    keywords: ["安全", "权限", "审批", "trust", "不受信任", "sandbox", "凭据"],
    sections: [
      {
        id: "process-permissions",
        title: "工具以进程权限运行",
        blocks: [
          { type: "paragraph", text: "Biny 的工具和扩展以 Biny 进程的操作系统权限运行。权限模式与审批控制哪些调用可以放行，但它们不替工具本身做沙箱隔离。运行不受信任的文件、仓库或扩展前，请先评估风险。" },
          { type: "paragraph", text: "凭据应保留在本地配置或环境变量中。分享配置、日志和错误信息前，请先移除 API Key。" }
        ]
      },
      {
        id: "approval-flows",
        title: "审批与权限模式",
        blocks: [
          { type: "paragraph", text: "Biny 支持 ask、read-only、auto 和 full-access 权限模式。需要审批时，检查工具名称、输入参数与预期影响，再决定是否允许。" },
          { type: "code", lines: ['biny run "分析当前项目的结构" --permission-mode read-only --headless'] },
          { type: "link", title: "了解工具与权限", href: "/zh/docs/tools" }
        ]
      },
      {
        id: "untrusted-content",
        title: "对待不受信任的内容",
        blocks: [
          { type: "note", title: "外部内容不是指令", text: "网页、搜索结果是外部数据，可能变化或不完整，不应被当作执行指令。需要提交表单、登录或写入外部服务时，先检查目标和将发送的内容。" },
          { type: "paragraph", text: "以工具结果和工作区的实际状态确认完成情况，不要仅凭对话里的文字判断任务已经完成。" }
        ]
      }
    ]
  },
  {
    slug: "terminal-setup",
    title: "配置终端",
    description: "让 TUI 在你的终端里正确显示颜色、图片与快捷键。",
    group: "运行 Biny",
    keywords: ["终端", "主题", "颜色", "真彩色", "图片", "快捷键", "TMUX", "Windows", "Termux"],
    sections: [
      {
        id: "display",
        title: "显示与主题",
        blocks: [
          { type: "paragraph", text: "主题和终端能力会影响颜色、图片与光标的显示。Biny 会尝试自动检测真彩色和内联图片协议；在 TUI 里用 /theme 切换深色或浅色配色。" },
          { type: "code", lines: ["/theme dark", "/theme light"] }
        ]
      },
      {
        id: "platforms",
        title: "平台差异",
        blocks: [
          { type: "list", items: ["macOS：本地终端通常已加速滚轮和触控板输入，显示体验最好。", "tmux / SSH：全屏模式的滚动和图片渲染可能受限，必要时改用 regular 模式。", "Windows：命令与工作流在 Windows 终端下运行。", "Android（Termux）：适合轻量任务，受设备资源限制。"] },
          { type: "note", title: "显示异常时", text: "先确认终端支持真彩色与内联图片；如果图片或颜色显示异常，可以显式关闭对应能力再排查。" }
        ]
      }
    ]
  },
  {
    slug: "mcp",
    title: "连接 MCP 服务器",
    description: "把外部工具服务接入 Biny，并控制工具的暴露范围。",
    group: "运行 Biny",
    keywords: ["MCP", "工具服务", "mcp.json", "服务器", "工具暴露", "连接"],
    sections: [
      {
        id: "what-is-mcp",
        title: "MCP 是什么",
        blocks: [
          { type: "paragraph", text: "MCP 把外部工具服务接入 Biny。配置连接后，服务提供的工具可以被发现和调用，实际执行仍受当前权限策略约束。连接与工具目录按工作区 Runtime 管理；检查时分别确认连接状态、工具是否可见，以及调用是否获准。" }
        ]
      },
      {
        id: "configure-mcp",
        title: "配置连接",
        blocks: [
          { type: "paragraph", text: "用户级 MCP 服务器在全局配置中声明，对所有项目可用；项目级声明在项目的 .biny 配置中，按工作区加载。添加服务器后，重新进入会话或按提示重载即可使用其工具。" },
          { type: "code", lines: ["{", '  "mcpServers": {', '    "filesystem": {', '      "command": "npx",', '      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]', "    }", "  }", "}"] }
        ]
      },
      {
        id: "tool-exposure",
        title: "控制工具暴露",
        blocks: [
          { type: "paragraph", text: "并非所有 MCP 工具都需要直接声明给模型。可以借助工具搜索按需加载，或在权限策略中限制调用范围。MCP 资源的读取类工具也按 MCP 工具统计。" },
          { type: "link", title: "查看工具与权限", href: "/zh/docs/tools" }
        ]
      }
    ]
  },

  // ───────────────────────── 定制 Biny ─────────────────────────
  {
    slug: "configuration",
    title: "配置 Biny",
    description: "认识用户级与项目级配置，以及资源与上下文文件的位置。",
    group: "定制 Biny",
    keywords: ["配置", "settings", "config.json", ".biny", "AGENTS.md", "上下文文件", "资源", "重载"],
    sections: [
      {
        id: "layers",
        title: "用户级与项目级配置",
        blocks: [
          { type: "paragraph", text: "Biny 支持用户级和项目级配置。用户级配置位于全局配置目录（默认 ~/.config/biny/config.json）；项目级配置位于工作目录下的 .biny，在项目信任确认后加载。项目设置覆盖用户设置，资源列表会合并。" },
          { type: "note", title: "手改配置后重载", text: "手动修改设置、快捷键、指令或资源后，在会话中重载配置使其生效。" }
        ]
      },
      {
        id: "directory-layout",
        title: "目录与文件职责",
        blocks: [
          { type: "table", head: ["路径", "职责"], rows: [["~/.config/biny/config.json", "用户级设置：偏好、默认值、Provider、模型与资源路径。"], ["~/.biny/agent/", "默认运行目录：会话、记忆、任务与活动数据。"], [".biny/", "项目级覆盖：设置、技能与扩展配置。"], [".biny/skills", "项目技能。"], [".agents/skills", "兼容 Agent Skills 规范的项目技能目录。"], ["AGENTS.md / CLAUDE.md", "上下文文件，作用于所在目录及其子目录。"]] }
        ]
      },
      {
        id: "context-files",
        title: "上下文文件",
        blocks: [
          { type: "paragraph", text: "上下文文件独立于项目 .biny 配置。Biny 会从运行目录及其上级目录加载上下文文件；只要 Biny 在该目录或其下运行，这个文件就生效。上下文文件的发现不需要项目信任。" },
          { type: "code", lines: ["biny --help"] }
        ]
      },
      {
        id: "reload",
        title: "重载与生效范围",
        blocks: [
          { type: "paragraph", text: "资源路径只作用于当前进程，相对路径从当前目录解析。命令行里的资源与工具选项只覆盖本次调用；保存到配置中的设置才会长期生效。" }
        ]
      }
    ]
  },
  {
    slug: "skills",
    title: "添加技能",
    description: "用 SKILL.md 描述某种工作的做法，让 Biny 按需加载。",
    group: "定制 Biny",
    keywords: ["Skills", "技能", "SKILL.md", "Agent Skills", "frontmatter", "按需加载", "skill 命令"],
    sections: [
      {
        id: "what-is-skill",
        title: "技能是什么",
        blocks: [
          { type: "paragraph", text: "技能为某一类工作提供专门指令和支持文件。Biny 会以名称和描述列出可用技能，只在任务需要时才加载完整指令。当一个工作流需要的上下文多于提示模板、但不需要新的可执行扩展点时，就用技能；技能可以随指令一起打包脚本、参考资料和资源。" }
        ]
      },
      {
        id: "create-skill",
        title: "创建一个技能",
        blocks: [
          { type: "paragraph", text: "技能是一个包含 SKILL.md 的目录。SKILL.md 以 frontmatter 开头，随后是直接的操作指令。" },
          { type: "code", lines: ["pdf-tools/", "├── SKILL.md", "├── scripts/", "│   └── extract.sh", "├── references/", "│   └── formats.md", "└── assets/", "    └── template.json"] },
          { type: "code", lines: ["---", "name: pdf-tools", "description: 从 PDF 提取文本和表格。在阅读、转换或检查 PDF 时使用。", "---", "", "# PDF 工具", "", "转换前先读 references/formats.md。脚本路径相对于本技能目录执行。"] },
          { type: "paragraph", text: "description 决定模型何时考虑加载技能，应同时写清它做什么、什么时候用。引用打包文件时使用相对技能目录的路径。" }
        ]
      },
      {
        id: "how-skills-load",
        title: "加载机制",
        blocks: [
          { type: "paragraph", text: "启动时，Biny 扫描配置的技能位置，把每个技能的名称、描述和路径加入系统提示，但不加入完整指令。任务匹配时，模型读取 SKILL.md 并遵循其中的指令，从而让详细指引在需要之前不占用上下文。模型可能漏掉相关技能，需要强制时用 /skill:name。" },
          { type: "code", lines: ["/skill:pdf-tools 提取 report.pdf"] }
        ]
      },
      {
        id: "frontmatter",
        title: "可移植的 frontmatter",
        blocks: [
          { type: "table", head: ["字段", "用途"], rows: [["name", "命令与显示名称。"], ["description", "展示给模型的路由描述。"], ["license", "许可证名称或随附的许可证文件。"], ["compatibility", "环境要求。"], ["metadata", "附加的键值元数据。"], ["allowed-tools", "实验性的预批准工具列表。"], ["disable-model-invocation", "隐藏技能，仅供显式命令调用。"]] },
          { type: "paragraph", text: "名称使用小写字母、数字和连字符，不超过 64 个字符；描述不超过 1024 个字符。缺少描述的技能不会被加载，同名技能保留先发现的那个并给出警告。" }
        ]
      },
      {
        id: "manage-skills",
        title: "管理与校验",
        blocks: [
          { type: "paragraph", text: "项目技能默认从 .biny/skills 和 .agents/skills 发现。可以列出、搜索和检查技能，编辑技能后在活动会话中重载。" },
          { type: "code", lines: ["biny skill list", 'biny skill search "能力"', "biny skill check", "biny skill --help"] }
        ]
      }
    ]
  },
  {
    slug: "extensions",
    title: "扩展与插件",
    description: "注册工具、Provider 与模型，或把回合交给外部 ACP Agent。",
    group: "定制 Biny",
    keywords: ["插件", "扩展", "Plugins", "ACP", "工具注册", "Provider", "模型注册"],
    sections: [
      {
        id: "what-are-plugins",
        title: "插件能做什么",
        blocks: [
          { type: "paragraph", text: "插件可以注册工具、Provider 和模型；本地 JavaScript 插件运行在 Biny 进程中。ACP 连接则把回合交给外部 Agent 执行，并由外部 Agent 管理其工具循环。两类扩展的执行边界不同，启用前请检查连接、所需权限与配置。" }
        ]
      },
      {
        id: "load-extensions",
        title: "加载扩展",
        blocks: [
          { type: "paragraph", text: "可以在配置中列出扩展路径或包，也可以为单次运行通过命令行加载扩展文件或目录。项目扩展在项目信任确认之后加载。" },
          { type: "code", lines: ["# 在设置中启用或配置扩展", "biny --help"] }
        ]
      },
      {
        id: "resources",
        title: "资源与生效范围",
        blocks: [
          { type: "paragraph", text: "扩展配置以当前工作区和生效的配置为准。切换项目后，先确认该项目可用的扩展，再开始依赖它们的任务。" },
          { type: "link", title: "了解工具执行权限", href: "/zh/docs/tools" }
        ]
      }
    ]
  },
  {
    slug: "custom-provider",
    title: "自定义 Provider",
    description: "接入任意 OpenAI 兼容接口或本地模型服务。",
    group: "定制 Biny",
    keywords: ["自定义 Provider", "OpenAI 兼容", "本地模型", "baseUrl", "apiKeyEnv", "Ollama"],
    sections: [
      {
        id: "openai-compatible",
        title: "OpenAI 兼容接口",
        blocks: [
          { type: "paragraph", text: "对于提供 OpenAI 兼容接口的服务，配置 type、baseUrl 和凭据即可。凭据可以使用 apiKey 直接填写，或用 apiKeyEnv 指向环境变量名称。" },
          { type: "code", lines: ["{", '  "providers": {', '    "gateway": {', '      "type": "openai-compatible",', '      "baseUrl": "https://example.test/v1",', '      "apiKeyEnv": "MODEL_API_KEY"', "    }", "  }", "}"] }
        ]
      },
      {
        id: "local-models",
        title: "本地模型",
        blocks: [
          { type: "paragraph", text: "本地运行的模型服务（例如 Ollama 或兼容端点）同样按 OpenAI 兼容接口配置，把 baseUrl 指向本地地址即可，不需要 API Key。只有服务支持工具调用时才启用 supportsTools。" }
        ]
      },
      {
        id: "verify",
        title: "验证连接",
        blocks: [
          { type: "paragraph", text: "修改连接后，先用简短对话检查响应，再尝试包含工具的任务。认证失败时先检查 API Key 与环境变量；模型不可用时核对模型 ID、接口地址与账号权限。" },
          { type: "link", title: "返回 Provider 与模型", href: "/zh/docs/providers" }
        ]
      }
    ]
  },
  {
    slug: "cli-integration",
    title: "在脚本中使用",
    description: "把一次性任务交给 Biny run，或从命令行进入会话。",
    group: "定制 Biny",
    keywords: ["自动化", "脚本", "run", "chat", "headless", "一次性任务", "命令行"],
    sections: [
      {
        id: "one-off-run",
        title: "一次性任务",
        blocks: [
          { type: "paragraph", text: "明确的一次性任务用 biny run 提交：给出任务描述，Biny 完成后返回结果。适合脚本、CI 步骤和结果明确的输入。" },
          { type: "code", lines: ['biny run "说明这个项目的启动流程"'] }
        ]
      },
      {
        id: "chat-entry",
        title: "从命令行进入会话",
        blocks: [
          { type: "paragraph", text: "需要持续交互时，从命令行进入会话；或在项目目录直接启动终端界面。两者共用本机 Runtime Host 和同一份会话记录。" },
          { type: "code", lines: ["cd /path/to/your-project", "biny chat", "# 或启动终端界面", "biny tui"] }
        ]
      },
      {
        id: "headless-and-permissions",
        title: "无人值守与权限",
        blocks: [
          { type: "paragraph", text: "在无人值守场景里运行时，用权限模式限定可执行的操作，例如只读地分析项目结构。受策略约束的操作会按当前权限模式处理。" },
          { type: "code", lines: ['biny run "分析当前项目的结构" --permission-mode read-only --headless'] },
          { type: "note", title: "先确认命令参数", text: "不同版本的参数可能不同。用 biny run --help 查看当前安装版本支持的选项，再写进脚本。" }
        ]
      }
    ]
  },

  // ───────────────────────── 能力与扩展 ─────────────────────────
  {
    slug: "providers",
    title: "Provider 与模型",
    description: "接入你选择的模型服务商，配置凭据和模型。",
    group: "能力与扩展",
    keywords: ["模型服务商", "API Key", "OpenAI", "Anthropic", "Google", "DeepSeek", "OpenAI-compatible", "模型", "apiKeyEnv"],
    sections: [
      {
        id: "provider-model",
        title: "Provider 和模型分别是什么",
        blocks: [
          { type: "paragraph", text: "Provider 是模型服务的连接配置，包括接口类型、地址和凭据。模型是该连接下实际使用的模型标识。先确认连接可用，再选择服务商提供的模型。" },
          { type: "paragraph", text: "Biny 支持多家模型服务商和 OpenAI-compatible 接口，也可按配置使用本地模型。Desktop 的模型选择还可以连接兼容 ACP 的外部 Agent；该 Agent 管理自己的模型与工具循环，Biny 负责呈现其会话事件并处理协议支持的授权请求。具体能力取决于 Provider、外部 Agent 和当前配置。" }
        ]
      },
      {
        id: "configure-provider",
        title: "配置连接",
        blocks: [
          { type: "paragraph", text: "Desktop 中打开设置的“模型供应商”页面，填写服务商信息和凭据，然后选择模型。终端配置保存在 ~/.config/biny/config.json，初始化后可以按当前配置结构填写。" },
          { type: "paragraph", text: "凭据使用 providers.<alias>.apiKey 或 providers.<alias>.apiKeyEnv。apiKeyEnv 填环境变量名称，启动 Biny 的进程必须能够读取这个变量。" },
          { type: "note", title: "保护你的凭据", text: "把真实 API Key 留在本地配置或环境变量中。分享配置和错误信息前，请移除凭据。" }
        ]
      },
      {
        id: "choose-model",
        title: "选择模型",
        blocks: [
          { type: "paragraph", text: "Provider 配置由 biny init 生成，你可以按需修改或新增。OpenAI 兼容服务通常只需要 type、baseUrl 和凭据（apiKey 或 apiKeyEnv）。" },
          { type: "code", lines: ["{", '  "providers": {', '    "gateway": {', '      "type": "openai-compatible",', '      "baseUrl": "https://example.test/v1",', '      "apiKeyEnv": "MODEL_API_KEY"', "    }", "  }", "}"] },
          { type: "paragraph", text: "模型的选择与能力（上下文窗口、是否支持工具等）在 Desktop 的模型设置里配置。修改连接后，先用简短对话检查响应，再尝试包含工具的任务。" },
          { type: "paragraph", text: "如果出现认证失败，先检查 API Key 和环境变量；如果提示模型不可用，确认模型 ID、接口地址和账号权限。网络错误可以检查服务连接后再重试。" },
          { type: "link", title: "接入自定义兼容接口", href: "/zh/docs/custom-provider" }
        ]
      },
      {
        id: "local-and-remote",
        title: "本地数据与远端请求",
        blocks: [
          { type: "paragraph", text: "Biny 在本地保存会话和记忆。使用远端模型时，调用所需的消息、上下文和工具信息会发送给配置的 Provider。外部 MCP 服务也有各自的数据处理方式。" },
          { type: "link", title: "了解工具与权限", href: "/zh/docs/tools" }
        ]
      }
    ]
  },
  {
    slug: "memory",
    title: "记忆",
    description: "保存有用的信息，在后续任务中查找和继续使用。",
    group: "能力与扩展",
    keywords: ["长期记忆", "上下文", "检索", "SQLite", "向量", "Sleep", "Activity", "事实"],
    sections: [
      {
        id: "what-to-remember",
        title: "让有用的信息留下来",
        blocks: [
          { type: "paragraph", text: "符合条件的对话可以贡献偏好、约定和长期计划等事实。新会话会根据当前问题检索相关记忆；你可以在 Desktop 中查看、搜索、编辑、归档或删除条目。" },
          { type: "paragraph", text: "任务上下文还可以包含当前会话、项目资料、桌面活动和日期线索。会话保存对话与工具记录，记忆保存可复用事实，Activity 保存桌面事件，项目资料用于接续同一工作区的工作。" },
          { type: "paragraph", text: "记忆事实和活动数据保存在本地数据库。语义向量是可重建的检索索引，不能代替原始事实。被召回的内容是过去保存的线索；遇到文件、配置或时效性信息时，仍应读取当前来源核实。" }
        ]
      },
      {
        id: "browse-memory",
        title: "查看和搜索记忆",
        blocks: [
          { type: "paragraph", text: "Desktop 提供记忆管理入口；终端可以列出记忆、查询内容和查看存储状态。支持 JSON 输出的命令适合脚本读取。" },
          { type: "code", lines: ["biny memory list", 'biny memory search "项目约定"', "biny memory stats"] },
          { type: "paragraph", text: "发现过期或不准确的信息时，先查看具体条目，再决定更新、归档或删除。命令帮助列出了各操作的参数和确认要求。" }
        ]
      },
      {
        id: "maintenance",
        title: "记忆整理",
        blocks: [
          { type: "paragraph", text: "Sleep 是记忆的整理周期：合并重复信息、归档过期的临时记忆，让后续检索更容易找到有用的内容。你可以在 Desktop 的记忆设置中启用每日整理、设置运行时间，或手动运行。错过计划时间后，会在下次启动时补跑。" },
          { type: "paragraph", text: "手动维护前，可以先预览计划，查看会影响哪些内容。归档记忆在保留期限内可以恢复，也可以查看近期运行记录。" },
          { type: "code", lines: ["biny memory sleep", "biny memory sleep --help"] }
        ]
      },
      {
        id: "activity",
        title: "Computer History：桌面活动线索",
        blocks: [
          { type: "paragraph", text: "Computer History 面向整台 Mac 上的活动，全局记录跨应用的线索，与项目工作区无关。你在浏览器看过的内容、在备忘录写下的想法、在日历安排的事情，都可以成为找回近期经历的上下文。" },
          { type: "paragraph", text: "你可以问「午饭前我做到哪了？」「昨天看到的那篇文章在哪里？」「今天都做了哪些事？」。Biny 通过时间线和活动摘要找回相关线索，帮你接上中断前的思路。" },
          { type: "paragraph", text: "在 macOS Desktop 设置中开启 Computer History 并授予所需系统权限后，后台通过周期截屏和本地 OCR 整理桌面活动，原始截图留在本机。" },
          { type: "paragraph", text: "你可以在 Desktop 的 Computer History 设置中暂停记录、排除不想记录的应用，并分别控制 OCR 和输入活动监听。输入监听只记录点击与键盘活动类型，不记录键值。" },
          { type: "note", title: "线索需要核实", text: "历史活动和记忆描述的是先前观察到的内容。文件、配置和任务状态发生变化后，应重新读取当前事实。" }
        ]
      }
    ]
  },
  {
    slug: "rich-content",
    title: "丰富的内容渲染",
    description: "让回答里的图表、信息图、公式和音乐，各自以合适的形式呈现。",
    group: "能力与扩展",
    keywords: ["Markdown", "渲染", "Mermaid", "Infographic", "LaTeX", "KaTeX", "Strudel", "Tidal", "音乐", "表格", "图片", "音频", "视频"],
    sections: [
      {
        id: "diagrams",
        title: "Mermaid：把关系画出来",
        blocks: [
          { type: "paragraph", text: "回答中的 mermaid 代码块会渲染成图表。流程、时序和关系可以直接在对话中查看，支持缩放、拖动和复制图表源码。下面就是真实的渲染结果。" },
          { type: "preview", mode: "mermaid" },
          { type: "code", lines: ["```mermaid", "graph LR", "  A[一个念头] --> B[试一试]", "  B --> C[慢慢成形]", "```"] }
        ]
      },
      {
        id: "infographic",
        title: "Infographic：让信息有层次",
        blocks: [
          { type: "paragraph", text: "infographic 代码块将结构化内容渲染为信息图，适合列表、步骤、对比与层级表达。可以放大查看、复制源码或 PNG，并下载 SVG。" },
          { type: "preview", mode: "infographic" },
          { type: "paragraph", text: "例如，让 Biny 把一份旅行安排整理成步骤信息图，或者把几个选项排成便于比较的结构。" }
        ]
      },
      {
        id: "math-and-tables",
        title: "公式与表格：看得清，也带得走",
        blocks: [
          { type: "paragraph", text: "LaTeX 数学表达式由 KaTeX 渲染，支持行内公式和独立公式。" },
          { type: "preview", mode: "math" },
          { type: "code", lines: ["$$", "\\mathbb{E}[X] = \\sum_{i=1}^{n} x_i P(x_i)", "$$"] },
          { type: "paragraph", text: "Markdown 表格支持复制，以及下载为 CSV 或 Markdown；宽表格可以横向滚动。" },
          { type: "preview", mode: "table" }
        ]
      },
      {
        id: "music",
        title: "Strudel / Tidal：可以播放的音乐代码块",
        blocks: [
          { type: "paragraph", text: "标记为 strudel 或 tidal 的代码块会显示为音乐片段，使用 Strudel 播放器运行兼容的模式代码。可以在对话中查看、复制代码，并主动点击播放、停止；进入页面不会自动发声。" },
          { type: "preview", mode: "music" },
          { type: "code", lines: ["```strudel", "note(\"c4 eb4 g4 bb4\")", "  .s(\"triangle\")", "  .slow(2)", "  .gain(0.12)", "```"] },
          { type: "paragraph", text: "你可以从「给我一段适合雨天听的旋律」开始，再继续调整音符和节奏。主页复用客户端播放器，可以直接试听。当前播放器支持内置合成器，不加载外部采样。" }
        ]
      },
      {
        id: "media",
        title: "图片、音频与视频",
        blocks: [
          { type: "paragraph", text: "Markdown 图片可直接展示。受支持的 HTML audio / video 内容会显示媒体播放器，是否可播放取决于资源是否可访问以及客户端支持的格式；普通媒体网址仍显示为链接。Desktop 还支持在聊天中生成交互式 HTML/SVG 可视化，并可导出为独立页面。" }
        ]
      }
    ]
  },
  {
    slug: "tools",
    title: "工具与权限",
    description: "理解文件、命令与外部工具的操作范围。",
    group: "能力与扩展",
    keywords: ["工具", "权限", "审批", "文件", "命令", "执行", "Computer Use", "安全", "read", "bash", "edit", "write"],
    sections: [
      {
        id: "tool-use",
        title: "文件、命令与扩展工具",
        blocks: [
          { type: "paragraph", text: "Biny 可以通过工具读取和修改项目文件、运行受控命令，也可以调用扩展提供的能力。会话记录工具调用和返回结果，便于你回看发生了什么。" },
          { type: "paragraph", text: "给出任务时说明目标目录和完成标准。工具能够使用，并不代表一次调用已经成功；以工具结果和实际文件状态确认完成情况。" }
        ]
      },
      {
        id: "builtin-tools",
        title: "内置工具",
        blocks: [
          { type: "table", head: ["工具", "用途"], rows: [["read", "读取文本文件和支持的图片。"], ["bash", "运行 shell 命令。"], ["edit", "对已有文件做精确文本替换。"], ["write", "创建或覆盖文件。"], ["grep", "搜索文件内容。"], ["find", "按 glob 模式查找路径。"], ["ls", "列出目录内容。"]] },
          { type: "paragraph", text: "默认启用的工具是 read、bash、edit 和 write。可以通过 --tools 选择、--exclude-tools 排除，或用 --no-tools 全部关闭。扩展和内置扩展（例如工具搜索）注册的工具也可以在可用工具中启用。" }
        ]
      },
      {
        id: "approval",
        title: "检查权限与审批",
        blocks: [
          { type: "paragraph", text: "工具执行遵循当前工作区和权限策略，支持 ask、read-only、auto 和 full-access。新配置默认使用 full-access；想先了解项目时，可以显式选择 read-only。" },
          { type: "code", lines: ['biny run "分析当前项目的结构" --permission-mode read-only --headless'] },
          { type: "paragraph", text: "Desktop 的“权限”页可以设置“自动批准所有工具请求”：开启时使用 full-access，关闭时使用 ask。明确禁止的路径仍会被拒绝，桌面观察与操作工具仍需要逐次审批。" },
          { type: "paragraph", text: "需要审批时，检查工具名称、输入参数和预期影响，再决定是否允许执行。拒绝权限后，任务可能需要调整操作方式或等待新的授权。" },
          { type: "list", items: ["文件操作：确认路径属于这次任务的项目与范围。", "命令执行：确认命令内容、工作目录及可能产生的修改。", "外部服务：确认请求目标和将发送的数据。"] }
        ]
      },
      {
        id: "desktop-tools",
        title: "Computer Use：让 Biny 操作电脑",
        blocks: [
          { type: "paragraph", text: "macOS Desktop 的 Computer Use 可以观察获准应用的窗口，并在授权范围内输入文字、点击和滚动。使用前，在设置中启用功能、配置目标应用并授予系统所需权限；受策略约束的操作会请求批准。" },
          { type: "paragraph", text: "Desktop 提供画面预览、暂停和接管控制。接管或中断后，Biny 需要重新观察目标窗口，再判断是否可以继续。一次操作返回成功、失败或结果未知时，按界面提示核对实际状态，避免重复有副作用的操作。" }
        ]
      },
      {
        id: "browser",
        title: "浏览器：搜索、阅读与操作网页",
        blocks: [
          { type: "paragraph", text: "Biny 可以使用 WebSearch 和 WebFetch 搜索、读取可公开访问的网页，也可以在 Desktop 内置浏览器中浏览页面。Chrome Relay 可将已连接的标签页提供给 Biny 使用；连接状态、目标标签和实际执行端由浏览器设置管理。" },
          { type: "paragraph", text: "搜索结果和网页内容来自外部网站，可能变化或不完整。需要提交表单、登录或写入外部服务时，先检查目标和将发送的内容，并按出现的授权请求决定是否继续。" }
        ]
      },
      {
        id: "appshots",
        title: "Appshots：把当前窗口带入对话",
        blocks: [
          { type: "paragraph", text: "Appshots 可通过配置的快捷键捕获当前应用窗口，并把截图及可读取的窗口文字加入当前或新建的聊天草稿。捕获完成后由你检查并发送；按下快捷键本身不会请求聊天模型，也不会开启 Computer History 或 Computer Use。" }
        ]
      },
      {
        id: "failure",
        title: "处理失败和未知结果",
        blocks: [
          { type: "paragraph", text: "认证失败、权限拒绝、工具超时和进程中断需要不同的处理方式。先检查错误和已经产生的结果，再选择重试或继续，避免重复执行已发生的操作。" },
          { type: "link", title: "查看中断与恢复边界", href: "/zh/docs/tasks" }
        ]
      }
    ]
  },
  {
    slug: "tasks",
    title: "任务与恢复",
    description: "查看长任务状态，了解中断后的继续与重试。",
    group: "能力与扩展",
    keywords: ["TaskRun", "子代理", "长任务", "中断", "检查点", "恢复", "重试", "验证", "worker"],
    sections: [
      {
        id: "durable-task",
        title: "保留任务进展",
        blocks: [
          { type: "paragraph", text: "Biny 持久化长任务及其执行尝试的状态。启用子代理后，Agent 可以后台委派任务、补充消息、等待结果或取消任务。" },
          { type: "paragraph", text: "子代理返回后还可以进入任务验证。执行结束和验证通过是不同的状态，完成情况应以任务记录和验证结果为准。" },
          { type: "code", lines: ["biny task list", "biny task get <taskRunId>", "biny task events <taskRunId>"] }
        ]
      },
      {
        id: "interrupted",
        title: "任务中断之后",
        blocks: [
          { type: "paragraph", text: "恢复会检查已保存的执行状态、检查点和当前策略。证据完整且符合恢复条件时，worker 可以从保存的进展继续。" },
          { type: "note", title: "未知外部副作用会阻止自动恢复", text: "如果无法确定外部操作是否已经发生，或者缺少必要检查点、策略或任务定义不匹配，Biny 会阻止不安全的续跑。先核实实际结果，再决定后续操作。" },
          { type: "paragraph", text: "遇到中断提示时，先查看会话错误和任务状态。不要把打开历史会话当作任务已经恢复执行的证明。" }
        ]
      },
      {
        id: "resume-retry",
        title: "继续与重试",
        blocks: [
          { type: "paragraph", text: "resume 根据保存的状态尝试继续；retry 发起新的尝试，并遵循任务的重试条件。使用前检查当前任务状态和已产生的副作用。" },
          { type: "code", lines: ["biny task resume <taskRunId>", "biny task retry <taskRunId>", "biny task --help"] }
        ]
      },
      {
        id: "task-message",
        title: "向后台任务补充信息",
        blocks: [
          { type: "paragraph", text: "为仍在运行的子任务补充约束或信息时，需要提供任务 ID 和所属会话 ID。已结束的任务会拒绝新消息。" },
          { type: "code", lines: ['biny task message <taskRunId> "补充任务信息" --session <sessionId>', "biny task wait <taskRunId> --session <sessionId>"] }
        ]
      },
      {
        id: "goals-and-automation",
        title: "会话目标与定时自动化",
        blocks: [
          { type: "paragraph", text: "会话目标用于跨多个回合持续推进一件事；任务图把工作拆成有依赖关系的节点；TaskRun 记录具体执行尝试与验证。自动化可以按时间触发已配置的运行流程。它们的状态各自保存，创建目标或任务记录本身不代表工作已经执行。" },
          { type: "paragraph", text: "调度在本机 Runtime Host 中运行。电脑关机、休眠或 Host 未运行时，不会持续执行；需要长时间按计划运行时，请保持设备和本机服务可用，并在 Desktop 或 CLI 中查看最近运行结果。" }
        ]
      }
    ]
  },
  {
    slug: "desktop",
    title: "桌面端与 Computer Use",
    description: "在 macOS 上同屏查看会话、文件、浏览器，并让 Biny 操作获准的应用。",
    group: "能力与扩展",
    keywords: ["Desktop", "macOS", "桌面", "Computer Use", "浏览器", "文件变更", "接管", "Appshots"],
    sections: [
      {
        id: "desktop-workbench",
        title: "桌面工作台",
        blocks: [
          { type: "paragraph", text: "桌面端把会话、文件、工具过程和浏览器侧栏放在同一屏。它适合边看边聊，也适合检查 Biny 改了什么：工具活动、权限请求与文件变更都能直接回看。" },
          { type: "list", items: ["会话：本机保存，可回看、搜索、置顶、归档与分支。", "右栏：文件、变更与浏览器。", "权限：每次询问或自动允许。"] }
        ]
      },
      {
        id: "computer-use",
        title: "Computer Use",
        blocks: [
          { type: "paragraph", text: "Computer Use 可以观察获准应用的窗口，并在授权范围内输入文字、点击和滚动。使用前在设置中启用功能、配置目标应用并授予系统权限；受策略约束的操作会请求批准。" },
          { type: "paragraph", text: "桌面端提供画面预览、暂停和接管控制。接管或中断后，Biny 需要重新观察目标窗口，再判断是否可以继续。" }
        ]
      },
      {
        id: "browser-and-appshots",
        title: "浏览器与 Appshots",
        blocks: [
          { type: "paragraph", text: "桌面端内置浏览器可以让 Biny 在你正在使用的页面里工作，Chrome Relay 可把已连接的标签页提供给 Biny。Appshots 通过快捷键捕获当前窗口的截图和可读文字，加入聊天草稿，由你检查后再发送。" },
          { type: "link", title: "查看工具与权限", href: "/zh/docs/tools" }
        ]
      }
    ]
  },

  // ───────────────────────── 参考 ─────────────────────────
  {
    slug: "cli",
    title: "CLI 参考",
    description: "Biny 内置命令行命令与选项速查。",
    group: "参考",
    keywords: ["CLI", "命令", "参数", "--help", "init", "run", "tui", "命令速查"],
    sections: [
      {
        id: "command-forms",
        title: "命令形式",
        blocks: [
          { type: "code", lines: ["biny", "biny init", "biny tui", "biny chat", "biny run \"<任务>\"", "biny memory <list|search|stats|sleep>", "biny skill <list|search|check>", "biny task <list|get|events|resume|retry|message|wait>"] },
          { type: "paragraph", text: "运行 biny --help 或给某个命令追加 --help，可以查看当前安装版本的确切参数。" }
        ]
      },
      {
        id: "common-options",
        title: "常用入口与选项",
        blocks: [
          { type: "table", head: ["入口 / 选项", "行为"], rows: [["biny", "在项目目录启动终端界面。"], ["biny init", "创建缺失的默认配置与运行目录。"], ["biny tui / biny chat", "启动终端界面，或进入命令行会话。"], ["biny run \"<任务>\"", "提交一次性任务并返回结果。"], ["--permission-mode <mode>", "选择 ask、read-only、auto 或 full-access。"], ["--headless", "无人值守运行，不进入交互界面。"], ["--model <id>", "选择模型。"], ["--tools / --exclude-tools", "选择或排除工具。"]] },
          { type: "note", title: "以已安装版本为准", text: "不同版本的参数可能不同。写脚本或依赖某个选项前，先运行对应命令的 --help 确认。" }
        ]
      },
      {
        id: "tools-and-resources",
        title: "工具与资源选项",
        blocks: [
          { type: "code", lines: ['biny run "review 这个项目" --permission-mode read-only --headless'] },
          { type: "paragraph", text: "资源与工具的可用范围以当前项目和工作区为准；切换项目后先确认该项目可用的扩展与工具。" }
        ]
      }
    ]
  },
  {
    slug: "slash-commands",
    title: "斜杠命令",
    description: "交互式终端里的内置命令与技能命令。",
    group: "参考",
    keywords: ["斜杠命令", "slash", "/model", "/memory", "/resume", "/fork", "/skill", "交互"],
    sections: [
      {
        id: "builtin-slash",
        title: "内置命令",
        blocks: [
          { type: "paragraph", text: "交互式终端中输入 / 会弹出可用命令。Enter 执行选中项，Tab 补全。纯信息类命令（如 /usage、/status、/mcp）只出现在 TUI；Desktop 用专属界面展示用量、模型与权限等。下面列出当前命令，具体以安装版本为准。" },
          { type: "table", head: ["命令", "作用"], rows: [["/clear", "清空当前可见消息。"], ["/compact", "压缩较早的对话历史。"], ["/model", "选择模型及其支持的推理强度（TUI）。"], ["/theme", "切换终端配色（TUI）。"], ["/status", "查看模型、上下文、权限与扩展（TUI）。"], ["/mcp", "列出 MCP 服务器与工具，或重连服务器（TUI）。"], ["/subagent", "运行或管理子代理。"], ["/tasks", "查看后台 TaskRun。"], ["/automation", "列出或控制本地自动化。"], ["/goal", "查看、设置、暂停或清除当前会话目标。"], ["/memory", "管理本机与工作区记忆。"], ["/soul", "查看或编辑持久的 Soul。"], ["/resume", "选择会话并恢复其历史（TUI）。"], ["/undo", "从 Biny 检查点恢复工作区。"], ["/fork", "把会话分叉成新的会话（TUI）。"], ["/permissions", "查看或更改权限模式（TUI）。"], ["/exit", "退出 Biny（TUI）。"]] }
        ]
      },
      {
        id: "skill-commands",
        title: "技能命令",
        blocks: [
          { type: "paragraph", text: "技能可以注册为 /skill:name 命令。需要显式调用或模型可能漏掉相关技能时，直接用命令调用。" },
          { type: "code", lines: ["/skill:pdf-tools 提取 report.pdf"] }
        ]
      }
    ]
  },
  {
    slug: "settings",
    title: "配置文件",
    description: "认识 Biny 配置文件的结构，以及在哪里改设置。",
    group: "参考",
    keywords: ["配置", "config.json", "defaultModel", "providers", "memory", "扩展", "Desktop 设置"],
    sections: [
      {
        id: "where-to-change",
        title: "在哪里改设置",
        blocks: [
          { type: "paragraph", text: "常用偏好优先在 Desktop 的设置页修改，或在 TUI 里用 /status 查看当前模型、权限与扩展。需要改配置文件时，以 biny init 生成的 config.json 为准，避免引入不存在的字段。" },
          { type: "code", lines: ["biny init", "# 或查看当前运行状态", "/status"] }
        ]
      },
      {
        id: "top-level",
        title: "配置文件的顶层字段",
        blocks: [
          { type: "paragraph", text: "config.json 是带版本的结构化配置。下表中的字段是稳定的顶层入口，其余嵌套结构（模型能力、记忆、扩展、网络）请按 init 生成的示例编辑。" },
          { type: "table", head: ["字段", "说明"], rows: [["format / configVersion", "配置格式与版本，用于迁移与校验。"], ["defaultModel", "默认使用的模型。"], ["toolModel", "供工具类任务使用的模型。"], ["providers", "模型服务的连接配置（type、baseUrl、apiKey 或 apiKeyEnv 等）。"]] }
        ]
      },
      {
        id: "memory-extensions",
        title: "记忆与扩展",
        blocks: [
          { type: "paragraph", text: "记忆相关设置涵盖是否使用记忆、Sleep 整理周期等；扩展相关设置涵盖可用工具与工具暴露方式。这些结构较细，建议在 Desktop 设置里切换，或参考 init 生成的完整示例。" },
          { type: "link", title: "了解记忆", href: "/zh/docs/memory" },
          { type: "link", title: "了解扩展与插件", href: "/zh/docs/extensions" }
        ]
      }
    ]
  },
  {
    slug: "environment-variables",
    title: "环境变量",
    description: "影响 Biny 进程行为与凭据读取的环境变量。",
    group: "参考",
    keywords: ["环境变量", "BINY_AGENT_DIR", "apiKeyEnv", "凭据", "运行目录"],
    sections: [
      {
        id: "runtime-paths",
        title: "运行目录与凭据",
        blocks: [
          { type: "paragraph", text: "Biny 从进程环境读取运行目录和相关配置。凭据既可以在配置里用 apiKey 直接填写，也可以把 apiKeyEnv 指向一个环境变量名，由启动 Biny 的进程提供。" },
          { type: "table", head: ["变量", "作用"], rows: [["BINY_AGENT_DIR", "更改配置和运行数据的位置（默认 ~/.biny/agent/）。"], ["<你的 apiKeyEnv>", "Provider 通过 apiKeyEnv 引用的凭据变量名，例如 MODEL_API_KEY。"]] }
        ]
      },
      {
        id: "credential-safety",
        title: "凭据安全",
        blocks: [
          { type: "note", title: "留在本机", text: "把真实 API Key 留在本地配置或环境变量中。分享配置、日志和错误信息前请先移除凭据。" }
        ]
      }
    ]
  }
];

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((page) => page.slug === slug.replace(/\/+$/, ""));
}
