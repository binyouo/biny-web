import { type AgentConfigStore } from "../config/store.js";
import { type AgentConfig, type ModelPricing } from "../config/schema.js";
import { modelCapabilities, modelContextBudget } from "../ai/capabilities.js";
import type { ModelCatalogEntry } from "../ai/types.js";
import { type ModelChoice } from "./ModelRegistry.js";
import type { AgentModel } from "../agent/core/types.js";
import type { ModelSettings } from "./ProviderRuntime.js";
import { AiRegistry } from "./AiRegistry.js";
import { type ModelsStore } from "./ModelsStore.js";
import type { ThinkingSelection } from "./modelThinking.js";
export { modelThinkingSelections, type ThinkingSelection } from "./modelThinking.js";
export type { ModelChoice } from "./ModelRegistry.js";
export interface ModelRuntimeInfo {
    modelAlias: string;
    provider: string;
    modelLabel: string;
    reasoningLabel: string;
    thinking: ThinkingSelection;
    contextWindow?: number;
    /** 上下文窗口未由模型元数据声明时为 true。 */
    contextWindowIsFallback?: boolean;
    effectiveContextWindow?: number;
    effectiveContextWindowPercent?: number;
    contextReserveTokens?: number;
    autoCompactTokenLimit?: number;
    maxInputTokens?: number;
    pricing?: ModelPricing;
}
/** Keeps one validated native Biny model while the selected provider changes. */
export declare class ModelManager {
    private readonly workspaceRoot;
    private readonly config;
    private readonly configStore;
    private readonly ai;
    private readonly modelsStore?;
    private activeSettings;
    private runtime;
    private observedConfigRevision;
    private readonly providerCredentials;
    constructor(workspaceRoot: string, config: AgentConfig, configStore?: AgentConfigStore, ai?: AiRegistry, modelsStore?: ModelsStore | undefined, catalogs?: readonly [string, ModelCatalogEntry[]][]);
    static create(workspaceRoot: string, config: AgentConfig, configStore?: AgentConfigStore, ai?: AiRegistry, modelsStore?: ModelsStore): Promise<ModelManager>;
    listModels(): ModelChoice[];
    getInfo(): ModelRuntimeInfo;
    getModel(): AgentModel;
    getModelSettings(): ModelSettings;
    getCapabilities(): ReturnType<typeof modelCapabilities>;
    getContextBudget(): ReturnType<typeof modelContextBudget>;
    /**
     * AgentSession 在回合入口重读配置；同回合后续步骤传 reloadConfig=false，
     * 只校验当前 Provider 并在 OAuth 临近过期时续期，不切换回合的模型选择。
     */
    preparePrompt(signal?: AbortSignal, reloadConfig?: boolean): Promise<void>;
    private recoverContextMetadata;
    refreshModelCatalog(providerAlias?: string): Promise<ModelCatalogEntry[]>;
    switchModel(alias: string, thinking?: ThinkingSelection): Promise<ModelRuntimeInfo>;
    refreshFromDisk(): Promise<ModelRuntimeInfo>;
    private applyConfig;
}
/** 只验证并保存选择，不修改驻留 Agent 的当前回合配置。 */
export declare function saveModelSelection(workspaceRoot: string, configStore: AgentConfigStore, alias: string, thinking?: ThinkingSelection, catalogs?: readonly [string, ModelCatalogEntry[]][], ai?: AiRegistry, modelsStore?: ModelsStore): Promise<AgentConfig>;
export declare function listModelChoices(config: AgentConfig, catalogs?: readonly [string, ModelCatalogEntry[]][]): ModelChoice[];
/** 普通模型选择器只展示各服务商设置中已启用且当前可用的模型。 */
export declare function filterPickerModelChoices(models: readonly ModelChoice[]): ModelChoice[];
export declare function listPickerModelChoices(config: AgentConfig, catalogs?: readonly [string, ModelCatalogEntry[]][]): ModelChoice[];
export declare function listConfiguredModelChoices(config: AgentConfig, catalogs?: readonly [string, ModelCatalogEntry[]][]): ModelChoice[];
export declare function hasUsableModelConfiguration(config: AgentConfig, alias?: string): boolean;
export declare function modelRuntimeInfo(config: AgentConfig, catalogs?: readonly [string, ModelCatalogEntry[]][]): ModelRuntimeInfo;
export declare function resolveThinkingSelection(config: AgentConfig, alias: string, requested?: ThinkingSelection): ThinkingSelection;
export declare function parseThinkingSelection(value: string | undefined): ThinkingSelection | undefined;
