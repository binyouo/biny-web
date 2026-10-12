import type { BlockedReason } from "../agent/types.js";
import type { SessionEvent } from "./recorder.js";
import type { SessionReplay } from "./replay.js";
import type { InterruptedTurn } from "./turnStore.js";
export type ContinuationPlan = {
    action: "continue";
    remainingSteps: number;
} | {
    action: "finished";
} | {
    action: "block";
    message: string;
    blockedReason: BlockedReason;
    requiredAction: string;
} | {
    action: "require-user-input";
    message: string;
} | {
    action: "exhausted";
    message: string;
};
type RecoveryEvidence = Pick<SessionReplay, "events" | "recoveredToolResults" | "retrySourceEvents">;
/**
 * Renewed preparation cannot substitute a different canonical user for a
 * proved native admission. Unknown/legacy evidence retains the existing
 * recovery checks; this does not reconstruct edit ancestry or compare text.
 */
export declare function admissionRecoveryInputConflict(turn: InterruptedTurn, events: readonly SessionEvent[], recoveredUserMessageId: string | undefined): {
    admittedUserMessageId: string;
    recoveredUserMessageId: string;
} | undefined;
export declare function resolveContinuationPlan(turn: InterruptedTurn, replay: RecoveryEvidence, turnLimit: number): ContinuationPlan;
/** 暂停属于当前断点，且暂停后没有新的根输入或完成终态，才允许从历史开启新回合。 */
export declare function pausedTurnAvailable(turn: InterruptedTurn, replay: Pick<SessionReplay, "events">): boolean;
export declare const pausedTurnMarker = "<turn_paused>\nThe previous turn was paused before completion. Running processes may still be active in the background. If tools or commands were cancelled, they may have partially executed.\n</turn_paused>";
/** Native control context for the two explicit paused-new-task boundaries. */
export declare function witnessedPausedFollowupMarker(events: readonly SessionEvent[], turn: InterruptedTurn, admitted: boolean): string;
export {};
