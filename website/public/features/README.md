# 首页能力截图

工具调用与 Code Mode 截图于 2026-11-04 从当前 Desktop 演示生成（「换个模型接着想」展开写入与执行工具；Code Mode 场景展开 `run_script` 脚本）；联网搜索和 Computer History 使用用户于 2026-11-01 指定的截图。图片按原始宽高比展示，点击可放大。

| 文件 | 展示内容 | 尺寸 |
| --- | --- | --- |
| `code-mode.png` | Code Mode：`run_script` 脚本参数与汇总提交结果 | 1353 × 828 |
| `tool-calls.png` | 工具调用：`src/utils/sort.ts` 文件差异与 `pnpm test` 执行结果 | 1353 × 828 |
| `web-research.png` | 联网搜索：MDN 抓取记录、对比表格与来源 | 1357 × 828 |
| `computer-history.png` | Computer History：运行统计、授权与排除应用 | 759 × 683 |

窄屏（≤640px）缩略图使用下列 WebP 裁切，均取自上方 1x PNG（cwebp -q 90）；联网搜索内容为整宽表格，不裁切。修改对应 PNG 时同步重新裁切。

| 文件 | 来源与区域 |
| --- | --- |
| `code-mode-mobile.webp` | `code-mode.png` x=258 y=110 w=545 h=660 |
| `tool-calls-mobile.webp` | `tool-calls.png` x=258 y=52 w=545 h=660 |
| `computer-history-mobile.webp` | `computer-history.png` x=20 y=10 w=420 h=470 |

网页查询截图保留了原有工具状态，其中一项抓取显示异常，不将其描述为全部抓取成功。

隐私脱敏改为内联的 `PrivacyStory` 分步演示（`src/demo/privacyStory.ts` 提供数据），不再使用截图或独立页面。
