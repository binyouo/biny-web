import { z } from "zod";
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
    }, "strict", z.ZodTypeAny, {
        name: string;
        email?: string | undefined;
    }, {
        name: string;
        email?: string | undefined;
    }>>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    repository: z.ZodString;
    path: z.ZodString;
    /** 显式文件清单时直接逐个 raw 下载，完全绕开 GitHub tree API 的未认证限额。 */
    files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** 缺省 main；仓库默认分支不同（如 master）时显式声明。 */
    branch: z.ZodOptional<z.ZodString>;
    entry: z.ZodOptional<z.ZodString>;
    homepage: z.ZodOptional<z.ZodString>;
    featured: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strict", z.ZodTypeAny, {
    name: string;
    id: string;
    path: string;
    version: string;
    details: string;
    description: string;
    tags: string[];
    repository: string;
    category: string;
    featured: boolean;
    branch?: string | undefined;
    entry?: string | undefined;
    files?: string[] | undefined;
    author?: {
        name: string;
        email?: string | undefined;
    } | undefined;
    homepage?: string | undefined;
}, {
    name: string;
    id: string;
    path: string;
    version: string;
    description: string;
    repository: string;
    category: string;
    branch?: string | undefined;
    details?: string | undefined;
    entry?: string | undefined;
    files?: string[] | undefined;
    tags?: string[] | undefined;
    author?: {
        name: string;
        email?: string | undefined;
    } | undefined;
    homepage?: string | undefined;
    featured?: boolean | undefined;
}>;
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
    }, "strict", z.ZodTypeAny, {
        branch: string;
        path: string;
        repository: string;
    }, {
        branch: string;
        path: string;
        repository: string;
    }>>;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    sha256: z.ZodOptional<z.ZodString>;
    enabled: z.ZodBoolean;
    installedAt: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    name: string;
    id: string;
    version: string;
    directory: string;
    entry: string;
    enabled: boolean;
    description: string;
    installedAt: string;
    category: string;
    error?: string | undefined;
    source?: {
        branch: string;
        path: string;
        repository: string;
    } | undefined;
    sha256?: string | undefined;
    sizeBytes?: number | undefined;
}, {
    name: string;
    id: string;
    version: string;
    directory: string;
    entry: string;
    enabled: boolean;
    description: string;
    installedAt: string;
    category: string;
    error?: string | undefined;
    source?: {
        branch: string;
        path: string;
        repository: string;
    } | undefined;
    sha256?: string | undefined;
    sizeBytes?: number | undefined;
}>;
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
export declare function listEnabledProjectPluginPaths(workspaceRoot: string): Promise<string[]>;
export declare function listEnabledGlobalPluginPaths(): Promise<string[]>;
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
export declare function uninstallProjectPlugin(workspaceRoot: string, pluginId: string): Promise<void>;
export declare function uninstallGlobalPlugin(pluginId: string): Promise<void>;
export declare function projectPluginRoot(workspaceRoot: string): string;
export {};
