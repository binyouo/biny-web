import type { AgentModel, AgentUsage, ModelRequestContext, ModelRequestMetrics } from "../core/types.js";
import { type EmotionState } from "./emotionTypes.js";
import { EmotionStorage } from "./emotionStorage.js";
export interface EmotionAnalysisMessage {
    role: "user" | "assistant";
    text: string;
}
export interface AnalyzeContextEmotionOptions {
    sessionId: string;
    storage: EmotionStorage;
    getModel: () => AgentModel | undefined;
    getMessages: () => Promise<readonly EmotionAnalysisMessage[]>;
    now?: () => Date;
    signal?: AbortSignal;
    onUsage?: (usage: AgentUsage) => void | Promise<void>;
    onRequestMetrics?: (metrics: ModelRequestMetrics) => void | Promise<void>;
    requestContext?: ModelRequestContext;
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
    constructor(options: EmotionAnalysisSchedulerOptions);
    schedule(sessionId: string, messageId?: string): void;
    cancel(): void;
}
