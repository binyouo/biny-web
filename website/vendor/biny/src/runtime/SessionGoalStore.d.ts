import type { RuntimeEventAuthority } from "./RuntimeAuthority.js";
export type SessionGoalStatus = "active" | "paused" | "blocked" | "budget_limited" | "completed";
export interface SessionGoalExpected {
    goalId: string;
    revision: number;
}
export type SessionGoalExpectation = SessionGoalExpected;
export interface SessionGoalEvidence {
    summary: string;
    requirements: Array<{
        requirement: string;
        evidence: string;
    }>;
}
export interface SessionGoalRecord extends SessionGoalExpected {
    workspaceId: string;
    sessionId: string;
    objective: string;
    status: SessionGoalStatus;
    tokenBudget?: number;
    /** 完整 usage 已确认的累计值；usageKnown=false 时不能当作总用量。 */
    tokensUsed: number;
    timeUsedMs: number;
    usageKnown: boolean;
    generation: number;
    evidence?: SessionGoalEvidence;
    createdAt: string;
    updatedAt: string;
}
export interface SessionGoalSetOptions {
    tokenBudget?: number;
    expected?: SessionGoalExpected;
}
export interface SessionGoalUsage {
    goalId: string;
    usageId: string;
    inputTokens?: number;
    cachedInputTokens?: number;
    outputTokens?: number;
    timeUsedMs?: number;
}
export declare class SessionGoalConflictError extends Error {
    readonly code = "session_goal_conflict";
    constructor();
}
/** 会话目标与 Graph Goal 分开定义状态；两者共用同一 authority 的事务与事实事件。 */
export declare class SessionGoalStore {
    private readonly database;
    private readonly authority;
    private closed;
    private readonly listeners;
    private constructor();
    static open(persistenceRoot: string, authority: RuntimeEventAuthority): Promise<SessionGoalStore>;
    subscribe(listener: () => void): () => void;
    get(sessionId: string): SessionGoalRecord | undefined;
    list(options?: {
        status?: SessionGoalStatus;
    }): SessionGoalRecord[];
    set(sessionId: string, objective: string, options?: SessionGoalSetOptions): SessionGoalRecord;
    pause(sessionId: string, expected?: SessionGoalExpected, evidence?: SessionGoalEvidence): SessionGoalRecord;
    resume(sessionId: string, expected?: SessionGoalExpected): SessionGoalRecord;
    clear(sessionId: string, expected?: SessionGoalExpected): void;
    complete(sessionId: string, expected: SessionGoalExpected, evidence: SessionGoalEvidence): SessionGoalRecord;
    block(sessionId: string, expected: SessionGoalExpected, evidence: SessionGoalEvidence): SessionGoalRecord;
    recordUsage(sessionId: string, input: SessionGoalUsage): SessionGoalRecord | undefined;
    close(): void;
    private finish;
    private requireGoal;
    private persist;
    private assertOpen;
}
