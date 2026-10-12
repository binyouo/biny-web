export type ManagedProcessState = "starting" | "running" | "exited" | "failed" | "stopped";
export interface HttpReadinessProbe {
    type: "http";
    url: string;
    expectedStatus?: number;
    timeoutMs?: number;
    intervalMs?: number;
}
export interface TcpReadinessProbe {
    type: "tcp";
    host: string;
    port: number;
    timeoutMs?: number;
    intervalMs?: number;
}
export interface LogReadinessProbe {
    type: "log";
    pattern: string;
    regex?: boolean;
    timeoutMs?: number;
    intervalMs?: number;
}
export type ManagedProcessReadinessProbe = HttpReadinessProbe | TcpReadinessProbe | LogReadinessProbe;
export type ManagedProcessReadinessStatus = "pending" | "ready" | "failed" | "timed_out";
export interface ManagedProcessReadinessResult {
    type: ManagedProcessReadinessProbe["type"];
    status: ManagedProcessReadinessStatus;
    passed: boolean;
    attempts: number;
    checkedAt: string;
    durationMs: number;
    message?: string;
    httpStatus?: number;
}
export interface ManagedProcessCleanupResult {
    status: "pending" | "stopped" | "not_needed" | "failed" | "transferred";
    at?: string;
    reason?: string;
    message?: string;
}
export interface ManagedProcessSnapshot {
    processId: string;
    pid: number;
    processGroupId?: number;
    command: string;
    cwd: string;
    state: ManagedProcessState;
    logPath: string;
    startedAt: string;
    exitedAt?: string;
    exitCode?: number;
    signal?: NodeJS.Signals;
    url?: string;
    readiness?: ManagedProcessReadinessResult;
    cleanup: ManagedProcessCleanupResult;
}
export interface StartManagedProcessOptions {
    command: string;
    /** 实际命令经过沙箱包装时，快照仍展示用户批准的原始命令。 */
    displayCommand?: string;
    cwd?: string;
    url?: string;
    readiness?: ManagedProcessReadinessProbe;
    signal?: AbortSignal;
}
export interface ReadManagedProcessOutputOptions {
    offset?: number;
    maxBytes?: number;
    fromEnd?: boolean;
}
export interface ManagedProcessOutput {
    processId: string;
    logPath: string;
    content: string;
    startOffset: number;
    nextOffset: number;
    totalBytes: number;
    omittedBefore: boolean;
    hasMore: boolean;
    /** Unconsumed live UTF-8 prefix; wait for output or exit, then retry nextOffset. */
    pendingUtf8Bytes?: number;
}
export interface ManagedProcessServiceOptions {
    workspaceRoot: string;
    persistenceRoot?: string;
    processLifetime?: ManagedProcessLifetime;
    terminationGraceMs?: number;
    killSettleMs?: number;
}
export type ManagedProcessLifetime = "runtime" | "execution-environment";
/** Error returned when a caller references an unknown runtime process ID. */
export declare class UnknownManagedProcessError extends Error {
    readonly processId: string;
    constructor(processId: string);
}
export declare class ManagedProcessService {
    private readonly workspaceRoot;
    private readonly persistenceRoot;
    private readonly processRoot;
    private readonly lifecycleLogPath;
    private readonly processLifetime;
    private readonly terminationGraceMs;
    private readonly killSettleMs;
    private readonly records;
    private initialization;
    private closePromise;
    private closing;
    constructor(options: ManagedProcessServiceOptions);
    initialize(): Promise<void>;
    start(options: StartManagedProcessOptions): Promise<ManagedProcessSnapshot>;
    status(processId: string): Promise<ManagedProcessSnapshot>;
    list(options?: {
        includeExited?: boolean;
    }): Promise<ManagedProcessSnapshot[]>;
    outputPath(processId: string): string;
    readOutput(processId: string, options?: ReadManagedProcessOutputOptions, signal?: AbortSignal): Promise<ManagedProcessOutput>;
    stop(processId: string, reason?: string): Promise<ManagedProcessSnapshot>;
    close(): Promise<ManagedProcessCleanupResult[]>;
    private requireRecord;
    private observeChild;
    private refreshRecord;
    private waitForReadiness;
    private waitForLogRegexReadiness;
    private recordLifecycle;
}
