/**
 * 用户可选的 Soul 提示词投影。
 *
 * 默认人格属于固定 system prompt；只有存在用户 SOUL.md 时才生成这个区块，
 * 默认人格与用户 Soul 二选一，避免两份人格同时生效。
 */
export type SoulPromptSource = "builtin" | "user";
/**
 * 把用户 Soul 投影成系统提示区块。
 *
 * SOUL.md 注入方式：wrapper 只声明身份职责与演化规则；
 * 不在此重复"不能改权限"式边界，各层逐条免责声明的做法已废弃。
 */
export declare function renderSoulPrompt(content: string, source: SoulPromptSource): string;
