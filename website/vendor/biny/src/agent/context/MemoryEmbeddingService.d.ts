/**
 * 记忆 Embedding 的下载与派生索引协调器。
 *
 * SQLite 记忆仍是唯一事实源；事实表和向量派生表位于同一个 Agent SQLite。完整重建只
 * 替换已有 vec0 投影，增量写只允许命中相同模型指纹和维度的当前投影。
 */
import type { EmbeddingModelDescriptor, EmbeddingModelRef, EmbeddingModelRuntime, LocalEmbeddingDownloadProgress, LocalEmbeddingModelId, LocalEmbeddingModelStatus } from "../../llm/embedding/types.js";
import type { LocalEmbeddingManager } from "../../llm/embedding/LocalEmbeddingRuntime.js";
import type { MemoryEntry } from "./memoryTypes.js";
import type { MemorySimilarityScan } from "./memoryTypes.js";
import type { LocalMemory } from "./LocalMemory.js";
import { MemoryVectorIndex, type MemoryVectorIndexStatus } from "./MemoryVectorIndex.js";
export type MemoryEmbeddingOperationStatus = {
    kind: "download";
    state: "running" | "completed" | "cancelled" | "failed";
    model: LocalEmbeddingModelId;
    startedAt: string;
    updatedAt: string;
    progress?: LocalEmbeddingDownloadProgress;
    error?: string;
} | {
    kind: "rebuild";
    state: "running" | "completed" | "cancelled" | "failed";
    startedAt: string;
    updatedAt: string;
    processedEntries: number;
    totalEntries: number;
    error?: string;
};
export interface MemoryEmbeddingRuntimeStatus {
    activeModel?: EmbeddingModelRef;
    models: EmbeddingModelDescriptor[];
    localModels: LocalEmbeddingModelStatus[];
    index: MemoryVectorIndexStatus;
    totalEntries: number;
    indexedEntries: number;
    pendingEntries: number;
    /** 配置或当前向量投影要求完整重建；供桌面设置页显示维护动作。 */
    needsRebuild: boolean;
    operation?: MemoryEmbeddingOperationStatus;
    degradedReason?: string;
}
export interface MemoryEmbeddingServiceOptions {
    localMemory: Pick<LocalMemory, "listMemoryEntries" | "getOverview">;
    localManager: LocalEmbeddingManager;
    getVectorIndex: () => MemoryVectorIndex;
    getReadOnlyVectorIndex: () => MemoryVectorIndex | undefined;
    getActiveModel: () => EmbeddingModelRef | undefined;
    /** 原始配置选择；用于 Sleep 在暂时无可用 Provider 时识别已有投影。 */
    getConfiguredModel?: () => EmbeddingModelRef | undefined;
    getProviderModels: () => EmbeddingModelDescriptor[];
    getRuntime: () => Promise<EmbeddingModelRuntime | undefined>;
    getNeedsRebuild?: () => boolean;
    now?: () => Date;
}
export declare class MemoryEmbeddingService {
    private readonly options;
    private operation;
    private downloadAbort;
    private rebuildAbort;
    private vectorIndexInstance;
    constructor(options: MemoryEmbeddingServiceOptions);
    vectorIndex(): MemoryVectorIndex;
    embeddingRuntime(): Promise<EmbeddingModelRuntime | undefined>;
    storedModelId(): string | null;
    status(): Promise<MemoryEmbeddingRuntimeStatus>;
    download(model: LocalEmbeddingModelId, signal?: AbortSignal): Promise<void>;
    cancelDownload(model: LocalEmbeddingModelId): boolean;
    removeLocalModel(model: LocalEmbeddingModelId): Promise<{
        filesDeleted: number;
        bytesFreed: number;
    }>;
    rebuild(signal?: AbortSignal): Promise<void>;
    /** 合成条目落库前生成向量；返回的提交函数拒绝内容或索引模型变化。 */
    prepareSynthesis(content: string, signal?: AbortSignal): Promise<((entry: MemoryEntry) => void) | undefined>;
    /** SQLite 事实已经提交，增量失败只能等待下一次完整重建，不能回滚事实事务。 */
    indexEntry(entry: MemoryEntry): Promise<void>;
    /** 读取当前模型的 active vectors，计算 Sleep 所需的相似边；索引不可用时安全返回空集。 */
    findSimilarPairs(entries: readonly MemoryEntry[], minimumSimilarity: number, signal?: AbortSignal): Promise<MemorySimilarityScan>;
    /**
     * 用一段新文本找语义候选。自动写入的 LLM 去重、语义删除和 temporary 清理都走这条
     * 只读路径；embedding 不可用时返回 undefined，让上层区分“没有候选”和“无法判断”。
     * 索引尚未建立时按空候选处理；后续写入会
     * 继续进入事实库，并由增量索引/重建补齐派生向量。
     */
    findSimilarEntries(query: string, entries: readonly MemoryEntry[], limit: number, minimumSimilarity: number, signal?: AbortSignal): Promise<MemoryEntry[] | undefined>;
    removeEntries(entryIds: readonly string[]): void;
    cancelRebuild(): boolean;
    close(): void;
    private assertNoRunningOperation;
    private now;
    private activeModelFingerprint;
}
