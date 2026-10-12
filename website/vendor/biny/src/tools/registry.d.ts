import type { BrowserAutomationEndpoint } from "./browser.js";
/**
 * 工具注册表模块。
 *
 * 内置文件、搜索和命令工具会在这里集中注册，agent loop 通过名称查找并执行工具。注册表也保留
 * 工具来源信息让内置、MCP、skill、plugin 和 subagent 工具复用同一调用路径。
 */
import type { ToolDefinition } from "./definition.js";
import type { JsonSchema } from "./schema.js";
import type { SandboxConfig, WebCookiesConfig, WebFetchConfig, WebSearchConfig } from "../config/schema.js";
import type { Tool, ToolContext, ToolExposure, ToolNamespace, ToolRisk, ToolSource } from "./types.js";
import type { ToolModelSelectionState } from "../llm/toolModelRequest.js";
import type { ToolModelCandidate } from "../llm/toolModel.js";
import type { ManagedProcessService } from "../runtime/ManagedProcessService.js";
/** Explicit host-owned read contracts, never inferred from extension metadata. */
export type HostReadQuery = "TaskStatus" | "PlanStatus" | "skill_lookup" | "BashOutput" | "read_skill_resource";
/** Shared by discovery and execution. Serialized/tool-supplied hints grant no authority. */
export declare function isCodeModeReadTool(entry: RegisteredTool): boolean;
export declare function isCodeModeTool(entry: RegisteredTool): boolean;
export interface RegisteredTool {
    readonly source: ToolSource;
    readonly tool: Tool;
}
export interface ToolCatalogDefinition extends ToolDefinition {
    outputSchema?: JsonSchema;
    source: ToolSource;
    risk?: ToolRisk;
    exposure: ToolExposure;
    namespace?: ToolNamespace;
}
export declare class ToolRegistry {
    private readonly tools;
    register(tool: Tool, source?: ToolSource): void;
    /** Host assembly only. Plugin/MCP/user registration never calls this route. */
    registerHostReadQuery(tool: Tool, identity: HostReadQuery): void;
    registerBuiltinTool(tool: Tool): void;
    registerUserTool(tool: Tool): void;
    registerMcpTool(tool: Tool): void;
    registerPluginTool(tool: Tool): void;
    registerSubagentTool(tool: Tool): void;
    /** MCP tools/list_changed 之类的动态刷新需要先移除旧注册；对进行中的调用无影响。 */
    unregister(name: string): boolean;
    get<TArgs = unknown, TResult = unknown>(name: string): Tool<TArgs, TResult>;
    list(): Tool[];
    listDefinitions(): ToolDefinition[];
    listCatalogDefinitions(): ToolCatalogDefinition[];
    listEntries(): RegisteredTool[];
}
export declare function createToolRegistry(context: ToolContext, webSearchConfig?: WebSearchConfig, managedProcessService?: ManagedProcessService, webFetchConfig?: WebFetchConfig, sandboxConfig?: SandboxConfig, webCookiesConfig?: WebCookiesConfig, getToolSearchModels?: () => readonly ToolModelCandidate[], browser?: BrowserAutomationEndpoint, getToolModelSelectionState?: () => ToolModelSelectionState): ToolRegistry;
