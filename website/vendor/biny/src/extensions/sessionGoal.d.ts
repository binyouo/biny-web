import type { SessionGoalExpectation, SessionGoalStore } from "../runtime/SessionGoalStore.js";
import type { Tool } from "../tools/types.js";
export declare function createSessionGoalTools(store: SessionGoalStore, getSessionId: () => string, getRequest: () => (SessionGoalExpectation & {
    runId: string;
    generation: number;
}) | undefined): Tool[];
