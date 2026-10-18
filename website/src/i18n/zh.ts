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
    title: "按老规矩整理周报",
    permissionMode: "自动允许安全修改",
    usage: "预置示例 · 已完成",
    steps: [
      { kind: "user", viaComposer: true, text: "按老规矩，帮我整理这周的项目进展。" },
      { kind: "tool", name: "召回记忆", summary: "周报格式 · 项目约定", payload: ["中文，先结论后依据。", "按主题归类，五条以内。", "保留下一步，放到项目的 docs/weekly/ 目录。"] },
      { kind: "assistant", text: "记得。**中文、先写结论、五条以内**，再把下一步列清楚。我先看看这周的变化。" },
      { kind: "tool", name: "Bash", summary: "git log --since='7 days ago' --oneline", command: { text: "git log --since='7 days ago' --oneline", output: ["a31f9c2 添加订单搜索", "9e55b0e 调整报表导出格式", "41a2f77 补充接口错误提示", "7d0c441 修复窄屏列表布局"] } },
      { kind: "assistant", text: "本周完成了搜索、导出和两项体验修复。\n\n| 本周进展 | 下一步 |\n| --- | --- |\n| 订单搜索支持按编号查找 | 补充组合筛选 |\n| 报表导出格式已调整 | 核对周会使用的字段 |\n| 错误提示与窄屏布局已修复 | 检查移动端使用体验 |\n\n周报已整理到 `docs/weekly/本周进展.md`。下次继续时，可以从这三项待办开始。" },
      { kind: "tool", name: "写入文件", summary: "docs/weekly/本周进展.md", filePath: "docs/weekly/本周进展.md" }
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
  home: {
    title: "一句话，一个想法，\n剩下的交给 Biny。",
    intro: "Biny 在你自己的电脑上工作。看过的网页、聊定的偏好、跑过的命令，都留在本机，下一次开口时接得上。",
    featuresTitle: "越用，越接近你的默契。",
    featuresIntro: "从找回看过的网页，到记住聊定的偏好，再到直接操作电脑。让每一次对话，都接着上次往前走。",
    workspaceTitle: "同一个 Biny，\n两个入口。",
    workspaceIntro: "桌面端负责看与聊，终端负责改与跑。会话和记忆在本机共享，换入口不必重讲一遍。",
    startTitle: "把下一件事，交给它。",
    startIntro: "装好、连上模型，从一件具体的小事开始。",
    providersTitle: "接哪家模型，你说了算。",
    features: [
      { id: "history" as const, label: "Computer History", title: "看过的，问一句找回。", summary: "先看过一家京都旅馆，再问「刚才那家旅馆叫什么？」。Biny 找回名字和网页线索。记录覆盖不同应用，不限于某个工作区。" },
      { id: "memory" as const, label: "Memory & Sleep", title: "聊定的偏好，不用再说一遍。", summary: "示例：从不同对话中记住喜欢安静小旅馆的偏好，Sleep 合并重复记忆，几天后聊起新的旅行时再想起。" },
      { id: "markdown" as const, label: "Rich Markdown", title: "答案不止一段文字。", summary: "聊天中呈现 Mermaid、Infographic、LaTeX、表格与可播放的 Strudel 音乐。点击标签切换示例，操作聊天后暂停轮播。" },
    ],
    providers: ["OpenAI", "Anthropic", "Gemini", "DeepSeek", "Kimi", "Qwen", "Ollama", "兼容 API"]
  },
  demo: {
    title: "从一句话，到每一步",
    hint: "可交互的预置示例，不会连接模型或改动你的文件。",
    controls: {
      replay: "重播",
      skip: "快进",
      playing: "播放中",
      done: "已结束",
      waiting: "等待你的确认"
    }
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
