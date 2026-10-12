import type { AgentConfig } from "../../config/schema.js";
import { McpToolCatalogCache, McpToolHost, type McpServerStatus } from "../../extensions/mcp.js";
import { type SkillBundle, type SkillDefinition } from "../../extensions/skills.js";
import type { Tool } from "../../tools/types.js";
export type RuntimeResourceState = "loading" | "ready" | "degraded";
export interface RuntimeResourceSnapshot {
    revision: number;
    state: RuntimeResourceState;
    mcp: {
        servers: McpServerStatus[];
        pending: boolean;
    };
    skills: {
        skills: SkillDefinition[];
        warnings: string[];
    };
}
/** 高频运行快照只需要就绪状态；能力目录通过 skills / mcp 查询读取。 */
export type RuntimeResourceReadiness = Pick<RuntimeResourceSnapshot, "revision" | "state">;
export interface McpDiscoveryReadiness {
    servers: McpServerStatus[];
    pending: string[];
    timedOut: boolean;
}
export declare class RuntimeHostResourceScope {
    readonly workspaceRoot: string;
    private readonly config;
    private readonly listeners;
    private readonly mcpHost;
    private skillBundle;
    private skillsReady;
    private state;
    private revision;
    private mcpPending;
    private baselinePromise;
    private skillRefreshPromise;
    private skillsLoadedAt;
    private closePromise;
    private readonly discoveryClosed;
    private references;
    constructor(workspaceRoot: string, config: AgentConfig, catalogCache?: McpToolCatalogCache);
    get mcp(): McpToolHost;
    get skills(): SkillBundle;
    retain(): void;
    release(): boolean;
    start(): Promise<void>;
    snapshot(): RuntimeResourceSnapshot;
    readiness(): RuntimeResourceReadiness;
    subscribe(listener: (snapshot: RuntimeResourceSnapshot) => void): () => void;
    createTools(): Tool[];
    waitForMcpDiscovery(input?: {
        query?: string;
        signal?: AbortSignal;
    }): Promise<McpDiscoveryReadiness>;
    createResourceTools(): Tool[];
    refreshSkills(force?: boolean): Promise<void>;
    close(): Promise<void>;
    private loadSkillBundle;
    private startMcp;
    private isDegraded;
    private refreshState;
    private publish;
}
export declare class RuntimeHostResourceRegistry {
    private readonly scopes;
    private readonly catalogCache;
    acquire(workspaceRoot: string, config: AgentConfig): RuntimeHostResourceScope;
    release(scope: RuntimeHostResourceScope): Promise<void>;
    close(): Promise<void>;
}
