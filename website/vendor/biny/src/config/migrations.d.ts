/**
 * 配置文档的一次性、纯数据迁移。
 *
 * 这里只转换 JSON shape，不读写文件。读取方在内存中使用当前结构；只有用户明确保存配置时
 * 才通过安全原子写入路径替换磁盘文档。
 */
export declare const GLOBAL_CONFIG_FORMAT: "biny-config";
export declare const GLOBAL_CONFIG_VERSION: 2;
export declare const PROJECT_SETTINGS_FORMAT: "biny-project-settings";
export declare const PROJECT_SETTINGS_VERSION: 2;
export interface ConfigMigrationResult {
    document: unknown;
}
export declare function migrateGlobalConfigDocument(value: unknown): ConfigMigrationResult;
export declare function migrateProjectSettingsDocument(value: unknown): ConfigMigrationResult;
