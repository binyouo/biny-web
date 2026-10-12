/**
 * Promote only the native, replay-admitted unfinished tool suffix before continuation.
 * This is an append plan, not another recovery/outcome inference or a legacy migration.
 * The caller must validate the full log and continuation safety under its operation lock.
 */
import { type RetryOrigin } from "./retryOrigin.js";
import type { AgentMessage } from "../agent/core/types.js";
import type { SessionEvent } from "./recorder.js";
import type { SessionReplay } from "./replay.js";
export interface RecoveryMaterializationPlan {
    /** False is a stale/unproven owner or branch, not a successful no-op. */
    eligible: boolean;
    parentMessageId?: string;
    messages: Array<Exclude<AgentMessage, {
        role: "user";
    }>>;
}
export declare function recoveryMaterializationPlan(recordedEvents: readonly SessionEvent[], replay: SessionReplay, turnId: string | undefined, retryOrigin?: RetryOrigin): RecoveryMaterializationPlan;
/** Concurrent same-owner canonical additions must be exact copies of the proved suffix. */
export declare function assertRecoveryMaterializationSuffix(prefixEvents: readonly SessionEvent[], prefixPlan: RecoveryMaterializationPlan, laterEvents: readonly SessionEvent[]): void;
