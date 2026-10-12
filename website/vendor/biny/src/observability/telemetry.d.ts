import type { AgentConfig } from "../config/schema.js";
import type { AgentUsage, ModelRequestMetrics } from "../agent/core/types.js";
export type NativeTelemetryEvent = {
    type: "start";
    provider: string;
    modelId: string;
    input?: unknown;
} | {
    type: "step";
    provider: string;
    modelId: string;
    step: number;
    finishReason?: string;
    usage?: AgentUsage;
    output?: unknown;
} | {
    type: "end";
    provider: string;
    modelId: string;
    steps: number;
    usage?: AgentUsage;
    output?: unknown;
} | {
    type: "error";
    provider: string;
    modelId: string;
    step: number;
    error: unknown;
} | {
    type: "request";
    provider: string;
    modelId: string;
    metrics: ModelRequestMetrics;
};
/** 记录一次模型运行事件，不依赖 provider 回调协议。 */
export declare function recordNativeTelemetry(config: AgentConfig, workspaceRoot: string, event: NativeTelemetryEvent): Promise<void>;
