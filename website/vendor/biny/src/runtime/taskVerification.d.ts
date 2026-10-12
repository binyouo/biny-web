import type { PlanReviewCandidate } from "./planWork.js";
import type { SessionEvent } from "../session/recorder.js";
export declare const taskVerificationContractVersion = 1;
export declare const defaultTaskVerificationMaxAttempts = 2;
export declare const taskVerificationPermissionRequiredReason = "Task verification requires explicit permission for this command.";
export interface TaskCommandCheck {
    id: string;
    command: string;
    cwd?: string;
    timeoutMs?: number;
    /**
     * 冻结验收标准本身依赖的工作区文件，例如 package.json、tsconfig 或验收脚本。
     * 待修复的测试与产物应放在 artifactPaths，而不是放进这里禁止修改。
     */
    definitionPaths: string[];
}
export interface TaskVerificationContract {
    version: 1;
    objective: string;
    context?: string;
    checks: TaskCommandCheck[];
    artifactPaths: string[];
    allowedRepairPaths: string[];
    /** 包含首次执行在内的 Attempt 总数上限，不是额外修复次数。 */
    maxAttempts: number;
}
export interface TaskCommandExecution {
    result: unknown;
    toolCallId: string;
    operationId?: string;
    resultEventId?: string;
    eventReferences: string[];
    recovered?: boolean;
    approvalRequired?: boolean;
}
export interface TaskVerificationApproval {
    approvalId: string;
    taskRunId: string;
    attemptId: string;
    checkId: string;
    toolCallId: string;
    deniedResultEventId: string;
    contractFingerprint: string;
    artifactFingerprint: string;
    definitionFingerprint: string;
    approvedAt: string;
}
export interface TaskCommandExecutor {
    executeTaskCheck(input: {
        command: string;
        checkId: string;
        contractFingerprint: string;
        cwd?: string;
        timeoutMs?: number;
        taskRunId: string;
        attemptId: string;
        approval?: TaskVerificationApproval;
        signal?: AbortSignal;
    }): Promise<TaskCommandExecution>;
}
export interface TaskCheckEvidence {
    checkId: string;
    command: string;
    cwd?: string;
    status: "passed" | "failed" | "blocked" | "cancelled";
    exitCode?: number;
    stdout?: string;
    stderr?: string;
    stdoutTruncated?: boolean;
    stderrTruncated?: boolean;
    reason?: string;
    toolCallId: string;
    operationId?: string;
    resultEventId?: string;
    eventReferences: string[];
    recovered?: boolean;
    approvalRequired?: boolean;
}
export interface TaskRepairScopeEvidence {
    enforcement: "post_execution_change_guard";
    changedPaths: string[];
    violationPaths: string[];
}
export interface TaskVerificationEvidence {
    taskRunId: string;
    attemptId: string;
    contractVersion: 1;
    contractFingerprint: string;
    artifactFingerprint: string;
    definitionFingerprint: string;
    status: "passed" | "failed" | "blocked" | "cancelled";
    reason?: string;
    checks: TaskCheckEvidence[];
    repairScope?: TaskRepairScopeEvidence;
    verifiedAt: string;
}
export interface TaskCandidateArtifacts {
    output: string;
    definitionFingerprint: string;
    repairScope: TaskRepairScopeEvidence;
    artifactFingerprint?: string;
    verificationApprovals?: TaskVerificationApproval[];
    communication?: unknown;
}
export type TaskWorkspaceSnapshot = Readonly<Record<string, string>>;
export interface TaskDefinition {
    prompt: string;
    constraints?: string[];
    agent?: string;
    verification?: TaskVerificationContract;
    review?: PlanReviewCandidate;
    /** 无命令验收的计划节点只能产出只读报告，不授予工作区写权限。 */
    reportOnly?: boolean;
}
export declare function readTaskDefinition(task: unknown): TaskDefinition;
export declare function readTaskVerificationContract(value: unknown): TaskVerificationContract;
export declare function taskVerificationFingerprint(contract: TaskVerificationContract): string;
export declare function fingerprintTaskVerificationDefinitions(workspaceRoot: string, contract: TaskVerificationContract, ignore: readonly string[], signal?: AbortSignal): Promise<string>;
export declare function captureTaskWorkspaceSnapshot(workspaceRoot: string, ignore: readonly string[], signal?: AbortSignal): Promise<TaskWorkspaceSnapshot>;
export declare function compareTaskWorkspaceSnapshots(before: TaskWorkspaceSnapshot, after: TaskWorkspaceSnapshot, allowedRepairPaths: readonly string[]): TaskRepairScopeEvidence;
export declare function fingerprintTaskArtifacts(workspaceRoot: string, artifactPaths: readonly string[], ignore: readonly string[], signal?: AbortSignal): Promise<string>;
export declare function verifyTaskCandidate(input: {
    workspaceRoot: string;
    ignore: readonly string[];
    taskRunId: string;
    attemptId: string;
    contract: TaskVerificationContract;
    definitionFingerprint: string;
    expectedArtifactFingerprint?: string;
    approvals?: readonly TaskVerificationApproval[];
    repairScope?: TaskRepairScopeEvidence;
    /** Fresh, frozen post-worker snapshot; final comparison guards the entire interval through verification. */
    candidateWorkspaceSnapshot?: TaskWorkspaceSnapshot;
    executor: TaskCommandExecutor;
    signal?: AbortSignal;
}): Promise<TaskVerificationEvidence>;
export declare function canReuseTaskVerification(input: {
    evidence: unknown;
    contract: TaskVerificationContract;
    definitionFingerprint: string;
    workspaceRoot: string;
    ignore: readonly string[];
    signal?: AbortSignal;
}): Promise<boolean>;
export declare function isTaskVerificationEvidence(value: unknown): value is TaskVerificationEvidence;
export declare function pendingTaskVerificationApproval(evidence: unknown): Omit<TaskVerificationApproval, "approvedAt"> | undefined;
/** 用户批准的是这一份持久化等待事实，而不是“当前碰巧排在前面的检查”。 */
export declare function taskVerificationApprovalId(approval: Omit<TaskVerificationApproval, "approvalId" | "approvedAt">): string;
export declare function isTaskVerificationApproval(value: unknown): value is TaskVerificationApproval;
export declare function matchingTaskVerificationApproval(approval: TaskVerificationApproval | undefined, expected: Omit<TaskVerificationApproval, "approvalId" | "deniedResultEventId" | "approvedAt">): boolean;
export declare function taskCheckToolCallId(input: {
    attemptId: string;
    checkId: string;
    contractFingerprint: string;
}): string;
export declare function taskCheckRecoveryToolCallIds(input: {
    attemptId: string;
    checkId: string;
    contractFingerprint: string;
    approval?: TaskVerificationApproval;
}): string[];
export type TaskCheckRecoveryDecision = {
    action: "execute";
    toolCallId: string;
} | {
    action: "reuse";
    execution: TaskCommandExecution;
} | {
    action: "block";
    execution: TaskCommandExecution;
};
export declare function recoverTaskCheckExecution(events: readonly SessionEvent[], sessionId: string, input: {
    attemptId: string;
    checkId: string;
    contractFingerprint: string;
    approval?: TaskVerificationApproval;
}): TaskCheckRecoveryDecision;
export declare function isTaskVerificationPermissionResult(value: unknown): boolean;
