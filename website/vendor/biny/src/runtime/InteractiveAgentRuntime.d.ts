import type { AgentAttachment, AgentSessionInfo, ResumedAgentSession } from "../agent/AgentSession.js";
import type { AgentCapabilitySelection } from "../agent/capabilitySelection.js";
import { type AgentTurnCancellationReason, type AgentTurnOutcome } from "../agent/types.js";
import type { PermissionResult } from "../permission/PermissionManager.js";
import { type CommandRuntime, type CommandRuntimeOptions } from "./CommandRuntime.js";
import { SessionRunLedger } from "../session/runLedger.js";
import { SessionLeaseStore } from "./SessionLease.js";
import type { RuntimeEventAuthority } from "./RuntimeAuthority.js";
import type { AgentRuntimeUpdate, InteractiveRuntimeSnapshot, RuntimeOperation } from "./agentEvents.js";
export interface SubmittedAgentRun {
    runId: string;
    messageId: string;
    completion: Promise<AgentRunOutcome>;
}
/**
 * 跨进程客户端预先分配的回合标识。这样 Host 接受请求后仍能返回稳定的
 * `runId`/`messageId`，客户端不需要先等待一轮 RPC 才能更新界面。
 */
export interface RuntimeRequestIds {
    /** 只有能展示并回答结构化问题的客户端才启用。 */
    allowUserInput?: boolean;
    runId?: string;
    messageId?: string;
    turnId?: string;
    parentRunId?: string;
    continuationSource?: string;
    retryOfMessageId?: string;
    /** 编辑时替换的原用户消息 ID。 */
    replaceUserMessageId?: string;
}
export interface QueuedAgentMessage {
    runId: string;
    messageId: string;
    delivery: "steer" | "queue";
}
export interface AgentRunOutcome extends AgentTurnOutcome {
    runId: string;
    durationMs: number;
}
export interface InteractiveAgentRuntimeOptions {
    shutdownDrainMs?: number;
    /** 由 composition root 注入；测试可省略跨进程租约。 */
    sessionLeases?: SessionLeaseStore;
    /** 运行 ledger 可注入，未提供时由真实 CommandRuntime 的 persistenceRoot 创建。 */
    runLedger?: SessionRunLedger;
    /** 新 RuntimeEvent 先进入 SQLite authority，再由 SessionRecorder 写 JSONL。 */
    runtimeAuthority?: RuntimeEventAuthority;
}
export interface InteractiveAgentHost {
    runtime: InteractiveAgentRuntime;
    commands: CommandRuntime;
}
/** Desktop、TUI 和 Unix socket 客户端共享的最小交互运行时形状。 */
export interface InteractiveRuntimeHandle {
    submitPrompt(input: string, attachments?: AgentAttachment[], requestIds?: RuntimeRequestIds, promptContext?: string, capabilitySelection?: AgentCapabilitySelection): SubmittedAgentRun;
    /** Host 内部目标推进回合，不生成可见用户输入。 */
    submitFollowupTurn?(requestIds: RuntimeRequestIds): SubmittedAgentRun;
    /** Host 内部监督回合：输入只进入本轮上下文，不写成新的 user_message。 */
    submitSupervisionTurn?(input: string, requestIds: RuntimeRequestIds, promptContext?: string): SubmittedAgentRun;
    steer(input: string, attachments?: AgentAttachment[], requestIds?: RuntimeRequestIds): Promise<QueuedAgentMessage>;
    enqueue(input: string, attachments?: AgentAttachment[], requestIds?: RuntimeRequestIds): Promise<QueuedAgentMessage>;
    updateQueuedRunMessage?(messageId: string, input: string): Promise<void>;
    removeQueuedRunMessage?(messageId: string): Promise<void>;
    moveQueuedRunMessage?(messageId: string, targetMessageId: string, placeAfter: boolean): Promise<void>;
    steerQueuedRunMessage?(messageId: string): Promise<void>;
    sendQueuedRunMessagesNow?(): Promise<void>;
    continueInterruptedTurn(): Promise<AgentRunOutcome | undefined>;
    startInterruptedTurn(requestIds?: RuntimeRequestIds, mode?: "exact" | "newTurn"): Promise<SubmittedAgentRun | undefined>;
    waitForIdle(): Promise<void>;
    cancelCurrentRun(reason: AgentTurnCancellationReason): void;
    cancelRun(runId: string, reason: AgentTurnCancellationReason): boolean;
    answerPermission(requestId: string, result: PermissionResult): void;
    /** 以当前 surface 的 writer 身份打开一个 session，并在切换/关闭前保持占用。 */
    claimSession(session: string): Promise<void>;
    /** 释放当前 surface 的 session writer；不传 session 时释放当前 claim。 */
    releaseSessionClaim(session?: string): Promise<void>;
    resumeSession(session: string): Promise<ResumedAgentSession>;
    /** 开始一个全新的空会话并重置会话级状态，不重建 runtime 基础设施（MCP/索引/技能）。忙碌时拒绝。 */
    startDraft(): Promise<AgentSessionInfo>;
    switchMessageVersion(messageId: string, direction: "prev" | "next"): Promise<void>;
    runExclusiveOperation<T>(operation: RuntimeOperation, execute: (signal: AbortSignal) => Promise<T>): Promise<T>;
    startBackgroundOperation<T extends {
        completion: Promise<unknown>;
    }>(operation: RuntimeOperation, start: (signal: AbortSignal) => T): T;
    compactConversation(hint?: string): Promise<string>;
    getSnapshot(): InteractiveRuntimeSnapshot;
    subscribe(listener: (update: AgentRuntimeUpdate) => void): () => void;
    close(): Promise<void>;
}
interface BackgroundOperation {
    completion: Promise<unknown>;
}
/**
 * UI-independent interactive host for AgentSession. It owns the active turn,
 * permission waits and AbortController state while AgentSession continues to
 * own model context, tools and JSONL persistence.
 */
export declare class InteractiveAgentRuntime {
    private readonly commandRuntime;
    private static readonly defaultShutdownDrainMs;
    private readonly updates;
    private readonly sessionLeases;
    private readonly runLedger;
    private readonly runtimeAuthority;
    private sessionLease;
    /** 打开会话后保持的 writer claim；运行 lease 可以与它共享同一个文件 lease。 */
    private sessionWriterClaim;
    private lastInfo;
    private state;
    private revision;
    private readonly tools;
    private pendingPermission;
    private activeRun;
    private activeRunController;
    private activeRunCompletion;
    /** 待发送消息只属于当前 Runtime；退出应用或重建 Runtime 后不恢复。 */
    private queuedMessages;
    private queuedMessageStartCompletion;
    private sendQueuedMessagesWithoutDelay;
    private abortController;
    private activeOperationCompletion;
    private closePromise;
    private commandRuntimeClosePromise;
    private closed;
    private readonly shutdownDrainMs;
    private resourceChangeUnsubscribe;
    constructor(commandRuntime: CommandRuntime, options?: InteractiveAgentRuntimeOptions);
    private getInfo;
    submitPrompt(input: string, attachments?: AgentAttachment[], requestIds?: RuntimeRequestIds, promptContext?: string, capabilitySelection?: AgentCapabilitySelection): SubmittedAgentRun;
    submitFollowupTurn(requestIds: RuntimeRequestIds): SubmittedAgentRun;
    submitSupervisionTurn(input: string, requestIds: RuntimeRequestIds, promptContext?: string): SubmittedAgentRun;
    steer(input: string, attachments?: AgentAttachment[], requestIds?: RuntimeRequestIds): Promise<QueuedAgentMessage>;
    enqueue(input: string, attachments?: AgentAttachment[], requestIds?: RuntimeRequestIds): Promise<QueuedAgentMessage>;
    private queueMessage;
    updateQueuedRunMessage(messageId: string, input: string): Promise<void>;
    removeQueuedRunMessage(messageId: string): Promise<void>;
    moveQueuedRunMessage(messageId: string, targetMessageId: string, placeAfter: boolean): Promise<void>;
    steerQueuedRunMessage(messageId: string): Promise<void>;
    sendQueuedRunMessagesNow(): Promise<void>;
    private requireQueuedMessage;
    private queuedMessageSnapshots;
    private scheduleQueuedMessageRun;
    private startQueuedMessageRun;
    continueInterruptedTurn(): Promise<AgentRunOutcome | undefined>;
    /** 只启动持久化断点恢复，返回句柄让 Desktop/TUI 保持流式事件通道。 */
    startInterruptedTurn(requestIds?: RuntimeRequestIds, mode?: "exact" | "newTurn"): Promise<SubmittedAgentRun | undefined>;
    private startRun;
    cancelCurrentRun(reason: AgentTurnCancellationReason): void;
    waitForIdle(): Promise<void>;
    cancelRun(runId: string, reason: AgentTurnCancellationReason): boolean;
    answerPermission(requestId: string, result: PermissionResult): void;
    claimSession(session: string): Promise<void>;
    releaseSessionClaim(session?: string): Promise<void>;
    resumeSession(session: string): Promise<ResumedAgentSession>;
    /**
     * 开始一个全新的空会话，不重建 runtime。
     *
     * 走 runMaintenanceOperation 的互斥语义：运行中或另一项维护进行时拒绝。会话级状态由
     * AgentSession.startNewSession 重置；这里额外释放旧会话的 writer claim，新会话在首次
     * 提交时才建立新的执行 lease。MCP 连接、记忆索引、技能等基础设施全部保留。
     */
    startDraft(): Promise<AgentSessionInfo>;
    switchMessageVersion(messageId: string, direction: "prev" | "next"): Promise<void>;
    /**
     * 命令执行层借用交互宿主的互斥、租约和关闭等待，但具体调用哪个服务由命令层决定。
     * 这样 runtime 不需要为 Model、Memory、MCP 等能力逐个暴露转发方法。
     */
    runExclusiveOperation<T>(operation: RuntimeOperation, execute: (signal: AbortSignal) => Promise<T>): Promise<T>;
    /**
     * 后台命令立即返回句柄，但在 completion 收尾前仍占用当前交互会话。
     * runtime 只跟踪生命周期，不认识子代理等具体领域对象。
     */
    startBackgroundOperation<T extends BackgroundOperation>(operation: RuntimeOperation, start: (signal: AbortSignal) => T): T;
    compactConversation(hint?: string): Promise<string>;
    getSnapshot(): InteractiveRuntimeSnapshot;
    private snapshotInfo;
    subscribe(listener: (update: AgentRuntimeUpdate) => void): () => void;
    close(): Promise<void>;
    private closeCommandRuntime;
    private runMaintenanceOperation;
    private acquireSessionLease;
    private releaseSessionLease;
    private releaseSessionLeaseIfIdle;
    private failUncaughtRun;
    /**
     * JSONL 已经写入终态、但 Host 的 SQLite projection 或终态事件又失败时，不能让内存
     * 状态永久卡在 runs。优先回读 canonical fact，并把它投影/广播为同一终态；读不到时
     * 仍发布 failed 释放前台，而不是让输入框无限禁用。
     */
    private recoverTerminalProjection;
    private emitRecoveredTerminal;
    private startRunLedger;
    private finishRunLedger;
    /**
     * Canonical terminal fact must exist before the control-plane projection and
     * before any host terminal event becomes visible to a client.
     */
    private commitTerminal;
    private executeRun;
    private completeRun;
    private incompleteRun;
    private blockRun;
    private cancelledRun;
    private abortRun;
    private failRun;
    private handleAgentEvent;
    private waitForPermission;
    private completeTool;
    private failTool;
    private eventBase;
    private standaloneRun;
    private emit;
    private setState;
    private syncActiveRunStatus;
    private publishSnapshot;
}
export declare function createInteractiveAgentHost(workspaceRoot: string, options?: CommandRuntimeOptions): Promise<InteractiveAgentHost>;
export {};
