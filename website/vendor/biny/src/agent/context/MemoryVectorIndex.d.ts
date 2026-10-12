export interface MemoryVectorInput {
    entryId: string;
    revision: number;
    embedding: ArrayLike<number>;
}
export interface MemoryVectorSearchResult {
    entryId: string;
    similarity: number;
}
export interface MemoryVectorIndexStatus {
    active?: {
        modelFingerprint: string;
        dimensions: number;
        vectorCount: number;
        createdAt: string;
        completedAt: string;
    };
}
interface MemoryVectorIndexOpenOptions {
    readOnly?: boolean;
}
export declare class MemoryVectorIndex {
    readonly databasePath: string;
    private readonly database;
    private readonly vectorExtensionAvailable;
    private closed;
    static openReadOnly(memoryRoot: string): MemoryVectorIndex | undefined;
    constructor(memoryRoot: string, options?: MemoryVectorIndexOpenOptions);
    /** 用同一 transaction 替换全部向量，避免保留半成品索引。 */
    replaceAll(modelFingerprint: string, dimensions: number, inputs: readonly MemoryVectorInput[], storedModelId?: string): void;
    /** 未知维度且没有活动事实时，原子清除旧模型投影，不能将旧维度冒充新模型维度。 */
    clearEmptyProjection(storedModelId?: string): void;
    /** 上次成功完整重建的模型 ID；与用于向量空间校验的 fingerprint 分开保存。 */
    storedModelId(): string | null;
    /** 模型/维度不匹配返回 false 以请求重建；过期条目直接丢弃，不能覆盖当前投影。 */
    upsertActiveVectors(modelFingerprint: string, dimensions: number, inputs: readonly MemoryVectorInput[]): boolean;
    removeEntries(entryIds: readonly string[]): void;
    search(query: ArrayLike<number>, options: {
        modelFingerprint: string;
        limit?: number;
        minimumSimilarity?: number;
        entryIds?: ReadonlySet<string>;
    }): MemoryVectorSearchResult[];
    listActiveEmbeddings(options: {
        modelFingerprint: string;
        entryIds?: ReadonlySet<string>;
    }): Array<{
        entryId: string;
        embedding: Float32Array;
    }>;
    status(): MemoryVectorIndexStatus;
    close(): void;
    private migrate;
    private ensureVectorTable;
    private insertVectors;
    private isCurrentEntry;
    private writeMetadata;
    private readMetadata;
    private readDimensions;
    private hasSchema;
    private transaction;
    private assertOpen;
}
export {};
