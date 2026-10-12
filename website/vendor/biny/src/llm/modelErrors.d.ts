import type { ModelRequestErrorCode, ModelRequestMetrics } from "../agent/core/types.js";
export declare function isModelContextOverflowError(error: unknown): boolean;
export declare function classifyModelRequestError(error: unknown, metrics: ModelRequestMetrics, signal: AbortSignal | undefined): ModelRequestErrorCode;
