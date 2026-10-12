import type { ModelCatalogEntry } from "../ai/types.js";
import type { ProviderConfig } from "../config/schema.js";
export interface ModelsStoreEntry {
    models: ModelCatalogEntry[];
    /** 目录来源的隔离键；旧版 alias 缓存缺省，不能把其 HTTP validators 当成当前来源的事实。 */
    sourceKey?: string;
    checkedAt?: number;
    lastModified?: number;
    etag?: string;
}
export interface ModelsStore {
    read(providerId: string): Promise<ModelsStoreEntry | undefined>;
    readMany?(providerIds: readonly string[]): Promise<Map<string, ModelsStoreEntry>>;
    write(providerId: string, entry: ModelsStoreEntry): Promise<void>;
    delete(providerId: string): Promise<void>;
}
/**
 * 同一主机可以挂多个不同网关路径，缓存必须按实际目录地址隔离；否则一个连接刷新后会
 * 把另一个连接的模型列表覆盖掉。哈希只用于文件键，不保存地址或凭据本身。
 */
export declare function modelCatalogCacheKey(providerId: string, config: ProviderConfig): string;
export declare function readProviderCatalog(providerId: string, config: ProviderConfig, store: ModelsStore): Promise<ModelsStoreEntry | undefined>;
export declare class InMemoryModelsStore implements ModelsStore {
    private readonly entries;
    read(providerId: string): Promise<ModelsStoreEntry | undefined>;
    readMany(providerIds: readonly string[]): Promise<Map<string, ModelsStoreEntry>>;
    write(providerId: string, entry: ModelsStoreEntry): Promise<void>;
    delete(providerId: string): Promise<void>;
}
export declare class FileModelsStore implements ModelsStore {
    readonly filePath: string;
    private readonly migrateDefaultState;
    private pending;
    constructor(filePath?: string);
    read(providerId: string): Promise<ModelsStoreEntry | undefined>;
    readMany(providerIds: readonly string[]): Promise<Map<string, ModelsStoreEntry>>;
    write(providerId: string, entry: ModelsStoreEntry): Promise<void>;
    delete(providerId: string): Promise<void>;
    private serialize;
    private migrateIfDefault;
}
export declare function restoreProviderCatalogs(providerIds: readonly string[], store: ModelsStore, providers?: Readonly<Record<string, ProviderConfig>>): Promise<Array<[string, ModelCatalogEntry[]]>>;
