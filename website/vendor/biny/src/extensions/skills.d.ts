import { type SkillMetadata } from "./skillDocument.js";
import type { Tool } from "../tools/types.js";
import { type SkillRootSource } from "./skillRoots.js";
import type { SkillRef } from "./skillTypes.js";
import type { CapabilitySelectionValue } from "../agent/capabilitySelection.js";
export type SkillScope = "builtin" | "project" | "global";
export interface SkillDefinition extends SkillMetadata {
    ref: SkillRef;
    id: string;
    name: string;
    description: string;
    /** Display path: project skills are workspace-relative, global skills use "~/". */
    path: string;
    /** Canonical absolute path of the skill markdown file. */
    filePath: string;
    /** Root used for file validation during scanning and invocation. */
    rootPath: string;
    scope: SkillScope;
    source: SkillRootSource;
    /** `always-inject: true` 的 skill 不依赖能力分析，名称和简介每轮进入系统提示。 */
    alwaysInject: boolean;
}
export interface SkillBundle {
    skills: SkillDefinition[];
    paths: string[];
    /** 与目录快照绑定的正文，不进入可用技能列表。 */
    instructions: Record<string, string>;
    prompt: string;
    warnings: string[];
    conflicts: SkillConflict[];
    /** 阻止部分 Skill 能力可用的加载问题；重复项等诊断不应放入这里。 */
    errors: string[];
}
export interface SkillConflict {
    name: string;
    winner: SkillDefinition;
    shadowed: SkillDefinition[];
}
export interface LoadSkillsOptions {
    workspaceRoot: string;
    /** Workspace-relative paths from extensions.skills. */
    projectPaths: string[];
    /** Isolated global skill directory; omitted means official, legacy, and admin roots. */
    globalRoot?: string;
    globalDefaults?: Readonly<Record<string, boolean>>;
    projectOverrides?: Readonly<Record<string, boolean>>;
}
export declare function loadSkills(options: LoadSkillsOptions): Promise<SkillBundle>;
export declare function skillPromptForSelection(bundle: SkillBundle, selection?: CapabilitySelectionValue): Promise<string>;
export declare function skillPathsForSelection(bundle: SkillBundle, selection?: CapabilitySelectionValue): string[];
type SkillBundleSource = SkillBundle | (() => SkillBundle);
export declare function createSkillTool(source: SkillBundleSource, refresh?: (force?: boolean) => Promise<void>): Tool;
/** 第三级渐进式披露：只在 SKILL.md 明确需要时读取 references/scripts/assets。 */
export declare function createSkillResourceTool(source: SkillBundleSource): Tool;
export declare function rankSkillsByQuery(skills: SkillDefinition[], query: string, limit: number): SkillDefinition[];
export {};
