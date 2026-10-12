import { type RetryOrigin } from "./retryOrigin.js";
import type { AgentMessage, ModelRequestMetrics } from "../agent/core/types.js";
import { type SessionMessageNode, type SessionMessageReference } from "./messageTree.js";
import type { SessionContextCheckpoint, SessionContextState, SessionContextUsage, SessionEvent, SessionUsage } from "./recorder.js";
import { type RuntimeHighWater } from "./runtimeEvent.js";
export { activeSessionEventsForPath, activeSessionMessageIds, sessionMessageTree, type SessionMessageNode, type SessionMessageReference } from "./messageTree.js";
export interface SessionReplay {
    events: SessionEvent[];
    /** 会话超过大小上限、只回放了最近部分时为 true。 */
    truncated?: boolean;
    messages: AgentMessage[];
    /** 与 messages 一一对应，index 是完整 session 模型消息流中的绝对位置。 */
    messageReferences: SessionMessageReference[];
    /** 当前 checkpoint 之前一共跳过了多少条模型消息。 */
    contextStartMessageIndex: number;
    /** 当前 checkpoint 之前一共跳过了多少条 user 消息，用于恢复附件与用户事件的对应关系。 */
    contextStartUserMessageIndex: number;
    /** 应用 checkpoint 之前，完整 session 可以重放出的模型消息数。 */
    totalMessageCount: number;
    contextUsage?: SessionContextUsage;
    contextState?: SessionContextState;
    contextCheckpoint?: SessionContextCheckpoint;
    usage: SessionUsage[];
    modelRequests: ModelRequestMetrics[];
    recoveredToolResults: Array<Extract<SessionEvent, {
        type: "tool_result";
    }>>;
    discardedToolCalls: SessionDiscardedToolCall[];
    messageTree: SessionMessageNode[];
    runtimeHighWater?: RuntimeHighWater;
    /** Physical evidence retained only for a checkpoint-scoped retry projection. */
    retrySourceEvents?: SessionEvent[];
}
export interface SessionReplayOptions {
    /** 只读证据回查需要压缩前原文，仍完整验证日志与当前消息分支。 */
    includeCompactedMessages?: boolean;
    sessionId?: string;
    retryOrigin?: RetryOrigin;
    expectedRuntimeHighWater?: RuntimeHighWater;
    resolveToolOutcome?: (call: {
        tool: string;
        sessionId: string;
        turnId: string;
        toolCallId: string;
        operationId: string;
        request: unknown;
    }) => Pick<Extract<SessionEvent, {
        type: "tool_result";
    }>, "result" | "executionStatus" | "outcomeUnknownReason" | "evidence"> | undefined;
}
export interface SessionDiscardedToolCall {
    tool: string;
    toolCallId?: string;
    sequence?: number;
    operationId: string;
    state: "not_started";
    reason: "not_started";
}
export declare function replaySession(filePath: string): Promise<SessionReplay>;
export declare function replayStoredSession(workspaceRoot: string, session: string | undefined): Promise<SessionReplay>;
export declare function replaySessionEvents(recordedEvents: SessionEvent[], options?: SessionReplayOptions): SessionReplay;
/**
 * 事件流重组为对话消息。
 *
 * 核心难点是「一条 assistant 消息可能对应多个 tool_call」：事件是逐个记录的，而消息要把
 * 同一批调用合并进一条 assistant 消息。因此这里维护一组 pending 状态，遇到 tool_result 或
 * 新的对话消息时才 flush 出去；`callsFlushed` 防止同一批调用被写入两次。
 */
export declare function sessionEventsToConversation(events: SessionEvent[], options?: {
    discardedToolCallIds?: ReadonlySet<string>;
    recoveredToolResults?: ReadonlyArray<Extract<SessionEvent, {
        type: "tool_result";
    }>>;
}): AgentMessage[];
