import { type SessionContextCheckpointState, type SessionContextClaimEvidence } from "./metadata.js";
export declare function checkpointClaims(state: SessionContextCheckpointState, evidence?: SessionContextClaimEvidence[]): {
    id: string;
    field: "done" | "goal" | "constraints" | "inProgress" | "blocked" | "decisions" | "errorsAndFixes" | "userMessages" | "nextSteps" | "criticalContext";
    text: string;
    sources: ("unknown" | "tool_call" | "tool_result" | "archive" | "inherited" | "user_stated" | "assistant_stated")[];
    verification: "not_verified";
    references: import("./metadata.js").SessionContextEvidenceReference[];
}[];
