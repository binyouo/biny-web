/**
 * Session 事件读取模块。
 *
 * Session 文件是一行一个 JSON 事件。这里负责把 JSONL 解析成事件数组，并从中提取首条用户消息、
 * 最后一条 assistant 消息、事件数量和时间信息，供 `sessions` 列表与历史恢复界面使用。
 */
import { type Stats } from "node:fs";
import type { SessionEvent, SessionTurnStatusEvent } from "./recorder.js";
export type { SessionEvent } from "./recorder.js";
import { type RuntimeEventIdentity } from "./runtimeEvent.js";
export interface SessionSummary {
    fileName: string;
    firstUserMessage: string;
    lastAssistantMessage: string;
    lastTurnStatus?: SessionTurnStatusEvent;
    eventCount: number;
    createdAt: string;
    updatedAt: string;
}
/** Complete validated snapshots are shared; consumers must not mutate their events. */
export declare function readSessionEvents(filePath: string): Promise<SessionEvent[]>;
/** 返回完整源文件及已投影前缀的摘要，供修复路径证明旧事实没有被改写。 */
export declare function readSessionEventsForBackfill(filePath: string, previousBytes: number): Promise<{
    events: SessionEvent[];
    byteLength: number;
    contentHash: string;
    prefixHash?: string;
    prefixEventCount?: number;
}>;
export declare function readStoredSessionEvents(workspaceRoot: string, session: string | undefined): Promise<{
    filePath: string;
    events: SessionEvent[];
    truncated: boolean;
    sizeBytes: number;
    summary?: SessionSummary;
}>;
/** 只读取一个 session 的摘要，供打开会话和 catalog 缺失时的按需修复使用。 */
export declare function readSessionSummary(workspaceRoot: string, session: string | undefined): Promise<SessionSummary | undefined>;
export declare function summarizeSessionEvents(fileName: string, events: readonly SessionEvent[], stat: Pick<Stats, "birthtime" | "mtime">): SessionSummary | undefined;
export interface ParseSessionEventsOptions {
    /**
     * `reject`（默认）超限即抛错，用于校验和写入路径。
     * `truncate` 保留最近的事件，用于"至少要能打开这条会话"的读取路径。
     */
    overflow?: "reject" | "truncate";
}
export interface ParsedSessionEvents {
    events: SessionEvent[];
    /** 事件数超过上限、头部事件被丢弃时为 true；只在 overflow: "truncate" 下可能发生。 */
    truncated: boolean;
}
export declare function parseSessionEvents(raw: string, options?: ParseSessionEventsOptions): SessionEvent[];
/** 与 parseSessionEvents 相同，但额外暴露是否发生了事件数截断，供读取路径如实上报。 */
export declare function parseSessionEventsDetailed(raw: string, options?: ParseSessionEventsOptions): ParsedSessionEvents;
export declare function runtimeEventIdentity(event: SessionEvent): RuntimeEventIdentity | undefined;
/**
 * Makes an existing JSONL session safe for append after an interrupted write.
 * A valid final event only needs a newline; an invalid unterminated fragment is
 * truncated back to the previous complete line.
 */
export declare function repairSessionTailForAppend(filePath: string): Promise<void>;
export declare function listSessionSummaries(workspaceRoot: string): Promise<SessionSummary[]>;
