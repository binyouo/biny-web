import type { AgentModel } from "./core/types.js";
import type { SessionEvent } from "../session/recorder.js";
export type SkillExtractionStage = "extracting" | "saving" | "done";
export interface SkillExtractionNotice {
    stage: SkillExtractionStage;
    skillName?: string;
    skillDescription?: string;
    /** 覆盖已有同名技能时为 true。 */
    updated?: boolean;
}
export interface SkillExtractionOutcome extends SkillExtractionNotice {
    /** 落盘后的绝对路径；未落盘时为 undefined。 */
    installedPath?: string;
}
export interface SkillExtractionInput {
    /** 本回合根 user 消息的 messageId；用于从全量事件中截取本回合素材。 */
    messageId: string;
    events: readonly SessionEvent[];
    installedSkills: ReadonlyArray<{
        name: string;
        description: string;
    }>;
    model?: AgentModel;
    minToolCalls: number;
    /** 测试或嵌入宿主可注入隔离 home；正常运行时使用当前用户 home。 */
    homeDir?: string;
    onNotice?: (notice: SkillExtractionNotice) => void;
    refreshSkills?: () => Promise<void>;
}
export declare function runSkillExtraction(input: SkillExtractionInput): Promise<SkillExtractionOutcome>;
