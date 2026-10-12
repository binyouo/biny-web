import type { ContentBlock } from "@agentclientprotocol/sdk";
import type { AgentSessionEvent, AgentPermissionRequest, AgentPermissionResult } from "../agent/types.js";
import type { PermissionManager } from "../permission/PermissionManager.js";
import { AcpClient } from "./client.js";
export declare function runAcpTurn(client: AcpClient, options: {
    content: ContentBlock[];
    model: string;
    signal?: AbortSignal;
    workspaceRoot: string;
    sessionId: string;
    permissionManager?: PermissionManager;
    confirmPermission?: (request: AgentPermissionRequest) => Promise<AgentPermissionResult>;
}): AsyncGenerator<AgentSessionEvent>;
