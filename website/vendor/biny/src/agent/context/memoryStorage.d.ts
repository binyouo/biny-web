import { type MemoryArchiveReason, type MemoryArchiveEntriesResult, type MemoryBulkArchiveResult, type MemoryClearResult, type MemoryDeleteResult, type MemoryEntriesResult, type MemoryEntry, type MemoryEntryInput, type MemoryEntryPatch, type MemoryListOptions, type MemoryArchiveChain, type MemoryMaintenanceStatus, type MemoryMutationOptions, type MemoryOverview, type MemoryReadOptions, type MemorySleepRun, type MemoryWriteResult } from "./memoryTypes.js";
export declare class SleepOwnerLostError extends Error {
    constructor();
}
export declare class StaleMemoryDecisionError extends Error {
    constructor();
}
export declare class MemoryStorage {
    readonly workspaceRoot: string;
    private database;
    private databaseOpening;
    private readonly agentDir;
    constructor(workspaceRoot: string, options?: {
        agentDir?: string;
    });
    close(): void;
    getOverview(options?: MemoryReadOptions): Promise<MemoryOverview>;
    getEntry(id: string, options?: MemoryReadOptions): Promise<MemoryEntry | undefined>;
    /** 只对给定归档行沿 original_id 索引追踪，避免为一页 UI 扫描全部归档。 */
    resolveArchiveChains(archiveIds: readonly string[], options?: MemoryReadOptions): Promise<Record<string, MemoryArchiveChain>>;
    listEntries(options?: MemoryListOptions): Promise<MemoryEntriesResult>;
    listArchivedEntries(options?: MemoryListOptions): Promise<MemoryArchiveEntriesResult>;
    writeEntry(input: MemoryEntryInput, options?: MemoryMutationOptions): Promise<MemoryWriteResult>;
    updateEntry(id: string, patch: MemoryEntryPatch, options?: MemoryMutationOptions): Promise<MemoryWriteResult>;
    archiveEntry(id: string, archived: boolean, options?: MemoryMutationOptions): Promise<{
        archived: boolean;
        entry?: MemoryEntry;
        revision: number;
    }>;
    archiveEntries(ids: readonly string[], reason: MemoryArchiveReason, options?: MemoryMutationOptions & {
        mergedInto?: string;
        temporaryTtl?: number;
    }): Promise<MemoryBulkArchiveResult>;
    purgeArchivedEntries(retentionDays: number, options?: MemoryMutationOptions): Promise<{
        deleted: number;
        revision: number;
    }>;
    deleteEntry(id: string, options?: MemoryMutationOptions): Promise<MemoryDeleteResult>;
    clearAll(options?: MemoryMutationOptions): Promise<MemoryClearResult & {
        deletedIds: string[];
    }>;
    /** 按对话清除活动事实；归档审计和其他对话在同一事务中保持不变。 */
    clearThread(threadId: string, options?: MemoryMutationOptions): Promise<MemoryClearResult & {
        deletedIds: string[];
    }>;
    recordRecallUsage(ids: string[], options?: MemoryReadOptions & {
        now?: Date;
    }): Promise<void>;
    readMaintenanceStatus(options?: MemoryReadOptions): Promise<MemoryMaintenanceStatus>;
    /** 共享事实库上的执行权；长模型请求期间由 owner 定期续期。 */
    acquireSleepOwner(token: string, signal?: AbortSignal): Promise<MemoryMaintenanceStatus>;
    renewSleepOwner(token: string): Promise<void>;
    releaseSleepOwner(token: string): Promise<void>;
    /** 只有 owner 已失效，才把遗留的 running 审计改成 interrupted。 */
    recoverInterruptedMaintenanceStatus(signal?: AbortSignal): Promise<MemoryMaintenanceStatus>;
    importSleepRun(run: MemorySleepRun, signal?: AbortSignal): Promise<boolean>;
    writeMaintenanceStatus(status: MemoryMaintenanceStatus, signal?: AbortSignal, sleepOwnerToken?: string): Promise<void>;
    private openDatabase;
    private openDatabaseInternal;
    private withWrite;
}
