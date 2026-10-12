/**
 * 进程内 AI 扩展注册表。
 *
 * 每个 CommandRuntime 持有独立实例，插件只影响当前工作区。Provider 定义、离线模型目录和
 * 凭据处理通过同一对象交给 ModelManager，避免依赖全局可变状态。
 */
import { type ProviderDefinitionRegistry } from "../ai/provider.js";
import type { ModelCatalogEntry, ProviderDefinition } from "../ai/types.js";
import type { ProviderConfig } from "../config/schema.js";
export type CredentialRefreshHandler = (config: ProviderConfig, signal?: AbortSignal) => Promise<ProviderConfig>;
export declare class AiRegistry {
    readonly providers: ProviderDefinitionRegistry;
    private readonly credentialHandlers;
    constructor(providers?: ProviderDefinitionRegistry);
    registerProvider(definition: ProviderDefinition, models?: readonly ModelCatalogEntry[]): void;
    registerCredentialHandler(id: string, handler: CredentialRefreshHandler): void;
    credentialHandler(id: string): CredentialRefreshHandler | undefined;
    registerModels(providerType: string, models: readonly ModelCatalogEntry[]): void;
    clone(): AiRegistry;
}
