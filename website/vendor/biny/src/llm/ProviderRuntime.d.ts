/**
 * Provider 运行时。
 *
 * 每个配置别名对应一个实例，统一持有服务商默认值、鉴权、模型目录和请求准备逻辑。
 * Provider 只负责把配置解析成 Vercel AI SDK 的 LanguageModel；请求协议由 SDK 统一处理。
 */
import type { AgentModel, CacheMarkerPlan } from "../agent/core/types.js";
import type { LanguageModelV4 } from "@ai-sdk/provider";
import type { ModelCatalogEntry, ProviderDefinition } from "../ai/types.js";
import type { AgentConfig, ModelAliasConfig, ProviderConfig } from "../config/schema.js";
import { AiRegistry } from "./AiRegistry.js";
import { type ModelsStore } from "./ModelsStore.js";
import { type EmbeddingModelDescriptor, type EmbeddingModelRef, type EmbeddingModelRuntime } from "./embedding/index.js";
export type ProviderCredentialWriter = (providerAlias: string, previous: ProviderConfig, renewed: ProviderConfig, signal?: AbortSignal) => Promise<ProviderConfig>;
export interface ProviderCredentialPersistence {
    read?(providerAlias: string, previous: ProviderConfig, signal?: AbortSignal): Promise<ProviderConfig>;
    write: ProviderCredentialWriter;
}
export declare class ProviderAuthenticationError extends Error {
    readonly providerAlias: string;
    readonly code: string;
    readonly retryable = false;
    constructor(providerAlias: string, code: string, detail: string, cause?: unknown);
}
export interface ModelSettings {
    applyPatchProtocol?: "openai-structured";
    model: AgentModel;
    /** 主 Agent 与辅助文本调用共用的 Vercel model；显式注入的测试模型可以没有它。 */
    vercelModel?: LanguageModelV4;
    maxRetries?: number;
    providerOptions?: Record<string, unknown>;
    reasoning?: "off" | AgentConfig["thinking"]["effort"];
    timeoutMs?: number;
    maxOutputTokens?: number;
    contextWindow: number | undefined;
    /** 按协议生成的 prompt 缓存标记计划；隐式缓存或用户关闭时为 undefined。 */
    cacheMarkers?: CacheMarkerPlan;
}
export interface ProviderRuntime {
    readonly id: string;
    readonly definition: ProviderDefinition;
    readonly config: ProviderConfig;
    getModels(): ModelCatalogEntry[];
    resolveModel(model: ModelAliasConfig): ModelAliasConfig;
    restoreModels(models: readonly ModelCatalogEntry[]): void;
    refreshModels(signal?: AbortSignal, force?: boolean): Promise<ModelCatalogEntry[]>;
    isConfigured(model?: ModelAliasConfig): boolean;
    validate(model?: ModelAliasConfig): void;
    createModelSettings(agentConfig: AgentConfig, model: ModelAliasConfig): ModelSettings;
    refreshCredential(signal?: AbortSignal): Promise<ProviderConfig | undefined>;
    listEmbeddingModels(): EmbeddingModelDescriptor[];
    createEmbeddingRuntime(modelId: string): EmbeddingModelRuntime;
}
export declare class ConfiguredProviderRuntime implements ProviderRuntime {
    readonly id: string;
    readonly config: ProviderConfig;
    private readonly ai;
    private readonly modelsStore?;
    private readonly fetcher;
    private readonly credentialPersistence?;
    readonly definition: ProviderDefinition;
    private readonly baselineModels;
    private liveModels;
    private preparedCredentials?;
    private credentialPreparation?;
    constructor(id: string, config: ProviderConfig, ai: AiRegistry, baselineModels?: readonly ModelCatalogEntry[], modelsStore?: ModelsStore | undefined, fetcher?: typeof globalThis.fetch, credentialPersistence?: ProviderCredentialPersistence | undefined);
    getModels(): ModelCatalogEntry[];
    listEmbeddingModels(): EmbeddingModelDescriptor[];
    createEmbeddingRuntime(modelId: string): EmbeddingModelRuntime;
    restoreModels(models: readonly ModelCatalogEntry[]): void;
    refreshModels(signal?: AbortSignal, force?: boolean): Promise<ModelCatalogEntry[]>;
    isConfigured(model?: ModelAliasConfig): boolean;
    resolveModel(model: ModelAliasConfig): ModelAliasConfig;
    validate(model?: ModelAliasConfig): void;
    createModelSettings(agentConfig: AgentConfig, model: ModelAliasConfig): ModelSettings;
    refreshCredential(signal?: AbortSignal): Promise<ProviderConfig | undefined>;
    private prepareTextModel;
    private withCredentials;
    private resolveApiKey;
    private normalizeCatalogEntry;
    private mergedCatalogEntry;
    private mergedCatalog;
}
export declare class ProviderRegistry {
    private readonly config;
    private readonly ai;
    private readonly fetcher;
    private readonly credentialPersistence?;
    private readonly providers;
    constructor(config: AgentConfig, catalogs?: readonly [string, ModelCatalogEntry[]][], ai?: AiRegistry, modelsStore?: ModelsStore, fetcher?: typeof globalThis.fetch, credentialPersistence?: ProviderCredentialPersistence | undefined);
    get(id: string): ProviderRuntime | undefined;
    require(id: string): ProviderRuntime;
    forModel(alias: string): {
        provider: ProviderRuntime;
        model: ModelAliasConfig;
    };
    createModelSettings(alias?: string): ModelSettings;
    listEmbeddingModels(): EmbeddingModelDescriptor[];
    createEmbeddingRuntime(ref: Extract<EmbeddingModelRef, {
        kind: "provider";
    }>): EmbeddingModelRuntime;
    validate(alias?: string): void;
    refreshModels(id: string, signal?: AbortSignal, force?: boolean): Promise<ModelCatalogEntry[]>;
    catalogsSnapshot(): Array<[string, ModelCatalogEntry[]]>;
}
