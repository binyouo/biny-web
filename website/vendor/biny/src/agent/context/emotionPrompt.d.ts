/**
 * 情绪状态的 prompt 投影。
 *
 * 情绪与疲劳独立成块，情绪块先于参考资料。
 * 情绪只影响表达层，不得被当作任务目标、权限或安全规则的来源。
 */
import { type FatigueStatus } from "./fatigue.js";
import type { BlendedEmotion } from "./emotionTypes.js";
export declare function renderEmotionPrompt(blended: BlendedEmotion, fatigue?: FatigueStatus): string;
