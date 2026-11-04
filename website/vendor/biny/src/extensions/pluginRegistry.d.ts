import { z } from "zod";
import type { PluginLoadTarget } from "./plugins.js";
export declare const BINY_PLUGIN_REGISTRY_URL = "https://raw.githubusercontent.com/Thinkya1/Biny/main/plugins/registry.json";
declare const pluginMarketEntrySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    details: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    author: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    repository: z.ZodString;
    path: z.ZodString;
    files: z.ZodOptional<z.ZodArray<z.ZodString>>;
    branch: z.ZodOptional<z.ZodString>;
    entry: z.ZodOptional<z.ZodString>;
    homepage: z.ZodOptional<z.ZodString>;
    featured: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strict>;
declare const managedPluginSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    directory: z.ZodString;
    entry: z.ZodString;
    source: z.ZodOptional<z.ZodObject<{
        repository: z.ZodString;
        path: z.ZodString;
        branch: z.ZodString;
    }, z.core.$strict>>;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    sha256: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    homepage: z.ZodOptional<z.ZodString>;
    configuration: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        properties: z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            default: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"string">;
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            default: z.ZodOptional<z.ZodString>;
            enum: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"number">;
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            default: z.ZodOptional<z.ZodNumber>;
            minimum: z.ZodOptional<z.ZodNumber>;
            maximum: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>], "type">>;
    }, z.core.$strict>>;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodBoolean, z.ZodString, z.ZodNumber]>>>;
    enabled: z.ZodBoolean;
    installedAt: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type PluginMarketEntry = z.infer<typeof pluginMarketEntrySchema>;
export type ManagedPlugin = z.infer<typeof managedPluginSchema>;
export interface PluginRegistryDocument {
    format: 1;
    plugins: PluginMarketEntry[];
}
export interface ProjectPluginManifest {
    format: 1;
    plugins: ManagedPlugin[];
}
export interface PluginRegistryCache {
    fetchedAt: string;
    document: PluginRegistryDocument;
}
export declare function parsePluginRegistry(value: unknown): PluginRegistryDocument;
/** 市场条目的 repository 必须是 GitHub 仓库首页地址；安装走 GitHub tree/raw API。 */
export declare function parsePluginRepository(value: string): {
    owner: string;
    name: string;
};
export declare function readProjectPluginManifest(workspaceRoot: string): Promise<ProjectPluginManifest>;
export declare function readGlobalPluginManifest(): Promise<ProjectPluginManifest>;
export declare function writeProjectPluginManifest(workspaceRoot: string, manifest: ProjectPluginManifest): Promise<void>;
export declare function writeGlobalPluginManifest(manifest: ProjectPluginManifest): Promise<void>;
export declare function readPluginRegistryCache(workspaceRoot: string): Promise<PluginRegistryCache | undefined>;
export declare function writePluginRegistryCache(workspaceRoot: string, cache: PluginRegistryCache): Promise<void>;
export declare function listEnabledProjectPlugins(workspaceRoot: string): Promise<PluginLoadTarget[]>;
export declare function listEnabledGlobalPlugins(): Promise<PluginLoadTarget[]>;
export declare function installPluginFromRepository(options: {
    workspaceRoot: string;
    plugin: PluginMarketEntry;
    fetcher?: typeof globalThis.fetch;
}): Promise<ManagedPlugin>;
export declare function installGlobalPluginFromRepository(options: {
    plugin: PluginMarketEntry;
    fetcher?: typeof globalThis.fetch;
}): Promise<ManagedPlugin>;
export declare function setProjectPluginEnabled(workspaceRoot: string, pluginId: string, enabled: boolean): Promise<ManagedPlugin>;
export declare function setGlobalPluginEnabled(pluginId: string, enabled: boolean): Promise<ManagedPlugin>;
export declare function setProjectPluginSettings(workspaceRoot: string, pluginId: string, settings: unknown): Promise<ManagedPlugin>;
export declare function setGlobalPluginSettings(pluginId: string, settings: unknown): Promise<ManagedPlugin>;
export declare function uninstallProjectPlugin(workspaceRoot: string, pluginId: string): Promise<void>;
export declare function uninstallGlobalPlugin(pluginId: string): Promise<void>;
export declare function projectPluginRoot(workspaceRoot: string): string;
export {};
