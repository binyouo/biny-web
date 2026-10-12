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
    /** Root the file must stay inside when it is re-read at invoke time. */
    rootPath: string;
    scope: SkillScope;
    source: SkillRootSource;
}
export interface SkillBundle {
    skills: SkillDefinition[];
    paths: string[];
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
/** 能力分析完成后只读取选中 Skill 的正文；自动装配不等同于一次 Skill 工具调用。 */
export declare function skillPromptForSelection(bundle: SkillBundle, selection?: CapabilitySelectionValue): Promise<string>;
export declare function skillPathsForSelection(bundle: SkillBundle, selection?: CapabilitySelectionValue): string[];
type SkillBundleSource = SkillBundle | (() => SkillBundle);
export declare function createSkillTool(source: SkillBundleSource): Tool;
/** 第三级渐进式披露：只在 SKILL.md 明确需要时读取 references/scripts/assets。 */
export declare function createSkillResourceTool(source: SkillBundleSource): Tool;
/**
 * 本地技能搜索（介于元数据清单与 Skill 工具之间的发现层）。
 *
 * 清单只含本回合激活的技能；模型怀疑还有其他已装技能时用关键词在这里检索，
 * 纯本地打分、不联网也不调辅助模型，命中后仍经 Skill 工具加载全文。
 */
export declare function createSkillLookupTool(source: SkillBundleSource): Tool;
export {};
