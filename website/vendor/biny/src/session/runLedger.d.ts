import { type RuntimeHighWater } from "./runtimeEvent.js";
declare const ledgerVersion: 1;
export type SessionRunStatus = "running" | "completed" | "incomplete" | "blocked" | "cancelled" | "aborted" | "failed";
export interface SessionRunRecord {
    version: typeof ledgerVersion;
    runId: string;
    sessionId: string;
    messageId?: string;
    runtimeId?: string;
    turnId?: string;
    pid: number;
    status: SessionRunStatus;
    startedAt: string;
    updatedAt: string;
    endedAt?: string;
    durationMs?: number;
    stopReason?: string;
    finishReason?: string;
    steps?: number;
    resumable?: boolean;
    blockedReason?: string;
    requiredAction?: string;
    error?: string;
    terminalEventId?: string;
    terminalEventSeq?: number;
}
export interface StartSessionRunOptions {
    runId: string;
    sessionId: string;
    messageId?: string;
    runtimeId?: string;
    turnId?: string;
    pid?: number;
    startedAt?: string;
}
export interface FinishSessionRunOptions {
    status: Exclude<SessionRunStatus, "running">;
    durationMs?: number;
    stopReason?: string;
    finishReason?: string;
    steps?: number;
    resumable?: boolean;
    blockedReason?: string;
    requiredAction?: string;
    error?: string;
    endedAt?: string;
    terminal?: RuntimeHighWater;
}
export declare class SessionRunLedger {
    private readonly persistenceRoot;
    constructor(persistenceRoot: string);
    start(options: StartSessionRunOptions): Promise<SessionRunRecord>;
    finish(runId: string, options: FinishSessionRunOptions): Promise<SessionRunRecord | undefined>;
    read(runId: string): Promise<SessionRunRecord | undefined>;
    listSessionRuns(sessionId: string): Promise<SessionRunRecord[]>;
    latestSessionRun(sessionId: string): Promise<SessionRunRecord | undefined>;
    /** 一次读取 ledger 目录并返回指定 session 的最新 run，避免列表按 session 重复 readdir。 */
    latestSessionRuns(sessionIds: readonly string[]): Promise<Map<string, SessionRunRecord>>;
    /** 删除某个 session 的所有运行投影；其它 session 的 ledger 不受影响。 */
    deleteSessionRuns(sessionId: string): Promise<void>;
    private reconcileStale;
    private readCanonicalTerminal;
    private write;
    private writeAt;
    private ensureDirectory;
}
export {};
