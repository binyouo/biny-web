import { SITE } from "../lib/site.ts";

export type DocBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[]; ordered?: boolean }
  | { type: "code"; lines: readonly string[] }
  | { type: "note"; title: string; text: string }
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

export const DOC_GROUPS = ["开始使用", "日常使用", "能力与扩展"] as const;
export const DOC_PAGES: readonly DocPage[] = [
  {
    slug: "introduction",
    title: "认识 Biny",
    description: "在你的项目中开始工作，把有用的上下文留给下一次。",
    group: "开始使用",
    keywords: ["介绍", "本地优先", "开发协作", "Desktop", "TUI", "CLI"],
    sections: [
      {
        id: "what-is-biny",
        title: "Biny 是什么",
        blocks: [
          { type: "paragraph", text: "Biny 是本地优先、记忆优先的开发协作 Agent。你可以在本地项目里讨论代码、处理开发任务，使用文件和命令工具，并在后续会话中继续利用已有记忆。" },
          { type: "paragraph", text: "会话和记忆保存在本机。你自行配置模型服务商；调用模型与外部工具时，相应请求仍会发送到你选择的服务。" }
        ]
      },
      {
        id: "choose-interface",
        title: "选择你的工作入口",
        blocks: [
          { type: "list", items: ["macOS Desktop：通过桌面界面管理项目、会话、模型与扩展。", "TUI：在终端里进行交互式对话，适合跟随当前项目工作。", "CLI chat：通过命令行进入对话。", "CLI run：执行一次性任务，适合脚本和明确的任务输入。"] },
          { type: "paragraph", text: "Desktop、TUI 和 CLI chat 共用本机执行服务。切换入口时，先确认工作区和会话，避免在另一个项目里继续操作。" }
        ]
      },
      {
        id: "first-step",
        title: "从一项小任务开始",
        blocks: [
          { type: "paragraph", text: "先完成安装与模型配置，再打开一个熟悉的项目。可以先让 Biny 解释一个模块，确认它使用了正确的目录和模型，然后再开始修改代码。" },
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
          { type: "paragraph", text: "先运行 biny init 创建默认配置。默认配置预设了 DeepSeek 连接，可以在启动 Biny 的终端中设置 DEEPSEEK_API_KEY 环境变量。" },
          { type: "code", lines: ["biny init", "export DEEPSEEK_API_KEY='YOUR_API_KEY'"] },
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
    slug: "sessions",
    title: "会话与工作区",
    description: "在正确的项目里开始对话，回到已有的工作。",
    group: "日常使用",
    keywords: ["项目", "会话", "对话", "历史", "终端", "Desktop", "resume", "workspace"],
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
        id: "history",
        title: "回到历史会话",
        blocks: [
          { type: "paragraph", text: "会话在本地记录用户消息、回复、工具调用与结果。Desktop 可以从历史中选择会话；终端可以列出记录，或进入会话选择。" },
          { type: "code", lines: ["biny sessions", "biny resume", "biny sessions --help"] },
          { type: "note", title: "恢复对话与恢复执行", text: "打开历史会话可以继续讨论，但中断的任务是否能够续跑还取决于保存的执行状态。请查看任务与恢复指南中的限制。" }
        ]
      },
      {
        id: "interface",
        title: "切换交互入口",
        blocks: [
          { type: "paragraph", text: "macOS Desktop、TUI 和 CLI chat 使用本机执行服务与同一套会话执行逻辑。选择你顺手的入口，保留相同的项目和会话上下文。" },
          { type: "paragraph", text: "在任务运行期间补充消息时，交互入口会处理待发送输入。下一步是否已经开始，以会话中的状态和工具结果为准。" },
          { type: "link", title: "了解任务与恢复", href: "/zh/docs/tasks" }
        ]
      }
    ]
  },
  {
    slug: "providers",
    title: "Provider 与模型",
    description: "接入你选择的模型服务商，配置凭据和模型。",
    group: "日常使用",
    keywords: ["模型服务商", "API Key", "OpenAI", "Anthropic", "Google", "DeepSeek", "OpenAI-compatible", "模型", "apiKeyEnv"],
    sections: [
      {
        id: "provider-model",
        title: "Provider 和模型分别是什么",
        blocks: [
          { type: "paragraph", text: "Provider 是模型服务的连接配置，包括接口类型、地址和凭据。模型是该连接下实际使用的模型标识。先确认连接可用，再选择服务商提供的模型。" },
          { type: "paragraph", text: "Biny 支持多家模型服务商和 OpenAI-compatible 接口。具体模型是否可调用、是否支持工具或推理参数，取决于服务商接口和当前配置。" }
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
          { type: "paragraph", text: "模型配置需要引用已配置的 Provider，并使用服务商接受的模型 ID。下面展示需要修改的字段；请把它们合并到 init 生成的配置中，并将地址和模型 ID 换成你的服务商信息。" },
          { type: "code", lines: ["{", '  "providers": {', '    "gateway": {', '      "type": "openai-compatible",', '      "baseUrl": "https://example.test/v1",', '      "apiKeyEnv": "MODEL_API_KEY"', "    }", "  },", '  "models": {', '    "coder": {', '      "provider": "gateway",', '      "model": "实际模型ID",', '      "supportsTools": true', "    }", "  },", '  "defaultModel": "coder"', "}"] },
          { type: "paragraph", text: "只有服务支持工具调用时才启用 supportsTools。修改连接后，先用简短对话检查响应，再尝试包含工具的任务。" },
          { type: "paragraph", text: "如果出现认证失败，先检查 API Key 和环境变量；如果提示模型不可用，确认模型 ID、接口地址和账号权限。网络错误可以检查服务连接后再重试。" }
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
          { type: "paragraph", text: "Biny 会从日常交流中留下有用的信息，例如你的表达习惯、生活偏好、长期计划和已确认的约定。长期记忆跨对话使用：开启一段新对话后，仍可以召回相关内容。" },
          { type: "paragraph", text: "记忆保存在本地数据库，并通过语义检索查找相关内容。会话记录和长期记忆承担不同职责；保存的线索仍需要结合当前情况判断。" }
        ]
      },
      {
        id: "browse-memory",
        title: "查看和搜索记忆",
        blocks: [
          { type: "paragraph", text: "Desktop 提供记忆管理入口；终端可以列出记忆、查询内容和查看存储状态。支持 JSON 输出的命令适合脚本读取。" },
          { type: "code", lines: ["biny memory list", 'biny memory search "项目约定"', "biny memory stats --json"] },
          { type: "paragraph", text: "发现过期或不准确的信息时，先查看具体条目，再决定更新、归档或删除。命令帮助列出了各操作的参数和确认要求。" }
        ]
      },
      {
        id: "maintenance",
        title: "记忆整理",
        blocks: [
          { type: "paragraph", text: "Sleep 是记忆的整理周期：合并重复信息、归档过期的临时记忆，让后续检索更容易找到有用的内容。你可以在 Desktop 的记忆设置中启用每日整理、设置运行时间，或手动运行。错过计划时间后，会在下次启动时补跑。" },
          { type: "paragraph", text: "手动维护前，可以先预览计划，查看会影响哪些内容。归档记忆在保留期限内可以恢复，也可以查看近期运行记录。" },
          { type: "code", lines: ["biny memory sleep --preview", "biny memory sleep --help"] }
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
    group: "日常使用",
    keywords: ["Markdown", "渲染", "Mermaid", "Infographic", "LaTeX", "KaTeX", "Strudel", "Tidal", "音乐", "表格", "图片", "音频", "视频"],
    sections: [
      {
        id: "diagrams",
        title: "Mermaid：把关系画出来",
        blocks: [
          { type: "paragraph", text: "回答中的 mermaid 代码块会渲染成图表。流程、时序和关系可以直接在对话中查看，支持缩放、拖动和复制图表源码。" },
          { type: "code", lines: ["```mermaid", "graph LR", "  A[一个念头] --> B[试一试]", "  B --> C[慢慢成形]", "```"] }
        ]
      },
      {
        id: "infographic",
        title: "Infographic：让信息有层次",
        blocks: [
          { type: "paragraph", text: "infographic 代码块将结构化内容渲染为信息图，适合列表、步骤、对比与层级表达。可以放大查看、复制源码或 PNG，并下载 SVG。" },
          { type: "paragraph", text: "例如，让 Biny 把一份旅行安排整理成步骤信息图，或者把几个选项排成便于比较的结构。" }
        ]
      },
      {
        id: "math-and-tables",
        title: "公式与表格：看得清，也带得走",
        blocks: [
          { type: "paragraph", text: "LaTeX 数学表达式由 KaTeX 渲染，支持行内公式和独立公式。Markdown 表格支持复制，以及下载为 CSV 或 Markdown；宽表格可以横向滚动。" },
          { type: "code", lines: ["$$", "\\mathbb{E}[X] = \\sum_{i=1}^{n} x_i P(x_i)", "$$"] }
        ]
      },
      {
        id: "music",
        title: "Strudel / Tidal：可以播放的音乐代码块",
        blocks: [
          { type: "paragraph", text: "标记为 strudel 或 tidal 的代码块会显示为音乐片段，使用 Strudel 播放器运行兼容的模式代码。可以在对话中查看、复制代码，并主动点击播放、停止；进入页面不会自动发声。" },
          { type: "code", lines: ["```strudel", "note(\"c4 eb4 g4 bb4\")", "  .s(\"triangle\")", "  .slow(2)", "  .gain(0.12)", "```"] },
          { type: "paragraph", text: "你可以从「给我一段适合雨天听的旋律」开始，再继续调整音符和节奏。主页复用客户端播放器，可以直接试听。当前播放器支持内置合成器，不加载外部采样。" }
        ]
      },
      {
        id: "media",
        title: "图片、音频与视频",
        blocks: [
          { type: "paragraph", text: "Markdown 图片可直接展示。受支持的 HTML audio / video 内容会显示媒体播放器，是否可播放取决于资源是否可访问以及客户端支持的格式；普通媒体网址仍显示为链接。" }
        ]
      }
    ]
  },
  {
    slug: "tools",
    title: "工具与权限",
    description: "理解文件、命令与外部工具的操作范围。",
    group: "能力与扩展",
    keywords: ["工具", "权限", "审批", "文件", "命令", "执行", "Computer Use", "安全"],
    sections: [
      {
        id: "tool-use",
        title: "从回复到实际操作",
        blocks: [
          { type: "paragraph", text: "Biny 可以通过工具读取和修改项目文件、运行受控命令，也可以调用扩展提供的能力。会话记录工具调用和返回结果，便于你回看发生了什么。" },
          { type: "paragraph", text: "给出任务时说明目标目录和完成标准。工具能够使用，并不代表一次调用已经成功；以工具结果和实际文件状态确认完成情况。" }
        ]
      },
      {
        id: "approval",
        title: "检查权限与审批",
        blocks: [
          { type: "paragraph", text: "工具执行遵循当前工作区和权限策略，支持 ask、read-only、auto 和 full-access。新配置默认使用 full-access；想先了解项目时，可以显式选择 read-only。" },
          { type: "code", lines: ['biny run "分析当前项目的结构" --permission-mode read-only --headless --json'] },
          { type: "paragraph", text: "Desktop 的“权限”页可以设置“自动批准所有工具请求”：开启时使用 full-access，关闭时使用 ask。明确禁止的路径仍会被拒绝，桌面观察与操作工具仍需要逐次审批。" },
          { type: "paragraph", text: "需要审批时，检查工具名称、输入参数和预期影响，再决定是否允许执行。拒绝权限后，任务可能需要调整操作方式或等待新的授权。" },
          { type: "list", items: ["文件操作：确认路径属于这次任务的项目与范围。", "命令执行：确认命令内容、工作目录及可能产生的修改。", "外部服务：确认请求目标和将发送的数据。"] }
        ]
      },
      {
        id: "desktop-tools",
        title: "Computer Use：让 Biny 操作电脑",
        blocks: [
          { type: "paragraph", text: "在 macOS Desktop 中，Biny 可以观察应用窗口，输入文字、点击和滚动。你可以让它查找网页内容，或在应用里完成一连串操作。使用前，在 Computer Use 设置中完成系统权限和目标应用配置。" },
          { type: "paragraph", text: "操作过程中可以查看画面、暂停或接管。恢复后，Biny 会重新观察窗口，再继续操作。首页演示复用 Biny 的聊天和浏览器界面，场景与网页为本地预置内容。" }
        ]
      },
      {
        id: "failure",
        title: "失败后先看结果",
        blocks: [
          { type: "paragraph", text: "认证失败、权限拒绝、工具超时和进程中断需要不同的处理方式。先检查错误和已经产生的结果，再选择重试或继续，避免重复执行已发生的操作。" },
          { type: "link", title: "查看中断与恢复边界", href: "/zh/docs/tasks" }
        ]
      }
    ]
  },
  {
    slug: "extensions",
    title: "MCP、Skills 与插件",
    description: "连接外部工具，复用工作方法，管理项目扩展。",
    group: "能力与扩展",
    keywords: ["MCP", "Skills", "Plugins", "扩展", "技能", "插件", "工具服务", "SKILL.md"],
    sections: [
      {
        id: "mcp",
        title: "MCP：连接工具服务",
        blocks: [
          { type: "paragraph", text: "MCP 把外部工具服务接入 Biny。配置连接后，服务提供的工具可以被发现和调用，实际执行仍受当前权限策略约束。" },
          { type: "paragraph", text: "排查时分别确认连接状态、工具是否可见，以及调用是否获准。服务器已连接，并不意味着所有工具都可执行。Desktop 设置提供 MCP 管理入口。" }
        ]
      },
      {
        id: "skills",
        title: "Skills：复用工作方法",
        blocks: [
          { type: "paragraph", text: "Skill 用 SKILL.md 描述适用场景、工作步骤和相关资源。Biny 可以发现可用技能，并在任务相关时读取它的说明。项目技能默认从 .biny/skills 和 .agents/skills 发现。" },
          { type: "paragraph", text: "将稳定的项目工作方式整理为 Skill，可以减少重复说明。内容应写清输入、操作边界和完成标准；技能中的外部资料仍需要核实。" },
          { type: "code", lines: ["biny skill list --json", 'biny skill search "能力" --json', "biny skill check --json", "biny skill --help"] }
        ]
      },
      {
        id: "plugins",
        title: "插件：组合扩展能力",
        blocks: [
          { type: "paragraph", text: "插件可以注册工具、Provider 和模型。Desktop 设置中可以管理插件。本地 JavaScript 插件会在进程中运行，安装或启用前应检查来源、所需配置和操作范围。" },
          { type: "paragraph", text: "扩展配置以当前工作区和生效的配置为准。切换项目后，先确认该项目可用的扩展，再开始依赖它们的任务。" },
          { type: "link", title: "了解工具执行权限", href: "/zh/docs/tools" }
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
          { type: "code", lines: ["biny task list", "biny task get <taskRunId> --json", "biny task events <taskRunId>"] }
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
          { type: "code", lines: ['biny task message <taskRunId> "补充任务信息" --session <sessionId>', "biny task wait <taskRunId> --session <sessionId> --wait-ms 30000 --json"] }
        ]
      }
    ]
  }
];

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((page) => page.slug === slug.replace(/\/+$/, ""));
}
