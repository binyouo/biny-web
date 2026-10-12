/**
 * 模型控制面：组合 Provider Runtime、模型注册表和当前可执行模型。
 *
 * ProviderRegistry 是模型与服务商行为的来源；ModelRegistry 只负责面向 UI/CLI 的查找和展示。
 */
import type { ModelCatalogEntry } from "../ai/types.js";
import type { AgentConfig, ProviderConfig } from "../config/schema.js";
import { type ModelChoice, type RegisteredModel } from "./ModelRegistry.js";
import { type ModelSettings, type ProviderCredentialPersistence } from "./ProviderRuntime.js";
import { AiRegistry } from "./AiRegistry.js";
import type { ModelsStore } from "./ModelsStore.js";
export declare class ModelRuntime {
    private readonly config;
    private readonly providers;
    private readonly models;
    constructor(config: AgentConfig, catalogs?: readonly [string, ModelCatalogEntry[]][], ai?: AiRegistry, modelsStore?: ModelsStore, fetcher?: typeof globalThis.fetch, credentials?: ProviderCredentialPersistence);
    listModels(): ModelChoice[];
    resolve(reference: string, options?: {
        requireAvailable?: boolean;
    }): RegisteredModel;
    createModelSettings(alias?: string): ModelSettings;
    validate(alias?: string): void;
    refreshModels(providerAlias: string, signal?: AbortSignal, force?: boolean): Promise<ModelCatalogEntry[]>;
    refreshActiveCredential(signal?: AbortSignal): Promise<ProviderConfig | undefined>;
    catalogsSnapshot(): Array<[string, ModelCatalogEntry[]]>;
}
