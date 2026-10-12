import type { SubagentTaskSnapshot } from "./SubagentTaskManager.js";
import { RuntimeEventAuthority, type RuntimeEventPage } from "./RuntimeAuthority.js";
import { type TaskCandidateArtifacts, type TaskVerificationApproval } from "./taskVerification.js";
export type TaskRunStatus = "queued" | "created" | "running" | "verifying" | "completed" | "failed" | "incomplete" | "blocked" | "policy_denied" | "budget_exhausted" | "needs_approval" | "aborted" | "cancelled";
export type TaskRetrySafety = "safe" | "idempotent" | "unsafe" | "unknown";
export interface TaskRunRecord {
    taskRunId: string;
    workspaceId: string;
    sessionId?: string;
    parentRunId?: string;
    status: TaskRunStatus;
    task: unknown;
    createdAt: string;
    updatedAt: string;
    terminalEventId?: string;
    revision: number;
}
export interface TaskAttemptRecord {
    attemptId: string;
    taskRunId: string;
    runId: string;
    turnId: string;
    parentRunId?: string;
    status: TaskRunStatus;
    highWaterSequence?: number;
    retrySafety: TaskRetrySafety;
    verification?: unknown;
    artifacts?: unknown;
    failure?: unknown;
    createdAt: string;
    updatedAt: string;
}
export interface TaskRunWithAttempts extends TaskRunRecord {
    attempts: TaskAttemptRecord[];
}
export interface LegacyWorkerOwnerProof {
    taskRunId: string;
    attemptId: string;
    expectedRevision: number;
    sessionId: string;
    parentRunId: string;
    runId: string;
    turnId: string;
    prompt: string;
    workspaceRoot: string;
    parentEventIds: string[];
    /** Present only when exact output and completed Worker terminal evidence agree. */
    completionDigest?: string;
}
/** Only the original ownerless slash admission or its exact restart blocker. */
export declare function isLegacyWorkerOwnerBoundary(task: TaskRunWithAttempts): boolean;
export interface TaskRunEvent {
    eventId: string;
    attemptId?: string;
    eventType: string;
    payload: unknown;
    createdAt: string;
}
export interface TaskRunCreateInput {
    taskRunId?: string;
    sessionId?: string;
    parentRunId?: string;
    task: unknown;
}
export interface TaskAttemptCreateInput {
    attemptId?: string;
    runId?: string;
    turnId?: string;
    parentRunId?: string;
    retrySafety?: TaskRetrySafety;
}
export interface TaskRunListOptions {
    order?: "asc" | "desc";
    status?: TaskRunStatus;
    limit?: number;
    cursor?: number;
}
export declare class DurableTaskRunStore {
    private readonly database;
    private readonly authority;
    readonly databasePath: string;
    private closed;
    private constructor();
    static open(persistenceRoot: string, authority: RuntimeEventAuthority): Promise<DurableTaskRunStore>;
    create(input: TaskRunCreateInput): TaskRunRecord;
    createAttempt(taskRunId: string, input?: TaskAttemptCreateInput): TaskAttemptRecord;
    transition(taskRunId: string, status: TaskRunStatus, input?: {
        attemptId?: string;
        highWaterSequence?: number;
        verification?: unknown;
        artifacts?: unknown;
        failure?: unknown;
    }): TaskRunWithAttempts;
    /** 进程重启后，旧的 queued/running 投影可以安全回到队列，再由新进程重新派发。 */
    requeue(taskRunId: string, reason?: string): TaskRunWithAttempts;
    /**
     * 验收失败只结束当前 Attempt，TaskRun 回到队列等待同一闭环的定向修复。
     * 旧 Attempt 的失败证据必须保留，不能被下一次 Attempt 的 queued 状态覆盖。
     */
    prepareVerificationRepair(taskRunId: string, attemptId: string, input: {
        verification: unknown;
        artifacts: unknown;
        failure: unknown;
    }): TaskRunWithAttempts;
    /** Approval is bound to the current pending check; duplicates never rewrite its evidence. */
    approveVerification(taskRunId: string, input: {
        attemptId: string;
        expectedRevision: number;
        approval: TaskVerificationApproval;
        artifacts: TaskCandidateArtifacts;
    }): TaskRunWithAttempts;
    resumeWorkerAttempt(taskRunId: string, attemptId: string, expectedRevision: number): TaskRunWithAttempts;
    /** Called only after the exact legacy Worker has prepared under its recorded policy. */
    reconcileWorkerOwner(proof: LegacyWorkerOwnerProof): TaskRunWithAttempts;
    /** 只有失败任务可以显式重试；新 attempt 会在执行入口创建。 */
    retry(taskRunId: string): TaskRunWithAttempts;
    syncSubagentSnapshot(snapshot: SubagentTaskSnapshot, binding?: {
        taskRunId?: string;
        attemptId?: string;
        completedStatus?: "completed" | "verifying";
        sessionId?: string;
    }, output?: string): TaskRunWithAttempts;
    /** 按已准入的 Attempt 查询独立 Worker 历史，不改变任务或恢复执行。 */
    workerTrail(taskRunId: string, options?: {
        limit?: number;
        afterSequence?: number;
        attemptId?: string;
    }): RuntimeEventPage;
    get(taskRunId: string): TaskRunWithAttempts | undefined;
    list(options?: TaskRunListOptions): {
        tasks: TaskRunWithAttempts[];
        nextCursor?: number;
        hasMore: boolean;
    };
    /** Recovery needs the newest append, independently of the public history page size. */
    latestEvent(taskRunId: string): TaskRunEvent | undefined;
    events(taskRunId: string, limit?: number): TaskRunEvent[];
    hasMessageReceipt(taskRunId: string, messageId: string): boolean;
    recordMessageReceipt(taskRunId: string, attemptId: string, messageId: string): void;
    close(): void;
    private read;
    private require;
    private readAttempt;
    private latestAttempt;
    private requireWithAttempts;
    private assertOpen;
}
export declare function isTaskRunTerminal(status: TaskRunStatus): boolean;
