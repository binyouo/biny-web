# 首页能力截图

工具调用与 Code Mode 截图于 2026-11-04 从当前 Desktop 演示生成（「换个模型接着想」展开写入与执行工具；Code Mode 场景展开 `run_script` 脚本）；联网搜索和 Computer History 使用用户于 2026-11-01 指定的截图。图片按原始宽高比展示，点击可放大。

| 文件 | 展示内容 | 尺寸 |
| --- | --- | --- |
| `code-mode.png` | Code Mode：`run_script` 脚本参数与汇总提交结果 | 1353 × 828 |
| `tool-calls.png` | 工具调用：`src/utils/sort.ts` 文件差异与 `pnpm test` 执行结果 | 1353 × 828 |
| `web-research.png` | 联网搜索：MDN 抓取记录、对比表格与来源 | 1357 × 828 |
| `computer-history.png` | Computer History：运行统计、授权与排除应用 | 759 × 683 |

网页查询截图保留了原有工具状态，其中一项抓取显示异常，不将其描述为全部抓取成功。

隐私脱敏由 `PrivacyDemo.tsx` 嵌入固定高度的 `privacy-demo.html`，复用真实面板和内置虚构邮箱请求，支持时间范围、提供商、会话、类型筛选和请求前后对照；不连接 Desktop 或模型服务。来源说明见 `../../src/demo/privacy/README.md`。
