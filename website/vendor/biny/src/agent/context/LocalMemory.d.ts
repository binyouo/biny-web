import type { AgentMessage, AgentModel, ModelRequestContext, ModelRequestObserver } from "../core/types.js";
import type { ModelUsageObserver, UsageModelInfoResolver } from "../../observability/usage.js";
import { redactSecrets } from "../../utils/secrets.js";
import { type ExtractedMemory } from "./memoryExtraction.js";
import { type MemoryDerivedIndexSink, type MemoryClearResult, type MemoryArchiveEntriesResult, type MemoryArchiveChain, type MemoryArchiveReason, type MemoryArchiveResult, type MemoryBulkArchiveResult, type MemoryDeleteResult, type MemoryEntriesResult, type MemoryEntry, type MemoryEntryInput, type MemoryEntryPatch, type MemoryOriginAnchor, type MemoryListOptions, type MemoryMatch, type MemoryMutationOptions, type MemoryOverview, type MemoryReadOptions, type MemorySimilarEntrySearch, type MemoryWriteResult } from "./memoryTypes.js";
/** 会话调用上下文中的事实操作与模型抽取；不持有全局维护状态。 */
export declare class LocalMemory {
    private readonly workspaceRoot;
    private readonly getToolModel;
    private readonly onUsage;
    private readonly onModelRequest;
    private readonly getModelRequestContext;
    private readonly derivedIndex?;
    private readonly findSimilarEntries?;
    private readonly getUsageModelInfo?;
    private readonly storage;
    private readonly recallLimitSource;
    constructor(workspaceRoot: string, getToolModel: () => AgentModel, onUsage?: ModelUsageObserver, 
    /** 共享记忆库合计自动注入条数上限。 */
    recallLimit?: number | (() => number), onModelRequest?: ModelRequestObserver, getModelRequestContext?: () => ModelRequestContext | undefined, derivedIndex?: Pick<MemoryDerivedIndexSink, "indexEntry" | "removeEntries"> | undefined, findSimilarEntries?: MemorySimilarEntrySearch | undefined, storageOptions?: {
        agentDir?: string;
    }, getUsageModelInfo?: UsageModelInfoResolver | undefined);
    /**
     * 召回上限可以绑定到宿主配置。配置在每个根回合开始时刷新，因此这里不能只保存构造时快照。
     */
    get recallLimit(): number;
    close(): void;
    getOverview(options?: MemoryReadOptions): Promise<MemoryOverview>;
    listMemoryEntries(options?: MemoryListOptions): Promise<MemoryEntriesResult>;
    getEntry(id: string, options?: MemoryReadOptions): Promise<MemoryEntry | undefined>;
    resolveArchiveChains(archiveIds: readonly string[], options?: MemoryReadOptions): Promise<Record<string, MemoryArchiveChain>>;
    writeEntry(input: MemoryEntryInput, options?: MemoryMutationOptions): Promise<MemoryWriteResult>;
    /**
     * 自动贡献记忆的写入入口，根据语义候选决定新增、更新或保持不变。
     * 底层 writeEntry 不做精确去重；手动 /memory add 不经过这层模型判断。
     */
    writeAutoEntry(input: MemoryEntryInput, options?: MemoryMutationOptions & {
        requireSemantic?: boolean;
        checkpoint?: () => Promise<void>;
    }): Promise<MemoryWriteResult & {
        updated?: boolean;
    }>;
    updateEntry(id: string, patch: MemoryEntryPatch, options?: MemoryMutationOptions): Promise<MemoryWriteResult>;
    archiveEntry(id: string, archived: boolean, options?: MemoryMutationOptions): Promise<MemoryArchiveResult>;
    archiveEntries(ids: readonly string[], reason: MemoryArchiveReason, options?: MemoryMutationOptions & {
        mergedInto?: string;
    }): Promise<MemoryBulkArchiveResult>;
    listArchivedEntries(options?: MemoryListOptions): Promise<MemoryArchiveEntriesResult>;
    deleteEntryById(id: string, options?: MemoryMutationOptions): Promise<MemoryDeleteResult>;
    clearAllEntries(options?: MemoryMutationOptions): Promise<MemoryClearResult>;
    clearThreadEntries(threadId: string, options?: MemoryMutationOptions): Promise<MemoryClearResult>;
    /** SQLite 是权威源；派生索引失败只能降级召回，不能让成功写入变成失败。 */
    private syncDerivedEntry;
    private removeDerivedEntries;
    /** 记录「条目被实际引用」的使用投影，供 Sleep 选择 survivor。 */
    recordRecallUsage(ids: string[], options?: MemoryReadOptions & {
        now?: Date;
    }): Promise<void>;
    /**
     * 在成功回合结束后直接整理并写入记忆。这里不落候选表：模型一次返回 add/delete，
     * 每个变更都通过同一套 SQLite 事务写路径提交，失败也不会影响已经完成的对话。
     */
    summarizeAndStoreMemories(messages: readonly AgentMessage[], options: {
        sessionId: string;
        turnId: string;
        messageId?: string;
        userId?: string;
        originAnchors?: MemoryOriginAnchor[];
        runId: string;
        externalContext: boolean;
        excludeExternalContext: boolean;
        signal?: AbortSignal;
        now?: Date;
        onMemoryWritten?: (entry: MemoryEntry) => Promise<void>;
    }): Promise<{
        created: ExtractedMemory[];
        updated: ExtractedMemory[];
        deleted: ExtractedMemory[];
    }>;
    private findSemanticMemoryEntries;
    private reconcileMemory;
    private deleteMemoryByDescription;
    private selectMemoryDeletionCandidates;
    private cleanupTemporaryMemories;
    private appendPersonMemory;
}
export declare function formatMemoryMatches(matches: Array<Pick<MemoryMatch, "entry" | "excerpt">>): string;
export { redactSecrets };
export type { MemoryBudgetOmission, MemoryArchiveReason, MemoryClearResult, MemoryBulkArchiveResult, MemoryDeleteResult, MemoryEntriesResult, MemoryEntry, MemoryEntryInput, MemoryDurability, MemoryListOptions, MemoryMaintenanceOptions, MemoryMaintenanceResult, MemoryMaintenanceStatus, MemoryMatch, MemoryMutationOptions, MemoryOmissionReason, MemoryOverview, MemoryReadOptions, MemoryRecallReport, MemorySearchOptions, MemorySearchResult, MemorySimilarityPair, MemoryWriteResult } from "./memoryTypes.js";
