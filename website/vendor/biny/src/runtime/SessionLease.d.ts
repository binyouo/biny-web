interface FileIdentity {
    device: number;
    inode: number;
}
/**
 * session 已经被另一个 surface/process 以 writer 身份持有。
 *
 * 这个错误在 Runtime Host 和本地 SessionLease 两条路径上共用，
 * 让 Desktop/TUI 不需要解析一段不稳定的自然语言错误。
 */
export interface SessionWriterConflictInfo {
    sessionId: string;
    ownerPid?: number;
    ownerSurface?: string;
    conflictKind?: "execution" | "external_writer";
    runId?: string;
}
export declare class SessionWriterConflictError extends Error implements SessionWriterConflictInfo {
    readonly code: "session_writer_conflict";
    readonly sessionId: string;
    readonly ownerPid?: number;
    readonly ownerSurface?: string;
    readonly conflictKind: "execution" | "external_writer";
    readonly runId?: string;
    constructor(sessionId: string, ownerPid?: number, ownerSurface?: string, message?: string, detail?: Pick<SessionWriterConflictInfo, "conflictKind" | "runId">);
}
export declare class SessionLeaseError extends SessionWriterConflictError {
    readonly pid: number;
    constructor(pid: number, sessionId: string);
}
export declare function isSessionWriterConflictError(error: unknown): error is SessionWriterConflictError;
export declare class SessionLease {
    private closed;
    private readonly store;
    readonly sessionId: string;
    private readonly identity;
    private readonly runtimeId;
    constructor(store: SessionLeaseStore, sessionId: string, identity: FileIdentity, runtimeId: string);
    close(): void;
}
export declare class SessionLeaseStore {
    readonly runtimeId: `${string}-${string}-${string}-${string}-${string}`;
    private readonly leases;
    private closed;
    readonly persistenceRoot: string;
    private readonly directoryPath;
    private readonly directoryIdentity;
    private constructor();
    static open(persistenceRoot: string): Promise<SessionLeaseStore>;
    acquire(sessionId: string): SessionLease;
    close(): void;
    release(sessionId: string, runtimeId: string, identity: FileIdentity): void;
    private acquireAuthority;
    private authorityIdentityAtPath;
    private createLease;
    private readLease;
    private readSecureFile;
    private retireStaleLease;
    private leasePath;
    private fileIdentityAtPath;
    private assertDirectoryBinding;
    private assertOpen;
}
export {};
