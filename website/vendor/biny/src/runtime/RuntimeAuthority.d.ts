import { DatabaseSync } from "node:sqlite";
import { type RuntimeEventIdentity, type RuntimeEventSink } from "../session/runtimeEvent.js";
export type RuntimeRunStatus = "admitted" | "running" | "completed" | "blocked" | "incomplete" | "cancelled" | "aborted" | "failed" | "unknown";
export interface RuntimeEvent {
    eventId: string;
    workspaceId: string;
    sessionId: string;
    invocationId: string;
    runId: string;
    turnId: string;
    eventSeq?: number;
    sequence: number;
    eventType: string;
    payload: unknown;
    createdAt: string;
}
export interface RuntimeEventPage {
    events: RuntimeEvent[];
    nextCursor?: number;
    hasMore: boolean;
    /** 当前数据库没有事件裁剪，因此 cursor 永远不会产生 gap。保留字段供 Host 协议使用。 */
    gap: false;
}
export interface RuntimeRunRecord {
    runId: string;
    workspaceId: string;
    sessionId: string;
    invocationId: string;
    turnId: string;
    parentRunId?: string;
    continuationSource?: string;
    status: RuntimeRunStatus;
    createdAt: string;
    updatedAt: string;
    terminalEventId?: string;
    terminalStatus?: RuntimeRunStatus;
    terminalPayload?: unknown;
    payload?: unknown;
}
export interface RuntimeRunStartInput {
    runId: string;
    sessionId: string;
    invocationId?: string;
    turnId: string;
    parentRunId?: string;
    continuationSource?: string;
    /** 重新生成的目标消息 identity；存在时表示本次运行是同一消息槽的版本重试。 */
    retryOfMessageId?: string;
    payload?: unknown;
    createdAt?: string;
}
export interface RuntimeRunStartResult extends RuntimeRunRecord {
    /** 仅表示本次调用是否真正创建了 admission；重试不会重新执行 AgentRun。 */
    created: boolean;
}
export interface RuntimeRunFinishInput {
    runId: string;
    status: RuntimeRunStatus;
    /** Omission preserves a terminal payload; repeated canonical session projections only enrich known evidence fields. */
    payload?: unknown;
    terminalEventId?: string;
    createdAt?: string;
}
export interface RuntimeRunListOptions {
    sessionId?: string;
    status?: RuntimeRunStatus;
    limit?: number;
    cursor?: string;
}
export interface RuntimeRunPage {
    runs: RuntimeRunRecord[];
    nextCursor?: string;
    hasMore: boolean;
}
export interface RuntimeContinuationClaim {
    sourceRunId: string;
    childRunId: string;
    claimToken: string;
    createdAt: string;
}
export interface RuntimeAuthorityOptions {
    workspaceId?: string;
    backfillLegacySessions?: boolean;
}
export interface RuntimeEventAppendInput {
    eventId?: string;
    eventSeq?: number;
    sessionId: string;
    invocationId?: string;
    runId: string;
    turnId: string;
    eventType: string;
    payload?: unknown;
    createdAt?: string;
}
/** SQLite authority 的 workspace 级打开句柄。每个进程只应持有短生命周期的同步操作。 */
export declare class RuntimeEventAuthority implements RuntimeEventSink {
    private readonly persistenceRoot;
    private readonly database;
    readonly databasePath: string;
    readonly workspaceId: string;
    private closed;
    private constructor();
    static open(persistenceRoot: string, options?: RuntimeAuthorityOptions): Promise<RuntimeEventAuthority>;
    /** 浏览持久化投影不创建数据库、不迁移 schema，也不修复在途执行状态。 */
    static openReadOnly(persistenceRoot: string): Promise<RuntimeEventAuthority | undefined>;
    /** 让 CommandRuntime 把自身的 SessionRecorder 绑定到同一 authority。 */
    asSink(): RuntimeEventSink;
    /** Store 与 authority 共用一个 DatabaseSync，避免跨连接双写无法原子提交。 */
    databaseHandle(): DatabaseSync;
    /** 仅用于没有额外事实事件的 projection-only 更新。 */
    runTransaction<T>(execute: () => T): T;
    /** 将 runtime fact 与其 SQLite projection 放入同一 SQLite transaction。 */
    runEventTransaction<T>(input: RuntimeEventAppendInput | (() => RuntimeEventAppendInput | undefined), execute: () => T): T;
    appendSessionEvent(input: {
        sessionId: string;
        runtime: RuntimeEventIdentity;
        event: unknown;
        createdAt: string;
    }): void;
    /**
     * 根 run admission 是不可重复的：同一个 runId 重试只返回已有 header，
     * 但如果客户端试图复用它表示另一个 turn，则 fail-closed。
     */
    startRun(input: RuntimeRunStartInput): RuntimeRunStartResult;
    /** 把 Host 的 accepted/running 状态投影到 authority；不会覆盖 terminal run。 */
    markRunRunning(runId: string, createdAt?: string): RuntimeRunRecord;
    finishRun(input: RuntimeRunFinishInput): RuntimeRunRecord;
    /**
     * continuation 的幂等 claim。重连或 Host takeover 重试时，已经 claim 的 source
     * 只返回原 child，不会再次启动一个可能重复副作用的 AgentRun。
     */
    claimContinuation(sourceRunId: string, childRunId: string, claimToken?: `${string}-${string}-${string}-${string}-${string}`, createdAt?: string): RuntimeContinuationClaim;
    /**
     * 释放尚未创建 child run 的 continuation claim。child 一旦落库就不能删除 claim，
     * 否则恢复重试会再次执行同一个 continuation。
     */
    releaseContinuationClaim(sourceRunId: string, childRunId: string, reason?: string, createdAt?: string): boolean;
    appendEvent(input: {
        eventId?: string;
        eventSeq?: number;
        sessionId: string;
        invocationId?: string;
        runId: string;
        turnId: string;
        eventType: string;
        payload?: unknown;
        createdAt?: string;
    }): RuntimeEvent;
    readEvents(options?: {
        afterSequence?: number;
        limit?: number;
        runId?: string;
        sessionId?: string;
        runOrTurnId?: string;
    }): RuntimeEventPage;
    /** 按稳定 toolCallId 从统一事实表读取跨 Session 的工具事件，供 Host 接管后恢复同一次操作。 */
    readToolEvents(toolCallIds: readonly string[]): RuntimeEvent[];
    getRun(runId: string): RuntimeRunRecord | undefined;
    /**
     * 把某个 run 已落盘的 JSONL 终态立即补投影到 SQLite。
     *
     * AgentSession 的 turn_status 是 canonical fact；Host 在取消与收尾竞争中若未能完成
     * projection，可以调用这里恢复 authority，而不用等 owner 进程重启后做全量 backfill。
     */
    reconcileRunFromSession(runId: string): Promise<RuntimeRunRecord | undefined>;
    listRuns(options?: RuntimeRunListOptions): RuntimeRunPage;
    schemaRevision(): number;
    close(): void;
    /** 将变化过的 JSONL 事实幂等投影到 authority，修复进程崩溃留下的缺口。 */
    private reconcileSessionProjections;
    private reconcileTerminalRunInTransaction;
    private migrate;
    /** Optional physical optimization; schema-13 readers never require this index. */
    private ensureTaskAttemptIndex;
    /** Reading a valid existing index must not acquire a write lock. */
    private hasTaskAttemptIndex;
    private createSessionGoalSchema;
    private hasColumn;
    private appendEventInTransaction;
    private readRun;
    private readEventById;
    private requireRun;
    private transaction;
    private assertOpen;
}
