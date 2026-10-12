import { type McpServer, type RequestPermissionRequest, type RequestPermissionResponse, type SessionNotification, type ContentBlock } from "@agentclientprotocol/sdk";
import type { AcpConfig, AgentConfig } from "../config/schema.js";
export interface AcpSessionInfo {
    sessionId: string;
    models: Array<{
        id: string;
        name: string;
    }>;
    modes: Array<{
        id: string;
        name: string;
    }>;
    currentModel?: string;
    currentMode?: string;
    modelConfigId?: string;
    modeConfigId?: string;
}
export interface AcpSessionBinding {
    version: 1;
    fingerprint: string;
    sessionId: string;
}
export declare function acpMcpServers(config: AgentConfig, launch: AcpConfig, mode?: "auto" | "ask" | "read-only" | "full-access"): McpServer[];
/** 一个实例只拥有一个项目中的一个外部会话，不共享进程或自动重放请求。 */
export declare class AcpClient {
    private readonly options;
    private child?;
    private connection?;
    private info?;
    private busy;
    private turnGeneration;
    private fingerprint?;
    private stderr;
    private stderrOverflow;
    private outputBytes;
    private redactions;
    private onUpdate?;
    private onPermission?;
    private turnSignal?;
    constructor(options: {
        launch: AcpConfig;
        cwd: string;
        mcpServers?: McpServer[];
        bindingFile?: string;
        requireBinding?: boolean;
        timeoutMs?: number;
    });
    connect(signal?: AbortSignal): Promise<AcpSessionInfo>;
    prompt(input: {
        content: ContentBlock[];
        model: string;
        signal?: AbortSignal;
        onUpdate(notification: SessionNotification): void;
        onPermission(request: RequestPermissionRequest): Promise<RequestPermissionResponse>;
    }): Promise<string>;
    close(): Promise<void>;
    private safeError;
    private readBinding;
    private writeBinding;
}
