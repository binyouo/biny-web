/**
 * Provider 模型请求的运行级汇总。
 *
 * 原始请求指标保留在本次 AgentSession 内，并由 telemetry 旁路落盘；这里提供不含输入输出正文的
 * 轻量汇总，供 `/status`、CLI JSON 和宿主 RPC 展示性能与重试情况。
 */
import type { ModelRequestMetrics } from "../agent/core/types.js";
export interface ModelRequestSummary {
    calls: number;
    succeeded: number;
    failed: number;
    totalAttempts: number;
    retries: number;
    totalDurationMs: number;
    averageDurationMs?: number;
    averageTimeToFirstEventMs?: number;
    averageTimeToFirstOutputMs?: number;
}
export declare function summarizeModelRequests(records: readonly ModelRequestMetrics[]): ModelRequestSummary;
export declare function formatModelRequestSummary(summary: ModelRequestSummary): string;
export declare function formatDuration(durationMs: number): string;
