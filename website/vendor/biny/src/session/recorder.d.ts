import { type SessionReplay } from "./replay.js";
import { type SensitiveValueRedactionOptions } from "../utils/secrets.js";
import type { SessionContextCheckpoint, SessionContextState, SessionContextUsage, SessionUsage } from "./metadata.js";
import type { AttachmentReference } from "../attachments/store.js";
import type { AgentMessage, ModelRequestMetrics } from "../agent/core/types.js";
import type { ToolExecutionResultStatus, ToolExecutionState, ToolOutcomeUnknownReason, ToolRetrySafety } from "../tools/types.js";
import type { CommittedFileChange } from "../tools/file/fileChange.js";
import { type RuntimeEventContext, type RuntimeEventIdentity, type RuntimeEventSink, type RuntimeHighWater } from "./runtimeEvent.js";
export type { SessionContextCheckpoint, SessionContextState, SessionContextUsage, SessionUsage, UsageOperation } from "./metadata.js";
/**
 * One provider reasoning block with the opaque metadata that makes it
 * replayable. Providers sign blocks individually, so concatenating several of
 * them under one signature produces history the provider will reject.
 */
export interface ReasoningBlock {
    text: string;
    providerOptions?: Record<string, unknown>;
}
export interface SessionImportSource {
    format: "claude" | "chatgpt" | "codex";
    conversationId?: string;
    toolCallId?: string;
    /** One-based source record or mapping entry, independent of source message identity. */
    record: number;
    messageId?: string;
    parentMessageId?: string;
}
export interface SessionEventRuntimeMetadata {
    runtime?: RuntimeEventIdentity;
    importSource?: SessionImportSource;
}
export type SessionTurnStatus = "completed" | "incomplete" | "blocked" | "cancelled" | "failed" | "aborted";
/**
 * 一个公开 Agent 回合的稳定终态。
 *
 * Provider 消息和工具事件负责恢复模型上下文；这个事件只保存宿主需要恢复的完成语义，
 * 不参与模型消息重放。
 */
export interface SessionTurnStatusEvent {
    type: "turn_status";
    status: SessionTurnStatus;
    stopReason: string;
    finishReason?: string;
    steps: number;
    summary?: string;
    resumable?: boolean;
    blockedReason?: string;
    requiredAction?: string;
    affectedTodoIds?: string[];
    runtime?: RuntimeEventIdentity;
    time?: string;
}
type SessionEventPayload = {
    type: "user_message";
    metadata?: Record<string, unknown>;
    content: string;
    attachments?: AttachmentReference[];
    skills?: string[];
    contextUsage?: SessionContextUsage;
    contextState?: SessionContextState;
    preparationUsage?: SessionUsage[];
    messageId?: string;
    parentMessageId?: string;
    slotId?: string;
    auditOnly?: boolean;
    time?: string;
} | {
    type: "assistant_message";
    metadata?: Record<string, unknown>;
    content: string;
    reasoningContent?: string;
    reasoningProviderOptions?: Record<string, unknown>;
    reasoningBlocks?: ReasoningBlock[];
    usage?: SessionUsage;
    relatedUsage?: SessionUsage[];
    contextState?: SessionContextState;
    messageId?: string;
    parentMessageId?: string;
    slotId?: string;
    replyToMessageId?: string;
    retryOfMessageId?: string;
    auditOnly?: boolean;
    time?: string;
} | {
    type: "tool_call";
    tool: string;
    args: unknown;
    toolCallId?: string;
    sequence?: number;
    assistantContent?: string;
    reasoningContent?: string;
    reasoningProviderOptions?: Record<string, unknown>;
    reasoningBlocks?: ReasoningBlock[];
    auditOnly?: boolean;
    time?: string;
} | {
    type: "tool_execution";
    tool: string;
    toolCallId: string;
    sequence: number;
    operationId: string;
    state: ToolExecutionState;
    evidence?: string;
    retrySafety?: ToolRetrySafety;
    outcomeUnknownReason?: ToolOutcomeUnknownReason;
    change?: CommittedFileChange;
    fileChangeIsResult?: boolean;
    time?: string;
} | {
    type: "tool_result";
    tool: string;
    result: unknown;
    toolCallId?: string;
    sequence?: number;
    relatedUsage?: SessionUsage[];
    executionStatus?: ToolExecutionResultStatus;
    outcomeUnknownReason?: ToolOutcomeUnknownReason;
    recovered?: boolean;
    operationId?: string;
    evidence?: string;
    auditOnly?: boolean;
    time?: string;
} | {
    type: "agent_message";
    metadata?: Record<string, unknown>;
    message: Exclude<AgentMessage, {
        role: "user";
    }>;
    messageId?: string;
    parentMessageId?: string;
    slotId?: string;
    replyToMessageId?: string;
    retryOfMessageId?: string;
    time?: string;
} | ({
    type: "context_checkpoint";
    reason: "threshold" | "overflow" | "manual";
    time?: string;
} & SessionContextCheckpoint) | {
    type: "model_request";
    metrics: ModelRequestMetrics;
    time?: string;
} | {
    type: "message_version_selected";
    messageId: string;
    slotId: string;
    time?: string;
} | {
    type: "message_metadata";
    messageId: string;
    metadata: Record<string, unknown>;
    time?: string;
}
/** 中断或暂停留下的模型上下文；不属于公开消息树，也不在聊天时间线展示。 */
 | {
    type: "turn_interrupted";
    reason: "interrupted" | "paused";
    content: string;
    time?: string;
} | SessionTurnStatusEvent | {
    type: "error";
    message: string;
    detail?: unknown;
    relatedUsage?: SessionUsage[];
    time?: string;
};
export type SessionEvent = SessionEventPayload & SessionEventRuntimeMetadata;
export declare class SessionRecorder {
    private readonly workspaceRoot;
    private readonly runtimeEventSink?;
    readonly sessionId: string;
    readonly filePath: string;
    private stream?;
    private descriptor?;
    private readonly descriptorIdentity;
    private closePromise?;
    private streamError;
    private closed;
    private closing;
    private toolCallSequence;
    private recordedEvents;
    private readonly existedAtCreation;
    private lastMessageId;
    private persistenceBarrier;
    private runtimeContext;
    private runtimeSequence;
    private runtimeSequenceInitialized;
    private lastRuntimeEvent;
    constructor(workspaceRoot: string, sessionId?: string, resolvedFilePath?: string, runtimeEventSink?: RuntimeEventSink | undefined);
    record(event: SessionEvent): SessionEvent;
    /** 旁路事实可以显式绑定运行身份，避免延迟 memory/diagnostic 请求继承旧 run。 */
    recordWithRuntimeContext(event: SessionEvent, runtimeContext?: RuntimeEventContext): SessionEvent;
    private recordInternal;
    /** Only ordinary redacted records and internally reconstructed durable copies enter here. */
    private appendPersistedEvent;
    private prepareAppendStream;
    /** 关键协议事件使用有序屏障，确保 JSONL 已交给文件系统后再推进执行状态。 */
    recordAndFlush(event: SessionEvent,
    /** 并发后台操作显式传自己的身份，避免临时改写 recorder 的共享上下文。 */
    runtimeContext?: RuntimeEventContext | undefined,
    /** Host-selected response context; never taken from tool data or event fields. */
    resultRedactionOptions?: SensitiveValueRedactionOptions): Promise<SessionEvent>;
    /**
     * A new ordinary input leaves a retry-owned view through the actual selected
     * path. The old checkpoint is opaque: abandonment never parses old intent.
     * Hydration is staged; only this recorder chooses the durable parent.
     */
    admitTurnAfterRetryView(kind: "ordinary" | "paused-followup" | "admitted-followup", prepare: (replay: SessionReplay, pausedMarker?: string) => Promise<{
        event?: Extract<SessionEvent, {
            type: "user_message";
        }>;
        install: () => void;
    }>): Promise<SessionEvent | undefined>;
    /**
     * Copy an already-durable native recovery suffix without recapturing/redacting it.
     * The API accepts only immutable source references, never caller message content.
     * Every copied body is reconstructed afresh from physical JSONL inside the barrier.
     */
    materializeRecoveredToolSuffix(input: {
        ownerTurnId: string;
        expectedRuntimeHighWater: RuntimeHighWater;
        sourcePrefix: {
            byteLength: number;
            sha256: string;
        };
    }): Promise<SessionReplay>;
    /** Finish only the actual outcome/payload held by the current checkpoint phase. */
    commitRetryReply(input: {
        /** Live completion publishes its rich audit between these validated stages. */
        stage?: "reply" | "terminal";
        ownerTurnId: string;
        replyMessageId: string;
        expectedRuntimeHighWater: RuntimeHighWater;
        sourcePrefix: {
            byteLength: number;
            sha256: string;
        };
    }): Promise<SessionReplay>;
    setRuntimeContext(context: RuntimeEventContext | undefined): void;
    runtimeContextSnapshot(): RuntimeEventContext | undefined;
    runtimeHighWater(): RuntimeHighWater | undefined;
    flush(): Promise<void>;
    nextToolCallSequence(): number;
    restoreToolCallSequence(sequence: number): void;
    restoreMessageParent(messageId: string | undefined): void;
    isUnrecordedDraft(): boolean;
    repairTailForAppend(): void;
    private linkCanonicalMessage;
    readText(): string;
    close(): Promise<void>;
    private closeAfterBarrier;
    private openDescriptor;
    private ensureRuntimeSequence;
}
/**
 * 生成新 session 的逻辑 id，同时就是 session 文件的 basename（`<id>.jsonl`）。
 *
 * 格式 `<yyyymmdd-hhmmss>-<rand8>`，与 7 月旧布局同构：时间戳段用本地时间（跟墙上时钟一致，
 * "按时间找会话"才符合直觉，也对齐外部 rollout 的本地时间命名；单机使用时字典序仍按创建
 * 先后排列），8 位 hex 随机段消掉同一秒内的碰撞。catalog/runLedger/claim/resume 只把 id 当
 * 不透明字符串，所以改格式不需要动那 30 处耦合；store 的 `sessionFilePath` 靠"先查重、再落
 * 候选路径"保证 id 与文件名始终一致。
 */
export declare function createSessionId(timestampMs?: number): string;
