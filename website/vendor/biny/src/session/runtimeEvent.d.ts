/**
 * Session JSONL 中所有新写入事件共用的运行身份。
 *
 * eventSeq 是 session 级单调高水位；runId 标识一次实际执行，turnId 标识
 * 一个用户任务及其所有 continuation。旧 session 可以没有这段 metadata，
 * 但新的 runtime 写入必须带齐身份，才能在恢复时判断事实属于哪次运行。
 */
export interface RuntimeEventIdentity {
    eventId: string;
    eventSeq: number;
    runId?: string;
    turnId?: string;
}
export interface RuntimeEventContext {
    runId: string;
    turnId: string;
}
export type RuntimeEventRecord = {
    runtime?: RuntimeEventIdentity;
};
export interface RuntimeHighWater {
    eventId: string;
    eventSeq: number;
    runId?: string;
    turnId?: string;
}
/**
 * SessionRecorder 写入 JSONL 后调用的 authority sink。
 *
 * JSONL 是 session 事实来源，SQLite 只保存可重建的运行投影。sink 保持同步，
 * 让调用方可以把 authority 投影失败当作当前运行不可安全继续的信号；下一次
 * authority 启动时会重新扫描 JSONL，补齐这次已经落盘但尚未投影的事实。
 */
export interface RuntimeEventSink {
    appendSessionEvent(input: {
        sessionId: string;
        runtime: RuntimeEventIdentity;
        event: unknown;
        createdAt: string;
    }): void;
}
export declare function createRuntimeEventIdentity(eventSeq: number, context?: RuntimeEventContext, eventId?: `${string}-${string}-${string}-${string}-${string}`): RuntimeEventIdentity;
export declare function validateRuntimeEventRecord(value: unknown): value is RuntimeEventIdentity | undefined;
/** Compare only valid witness records; JSON omits optional own-undefined fields. */
export declare function sameRuntimeHighWater(left: RuntimeHighWater | undefined, right: RuntimeHighWater | undefined): boolean;
export declare function assertRuntimeEventSequence(value: number): void;
/**
 * 校验带 runtime metadata 的事实流。旧事件允许缺少 metadata；一旦事件带有
 * metadata，后续 metadata 的 eventSeq 必须严格递增且 eventId 不得重复。
 */
export declare function validateRuntimeEventStream(events: readonly RuntimeEventRecord[], expected?: {
    runId?: string;
    turnId?: string;
    upToEventSeq?: number;
}): RuntimeHighWater | undefined;
export declare function runtimeEventsForRun<T extends RuntimeEventRecord>(events: readonly T[], runId: string): T[];
