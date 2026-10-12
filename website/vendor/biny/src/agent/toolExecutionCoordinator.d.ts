import { type EditingMode } from "../tools/file/editingMode.js";
import { PermissionManager } from "../permission/PermissionManager.js";
import type { ReasoningBlock } from "../session/recorder.js";
import { type CodeModeLimits } from "./codeMode.js";
import type { AgentRuntimeContext, AgentSessionEvent, AgentToolEvent } from "./types.js";
import type { AgentTool } from "./core/types.js";
export interface AgentStepContext {
    assistantContent?: string;
    reasoningContent?: string;
    reasoningProviderOptions?: Record<string, unknown>;
    /** Individually signed reasoning blocks for this step, in provider order. */
    reasoningBlocks?: ReasoningBlock[];
}
/**
 * 工具副作用的 admission 预算。
 *
 * 额度必须在 ToolScheduler 和权限请求之前原子占用；否则一个 provider 批次可以先执行完所有
 * 并行调用，再由上层在步结束后发现超限。
 */
export interface ToolExecutionBudget {
    maxToolCalls: number;
    maxRepeatedActions: number;
    /** 进程内断点续跑时，已占用的调用额度。显式新预算窗口应传 0。 */
    initialToolCallCount?: number;
    /** 逐动作恢复，不能把某个动作的次数转嫁给恢复后的所有其他动作。 */
    initialRepeatedActions?: RepeatedActionBudget[];
    initialToolDiscovery?: ToolDiscoveryProgress;
}
export interface ToolDiscoveryProgress {
    tools: string[];
    noProgressCount: number;
}
export interface RepeatedActionBudget {
    fingerprint: string;
    count: number;
    resultFingerprint?: string;
}
export interface ToolExecutionBudgetSnapshot {
    accountedToolCalls: number;
    maxRepeatedActionCount: number;
    repeatedActions: RepeatedActionBudget[];
    toolDiscovery?: ToolDiscoveryProgress;
}
export type ToolBudgetReason = "tool_call_limit" | "repeated_action_limit";
export interface ToolBudgetRejection {
    status: "budget_rejected";
    reason: ToolBudgetReason;
    resumable: true;
    limit: number;
    attemptedToolCallCount: number;
    attemptedActionCount: number;
    error: string;
}
export declare class ToolExecutionCoordinator {
    private readonly context;
    private readonly permissionManager;
    private readonly emit;
    private readonly getStepContext;
    private readonly executionBudget?;
    private readonly onToolResultPersisted?;
    private readonly admissionScheduler;
    private readonly scheduler;
    private readonly pendingExecutions;
    private readonly quarantinedCodeModeChildIds;
    private readonly codeModeToolChecks;
    private readonly observedToolCallCounts;
    private readonly duplicateToolCallIds;
    private readonly duplicateExecutionCounts;
    private permissionTail;
    /** 并行工具结果也必须按顺序占用同一份回合预算，归档 I/O 期间不能让其他结果绕过预留。 */
    private toolResultBudgetTail;
    /** Bytes actually handed back to the model this turn; drives the budget. */
    private inlineToolResultBytes;
    /** Bytes tools produced this turn, archived or not; reported for diagnostics. */
    private producedToolResultBytes;
    private readonly diagnostics;
    private readonly hooks;
    /** 本回合共享的快照完成信号；所有写入等待同一次快照。 */
    private checkpointPromise?;
    private accountedToolCallCount;
    private readonly accountedActionCounts;
    private readonly actionResults;
    private readonly pendingActionCounts;
    private readonly discoveredToolNames;
    private discoveryNoProgressCount;
    /** 首个预算拒绝决定本轮终态，后续并行调用不得覆盖更早发生的事实。 */
    private budgetRejection;
    private readonly uncertainExecutions;
    private readonly toolImages;
    private imageBytes;
    private codeModeCellActive;
    constructor(context: AgentRuntimeContext, permissionManager: PermissionManager, emit: (event: AgentToolEvent | Extract<AgentSessionEvent, {
        type: "error";
    }>) => void, getStepContext?: () => AgentStepContext, allowedToolNames?: ReadonlySet<string>, executionBudget?: ToolExecutionBudget | undefined, onToolResultPersisted?: (() => Promise<void>) | undefined, executionToolNames?: ReadonlySet<string>);
    private readonly allowedToolNames?;
    private readonly executionToolNames?;
    /** 只扩展到当前注册表中真实存在的工具；权限、预算和审计不会随 schema 扩展而放宽。 */
    allowTools(names: readonly string[]): string[];
    /** Model-facing tool envelope. */
    createAgentTools(editing?: {
        mode: EditingMode;
        attachmentRoot?: string;
    }, options?: {
        auditOnly?: boolean;
        script?: boolean;
        toolDiscoveryNames?: ReadonlySet<string>;
        toolDiscoveryNamespace?: string;
    }): AgentTool[];
    /** Outer Code Mode admission is separate from the child scheduler: a cell
     * holding its only slot would deadlock when maxConcurrentTools is one. */
    createCodeModeTool(editing?: {
        mode: EditingMode;
        attachmentRoot?: string;
    }, executionPolicy?: CodeModeLimits): AgentTool;
    waitForIdle(): Promise<void>;
    private recordAndFlush;
    getExecutionBudgetSnapshot(): ToolExecutionBudgetSnapshot;
    getBudgetRejection(): ToolBudgetRejection | undefined;
    assertCanContinue(): void;
    observeToolCall(toolCallId: string): string | undefined;
    handleInvalidToolCall(toolName: string, toolCallId: string, input: unknown, signal?: AbortSignal): Promise<unknown>;
    private execute;
    private finishSyntheticCall;
    private emitToolResult;
    /**
     * The loop retains every returned value until the turn finishes. Keep the
     * first bounded slice of useful results inline, then preserve
     * later outputs durably instead of letting ordinary repository inspection
     * overflow the provider context window.
     *
     * The budget bounds what actually reaches the model, so an archived result's
     * own envelope and preview are charged against it too. Once the budget is
     * spent, later results collapse to a bare reference the model can reopen with
     * `read_tool_result` — otherwise a long turn would still accumulate one
     * preview per step and overflow the window it was meant to protect.
     */
    private applyToolResultBudget;
    private archivedToolResultEnvelope;
    /**
     * 持久化层的大结果外置：回合预算只约束模型上下文，落盘 JSONL 的单行仍可能拖到 MB 级，
     * 让列表扫描、打开会话和回放全部变慢。超过行内上限的结果归档到 .biny/tool-results，
     * 事件里只留与预算归档一致的 envelope（preview + archivePath）；回放时模型看到的是
     * preview + 可取回全文的指引，运行中的内存上下文与实时事件不受影响。
     */
    private outlineToolResultForPersistence;
    /**
     * 执行前钩子。任一条非零退出就阻止这次调用，并把它的输出作为拒绝理由回给模型 —— 模型
     * 需要知道为什么被拦，否则只会原样重试。
     */
    private runBeforeToolHooks;
    /** 执行后钩子的输出只作为附加信息；它的退出码不改变这次调用的成败。 */
    private attachAfterToolHooks;
    /**
     * 本回合第一次真正改动工作区之前建一个快照。
     *
     * 建在权限通过之后、执行之前：用户拒绝的调用不该留下快照，而一旦要执行就必须先有退路。
     * 建快照失败不能挡住工具执行 —— 没有 git 仓库是常态，为此拒绝干活是本末倒置。
     */
    private ensureCheckpoint;
    /**
     * 写入类工具成功后跑一次项目自己的检查，把结果挂在该次工具结果上。
     *
     * 只在成功路径上跑：失败的编辑没改动文件，跑检查只是浪费时间并可能报告上一次的旧错误。
     * 诊断自身出错也不能影响工具结果 —— 它是附加信息，不是这次调用的成败依据。
     */
    private attachDiagnostics;
    private prepareToolCall;
    private executeResolvedTool;
    private buildPermissionRequest;
    private canonicalPermissionArgs;
    private buildPermissionSnapshot;
    private resolvePermissionTarget;
    private captureFileBaseline;
    private nextSequence;
    /**
     * 没有 await 的同步临界区：同一批并行 execute 即使同时恢复 microtask，也会逐个检查并占用
     * 额度，后来的调用无法越过前一个调用刚提交的计数。
     */
    private admitToolCall;
    private duplicateAuditId;
    private trackExecution;
    private withPermissionGate;
}
