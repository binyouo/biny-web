import type { AgentMessage } from "../agent/core/types.js";
import type { SessionReplay, SessionMessageReference, SessionDiscardedToolCall, SessionMessageNode } from "./replay.js";
import type { SessionEvent, SessionContextUsage, SessionContextState, SessionContextCheckpoint, SessionUsage } from "./recorder.js";
import type { ModelRequestMetrics } from "../agent/core/types.js";
import type { RuntimeHighWater } from "./runtimeEvent.js";
export interface SessionSnapshotData {
    replayVersion: number;
    /** 快照时刻 JSONL 的指纹，用于判断快照是否过时。 */
    fingerprint: {
        size: number;
        mtimeMs: number;
    };
    /** 快照创建时间。 */
    createdAt: string;
    messages: AgentMessage[];
    messageReferences: SessionMessageReference[];
    contextStartMessageIndex: number;
    contextStartUserMessageIndex: number;
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
    /**
     * 预计算的 maxToolCallSequence，避免在 resume 路径上依赖 replay.events。
     * 等于 maxToolCallSequence(replay.events) 的结果。
     */
    maxToolCallSequence: number;
}
/**
 * 尝试读取快照。
 *
 * @returns 快照数据；如果快照不存在、指纹不匹配或损坏，返回 undefined。
 */
export declare function tryReadSessionSnapshot(jsonlPath: string, fingerprint: {
    size: number;
    mtimeMs: number;
}): Promise<SessionSnapshotData | undefined>;
/**
 * 将 replay 结果写入快照文件。
 *
 * 快照写入是"尽力而为"的：失败不会影响主流程，catch 静默吞掉。
 * 写入是异步的，不会阻塞 resume 调用链。
 */
export declare function writeSessionSnapshot(jsonlPath: string, fingerprint: {
    size: number;
    mtimeMs: number;
}, replay: SessionReplay): Promise<void>;
/**
 * 从快照数据重建 SessionReplay 对象（不含 events）。
 *
 * 返回的 replay 对象包含 resume() 需要的所有字段，events 为空数组——调用方
 * 不应依赖返回值的 events 字段（快照路径下也没有 events）。
 */
export declare function snapshotToReplay(snapshot: SessionSnapshotData): SessionReplay;
