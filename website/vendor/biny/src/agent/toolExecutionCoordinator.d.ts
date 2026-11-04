import { type EditingMode } from "../tools/file/editingMode.js";
import { PermissionManager } from "../permission/PermissionManager.js";
import type { ReasoningBlock } from "../session/recorder.js";
import { type CodeModeLimits } from "./codeMode.js";
import type { AgentRuntimeContext, AgentSessionEvent, AgentToolEvent } from "./types.js";
import type { AgentTool, AgentToolResult } from "./core/types.js";
export interface AgentStepContext {
    assistantContent?: string;
    reasoningContent?: string;
    /** Individually signed reasoning blocks for this step, in provider order. */
    reasoningBlocks?: ReasoningBlock[];
}
export interface ToolDiscoveryProgress {
    tools: string[];
}
export interface ToolDiscoverySnapshot {
    toolDiscovery?: ToolDiscoveryProgress;
}
export declare class ToolExecutionCoordinator {
    private readonly context;
    private readonly permissionManager;
    private readonly emitEvent;
    private readonly getStepContext;
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
    private readonly discoveredToolNames;
    private readonly uncertainExecutions;
    private readonly toolImages;
    private imageBytes;
    private codeModeCellActive;
    private readonly scriptParents;
    private readonly goalControlCalls;
    constructor(context: AgentRuntimeContext, permissionManager: PermissionManager, emitEvent: (event: AgentToolEvent | Extract<AgentSessionEvent, {
        type: "error";
    }>) => void, getStepContext?: () => AgentStepContext, allowedToolNames?: ReadonlySet<string>, initialToolDiscovery?: ToolDiscoveryProgress, onToolResultPersisted?: (() => Promise<void>) | undefined, executionToolNames?: ReadonlySet<string>);
    private readonly allowedToolNames?;
    private readonly executionToolNames?;
    /** 只扩展到当前注册表中真实存在的工具；权限、预算和审计不会随 schema 扩展而放宽。 */
    allowTools(names: readonly string[]): string[];
    /** Model-facing tool envelope. */
    createAgentTools(editing?: {
        mode: EditingMode;
        attachmentRoot?: string;
    }, options?: {
        parentToolCallId?: string;
        auditOnly?: boolean;
        script?: boolean;
        discovery?: boolean;
        toolDiscoveryNames?: ReadonlySet<string>;
        toolDiscoveryModelNames?: ReadonlySet<string>;
        toolDiscoveryNamespace?: string;
    }): AgentTool[];
    /** Execute an MCP capability requested by a loaded host plugin through the same policy path as model calls. */
    executePluginMcpTool(serverName: string, toolName: string, args: Record<string, unknown>, toolCallId: string, signal?: AbortSignal): Promise<AgentToolResult>;
    /** The caller owns image delivery, but every settled invocation releases its reservation. */
    private takeToolImage;
    /** Outer Code Mode admission is separate from the child scheduler: a cell
     * holding its only slot would deadlock when maxConcurrentTools is one. */
    createCodeModeTool(editing?: {
        mode: EditingMode;
        attachmentRoot?: string;
    }, executionPolicy?: CodeModeLimits): AgentTool;
    waitForIdle(): Promise<void>;
    private emit;
    private recordAndFlush;
    getToolDiscoverySnapshot(): ToolDiscoverySnapshot;
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
     * spent, large results collapse to a reference. Small feedback stays inline
     * so an exit code or a short file page never needs a second tool call merely
     * because earlier output was large. Request-time history projection bounds
     * retained results independently of this cumulative admission budget.
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
    private duplicateAuditId;
    private trackExecution;
    private withPermissionGate;
}
