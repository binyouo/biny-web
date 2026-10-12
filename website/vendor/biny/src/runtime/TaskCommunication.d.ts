import { z } from "zod";
import { type DurableTaskRunStore, type TaskRunWithAttempts, type TaskRunStatus } from "./TaskRunStore.js";
declare const messageSchema: z.ZodObject<{
    id: z.ZodString;
    direction: z.ZodEnum<["parent", "worker"]>;
    content: z.ZodString;
    createdAt: z.ZodString;
    delivered: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    id: string;
    direction: "worker" | "parent";
    content: string;
    createdAt: string;
    delivered?: boolean | undefined;
}, {
    id: string;
    direction: "worker" | "parent";
    content: string;
    createdAt: string;
    delivered?: boolean | undefined;
}>;
export type TaskMessage = z.infer<typeof messageSchema>;
export interface WorkerActivity {
    id: string;
    sequence: number;
    createdAt: string;
    kind: "tool_call" | "tool_result" | "tool_execution" | "assistant" | "reasoning" | "completion" | "model";
    model?: {
        provider: string;
        id: string;
    };
    tool?: string;
    toolCallId?: string;
    content?: string;
    status?: string;
    args?: unknown;
    result?: unknown;
}
export interface TaskInspectionOptions {
    attemptId?: string;
    afterSequence?: number;
    afterRevision?: number;
    limit?: number;
    waitMs?: number;
    summary?: boolean;
}
export interface TaskInspection {
    taskRunId: string;
    sessionId: string;
    attemptId?: string;
    attempts: Array<{
        attemptId: string;
        status: TaskRunStatus;
    }>;
    title: string;
    name?: string;
    description?: string;
    agent?: string;
    status: TaskRunStatus;
    revision: number;
    createdAt: string;
    updatedAt: string;
    output?: string;
    outputTruncated?: boolean;
    reason?: string;
    stopReason?: string;
    verification?: unknown;
    inputOpen: boolean;
    resumable: boolean;
    approval?: {
        approvalId: string;
        command?: string;
        cwd?: string;
        reason?: string;
    };
    messages: TaskMessage[];
    activity: WorkerActivity[];
    cursor: number;
    hasMore: boolean;
}
export interface TaskNotification {
    id: string;
    taskRunId: string;
    attemptId: string;
    content: string;
    messageIds: string[];
    terminal: boolean;
}
export interface WorkerCommunication {
    pending(): TaskMessage[];
    delivered(ids: string[]): void;
    seal(): boolean;
    report(content: string, id: string): TaskMessage;
}
/** 消息复用 Attempt 的 authority 事务；子 Session 提交接收事实后才确认送达。 */
export declare class TaskCommunication {
    private readonly tasks;
    private readonly sessionId;
    private readonly listeners;
    private closed;
    constructor(tasks: DurableTaskRunStore, sessionId: string);
    read(taskRunId: string): TaskRunWithAttempts;
    send(taskRunId: string, content: string, id?: string): TaskMessage;
    messages(taskRunId: string): TaskMessage[];
    notifications(maxCharacters?: number): TaskNotification[];
    acknowledge(notice: TaskNotification): void;
    inspect(taskRunId: string, options?: TaskInspectionOptions, signal?: AbortSignal): Promise<TaskInspection>;
    worker(taskRunId: string, attemptId: string): WorkerCommunication;
    notify(taskRunId: string): void;
    wait(taskRunId: string, waitMs?: number, afterRevision?: number, signal?: AbortSignal): Promise<TaskRunWithAttempts>;
    private waitFor;
    close(): void;
    private append;
    private save;
}
export {};
