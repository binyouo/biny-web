import { z } from "zod";
import type { AgentMessage } from "../agent/core/types.js";
import type { ToolModelCandidate } from "../llm/toolModel.js";
import { type ToolModelAttempt, type ToolModelSelectionState } from "../llm/toolModelRequest.js";
import { type RegisteredTool } from "./registry.js";
import type { Tool, ToolSource } from "./types.js";
export declare const toolSearchToolName = "ToolSearch";
declare const toolSearchSchema: z.ZodObject<{
    query: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<["builtin", "mcp", "skill", "plugin", "subagent", "all"]>>;
    maxResults: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    query: string;
    type?: "all" | "mcp" | "builtin" | "subagent" | "skill" | "plugin" | undefined;
    maxResults?: number | undefined;
}, {
    query: string;
    type?: "all" | "mcp" | "builtin" | "subagent" | "skill" | "plugin" | undefined;
    maxResults?: number | undefined;
}>;
export type ToolSearchArgs = z.infer<typeof toolSearchSchema>;
export interface ToolSearchMatch {
    name: string;
    description: string;
    source: ToolSource;
    capability?: string;
}
export interface ToolSearchResult {
    status: "completed" | "failed";
    query: string;
    found: number;
    tools: ToolSearchMatch[];
    reasoning?: string;
    code?: ToolSearchErrorCode;
    error?: string;
    retryable?: boolean;
    model?: Pick<ToolModelAttempt, "provider" | "providerAlias" | "modelId">;
    modelAttempts?: readonly ToolModelAttempt[];
}
export type ToolSearchErrorCode = "mcp_discovery_timeout" | "tool_search_model_unavailable" | "tool_search_timeout" | "tool_search_invalid_response" | "tool_search_request_failed";
export declare function createToolSearchTool(getTools: () => readonly RegisteredTool[], getModels?: () => readonly ToolModelCandidate[], getSelectionState?: () => ToolModelSelectionState): Tool<ToolSearchArgs, ToolSearchResult>;
/** 点名只匹配完整、大小写一致的注册名，避免把近似名称当成工具身份。 */
export declare function explicitToolNames(query: string, tools: readonly {
    name: string;
}[]): string[];
export declare function toolSearchResultNames(value: unknown): string[];
export declare function isToolSearchTerminalFailure(value: unknown): value is ToolSearchResult & {
    status: "failed";
    retryable: false;
};
/** 从对话上下文恢复成功发现的精确工具名；实际白名单仍由当前注册表校验。 */
export declare function toolSearchResultNamesFromMessages(messages: readonly AgentMessage[]): string[];
export {};
