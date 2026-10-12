/**
 * 工具调度器。
 *
 * 同一批模型 tool_calls 中，资源不冲突的工具可以并发；涉及同一路径写入或未知副作用的工具会等待。
 * 调度器只负责启动时机，不负责 UI、权限或 transcript 顺序。
 */
import { type ToolAccessList } from "./access.js";
export declare const defaultMaxToolConcurrency = 4;
export declare const defaultMaxQueuedToolCalls = 64;
export interface ToolSchedulerOptions {
    maxConcurrency: number;
    maxQueuedTasks: number;
}
export interface ToolSchedulerSnapshot {
    maxConcurrency: number;
    maxQueuedTasks: number;
    active: number;
    queued: number;
}
export declare class ToolSchedulerQueueFullError extends Error {
    readonly maxQueuedTasks: number;
    constructor(maxQueuedTasks: number);
}
export interface ToolSchedulerTask<TResult> {
    accesses: ToolAccessList;
    signal?: AbortSignal;
    start(): Promise<TResult>;
}
export declare class ToolScheduler<TResult> {
    private readonly queue;
    private readonly active;
    private readonly maxConcurrency;
    private readonly maxQueuedTasks;
    private pumping;
    constructor(options?: number | ToolSchedulerOptions, maxQueuedTasks?: number);
    getSnapshot(): ToolSchedulerSnapshot;
    schedule(task: ToolSchedulerTask<TResult>): Promise<TResult>;
    private pump;
    private nextRunnableIndex;
    private start;
    private finish;
    private isBlocked;
}
