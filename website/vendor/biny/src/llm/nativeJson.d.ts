import type { AgentMessage, AgentModel, AgentUsage, ModelRequestContext, ModelRequestObserver } from "../agent/core/types.js";
export interface NativeTextGenerationOptions {
    systemPrompt?: string;
    signal?: AbortSignal;
    maxOutputTokens?: number;
    /** 覆盖模型默认的 provider 请求重试次数；不传时沿用模型配置。 */
    maxRetries?: number;
    providerOptions?: Record<string, unknown>;
    reasoning?: "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
    timeoutMs?: number;
    /** 首个事件和相邻流事件的最长等待；有持续进展时不消耗这个空闲期限。 */
    idleTimeoutMs?: number;
    /** Await provider requests and local stream cleanup after abort/timeout; this cannot prove remote I/O stopped. */
    awaitModelSettlementOnAbort?: boolean;
    onRequestMetrics?: ModelRequestObserver;
    requestContext?: ModelRequestContext;
}
export interface NativeTextGenerationResult {
    text: string;
    usage?: AgentUsage;
    finishReason?: string;
}
/** Small text helper for structured side tasks such as memory and compaction. */
export declare function generateNativeText(model: AgentModel, messages: AgentMessage[], options?: NativeTextGenerationOptions): Promise<NativeTextGenerationResult>;
export declare function nativeJsonMessages(systemPrompt: string, prompt: string): AgentMessage[];
export declare function parseNativeJson(text: string): unknown;
