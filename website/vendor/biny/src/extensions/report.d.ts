/**
 * 扩展状态汇总与文本报告。
 *
 * `/status`、`/mcp`、`/skills`、`/plugins` 输出的都是这里生成的文本。纯格式化，不去连接
 * MCP、不加载技能，状态由调用方采集后传入。
 */
import type { McpServerStatus } from "./mcp.js";
import type { SkillDefinition } from "./skills.js";
import type { SubagentDefinition } from "./agents.js";
import type { ToolSource } from "../tools/types.js";
export interface ExtensionStatus {
    mcp: McpServerStatus[];
    skills: SkillDefinition[];
    skillWarnings: string[];
    plugins: string[];
    subagent: {
        enabled: boolean;
        maxSteps?: number;
        maxOutputTokens: number;
        maxConcurrentSubagents: number;
        maxPendingSubagents: number;
        timeoutMs?: number;
        model?: string;
        maxCostUsd?: number;
        allowedTools: string[];
        agents: SubagentDefinition[];
    };
    toolScheduling: {
        maxConcurrentTools: number;
        maxQueuedToolCalls: number;
    };
    toolCounts: Record<ToolSource, number>;
}
export type ExtensionSection = "all" | "mcp" | "skills" | "plugins";
export declare function createToolCounts(entries: Array<{
    source: ToolSource;
}>): Record<ToolSource, number>;
export declare function formatExtensionReport(status: ExtensionStatus, section?: ExtensionSection): string;
/** /subagent agents 的独立列表输出（CLI 与 TUI 共用）。 */
export declare function formatSubagentAgentList(definitions: readonly SubagentDefinition[]): string;
