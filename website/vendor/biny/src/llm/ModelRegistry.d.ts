/**
 * 统一模型注册表。
 *
 * 配置模型是稳定来源，provider `/models` 是可刷新来源。两者在这里合并成同一份模型视图；
 * 注册表只保存模型元数据，不保存 API key，也不会把实时目录自动写回项目配置。
 */
import { modelCapabilities } from "../ai/capabilities.js";
import type { ModelCatalogEntry } from "../ai/types.js";
import type { AgentConfig, ModelAliasConfig, ModelApiBackend, ModelCompatibility, ModelProvider, ReasoningEffort, ThinkingLevelMap } from "../config/schema.js";
import { ProviderRegistry } from "./ProviderRuntime.js";
import type { EmbeddingModelDescriptor } from "./embedding/index.js";
export type ModelSource = "configured" | "catalog";
export interface ModelChoice {
    alias: string;
    displayName: string;
    description?: string;
    provider: string;
    providerType: ModelProvider | string;
    model: string;
    modelKey: string;
    supportsTools?: boolean;
    capabilities?: ReturnType<typeof modelCapabilities>;
    contextWindow?: number;
    /** 上下文窗口未由模型元数据声明时为 true；展示层不得把该数值称为官方窗口。 */
    contextWindowIsFallback?: boolean;
    effectiveContextWindow?: number;
    effectiveContextWindowPercent?: number;
    contextReserveTokens?: number;
    autoCompactTokenLimit?: number;
    /** Provider 声明的输入硬上限；实际可发预算见 `inputBudgetTokens`。 */
    maxInputTokens?: number;
    inputBudgetTokens?: number;
    /** 上下文窗口中为输出和运行时协议预留的 token；供桌面端展示完整占用。 */
    outputReserveTokens?: number;
    reasoningReserveTokens?: number;
    toolSchemaReserveTokens?: number;
    systemPromptReserveTokens?: number;
    protocolSafetyMarginTokens?: number;
    maxOutputTokens?: number;
    limits?: ModelAliasConfig["limits"];
    efforts: ReasoningEffort[];
    defaultThinking: "off" | ReasoningEffort;
    thinkingLevelMap: ThinkingLevelMap;
    apiBackend?: ModelApiBackend;
    baseUrl?: string;
    /** 模型级自定义 Header；设置页的模型选项弹窗用它回显。 */
    headers?: Record<string, string>;
    compatibility?: ModelCompatibility;
    pricing?: ModelAliasConfig["pricing"];
    /** 普通模型选择器可见性；旧 Runtime Host 未返回时按默认策略处理。 */
    showInPicker?: boolean;
    available: boolean;
    source: ModelSource;
}
export interface RegisteredModel {
    alias: string;
    model: ModelAliasConfig;
    providerAlias: string;
    source: ModelSource;
}
export declare function catalogModelAlias(providerAlias: string, modelId: string): string;
export declare class ModelRegistry {
    private readonly config;
    private readonly providers;
    private readonly catalogs;
    constructor(config: AgentConfig, providers?: ProviderRegistry);
    registerCatalog(providerAlias: string, entries: ModelCatalogEntry[]): void;
    catalog(providerAlias: string): ModelCatalogEntry[];
    catalogsSnapshot(): Array<[string, ModelCatalogEntry[]]>;
    listModels(): ModelChoice[];
    listAvailableModels(): ModelChoice[];
    /** Embedding 目录独立于聊天模型 picker，只包含 provider 显式声明的 wire/model。 */
    listEmbeddingModels(): EmbeddingModelDescriptor[];
    isAvailable(resolved: RegisteredModel): boolean;
    resolve(aliasOrReference: string): RegisteredModel | undefined;
    private toChoice;
}
export declare function modelKey(providerAlias: string, modelId: string): string;
export declare function hasUsableModelConfiguration(config: AgentConfig, alias: string, modelOverride?: ModelAliasConfig): boolean;
