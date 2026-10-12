/**
 * TaskRun 重试准入策略。
 *
 * 普通 TUI 继续是新的 user message；TaskRun retry 只允许 Host 对已经失败、
 * 且失败原因和副作用状态都能证明安全的 Attempt 发起。未知副作用不能通过
 * confirmation 绕过，因为这会把“可能已经执行”误当成“可以重新执行”。
 */
import type { TaskAttemptRecord, TaskRunWithAttempts } from "./TaskRunStore.js";
export declare const taskRetryableFailureClasses: readonly ["RateLimit", "continuation_abandoned_before_provider_dispatch"];
export type TaskRetryableFailureClass = (typeof taskRetryableFailureClasses)[number];
export type TaskRetryRejectionCode = "task_not_found" | "attempt_missing" | "task_not_failed" | "attempt_not_failed" | "failure_not_retryable" | "retry_safety_unknown" | "retry_safety_unsafe";
export type TaskRetryDecision = {
    allowed: true;
    attempt: TaskAttemptRecord;
    failureClass: TaskRetryableFailureClass;
} | {
    allowed: false;
    code: TaskRetryRejectionCode;
    reason: string;
};
/**
 * 评估一次新的 TaskAttempt 是否可以从上一次失败继续。
 *
 * 这里故意只接受当前明确的两类基础设施失败：provider 限流，或已经
 * 证明发生在 provider dispatch 之前的 continuation abandonment。普通模型失败、
 * 工具失败、超时、取消和预算耗尽都必须由用户发新 prompt 或走专门恢复流程。
 */
export declare function evaluateTaskRetry(task: TaskRunWithAttempts | undefined): TaskRetryDecision;
