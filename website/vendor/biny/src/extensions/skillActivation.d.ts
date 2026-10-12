/** Skill 开关的纯解析逻辑，供配置、catalog 和 runtime 共用。 */
import type { SkillRef } from "./skillTypes.js";
export type SkillActivationSource = "default" | "global" | "project";
export interface SkillActivationInput {
    ref: SkillRef;
    globalDefaults?: Readonly<Record<string, boolean>>;
    projectOverrides?: Readonly<Record<string, boolean>>;
}
export interface SkillActivationState {
    enabled: boolean;
    globalEnabled: boolean;
    projectOverride: boolean | undefined;
    source: SkillActivationSource;
}
export declare function resolveSkillActivation(input: SkillActivationInput): SkillActivationState;
export declare function setSkillActivation(values: Readonly<Record<string, boolean>>, ref: SkillRef, enabled: boolean | undefined): Record<string, boolean>;
export declare function effectiveSkillRefs(refs: readonly SkillRef[], globalDefaults?: Readonly<Record<string, boolean>>, projectOverrides?: Readonly<Record<string, boolean>>): SkillRef[];
