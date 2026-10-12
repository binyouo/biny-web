import type { AgentConfig, ModelAliasConfig, ProviderConfig } from "../config/schema.js";
export interface ResolvedModelConfig {
    alias: string;
    model: ModelAliasConfig;
    providerAlias: string;
    provider: ProviderConfig;
}
export declare function resolveModelConfig(config: AgentConfig, alias?: string): ResolvedModelConfig;
