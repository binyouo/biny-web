/**
 * 记忆搜索：手动查询先向量 topK 再按请求范围过滤；自动召回先限制可注入事实再取 topK。
 *
 * SQLite/LocalMemory 负责事实源；向量索引只提供可丢弃的语义排名。手动查询覆盖整个记忆库，
 * 不做来源分桶或工作区过滤；向量不可用或指纹不匹配时返回空结果及原因。
 */
import type { EmbeddingModelRuntime } from "../../llm/embedding/types.js";
import { type MemoryVectorIndexStatus, type MemoryVectorSearchResult } from "./MemoryVectorIndex.js";
import type { MemoryEntriesResult, MemoryEntry, MemoryRecallReport, MemorySearchResult } from "./memoryTypes.js";
/** 自动召回为空且不是"确实没有相关内容"时的降级原因。 */
export type MemoryRecallDegraded = NonNullable<MemoryRecallReport["degraded"]>;
export interface AutomaticMemoryStore {
    listMemoryEntries(options?: {
        includeArchived?: boolean;
        signal?: AbortSignal;
    }): Promise<MemoryEntriesResult>;
    /** Production stores can revalidate only the selected active facts. */
    getEntry?(id: string, options?: {
        activeOnly?: boolean;
        signal?: AbortSignal;
    }): Promise<MemoryEntry | undefined>;
    recordRecallUsage(ids: string[], options?: {
        signal?: AbortSignal;
        now?: Date;
    }): Promise<void>;
}
export interface MemoryVectorSearchIndex {
    status(): MemoryVectorIndexStatus;
    search(query: ArrayLike<number>, options: {
        modelFingerprint: string;
        limit?: number;
        minimumSimilarity?: number;
        entryIds?: ReadonlySet<string>;
    }): MemoryVectorSearchResult[];
    close?(): void;
}
export interface HybridMemoryRetrieverOptions {
    localMemory: AutomaticMemoryStore;
    getEmbeddingRuntime: () => Promise<EmbeddingModelRuntime | undefined>;
    getReadOnlyVectorIndex: () => MemoryVectorSearchIndex | undefined;
    /** 命中条目必须达到的最低相似度。 */
    getThreshold: (fingerprint: string, recommended: number) => number;
    rewriteQuery?: (query: string, signal?: AbortSignal, options?: {
        awaitModelSettlementOnAbort: boolean;
    }) => Promise<string>;
    queryRewriteEnabled?: () => boolean;
    allowEntry?: (entry: MemoryEntry) => boolean;
    closeVectorIndex?: boolean;
}
export interface HybridMemoryRankingInput {
    entries: readonly MemoryEntry[];
    vectorRanking: readonly {
        entryId: string;
        similarity: number;
    }[];
    semanticAvailable: boolean;
    automatic?: boolean;
    /** 语义路径不可用时随空结果上报。 */
    degraded?: MemoryRecallDegraded;
    paths?: ReadonlyMap<string, string>;
    limit: number;
    maxChars: number;
}
/**
 * AgentSession 与 Runtime Host 重建索引必须使用同一段文本和同一哈希。
 * Embedding 只接收记忆 content；它就是这段事实正文。
 */
export declare function memoryEntryEmbeddingText(entry: MemoryEntry): string;
export declare class HybridMemoryRetriever {
    private readonly options;
    private vectorIndex;
    constructor(options: HybridMemoryRetrieverOptions);
    retrieve(query: string, _paths: string[], options: {
        limit: number;
        threshold?: number;
        rewriteQuery?: boolean;
        maxChars?: number;
        signal?: AbortSignal;
        automatic?: boolean;
        allowEntry?: (entry: MemoryEntry) => boolean;
        tags?: string[];
        threadId?: string;
        userId?: string;
        userIds?: string[];
    }): Promise<MemorySearchResult>;
    private rewrite;
    recordRecallUsage(ids: string[], options?: {
        signal?: AbortSignal;
        now?: Date;
    }): Promise<void>;
    close(): void;
    private semanticSearch;
}
/** 纯排序函数不访问磁盘或模型，便于锁定权重和预算行为。 */
export declare function rankHybridMemory(input: HybridMemoryRankingInput, storeRevision?: number): MemorySearchResult;
