export declare const BINY_AGENT_DIR_ENV = "BINY_AGENT_DIR";
export declare const DEFAULT_AGENT_DIR: string;
export declare const DEFAULT_CONFIG_DIR: string;
export declare const GLOBAL_CONFIG_FILE = "config.json";
export declare const PROJECT_SETTINGS_FILE = "settings.json";
export declare const MODELS_STORE_FILE = "models-store.json";
export declare const GLOBAL_PLUGIN_DIR = "plugins";
export declare const AGENT_DATABASE_FILE = "agent.sqlite";
export declare function isTestProcess(): boolean;
/** 测试可以显式指定临时目录，但不能把默认路径或其符号链接当成隔离目录。 */
export declare function assertTestStatePathIsolated(root: string): void;
export interface PathEnvironment {
    env?: NodeJS.ProcessEnv;
    homeDir?: string;
}
export declare function globalAgentDir(options?: PathEnvironment): string;
export declare function globalConfigPath(options?: PathEnvironment): string;
export declare function globalConfigDir(options?: PathEnvironment): string;
/** 动态 Provider 模型目录属于全局模型配置，不按工作区重复保存。 */
export declare function globalModelsStorePath(options?: PathEnvironment): string;
export declare function globalPluginRoot(options?: PathEnvironment): string;
/** 项目会话按规范化绝对路径隔离，避免不同工作区的 latest、id 前缀和锁互相干扰。 */
export declare function projectSessionsDir(workspaceRoot: string, options?: PathEnvironment): string;
/** 项目运行状态的全局分区；名称规则与项目 session 一致，避免同名工作区互相覆盖。 */
export declare function workspaceAgentDir(workspaceRoot: string, options?: PathEnvironment): string;
/** 新目录名 `<basename>-<hash8>`，供 store.ts 迁移和测试断言使用。 */
export declare function projectStateDirName(workspaceRoot: string): string;
/** 旧版目录名是纯 24hex（sha256 前 24 位）；只在迁移旧目录时用到。 */
export declare function legacyProjectStateDirName(workspaceRoot: string): string;
export declare function projectBinyDir(workspaceRoot: string): string;
export declare function projectSettingsPath(workspaceRoot: string): string;
