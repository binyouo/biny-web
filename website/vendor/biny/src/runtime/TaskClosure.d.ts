/**
 * TaskRun 的执行、验收与有限修复闭环。
 *
 * Worker 仍由调用方已有的 Subagent 或 Graph Runtime 提供；这里仅统一 Attempt 生命周期和
 * 验收完成权，避免不同入口各自实现一套重试状态机。
 */
import { type DurableTaskRunStore, type TaskAttemptRecord, type TaskRetrySafety } from "./TaskRunStore.js";
import { type PlanReviewResult } from "./planWork.js";
import { z } from "zod";
import { type TaskCommandExecutor, type TaskVerificationEvidence } from "./taskVerification.js";
export interface TaskClosureResult {
    status: "completed" | "incomplete" | "blocked" | "needs_approval" | "cancelled";
    output?: string;
    evidence?: TaskVerificationEvidence;
    reason?: string;
    review?: PlanReviewResult;
}
declare const workerAttemptSchema: z.ZodObject<{
    prompt: z.ZodString;
    beforeWorkspace: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    definitionFingerprint: z.ZodOptional<z.ZodString>;
    accessMode: z.ZodOptional<z.ZodEnum<["read-only", "workspace"]>>;
    agent: z.ZodOptional<z.ZodString>;
    communication: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    prompt: string;
    agent?: string | undefined;
    accessMode?: "workspace" | "read-only" | undefined;
    communication?: boolean | undefined;
    definitionFingerprint?: string | undefined;
    beforeWorkspace?: Record<string, string> | undefined;
}, {
    prompt: string;
    agent?: string | undefined;
    accessMode?: "workspace" | "read-only" | undefined;
    communication?: boolean | undefined;
    definitionFingerprint?: string | undefined;
    beforeWorkspace?: Record<string, string> | undefined;
}>;
export declare function readWorkerAttemptCheckpoint(artifacts: unknown): z.infer<typeof workerAttemptSchema> | undefined;
export declare function runTaskClosure(input: {
    taskRuns: DurableTaskRunStore;
    taskRunId: string;
    workspaceRoot: string;
    ignore: readonly string[];
    executor: TaskCommandExecutor;
    retrySafety?: TaskRetrySafety;
    signal?: AbortSignal;
    canRepair?: () => boolean;
    resumeWorker?: boolean;
    executeAttempt(prompt: string, attempt: TaskAttemptRecord): Promise<string>;
}): Promise<TaskClosureResult>;
/**
 * 只批准当前 Attempt 已经持久化的那一个验收检查。
 * 批准同时绑定契约、定义输入、候选产物和被拒绝的 tool_result，不能变成通用 Bash 授权。
 */
export declare function approveTaskVerification(input: {
    taskRuns: DurableTaskRunStore;
    taskRunId: string;
    approvalId: string;
    workspaceRoot: string;
    ignore: readonly string[];
}): Promise<void>;
export {};
