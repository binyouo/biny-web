export type ActionType = "read" | "write" | "delete" | "shell" | "network" | "git" | "install" | "unknown";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type PermissionMode = "ask" | "read-only" | "auto" | "full-access";
export type PermissionGrantScope = "once" | "command" | "session" | "tool" | "path";
export type PermissionDecision = "allow" | "ask" | "deny";
export type PermissionAction = "allow_once" | "allow_always" | "deny" | "deny_with_reason";
export interface ProjectPermissionPolicy {
    mode: PermissionMode;
    allowTools: string[];
    allowPaths: string[];
    denyPaths: string[];
    criticalAlwaysAsk: boolean;
    source?: string;
}
export interface PermissionRequestContext {
    toolName: string;
    actionType: ActionType;
    riskLevel: RiskLevel;
    targetPath?: string;
    /** 移动等双路径变更的第二个目标路径，与 targetPath 一样参与 denyPaths 判定。 */
    secondaryTargetPath?: string;
    command?: string;
    reason?: string;
    diffPreview?: string;
    changeSummary?: string;
    /** Opaque exact-call fingerprint used for command-scoped grants. */
    approvalRule?: string;
    sessionId: string;
    projectRoot: string;
}
export interface PermissionPrompt extends PermissionRequestContext {
    /** 关键操作要求逐次批准时，界面不提供会话授权。 */
    canRemember?: boolean;
    toolCallId: string;
    tool: string;
    title: string;
    details: string;
    requireFullYes: boolean;
    diff?: string;
    preview?: string;
}
export interface PermissionEvaluation {
    canRemember?: boolean;
    decision: PermissionDecision;
    reason: string;
}
export interface PermissionApplyResult {
    approved: boolean;
    action?: PermissionAction;
    scope?: PermissionGrantScope;
    nextMode?: PermissionMode;
    message?: string;
}
/** UI transport response. `confirmation` is validated before grants are applied. */
export interface PermissionResult extends PermissionApplyResult {
    confirmation?: string;
}
export interface DeniedOperation {
    toolName: string;
    actionType: ActionType;
    riskLevel: RiskLevel;
    target?: string;
    reason: string;
    at: string;
}
export interface PermissionStatus {
    mode: PermissionMode;
    allowTools: string[];
    allowPaths: string[];
    projectAllowTools: string[];
    projectAllowPaths: string[];
    sessionAllowTools: string[];
    sessionAllowPaths: string[];
    allowedCommands: string[];
    allowedActions: string[];
    deniedOperations: DeniedOperation[];
    projectPolicySource?: string;
}
export declare class PermissionManager {
    private mode;
    private readonly policy;
    private readonly sessionAllowedTools;
    private readonly sessionAllowedPaths;
    private readonly sessionAllowedCommands;
    private readonly sessionAllowedActions;
    private readonly deniedOperations;
    constructor(policy?: Partial<ProjectPermissionPolicy>);
    evaluate(request: PermissionRequestContext): PermissionEvaluation;
    applyResult(request: PermissionRequestContext, result: PermissionApplyResult): void;
    revokeResult(request: PermissionRequestContext, result: PermissionApplyResult | undefined): void;
    setMode(mode: PermissionMode): void;
    getDeniedPaths(): string[];
    resetSession(): void;
    getStatus(): PermissionStatus;
}
