import type { AgentConfig } from "./schema.js";
export declare const BINY_KEYCHAIN_SERVICE = "com.biny.agent";
export declare const CREDENTIAL_TRANSACTION_JOURNAL = ".credentials.transaction.json";
export type ProviderCredentialKind = "apiKey" | "refreshToken";
export interface CredentialStore {
    readonly persistent: boolean;
    get(account: string): Promise<string | undefined>;
    set(account: string, value: string): Promise<void>;
    delete(account: string): Promise<void>;
    /** 文件配置的凭据 nonce 变化时，让缓存实现丢弃相应槽位；nonce 只作相等比较。 */
    observeCredentialRevisions?(revisions: Readonly<Record<string, string>> | undefined): void;
}
export type DeferredCredentialTransactionStatus = "missing" | "before" | "target";
export interface CredentialTransactionOptions {
    deferredFor?: string;
}
export declare class CredentialRecoveryRequiredError extends Error {
    readonly cause?: unknown | undefined;
    readonly name = "CredentialRecoveryRequiredError";
    constructor(message: string, cause?: unknown | undefined);
}
export interface KeychainCommandResult {
    stdout: string;
    stderr?: string;
}
export type KeychainCommand = (command: string, args: string[], input?: string) => Promise<KeychainCommandResult>;
export declare class MacKeychainCredentialStore implements CredentialStore {
    private readonly run;
    readonly persistent = true;
    /**
     * 进程内凭据缓存。`security` 每次调用都要 fork 一个子进程、在钥匙串锁定/等授权时还会
     * 阻塞到超时；设置保存一次要全量水合配置好几轮，逐 provider 同步进程是主要卡顿来源。
     * 这里把读到的值缓存进内存：之后的 get 命中内存、不再 fork；set/delete 仍真实落 Keychain
     * 并同步缓存。其它进程的配置提交由凭据 nonce 使对应槽位失效。
     */
    private readonly cache;
    private readonly cacheReadGenerations;
    private observedCredentialRevisions;
    constructor(run?: KeychainCommand);
    observeCredentialRevisions(revisions: Readonly<Record<string, string>> | undefined): void;
    private invalidateCache;
    get(account: string): Promise<string | undefined>;
    set(account: string, value: string): Promise<void>;
    delete(account: string): Promise<void>;
}
/** 非 macOS 的显式无持久化实现，避免误把凭据写入一个看似安全但未审计的文件。 */
export declare class EnvironmentCredentialStore implements CredentialStore {
    readonly persistent = false;
    get(_account: string): Promise<string | undefined>;
    set(_account: string, _value: string): Promise<void>;
    delete(_account: string): Promise<void>;
}
export declare function createCredentialStore(platform?: NodeJS.Platform): CredentialStore;
export declare function providerCredentialAccount(providerAlias: string, kind: ProviderCredentialKind): string;
export declare function applyStoredCredentials(config: AgentConfig, store: CredentialStore): Promise<AgentConfig>;
export declare function loadStoredCredentials(config: AgentConfig, store: CredentialStore): Promise<AgentConfig>;
export declare function saveStoredCredentials(config: AgentConfig, store: CredentialStore, previous?: AgentConfig): Promise<void>;
/**
 * Keychain 与 config.json 的补偿事务。
 *
 * journal 只保存 account 名和配置 revision；旧值与目标值都写入事务专用临时 Keychain
 * account。进程在任何一步退出后，下一次 load 都能根据 config 文档 revision 完成目标或恢复
 * 旧值，而无需让密钥正文落入文件。
 */
export declare function saveConfigAndStoredCredentials(config: AgentConfig, previous: AgentConfig, store: CredentialStore, journalPath: string, persistConfig: () => Promise<void>, loadConfigDocument: () => Promise<AgentConfig>, options?: CredentialTransactionOptions): Promise<void>;
/**
 * 给每个凭据槽位维护一个不含密钥正文的随机版本。
 *
 * 公共配置字段的 revision 不能直接哈希 Keychain 正文，否则 revision 会变成凭据指纹；
 * 但完全忽略凭据又会让旧配置快照覆盖并发写入的新密钥。随机 nonce 由配置事务随同
 * config.json 原子保存，足以让旧快照在 saveVersioned 的 CAS 预检阶段失败。
 */
export declare function synchronizeCredentialRevisions(config: AgentConfig, previous: AgentConfig): void;
/**
 * 检查当前是否存在待恢复/待清理的凭据事务。
 *
 * 这只是瞬时状态，不能证明后续读取安全：writer 可在检查之后创建并清理整个 journal。
 * 配置文档读取、事务恢复和凭据水合仍须在同一个全局配置锁内完成。
 */
export declare function hasPendingCredentialTransaction(journalPath: string): Promise<boolean>;
/** load 边界先恢复未完成的凭据事务；无法证明方向时 fail closed，不返回混合状态。 */
export declare function recoverStoredCredentialTransaction(store: CredentialStore, journalPath: string, loadConfigDocument: () => Promise<AgentConfig>): Promise<void>;
/** 复读并校准延迟事务，但保留临时 Keychain account 供外层最终提交或补偿。 */
export declare function deferredCredentialTransactionStatus(store: CredentialStore, journalPath: string, loadConfigDocument: () => Promise<AgentConfig>, deferredFor: string): Promise<DeferredCredentialTransactionStatus>;
/** 外层设置事务完成复读后才清理 Keychain 备份。 */
export declare function finalizeDeferredCredentialTransaction(store: CredentialStore, journalPath: string, loadConfigDocument: () => Promise<AgentConfig>, deferredFor: string): Promise<void>;
/**
 * 外层事务补偿凭据，并可在同一个配置写锁内恢复 config 文档。
 * rolling_back/rolled_back 让 before==target 时也能在崩溃后继续沿补偿方向恢复。
 */
export declare function rollbackDeferredCredentialTransaction(store: CredentialStore, journalPath: string, loadConfigDocument: () => Promise<AgentConfig>, deferredFor: string, persistRollback?: () => Promise<void>): Promise<DeferredCredentialTransactionStatus>;
