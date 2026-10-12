import type { SessionEvent } from "./recorder.js";
import { type RuntimeHighWater } from "./runtimeEvent.js";
export interface RetryOrigin {
    version: 1;
    source: "agent-session-retry";
    sessionId: string;
    ownerTurnId: string;
    initialRunId: string;
    sourceUserMessageId: string;
    targetMessageId: string;
    targetRole: "user" | "assistant";
    targetRuntime: RuntimeHighWater;
    baseParentMessageId: string;
    targetSlotId: string;
    replyToMessageId: string;
    finalMessageId: string;
    /** Immutable intent boundary, independent of the advancing execution checkpoint. */
    admissionHighWater: RuntimeHighWater;
}
export declare function isRetryOrigin(value: unknown): value is RetryOrigin;
export interface RetryScope {
    status: "active" | "superseded" | "finished";
    /** Actual persisted cursor on the owned replacement chain, never the selected old answer. */
    cursor: string;
    final?: Extract<SessionEvent, {
        type: "agent_message";
    }>;
    selectedFinal: boolean;
    prefixEvents: SessionEvent[];
    ownedEvents: SessionEvent[];
}
/** Full physical log validation precedes all scoped projections and recovery decisions. */
export declare function resolveRetryScope(events: readonly SessionEvent[], origin: RetryOrigin, expected?: {
    sessionId?: string;
    turnId?: string;
    runtimeHighWater?: RuntimeHighWater;
}): RetryScope;
/** Recovered results are reordered by replay; membership remains grounded in native call identity. */
export declare function retryProjectionEvents(events: readonly SessionEvent[], scope: RetryScope, origin: RetryOrigin): SessionEvent[];
