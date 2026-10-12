import type { AgentConfig } from "../config/schema.js";
import type { Tool } from "../tools/types.js";
import type { ToolRegistry } from "../tools/registry.js";
import type { ModelCatalogEntry, ProviderDefinition } from "../ai/types.js";
import { AiRegistry } from "../llm/AiRegistry.js";
import type { CredentialRefreshHandler } from "../llm/AiRegistry.js";
export interface BinyPluginContext {
    workspaceRoot: string;
    config: AgentConfig;
    registerTool(tool: Tool): void;
    registerProvider(definition: ProviderDefinition, models?: readonly ModelCatalogEntry[]): void;
    registerModels(providerType: string, models: readonly ModelCatalogEntry[]): void;
    registerCredentialHandler(id: string, handler: CredentialRefreshHandler): void;
}
export declare function loadPlugins(workspaceRoot: string, configuredPaths: string[], config: AgentConfig, registry: ToolRegistry, ai?: AiRegistry): Promise<string[]>;
/** 从指定受管根目录加载插件；全局插件只能通过全局配置根目录进入这里。 */
export declare function loadPluginsFromRoot(workspaceRoot: string, pluginRoot: string, configuredPaths: string[], config: AgentConfig, registry: ToolRegistry, ai?: AiRegistry): Promise<string[]>;
