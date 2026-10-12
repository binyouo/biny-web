export type SubagentDefinitionScope = "project" | "global";
export interface SubagentDefinition {
    name: string;
    description: string;
    /** 定义正文，作为子代理的附加 system prompt。 */
    prompt: string;
    /** frontmatter tools 声明的工具子集；省略表示使用全局 allowedTools。 */
    tools?: string[];
    /** frontmatter model 声明的模型别名覆盖；省略时沿用 subagent 默认模型。 */
    model?: string;
    scope: SubagentDefinitionScope;
    /** 展示路径：项目定义为 workspace 相对路径，全局定义以 ~ 开头。 */
    path: string;
    filePath: string;
}
export interface LoadSubagentDefinitionsOptions {
    workspaceRoot: string;
    /** workspace 相对目录，来自 extensions.subagent.agentPaths。 */
    projectPaths: string[];
    /** 全局定义目录；默认 ~/.config/biny/agents。 */
    globalRoot?: string;
}
export declare function loadSubagentDefinitions(options: LoadSubagentDefinitionsOptions): Promise<SubagentDefinition[]>;
export declare function findSubagentDefinition(definitions: readonly SubagentDefinition[], name: string): SubagentDefinition | undefined;
/** system prompt 里的具名子代理元数据段（正文不进入主上下文，保持渐进披露）。 */
export declare function buildSubagentDefinitionsPrompt(definitions: readonly SubagentDefinition[]): string;
