export type SkillRootEngine = "biny" | "codex" | "claude" | "pi";
export type SkillRootSource = "biny" | "agents" | "builtin";
export type SkillRootScope = "builtin" | "global" | "project";
export interface SkillRootConvention {
    relativePath: string;
    engines: readonly SkillRootEngine[];
    source: SkillRootSource;
    /** 全局 `.agents/skills` 是用户显式管理的入口，可保留指向其他 Skill 根的软链。 */
    allowExternalSymlinks?: boolean;
}
export declare const PROJECT_SKILL_ROOT_CONVENTIONS: readonly SkillRootConvention[];
export declare const GLOBAL_SKILL_ROOT_CONVENTIONS: readonly SkillRootConvention[];
export declare const DEFAULT_PROJECT_SKILL_PATHS: string[];
/**
 * 返回 Skill 根的跨 scope 优先级；数值越小越优先。
 *
 * 项目 Skill 必须覆盖全局 Skill。全局配置目录不是 home 下的
 * `.biny/skills`，因此需要先按实际解析后的路径识别它。
 * 省略 homeDir 时尊重环境配置；显式传入时与 defaultGlobalSkillRoots 一样保持隔离。
 */
export declare function skillRootPrecedence(scope: SkillRootScope, configuredPath: string, homeDir?: string): number;
export declare function defaultGlobalSkillRoots(homeDir?: string): string[];
