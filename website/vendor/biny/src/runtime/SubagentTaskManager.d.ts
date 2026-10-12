export type SubagentTaskStatus = "queued" | "running" | "completed" | "incomplete" | "failed" | "aborted" | "timed_out";
export type SubagentAccessMode = "read-only" | "workspace";
export interface SubagentTaskSnapshot {
    taskId: string;
    parentRunId: string;
    task: string;
    status: SubagentTaskStatus;
    createdAt: string;
    deadline?: string;
    startedAt?: string;
    completedAt?: string;
    error?: string;
    stopReason?: string;
    accessMode?: SubagentAccessMode;
    /** 具名子代理定义名；省略表示默认子代理。 */
    agent?: string;
}
export interface SubagentTaskRunOptions {
    taskId?: string;
    /** Host 将一次子代理执行绑定回既有 TaskRun / Attempt；内存调度器本身不解释这些字段。 */
    taskRunId?: string;
    attemptId?: string;
    completedStatus?: "completed" | "verifying";
    parentRunId?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
    accessMode?: SubagentAccessMode;
    agent?: string;
}
export interface SubmittedSubagentTask {
    taskId: string;
    parentRunId: string;
    deadline?: string;
    completion: Promise<string>;
}
export interface SubagentTaskManagerOptions {
    maxConcurrentSubagents: number;
    maxPendingSubagents?: number;
    timeoutMs?: number;
    shutdownDrainMs?: number;
    /** 将内存调度快照投影到 durable TaskRun；观察者失败不能破坏调度。 */
    onSnapshot?(snapshot: SubagentTaskSnapshot): void;
    persistCompletion?(snapshot: SubagentTaskSnapshot, output: string): Promise<void> | void;
    execute(task: string, context: {
        taskId: string;
        parentRunId: string;
        signal: AbortSignal;
        deadline?: string;
        accessMode: SubagentAccessMode;
        agent?: string;
    }): Promise<string>;
}
/**
 * Owns bounded child-task execution independently from model/tool plumbing.
 * Parent cancellation, deadlines and close all terminate queued and running
 * tasks through the same AbortController path.
 */
export declare class SubagentTaskManager {
    private readonly options;
    private static readonly historyLimit;
    private static readonly defaultMaxPendingSubagents;
    static readonly maxTaskCharacters = 20000;
    private static readonly maxTimerMs;
    private readonly tasks;
    private readonly queue;
    private readonly terminalSnapshots;
    private readonly runningExecutions;
    private readonly listeners;
    private activeTasks;
    private closed;
    private closePromise;
    private readonly maxPendingSubagents;
    constructor(options: SubagentTaskManagerOptions);
    run(task: string, options?: SubagentTaskRunOptions): Promise<string>;
    submit(task: string, options?: SubagentTaskRunOptions): SubmittedSubagentTask;
    getSnapshot(taskId: string): SubagentTaskSnapshot | undefined;
    listSnapshots(): SubagentTaskSnapshot[];
    subscribe(listener: (task: SubagentTaskSnapshot) => void): () => void;
    cancelTask(taskId: string, reason?: string): boolean;
    cancelParent(parentRunId: string, reason?: string): void;
    cancelAll(reason?: string): void;
    close(): Promise<void>;
    private closeTasks;
    private drain;
    private execute;
    private abortTask;
    private complete;
    private fail;
    private cleanup;
    private emit;
    private rememberTerminalTask;
}
export declare class SubagentTaskAbortedError extends Error {
    readonly taskId: string;
    readonly name = "SubagentTaskAbortedError";
    constructor(taskId: string, message: string);
}
/** 保留部分交付，但不能让 Promise 成功结算把预算停止投影为任务完成。 */
export declare class SubagentTaskIncompleteError extends Error {
    readonly stopReason: string;
    readonly output: string;
    readonly name = "SubagentTaskIncompleteError";
    constructor(stopReason: string, output: string);
}
export declare class SubagentTaskTimeoutError extends Error {
    readonly taskId: string;
    readonly name = "SubagentTaskTimeoutError";
    constructor(taskId: string, timeoutMs: number);
}
export declare class SubagentTaskQueueFullError extends Error {
    readonly maxPendingSubagents: number;
    readonly name = "SubagentTaskQueueFullError";
    constructor(maxPendingSubagents: number);
}
