import type { AgentConfig } from "../config/schema.js";
import type { Tool } from "../tools/types.js";
import type { ToolRegistry } from "../tools/registry.js";
import type { ModelCatalogEntry, ProviderDefinition } from "../ai/types.js";
import { AiRegistry } from "../llm/AiRegistry.js";
import type { CredentialRefreshHandler } from "../llm/AiRegistry.js";
import { PluginLifecycleRegistry, type PluginTurnLifecycle } from "./pluginLifecycle.js";
import type { PluginSettings } from "./pluginSettings.js";
/** 受管 Plugin 的加载目标：入口路径加上清单里声明并解析好的设置值。 */
export interface PluginLoadTarget {
    path: string;
    settings: Readonly<PluginSettings>;
}
export interface BinyPluginContext {
    workspaceRoot: string;
    config: AgentConfig;
    /** 受管 Plugin 拿到 biny-plugin.json 声明值与默认值的合并结果；其他来源拿到空对象。 */
    settings: Readonly<PluginSettings>;
    registerTool(tool: Tool): void;
    registerProvider(definition: ProviderDefinition, models?: readonly ModelCatalogEntry[]): void;
    registerModels(providerType: string, models: readonly ModelCatalogEntry[]): void;
    registerCredentialHandler(id: string, handler: CredentialRefreshHandler): void;
    registerTurnLifecycle(lifecycle: PluginTurnLifecycle): void;
}
export declare function loadPlugins(workspaceRoot: string, configuredPaths: ReadonlyArray<string | PluginLoadTarget>, config: AgentConfig, registry: ToolRegistry, ai?: AiRegistry, lifecycle?: PluginLifecycleRegistry): Promise<string[]>;
/** 从指定受管根目录加载插件；全局插件只能通过全局配置根目录进入这里。 */
export declare function loadPluginsFromRoot(workspaceRoot: string, pluginRoot: string, configuredPaths: ReadonlyArray<string | PluginLoadTarget>, config: AgentConfig, registry: ToolRegistry, ai?: AiRegistry, lifecycle?: PluginLifecycleRegistry): Promise<string[]>;
