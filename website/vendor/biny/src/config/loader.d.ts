import { type AgentConfig } from "./schema.js";
export declare const CONFIG_FILE = "config.json";
export declare const maxConfigFileBytes: number;
export interface ConfigPathOptions {
    /** 测试或嵌入宿主可显式指定全局根目录；正常 CLI/TUI/Desktop 使用 BINY_AGENT_DIR 或默认路径。 */
    globalDir?: string;
}
/** 加载全局配置，再叠加当前项目的运行参数覆盖。 */
export declare function loadConfig(workspaceRoot: string, options?: ConfigPathOptions): Promise<AgentConfig>;
/** 只读取全局配置，不读取项目覆盖；供保存配置时保持全局字段的原始值。 */
export declare function loadGlobalConfig(options?: ConfigPathOptions): Promise<AgentConfig>;
/** 从指定的全局配置目录读取当前格式，测试和桌面端可显式传入隔离目录。 */
export declare function loadConfigFile(root: string): Promise<AgentConfig>;
export declare function saveConfig(workspaceRoot: string, config: AgentConfig, options?: ConfigPathOptions): Promise<void>;
/** 保存指定目录下的完整配置文件；凭据字段会被显式清空，不会写入 JSON。 */
export declare function saveConfigFile(root: string, config: AgentConfig): Promise<void>;
export declare function ensureConfig(workspaceRoot: string, options?: ConfigPathOptions): Promise<void>;
