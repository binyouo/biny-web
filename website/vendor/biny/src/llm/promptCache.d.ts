import type { AgentMessage, AgentTool } from "../agent/core/types.js";
import type { ModelApiBackend } from "../config/schema.js";
export type PromptCacheMode = "implicit" | "explicit-key" | "breakpoint" | "unknown";
export interface PromptCacheCapability {
    mode: PromptCacheMode;
    cacheReadFields: string[];
    cacheWriteFields: string[];
    cacheMissFields: string[];
    fullInputIncludesCachedTokens?: boolean;
    supportsPromptCacheKey?: boolean;
}
export interface PromptCacheCapabilityInput {
    provider?: string;
    providerAlias?: string;
    modelId: string;
    reasoningProtocol?: string;
    api?: ModelApiBackend;
}
/**
 * 进程内的 prompt 投影缓存。
 *
 * 这里只缓存不可变工具对象对应的排序/schema/hash 元数据，不缓存用户消息、模型答案或
 * KV tensor。它的价值是让同一组工具在每轮重新组装成新数组时，仍能复用规范化结果；容量
 * 有界且按最近使用淘汰，命中只影响旁路组装性能，不影响请求语义。
 */
export declare class LocalPromptProjectionCache {
    private readonly maxEntries;
    private readonly toolSchemas;
    private hitCount;
    private missCount;
    private evictionCount;
    constructor(options?: {
        maxEntries?: number;
    });
    getToolSchema(key: string): ToolSchemaCacheEntry | undefined;
    setToolSchema(key: string, entry: ToolSchemaCacheEntry): void;
    stats(): LocalPromptProjectionCacheStats;
    clear(): void;
}
export interface LocalPromptProjectionCacheStats {
    entries: number;
    hits: number;
    misses: number;
    evictions: number;
}
export type PromptPrefixChangeReason = "initial" | "provider_changed" | "model_changed" | "system_changed" | "tool_schema_changed" | "unchanged";
export type PromptEpochReason = "initial" | "compaction" | "rewind" | "fork" | "provider_changed" | "model_changed" | "tool_schema_changed";
export interface PromptEpoch {
    epochId: string;
    stablePrefixHash: string;
    provider: string;
    model: string;
    reason: PromptEpochReason;
    createdAt: string;
}
export type PromptRequestShapeChangeReason = PromptPrefixChangeReason | "provider_options_changed" | "history_projection_changed";
export type PromptShapeStatus = "full" | "skipped_due_to_budget";
/**
 * 诊断预算只约束旁路 hash，不约束真实模型请求。超过预算后，同一 epoch 不再重复扫描长历史，
 * 下一次 epoch 变化时重新测量，避免为了追踪命中率持续增加首 token 延迟。
 */
export declare const promptShapeBudgetMs = 5;
export interface PromptShapeDiagnostic {
    provider: string;
    providerAlias?: string;
    modelId: string;
    stablePrefixHash: string;
    requestShapeHash: string;
    stableSystemHash: string;
    systemPromptHash: string;
    toolSchemaHash: string;
    providerOptionsHash: string;
    historyProjectionHash: string;
    epochId: string;
    epoch: PromptEpoch;
    epochReason: PromptEpochReason;
    epochCreatedAt: string;
    prefixChangeReason: PromptPrefixChangeReason;
    requestShapeChangeReason: PromptRequestShapeChangeReason;
}
export interface PromptShapeInput {
    provider: string;
    providerAlias?: string;
    modelId: string;
    stableSystemPrompt: string;
    systemPrompt?: string;
    tools: readonly AgentTool[];
    messages: readonly AgentMessage[];
    providerOptions?: Record<string, unknown>;
    promptEpoch?: number;
    promptEpochReason?: PromptEpochReason;
    promptEpochCreatedAt?: string;
    localPromptCache?: LocalPromptProjectionCache;
}
export declare function promptCacheCapability(input: PromptCacheCapabilityInput): PromptCacheCapability;
export declare function computePromptShapeDiagnostic(input: PromptShapeInput, previous: PromptShapeDiagnostic | undefined): PromptShapeDiagnostic;
export declare function canonicalToolSchemas(tools: readonly AgentTool[], localPromptCache?: LocalPromptProjectionCache): unknown[];
export declare function canonicalToolSchemaHash(tools: readonly AgentTool[], localPromptCache?: LocalPromptProjectionCache): string;
/** Provider 请求中的工具数组也必须与 hash 使用同一排序，避免无语义的顺序变化破坏前缀。 */
export declare function stableAgentTools(tools: readonly AgentTool[], localPromptCache?: LocalPromptProjectionCache): AgentTool[];
export declare function stableHash(value: unknown): string;
interface ToolSchemaCacheEntry {
    fingerprint: string;
    sorted: AgentTool[];
    schemas: unknown[];
    hash: string;
}
export {};
