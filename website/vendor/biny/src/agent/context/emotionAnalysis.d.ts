/**
 * 对话上下文情绪的低频分析与防抖调度。
 *
 * 分析只读取当前 session 的活动消息路径，输出仅允许更新 context 情绪；模型失败、解析
 * 失败或结果没有变化都静默结束，不把这条旁路变成主回合的依赖。
 */
import type { AgentModel, AgentUsage, ModelRequestContext, ModelRequestMetrics } from "../core/types.js";
import type { UsageModelInfo, UsageModelInfoResolver } from "../../observability/usage.js";
import { type EmotionState } from "./emotionTypes.js";
import { EmotionStorage } from "./emotionStorage.js";
export interface EmotionAnalysisMessage {
    role: "user" | "assistant";
    text: string;
}
export type EmotionAnalysisFailure = "invalid_json" | "invalid_shape";
export interface AnalyzeContextEmotionOptions {
    sessionId: string;
    storage: EmotionStorage;
    getModel: () => AgentModel | undefined;
    getMessages: () => Promise<readonly EmotionAnalysisMessage[]>;
    now?: () => Date;
    signal?: AbortSignal;
    onUsage?: (usage: AgentUsage, model?: Readonly<UsageModelInfo>) => void | Promise<void>;
    getUsageModelInfo?: UsageModelInfoResolver;
    onRequestMetrics?: (metrics: ModelRequestMetrics) => void | Promise<void>;
    requestContext?: ModelRequestContext;
    /** 分析产出有效结果即触发；updated 区分是否实际写入了新的 context 快照。 */
    onAnalyzed?: (state: EmotionState, updated: boolean) => void | Promise<void>;
    /** 模型给出了输出但无法解析或结构不符时触发；请求本身的错误仍向上传播。 */
    onFailed?: (reason: EmotionAnalysisFailure) => void | Promise<void>;
    onUpdated?: (state: EmotionState) => void | Promise<void>;
}
export declare function analyzeContextEmotion(options: AnalyzeContextEmotionOptions): Promise<EmotionState | undefined>;
export interface EmotionAnalysisSchedulerOptions {
    delayMs?: number;
    analyze: (sessionId: string, signal: AbortSignal, messageId?: string) => void | Promise<void>;
    timers?: {
        setTimeout: (callback: () => void, ms: number) => ReturnType<typeof setTimeout>;
        clearTimeout: (handle: ReturnType<typeof setTimeout>) => void;
    };
}
export declare class EmotionAnalysisScheduler {
    private readonly delayMs;
    private readonly analyze;
    private readonly timers;
    private timer?;
    private controller?;
    private readonly pending;
    private closed;
    constructor(options: EmotionAnalysisSchedulerOptions);
    schedule(sessionId: string, messageId?: string): void;
    cancel(): void;
    /** Cancel promptly, then join every admitted analysis, including superseded work. */
    cancelAndDrain(): Promise<void>;
    /** Terminal disposal seals timer admission synchronously before joining active work. */
    close(): Promise<void>;
}
