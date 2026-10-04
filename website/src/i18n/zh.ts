import type { DemoScenario } from "../demo/types";

const scenarios: DemoScenario[] = [
  {
    id: "flow",
    title: "从一句话开始",
    permissionMode: "自动允许安全修改",
    usage: "预置示例 · 已完成",
    steps: [
      { kind: "user", viaComposer: true, text: "周会前帮我把这周的提交整理成周报要点，中文，五条以内。" },
      {
        kind: "reasoning",
        label: "已推理 2 秒",
        text: "先拉这周的 git 记录，按主题归类，再压成面向周会的要点。周报的读者要的是结论和数字，不是提交哈希列表。"
      },
      {
        kind: "tool",
        name: "Bash",
        summary: "git log --since='7 days ago' --oneline",
        durationLabel: "0.3 秒",
        command: {
          text: "git log --since='7 days ago' --oneline",
          output: [
            "a31f9c2 添加订单搜索",
            "9e55b0e 调整报表导出格式",
            "41a2f77 补充接口错误提示",
            "7d0c441 修复列表在窄屏下的错位",
            "",
            "示例项目 · 4 条提交"
          ]
        }
      },
      {
        kind: "assistant",
        text: "整理好了，本周四条：\n\n1. 新增订单搜索，支持按编号找到对应记录。\n\n2. 调整报表导出格式，便于周会汇报。\n\n3. 补充接口错误提示，失败时能看见原因。\n\n4. 修复列表在窄屏下的错位。\n\n这些是示例项目的提交内容；可以继续整理成 Markdown 周报。"
      }
    ]
  },
  {
    id: "models",
    title: "换个模型接着想",
    permissionMode: "自动允许安全修改",
    usage: "预置示例 · 已完成",
    steps: [
      { kind: "user", viaComposer: true, text: "这个排序在大数组下太慢了，帮我看看优化思路。" },
      {
        kind: "reasoning",
        label: "已推理 3 秒",
        text: "先读实现，确认瓶颈出在算法复杂度还是常数开销，再决定给哪个方向。"
      },
      {
        kind: "tool",
        name: "读取文件",
        summary: "src/utils/sort.ts",
        durationLabel: "0.2 秒",
        payload: [
          "12  export function sortIds(ids: number[]) {",
          "13    if (ids.length <= 1) return ids;",
          "14    const pivot = ids[0];",
          "15    const rest = ids.slice(1);",
          "16    return [...sortIds(rest.filter(x => x < pivot)),",
          "17            pivot,",
          "18            ...sortIds(rest.filter(x => x >= pivot))];",
          "19  }"
        ]
      },
      {
        kind: "assistant",
        text: "瓶颈找到了：这是每层都 filter 出新数组的朴素快排，pivot 还固定取第一个元素——遇到近似有序的输入会退化成 O(n²)，内存分配也可观。两个方向：一是原地分区加三数取中；二是值域有限的话直接计数排序到 O(n)。你的 ID 是什么分布？"
      },
      { kind: "user", viaComposer: true, text: "雪花算法生成的 ID，值域很大。这步很关键，我切个推理更强的模型再定。" },
      {
        kind: "model",
        model: "reasoning-model",
        label: "已切换到 reasoning-model",
        note: "同一会话里随时换模型，继续使用当前会话上下文"
      },
      {
        kind: "reasoning",
        label: "已推理 6 秒",
        text: "值域大，计数排序出局。雪花 ID 近似单调递增，输入经常接近有序——这正是固定 pivot 快排的最坏情况。可以用原地分区和三数取中减少分配，并在递归过深时回退到堆排序，限制最坏情况。"
      },
      {
        kind: "assistant",
        text: "定了：原地分区，pivot 三数取中，递归过深时退化堆排序。雪花 ID 经常近似有序，正好命中旧实现的最坏情况。我直接改。"
      },
      {
        kind: "tool",
        name: "修改文件",
        summary: "src/utils/sort.ts",
        durationLabel: "0.1 秒",
        diff: {
          path: "src/utils/sort.ts",
          added: 6,
          removed: 5,
          lines: [
            { line: 12, sign: " ", text: "export function sortIds(ids: number[]) {" },
            { line: 13, sign: "-", text: "  if (ids.length <= 1) return ids;" },
            { line: 14, sign: "-", text: "  const pivot = ids[0];" },
            { line: 15, sign: "-", text: "  const rest = ids.slice(1);" },
            { line: 16, sign: "-", text: "  return [...sortIds(rest.filter(x => x < pivot)), pivot," },
            { line: 17, sign: "-", text: "          ...sortIds(rest.filter(x => x >= pivot))];" },
            { line: 13, sign: "+", text: "  // 原地分区 + 三数取中，最坏 O(n log n)" },
            { line: 14, sign: "+", text: "  introsort(ids, 0, ids.length - 1);" },
            { line: 15, sign: "+", text: "  return ids;" },
            { line: 16, sign: "+", text: "}" },
            { line: 17, sign: "+", text: "" },
            { line: 18, sign: "+", text: "function introsort(a: number[], lo: number, hi: number) { … }" }
          ]
        }
      },
      {
        kind: "tool",
        name: "Bash",
        summary: "pnpm test -- sort",
        durationLabel: "3.1 秒",
        command: {
          text: "pnpm test -- sort",
          output: [
            "utils/sort.test.ts  ✓ 随机输入排序正确",
            "utils/sort.test.ts  ✓ 有序输入排序正确",
            "",
            "示例测试输出：2 passed, 0 failed"
          ]
        }
      },
      {
        kind: "assistant",
        text: "示例改动已经完成，随机输入与有序输入的正确性用例通过。性能需要在真实项目的数据上单独验证；切换模型后，可以继续沿用当前会话的上下文。"
      }
    ]
  },
  {
    id: "memory",
    title: "它记得「老规矩」",
    permissionMode: "自动允许安全修改",
    usage: "预置示例 · 已完成",
    steps: [
      { kind: "user", viaComposer: true, text: "老规矩，把这周的活跃用户数据出张图。" },
      {
        kind: "tool",
        name: "召回记忆",
        summary: "\"老规矩\" 周报 图表",
        durationLabel: "0.2 秒",
        payload: [
          "命中 2 条记忆：",
          "",
          "1. 「老规矩」= 折线图，纵轴从 0 开始，配色跟终端主题。",
          "2. 数据来源标注在图表下方，字号小一档。"
        ]
      },
      {
        kind: "assistant",
        text: "记得：折线图、纵轴从 0、来源小字标注。这次照办。"
      },
      {
        kind: "tool",
        name: "加载技能",
        summary: "skills/weekly-chart/SKILL.md",
        durationLabel: "0.1 秒",
        payload: [
          "# weekly-chart",
          "",
          "1. 拉取接口数据存成 JSON",
          "2. 按天聚合并渲染折线图",
          "3. 导出 PNG 到 docs/charts/",
          "",
          "技能正文按需加载，初始只提供名称和说明。"
        ]
      },
      {
        kind: "tool",
        name: "Bash",
        summary: "python3 scripts/fetch_active.py --week current",
        durationLabel: "2.4 秒",
        command: {
          text: "python3 scripts/fetch_active.py --week current",
          output: ["已拉取 7 天数据：1,284 条记录", "按天聚合完成：7 个数据点"]
        }
      },
      {
        kind: "tool",
        name: "写入文件",
        summary: "docs/charts/active-w36.png",
        durationLabel: "0.9 秒",
        filePath: "docs/charts/active-w36.png"
      },
      {
        kind: "assistant",
        text: "出好了：docs/charts/active-w36.png。折线图、纵轴从 0、来源标注都在老位置。峰值在周四，2,913 人，比上周多 11%。"
      },
      {
        kind: "tool",
        name: "保存记忆",
        summary: "周报图表偏好 · 更新",
        durationLabel: "0.1 秒",
        payload: ["已更新记忆：「老规矩」追加一条——", "报告里附上环比变化百分比。"]
      },
      {
        kind: "assistant",
        text: "顺手把「附上环比」也记进了偏好，下次你说「老规矩」连这句都不用提。记忆保存在本机，可以查看和管理。"
      }
    ]
  },
  {
    id: "fix",
    title: "修复登录超时",
    permissionMode: "每次询问",
    usage: "预置示例 · 已完成",
    steps: [
      { kind: "user", text: "登录接口偶发超时，先定位原因再改，测试文件别动。" },
      {
        kind: "reasoning",
        label: "已推理 4 秒",
        text: "先读认证入口，确认超时值是在客户端设置还是服务端返回，再决定改哪一层。重试逻辑也要一起看，偶发通常出在重试上。"
      },
      {
        kind: "tool",
        name: "读取文件",
        summary: "src/auth/session.ts",
        durationLabel: "0.2 秒",
        payload: [
          "42  const controller = new AbortController();",
          "43  const timer = setTimeout(() => controller.abort(), 8_000);",
          "51  return retry(() => request(url, { signal: controller.signal }), 3);"
        ]
      },
      {
        kind: "tool",
        name: "搜索内容",
        summary: '"AbortController" src/**/*.ts',
        durationLabel: "0.4 秒",
        payload: [
          "src/auth/session.ts:42",
          "src/auth/refresh.ts:17",
          "src/http/client.ts:88",
          "",
          "命中 3 处，无截断"
        ]
      },
      {
        kind: "assistant",
        text: "找到了：超时用的 `AbortController` 建在重试循环外面。第一次请求超时后 signal 已经 abort，后面两次重试是拿着废掉的 signal 立刻失败的，看起来就像“偶发超时”。修法是把 controller 移进每次重试里。"
      },
      {
        kind: "tool",
        name: "修改文件",
        summary: "src/auth/session.ts",
        durationLabel: "0.1 秒",
        permission: {
          title: "修改文件",
          details: "Biny 想要修改工作区中的 1 个文件。",
          target: "src/auth/session.ts",
          risk: "medium",
          riskLabel: "中风险",
          requireFullYes: false,
          deniedReply:
            "好，不动这个文件。改动我已经写成 patch，你可以自己决定要不要应用；也可以让我换个方案，只改 `src/http/client.ts` 里的重试逻辑。"
        },
        diff: {
          path: "src/auth/session.ts",
          added: 5,
          removed: 2,
          lines: [
            { line: 40, sign: " ", text: "export async function openSession(url: string) {" },
            { line: 41, sign: "-", text: "  const controller = new AbortController();" },
            { line: 42, sign: "-", text: "  const timer = setTimeout(() => controller.abort(), 8_000);" },
            { line: 41, sign: "+", text: "  return retry(async () => {" },
            { line: 42, sign: "+", text: "    const controller = new AbortController();" },
            { line: 43, sign: "+", text: "    const timer = setTimeout(() => controller.abort(), 8_000);" },
            { line: 44, sign: "+", text: "    try { return await request(url, { signal: controller.signal }); }" },
            { line: 45, sign: "+", text: "    finally { clearTimeout(timer); }" },
            { line: 46, sign: " ", text: "  }, 3);" },
            { line: 47, sign: " ", text: "}" }
          ]
        }
      },
      {
        kind: "tool",
        name: "Bash",
        summary: "pnpm test -- auth",
        durationLabel: "6.8 秒",
        command: {
          text: "pnpm test -- auth",
          output: [
            "auth/session.test.ts  ✓ 重试时重新创建 AbortController (128ms)",
            "auth/session.test.ts  ✓ 超时后清理定时器 (41ms)",
            "",
            "2 passed, 0 failed"
          ]
        }
      },
      {
        kind: "assistant",
        text: "改完了，两个测试都过。原因是重试共用了同一个已 abort 的 signal；现在每次重试各自建 controller，并在 `finally` 里清定时器，避免定时器泄漏。测试文件按你说的没动。"
      }
    ]
  },
  {
    id: "explore",
    title: "了解陌生项目",
    permissionMode: "只读",
    usage: "预置示例 · 已完成",
    steps: [
      { kind: "user", text: "这个项目我第一次接手，先了解入口和目录结构，别修改文件。" },
      {
        kind: "reasoning",
        label: "阅读项目背景",
        text: "在只读模式下查看项目说明和入口，先把职责与依赖关系整理清楚。"
      },
      {
        kind: "tool",
        name: "列出文件",
        summary: ".",
        durationLabel: "0.1 秒",
        payload: ["src/routes/  src/services/  src/storage/", "tests/  docs/", "", "示例项目目录"]
      },
      {
        kind: "tool",
        name: "读取文件",
        summary: "README.md",
        durationLabel: "0.2 秒",
        payload: ["# Sample Project", "", "请求从 routes 进入，由 services 处理业务，再通过 storage 访问本地数据。"]
      },
      {
        kind: "assistant",
        text: "项目有三层：routes 接收请求，services 处理业务，storage 负责数据。建议先从一条公开接口跟进完整调用，再阅读它的测试。\n\n这次只做了读取，没有修改文件。"
      }
    ]
  },
  {
    id: "risky",
    title: "清理构建产物",
    permissionMode: "每次询问",
    usage: "预置示例 · 已完成",
    steps: [
      { kind: "user", text: "磁盘满了，把构建产物清一清。" },
      {
        kind: "tool",
        name: "Bash",
        summary: "du -sh dist out release",
        durationLabel: "0.9 秒",
        command: { text: "du -sh dist out release", output: ["1.2G\tdist", "864M\tout", "3.4G\trelease"] }
      },
      {
        kind: "assistant",
        text: "这三个目录一共 5.4G，都是可以重新构建的产物。删除不可逆，需要你确认。"
      },
      {
        kind: "tool",
        name: "Bash",
        summary: "rm -rf dist out release",
        durationLabel: "1.4 秒",
        permission: {
          title: "执行命令",
          details: "Biny 想要在工作区执行一条会删除文件的命令。",
          target: "/Users/you/projects/sample-project",
          preview: "rm -rf dist out release",
          risk: "high",
          riskLabel: "高风险",
          requireFullYes: true,
          deniedReply:
            "没执行。要更稳的话，我可以改成只删 `release/`，或者先 `mv` 到临时目录、确认没问题再删——你说了算。"
        },
        command: {
          text: "rm -rf dist out release",
          output: ["已删除 dist/ out/ release/", "磁盘可用空间 12G → 17.4G"]
        }
      },
      {
        kind: "assistant",
        text: "清完了，释放 5.4G。这三个目录都能用 `pnpm build` 和 `pnpm desktop:dist` 重新生成，源码和本机会话数据没有动。"
      }
    ]
  }
];

export const zh = {
  meta: {
    localeLabel: "简体中文"
  },
  hero: {
    eyebrow: "本地优先 · 记忆优先",
    title: "与你一起工作的\n本地 AI Agent",
    subtitle: "Biny 把对话、记忆和工具带进你的项目。在桌面或终端里继续工作，连接你选择的模型，按你的权限执行任务。",
    primaryCta: "获取 Biny",
    secondaryCta: "开始使用",
    platformNote: "macOS Desktop · TUI / CLI · 本地运行"
  },
  features: {
    eyebrow: "为日常工作准备",
    title: "对话之外，继续把事情做完",
    subtitle: "从项目背景到每次工具操作，让上下文和工作过程都有迹可循。",
    illustrationNote: "功能示意 · 内容为预置示例",
    items: [
      {
        visual: "memory" as const,
        label: "记忆与上下文",
        title: "不必每次\n都从头说起",
        body: "项目背景、已有偏好和会话历史，可以成为后续任务的上下文。会话与记忆保存在本机，你可以查看、检索和管理，让协作从上一次的工作继续。",
        link: "了解记忆如何工作",
        doc: "memory"
      },
      {
        visual: "permission" as const,
        label: "工具与权限",
        title: "看见过程，\n掌握操作范围",
        body: "读取文件、搜索内容、修改代码和执行命令，都能在会话里查看过程与结果。根据项目需要选择权限模式，在需要审批时确认或拒绝操作。",
        link: "了解工具与权限",
        doc: "tools"
      },
      {
        visual: "terminal" as const,
        label: "Desktop · TUI · CLI",
        title: "在你习惯的\n界面里工作",
        body: "桌面端把项目、会话与设置放在一个窗口；终端保留键盘驱动的工作方式。交互式入口共用本机运行时，也可以通过 CLI 执行一次性任务。",
        link: "了解会话与工作区",
        doc: "sessions"
      },
      {
        visual: "extensions" as const,
        label: "MCP · Skills · Plugins",
        title: "把自己的工具，\n接进工作流",
        body: "连接 MCP 服务，按需加载 Skills，或通过本地插件补充能力。把项目里的方法和外部工具交给 Biny 使用，扩展操作仍受工作区与权限策略约束。",
        link: "了解扩展能力",
        doc: "extensions"
      }
    ],
    illustrations: {
      memory: {
        title: "本地记忆",
        scope: "跨会话使用",
        notes: [
          { title: "周报偏好", body: "中文，先写结论，再补充依据。" },
          { title: "项目约定", body: "修改前阅读说明，保留已有工作。" },
          { title: "图表格式", body: "纵轴从 0 开始，附上数据来源。" }
        ],
        recalled: "召回相关上下文",
        message: "按之前的约定，先把本周变化整理成中文要点。"
      },
      permission: {
        title: "修改文件",
        diffLabel: "示例代码变更",
        request: "确认这次修改",
        description: "查看目标文件与变更，再决定是否允许。",
        deny: "拒绝",
        allow: "允许一次"
      },
      terminal: {
        title: "Terminal",
        workspace: "sample-project",
        prompt: "帮我了解这个项目的入口。",
        answer: "项目说明已读完。接下来查看入口与目录结构。",
        permission: "只读",
        status: "等待输入"
      },
      extensions: {
        workspace: "你的工作区",
        items: [
          { name: "MCP", icon: "plug" as const, description: "连接外部工具与资源" },
          { name: "Skills", icon: "file" as const, description: "按需加载项目里的工作方法" },
          { name: "Plugins", icon: "layers" as const, description: "组合本地工具与能力" }
        ],
        note: "遵循工作区与权限策略"
      }
    }
  },
  providers: {
    eyebrow: "模型由你选择",
    title: "连接你熟悉的模型服务",
    subtitle: "使用云端 Provider、兼容接口或本地模型，按任务选择合适的模型与配置。",
    listLabel: "支持的模型服务与接口",
    items: [
      { name: "OpenAI", mark: "O" },
      { name: "Anthropic", mark: "A" },
      { name: "Gemini", mark: "G" },
      { name: "DeepSeek", mark: "D" },
      { name: "Kimi", mark: "K" },
      { name: "Qwen", mark: "Q" },
      { name: "Ollama", mark: "L" },
      { name: "兼容 API", mark: "{}" }
    ],
    link: "查看模型配置指南"
  },
  demo: {
    eyebrow: "交互演示",
    title: "从一句话，到每一步",
    subtitle: "切换示例会话，展开工具结果，试着确认或拒绝一次操作。",
    hint: "网页演示使用预置场景，不连接模型，也不读取或修改你的文件。",
    window: {
      projectName: "sample-project"
    },
    controls: {
      replay: "重播",
      skip: "跳到结尾",
      playing: "播放中",
      done: "已结束",
      waiting: "等待你的确认"
    },
    permission: {
      inputPlaceholder: "输入 yes",
      deny: "拒绝",
      always: "始终允许同类操作",
      once: "允许一次",
      approved: "已允许",
      denied: "已拒绝"
    },
    sections: {
      result: "结果",
      command: "命令",
      output: "输出",
      change: "变更",
      duration: "时长"
    }
  },
  faq: {
    eyebrow: "常见问题",
    title: "开始之前，\n你可能想知道",
    subtitle: "安装、模型、数据与权限，先从这些问题了解 Biny。",
    docsLink: "查看完整文档",
    items: [
      {
        q: "Biny 是怎样工作的？",
        a: "Biny 是本地优先、记忆优先的开发协作 Agent。它在你的项目里结合上下文与模型完成任务，提供 macOS 桌面端、TUI 和 CLI；会话、工具过程与记忆保存在本机。"
      },
      {
        q: "我的数据会发到哪里？",
        a: "会话与记忆在本机保存。模型请求会直接发送到你配置的 Provider，任务相关的消息、文件内容与工具结果可能成为请求的一部分。云端服务的数据处理规则由对应 Provider 决定；使用本地模型时，也需要确认其他扩展工具的网络行为。"
      },
      {
        q: "需要使用哪一家模型？",
        a: "可以自行选择。Biny 支持多家模型 Provider、OpenAI-compatible 等兼容接口，以及 Ollama 等本地模型。可用能力取决于模型、服务商与配置，具体接入方式见模型文档。"
      },
      {
        q: "怎样控制文件修改和命令执行？",
        a: "工具操作经过权限策略。你可以选择只读、每次询问、自动允许安全修改或完全访问；完全访问会跳过常规审批，明确禁止的路径仍会被拦截。需要审批时，可以查看目标与操作内容，再决定是否允许。"
      },
      {
        q: "Biny 是免费的吗？",
        a: "Biny 的源码可以在项目仓库查看。使用云端模型时，费用由你配置的服务商决定；本地模型的运行也需要相应的设备资源。"
      },
      {
        q: "现在可以在哪些平台使用？",
        a: "桌面端面向 macOS，CLI 与 TUI 通过 Node.js 运行，当前开发与验证主要在 macOS 上进行。安装方式与可下载产物以安装页为准，也可以从源码启动。"
      }
    ]
  },
  cta: {
    title: "从你的下一个项目开始",
    subtitle: "打开工作区，连接模型，把第一件事交给 Biny。",
    primary: "获取 Biny",
    secondary: "阅读快速开始",
    note: "本地运行 · 模型自选 · 公开源码"
  },
  common: {
    backHome: "返回首页",
    notFoundTitle: "页面未找到",
    themeToggle: "切换主题",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单"
  },
  demoScenarios: scenarios
};

export type Copy = typeof zh;
