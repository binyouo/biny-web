import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { type Prompt } from "@modelcontextprotocol/sdk/types.js";
import type { AgentConfig } from "../config/schema.js";
import type { ToolRegistry } from "../tools/registry.js";
import { type Tool, type ToolExposure } from "../tools/types.js";
export type McpTransportKind = "stdio" | "http" | "in-process";
export interface McpServerStatus {
    name: string;
    /** stdio 显示 command，http 显示 url。 */
    command: string;
    transport: McpTransportKind;
    enabled: boolean;
    connected: boolean;
    /** 正在建立首连或重连；这不是连接失败。 */
    connecting?: boolean;
    /** 连接未完成时可用于发现的目录；不代表工具可以直接执行。 */
    catalogCached?: boolean;
    toolNames: string[];
    promptNames: string[];
    hasResources: boolean;
    instructions?: string;
    lastError?: string;
    authRequired?: boolean;
}
export interface McpServerDetails {
    status: McpServerStatus;
    resources: Array<Record<string, unknown>>;
}
interface ListedMcpTool {
    name: string;
    description?: string;
    inputSchema: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
    annotations?: {
        readOnlyHint?: boolean;
        destructiveHint?: boolean;
    };
}
/** 由 Runtime Host 持有，不写磁盘；只复用已完成握手的工具元数据。 */
export declare class McpToolCatalogCache {
    private readonly entries;
    get(key: string): {
        tools: ListedMcpTool[];
        instructions?: string;
    } | undefined;
    set(key: string, tools: ListedMcpTool[], instructions?: string): void;
    /** 失败只撤回本次尝试读到的条目，不能删除其他作用域后来发布的目录。 */
    captureInvalidation(key: string): () => void;
    delete(key: string): void;
    clear(): void;
}
export declare class McpToolHost {
    private readonly catalogCache;
    private readonly servers;
    private readonly openingClients;
    private registry?;
    private workspaceRoot;
    private closing;
    private readonly listeners;
    private readonly genericTools;
    constructor(catalogCache?: McpToolCatalogCache);
    attachLocalServer(name: string, identity: string, tools: Tool[], open: () => Promise<{
        transport: Transport;
        close: () => Promise<void>;
    }>): Promise<void>;
    detachLocalServer(name: string): Promise<void>;
    connectConfiguredServers(workspaceRoot: string, config: AgentConfig, registry?: ToolRegistry): Promise<void>;
    /** 为不同 session 创建指向同一 MCP 连接的工具代理。 */
    createTools(): Tool[];
    cachedGenericTools(kind: "resources" | "prompts", create: () => Tool[]): Tool[];
    subscribe(listener: () => void): () => void;
    listServers(): McpServerStatus[];
    hasEnabledServers(): boolean;
    listExposedServers(): McpServerStatus[];
    genericToolExposure(): ToolExposure;
    assertServerExposed(serverName: string): void;
    /** 收集各服务器 initialize 返回的 instructions，供 system prompt 注入。 */
    instructionsPrompt(): string;
    /** 手动重连（/mcp reconnect）。失败不抛出，结果反映在状态里。 */
    reconnectServer(serverName: string): Promise<McpServerStatus>;
    /** 调用前可以重连；派发后的断线无法证明副作用未发生，不能自动重放。 */
    callServerTool(serverName: string, toolName: string, args: Record<string, unknown>, signal?: AbortSignal, rawResult?: boolean, onDispatched?: () => void, metadata?: Record<string, unknown>, expectedLocalIdentity?: string, expectedDefinition?: string): Promise<unknown>;
    listServerResources(serverName?: string, signal?: AbortSignal): Promise<Array<Record<string, unknown>>>;
    readServerResource(serverName: string, uri: string, signal?: AbortSignal): Promise<unknown>;
    listServerPrompts(serverName?: string, signal?: AbortSignal): Promise<Array<{
        server: string;
        prompts?: Prompt[];
        error?: string;
    }>>;
    getServerPrompt(serverName: string, name: string, args?: Record<string, string>, signal?: AbortSignal): Promise<unknown>;
    describeServer(serverName: string): Promise<McpServerDetails>;
    close(): Promise<void>;
    private requireServer;
    private requestWithCredentials;
    private requestOptions;
    /** 串行化的重连：并发调用共享同一次连接尝试。 */
    private reconnect;
    private startServer;
    /** tools/list_changed 到达后重新拉取工具并原子替换注册。 */
    private refreshServerTools;
    private registerServerTools;
    private serverToolProxy;
    private emitChange;
    private listPromptNames;
    private listAllTools;
    private openClient;
    private tryConnect;
}
/** 通用 resources 工具：列出并读取任意已连接 MCP 服务器暴露的资源。 */
export declare function createMcpResourceTools(host: McpToolHost): Tool[];
/** 展开配置值里的 ${VAR} / ${VAR:-default} 环境变量引用。 */
export declare function expandEnvTemplate(value: string): string;
export {};
