import type { AgentConfig } from "./schema.js";
export interface VersionedConfigSnapshot {
    config: AgentConfig;
    revision: string;
}
export declare class ConfigRevisionConflictError extends Error {
    readonly expectedRevision: string;
    readonly actualRevision: string;
    readonly name = "ConfigRevisionConflictError";
    constructor(expectedRevision: string, actualRevision: string);
}
/** revision 覆盖非凭据配置和凭据槽位的非机密版本；Keychain/token 正文既不进入 IPC，也不进入哈希。 */
export declare function configDocumentRevision(config: AgentConfig): string;
export declare function assertConfigRevision(expectedRevision: string, config: AgentConfig): void;
export declare function withGlobalConfigWriteLock<T>(root: string, operation: () => Promise<T>): Promise<T>;
/** 只保留"变了就必须重建 Runtime"的字段，其余键被剔除，使 revision 比较忽略它们。 */
export declare function restartRelevantConfig(config: AgentConfig): AgentConfig;
/**
 * 这次配置变更是否需要重启驻留的 Runtime Host。
 *
 * 判据不能用"revision 变了"——那等于把所有设置都当成需要重启。
 * 用一个记忆开关把所有项目的 Host 拖去重启，正是"开关要等很久"的来源。
 */
export declare function configChangeRequiresRuntimeRestart(before: AgentConfig, after: AgentConfig): boolean;
