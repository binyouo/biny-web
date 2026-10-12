import type { DurableTaskRunStore } from "../runtime/TaskRunStore.js";
import type { GoalGraphStore, GraphRecord } from "../runtime/GoalGraphStore.js";
import type { Tool } from "../tools/types.js";
export interface PlanToolOptions {
    graphs: GoalGraphStore;
    taskRuns: DurableTaskRunStore;
    stopGraph?: (graphId: string, reason?: string) => GraphRecord;
}
export declare function createPlanTools(options: PlanToolOptions): Tool[];
export declare function planStatus(options: PlanToolOptions, graphId: string, sessionId: string): {
    graphId: string;
    objective: string | undefined;
    status: import("../runtime/GoalGraphStore.js").GraphStatus;
    revision: number;
    checkpoint: import("../runtime/GoalGraphStore.js").SupervisorCheckpoint | undefined;
    replans: {
        used: number;
        max: number;
    };
    nodes: {
        nodeId: string;
        key: string;
        title: string;
        block: import("../runtime/planWork.js").PlanBlock | undefined;
        completionBasis: string;
        report: unknown;
        status: import("../runtime/GoalGraphStore.js").GraphNodeStatus;
        dependencies: string[];
        replacesNodeId: string | undefined;
        taskRunId: string | undefined;
        taskStatus: import("../runtime/TaskRunStore.js").TaskRunStatus | undefined;
        attemptId: string | undefined;
        approval: {
            approvalId: string;
            taskRunId: string;
            attemptId: string;
            checkId: string;
            command: string | undefined;
            cwd: string;
            reason: string;
        } | undefined;
        evidence: unknown;
    }[];
    pendingApprovals: {
        approvalId: string;
        taskRunId: string;
        attemptId: string;
        checkId: string;
        command: string | undefined;
        cwd: string;
        reason: string;
        nodeId: string;
        key: string;
    }[];
    evidenceRunId: string;
};
