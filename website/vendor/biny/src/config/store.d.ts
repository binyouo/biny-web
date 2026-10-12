import { type DeferredCredentialTransactionStatus, type CredentialStore } from "./credentials.js";
import type { AgentConfig } from "./schema.js";
import { type VersionedConfigSnapshot } from "./versioned.js";
/** 运行时面向的配置存储接口。 */
export interface AgentConfigStore {
    /** 文件型配置的监听入口；内存实现无需提供。 */
    configPath?(): string;
    load(workspaceRoot?: string): Promise<AgentConfig>;
    save(config: AgentConfig, workspaceRoot?: string): Promise<void>;
    /** 凭据是否能被独立 Runtime Host 进程读取；Desktop safeStorage 只在主进程可用。 */
    supportsDetachedRuntimeHost?: boolean;
    /** 当前进程内成功写入配置的版本号；runtime 用它避免每次 prompt 都重新读盘。 */
    revision?(): number;
    /** 跨进程配置 CAS；个性化和记忆策略的 UI/RPC 写入必须使用这组接口。 */
    loadVersioned?(workspaceRoot?: string): Promise<VersionedConfigSnapshot>;
    saveVersioned?(config: AgentConfig, expectedRevision: string, workspaceRoot?: string): Promise<VersionedConfigSnapshot>;
    /** Desktop 外层设置事务使用：保存后保留 Keychain before/target，直到显式 finalize/rollback。 */
    saveVersionedDeferred?(config: AgentConfig, expectedRevision: string, deferredFor: string, workspaceRoot?: string): Promise<VersionedConfigSnapshot>;
    deferredCredentialStatus?(deferredFor: string, workspaceRoot?: string): Promise<DeferredCredentialTransactionStatus>;
    finalizeDeferredCredentials?(deferredFor: string, workspaceRoot?: string): Promise<void>;
    rollbackVersionedDeferred?(before: AgentConfig, targetRevision: string, deferredFor: string, workspaceRoot?: string): Promise<"not_needed" | "completed" | "failed">;
    rollbackDeferredCredentials?(deferredFor: string, workspaceRoot?: string): Promise<"not_needed" | "completed" | "failed">;
}
export interface FileConfigStoreOptions {
    credentialStore?: CredentialStore;
    globalDir?: string;
}
/**
 * 在共享全局配置上执行一个只改自己字段的更新。
 *
 * Desktop、TUI 和 Runtime Host 可能各自持有不同的配置快照。普通的 load + save
 * 只能保证单次写入不互相覆盖，不能保证两次读改写之间没有第三方更新；带版本存储
 * 的实现用 CAS 检测冲突，重读后重新计算候选配置，避免模型切换和权限更新互相回滚。
 */
export declare function updateConfig(store: AgentConfigStore, workspaceRoot: string | undefined, update: (config: AgentConfig) => AgentConfig): Promise<AgentConfig>;
export declare function createFileConfigStore(workspaceRoot: string, options?: FileConfigStoreOptions): AgentConfigStore;
