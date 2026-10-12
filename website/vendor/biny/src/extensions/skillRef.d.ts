export type SkillRefScope = "builtin" | "global" | "project";
export interface SkillRefInput {
    scope: SkillRefScope;
    name: string;
    projectRoot?: string;
    source?: string;
}
export declare function createSkillRef(input: SkillRefInput): string;
export declare function createSkillId(ref: string): string;
/** 配置里按项目保存 Skill 覆盖时使用的稳定键，不暴露绝对路径。 */
export declare function createProjectSkillKey(projectRoot: string): string;
export declare function normalizeSkillName(name: string): string;
