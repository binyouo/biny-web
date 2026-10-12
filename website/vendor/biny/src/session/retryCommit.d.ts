import type { SessionEvent } from "./recorder.js";
import type { RetryOrigin } from "./retryOrigin.js";
import type { AgentAssistantMessage } from "../agent/core/types.js";
import type { AgentTurnOutcome } from "../agent/types.js";
import { type RuntimeHighWater } from "./runtimeEvent.js";
export interface RetryWindow {
    version: 1;
    replyMessageId: string;
    admissionHighWater: RuntimeHighWater;
}
export interface RetryCommit {
    version: 1;
    replyMessageId: string;
    runId: string;
    parentMessageId: string;
    runtimeHighWater: RuntimeHighWater;
    message: AgentAssistantMessage;
    outcome: AgentTurnOutcome;
}
export declare function isRetryWindow(value: unknown): value is RetryWindow;
export declare function isRetryCommit(value: unknown): value is RetryCommit;
export declare function assertRetryWindow(events: readonly SessionEvent[], origin: RetryOrigin, window: RetryWindow | undefined): asserts window is RetryWindow;
