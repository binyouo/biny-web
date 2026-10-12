import type { AgentMessage, AgentModel } from "../agent/core/types.js";
import { type NativeTextGenerationOptions, type NativeTextGenerationResult } from "./nativeJson.js";
import type { ToolModelCandidate } from "./toolModel.js";
/** 当前 Runtime 的辅助模型选择状态；连接标识不包含明文凭据。 */
export interface ToolModelSelectionState {
    unavailableConnections: Map<string, {
        retryAt: number;
        failures: number;
    }>;
    preferredCandidate?: string;
}
export interface ToolModelAttempt {
    provider: string;
    providerAlias?: string;
    modelId: string;
    status: "failed" | "completed";
}
export declare class ToolModelCandidatesExhaustedError extends Error {
    readonly attempts: readonly ToolModelAttempt[];
    readonly retryable = false;
    constructor(attempts: readonly ToolModelAttempt[], cause?: unknown);
}
/** 只对连接的永久失败切换账户；型号权限拒绝仍可尝试同连接的其他型号。 */
export declare function toolModelFailureScope(error: unknown): "connection" | "model" | undefined;
export declare function generateToolModelText(candidates: readonly ToolModelCandidate[], messages: AgentMessage[], options?: NativeTextGenerationOptions & {
    selectionState?: ToolModelSelectionState;
}): Promise<NativeTextGenerationResult & {
    model: AgentModel;
    attempts: readonly ToolModelAttempt[];
}>;
