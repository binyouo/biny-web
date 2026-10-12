/**
 * Activity 新对话建议。
 *
 * 建议只从最近三天的已分析 session 生成，输入是分析层的项目、标题、描述和部分主题、亮点，
 * 不把截图/OCR 原文直接送给模型，统一使用配置选出的工具模型。
 */
import type { AgentModel } from "../agent/core/types.js";
import type { ActivityStore } from "./store.js";
export interface ActivitySuggestionCache {
    get(key: string): string[] | undefined;
    set(key: string, suggestions: string[]): void;
}
export interface ActivitySuggestionsDeps {
    store: ActivityStore;
    model?: AgentModel;
    now?: Date;
    force?: boolean;
    cache?: ActivitySuggestionCache;
    signal?: AbortSignal;
    checkpoint?: () => Promise<void>;
}
export interface ActivitySuggestionsResult {
    suggestions: string[];
    model?: string;
    cached: boolean;
    reason?: "no_model" | "no_activity" | "generation_failed";
}
export declare function createInMemoryActivitySuggestionCache(ttlMs?: number): ActivitySuggestionCache;
export declare function generateActivitySuggestions(deps: ActivitySuggestionsDeps): Promise<ActivitySuggestionsResult>;
