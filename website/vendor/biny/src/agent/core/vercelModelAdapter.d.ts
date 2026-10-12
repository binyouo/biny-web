/**
 * 把 Biny 仍在使用的 AgentModel 协议适配成 Vercel LanguageModelV4。
 *
 * 主 Agent 的 provider runtime 直接提供 Vercel model 时不会经过这里；这个边界
 * 只服务显式注入的测试/本地模型，避免把旧 provider 协议带回正常链路。
 */
import { type LanguageModelCallEndEvent, type ModelMessage, type ToolSet } from "ai";
import type { LanguageModelV4, LanguageModelV4CallOptions } from "@ai-sdk/provider";
import { type PromptShapeDiagnostic } from "../../llm/promptCache.js";
import type { AgentAssistantMessage, AgentMessage, AgentUsage, ModelStreamOptions } from "./types.js";
import type { VercelLoopState } from "./vercelAgentLoop.js";
export interface DirectCallDiagnostics {
    callId: string;
    startedAtMs: number;
    promptShape?: PromptShapeDiagnostic;
    promptShapeDurationMs?: number;
    promptShapeStatus?: "full" | "skipped_due_to_budget";
    promptShapeBudgetExceeded?: boolean;
}
export declare function createLanguageModel(state: VercelLoopState): LanguageModelV4;
export declare function modelMessages(state: VercelLoopState): Promise<ModelMessage[]>;
export declare function recordDirectModelRequest(state: VercelLoopState, event: LanguageModelCallEndEvent<ToolSet>): Promise<void>;
/** 未收到成功结束回调的请求也必须结算；清空后再通知，避免 error/abort/finally 重复记账。 */
export declare function recordDirectModelFailure(state: VercelLoopState, error: unknown): Promise<void>;
export declare function beginDirectModelRequest(state: VercelLoopState, callId: string): void;
export declare function toModelMessages(messages: AgentMessage[], nativePatch?: boolean): ModelMessage[];
export declare function toVercelUsage(usage: AgentUsage | undefined): {
    inputTokens: {
        total: number | undefined;
        noCache: number | undefined;
        cacheRead: number | undefined;
        cacheWrite: number | undefined;
    };
    outputTokens: {
        total: number | undefined;
        text: number | undefined;
        reasoning: number | undefined;
    };
};
export declare function fromVercelUsage(usage: {
    inputTokens: number | undefined;
    inputTokenDetails: {
        cacheReadTokens: number | undefined;
        cacheWriteTokens: number | undefined;
    };
    outputTokens: number | undefined;
    outputTokenDetails: {
        reasoningTokens: number | undefined;
    };
    raw?: unknown;
}): AgentUsage;
export declare function toVercelFinishReason(reason: AgentAssistantMessage["stopReason"] | undefined): {
    unified: "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other";
    raw: string | undefined;
};
export declare function fromVercelFinishReason(reason: string): AgentAssistantMessage["stopReason"];
export declare function toVercelReasoning(reasoning: ModelStreamOptions["reasoning"]): LanguageModelV4CallOptions["reasoning"];
