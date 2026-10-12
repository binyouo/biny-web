/** 计划工作包和只读评审契约；复用 TaskRun 产物，不建立第二份任务账本。 */
import { z } from "zod";
import type { GraphNodeInput, GraphNodeRecord, GraphRecord } from "./GoalGraphStore.js";
import { type TaskVerificationContract, type TaskVerificationEvidence } from "./taskVerification.js";
export interface PlanBlock {
    taskKey: string;
    title: string;
    acceptance: string[];
    kind: "implementation" | "review" | "report";
    reviewTarget?: string;
    rework?: boolean;
}
export interface PlanReviewCandidate {
    taskRunId: string;
    attemptId: string;
    contract: TaskVerificationContract;
    evidence: TaskVerificationEvidence;
}
export declare const planReviewResultSchema: z.ZodEffects<z.ZodObject<{
    verdict: z.ZodEnum<["passed", "needs_changes"]>;
    summary: z.ZodString;
    evidenceReferences: z.ZodArray<z.ZodString, "many">;
    findings: z.ZodArray<z.ZodObject<{
        criterion: z.ZodString;
        requestedChange: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        criterion: string;
        requestedChange: string;
    }, {
        criterion: string;
        requestedChange: string;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    summary: string;
    verdict: "passed" | "needs_changes";
    evidenceReferences: string[];
    findings: {
        criterion: string;
        requestedChange: string;
    }[];
}, {
    summary: string;
    verdict: "passed" | "needs_changes";
    evidenceReferences: string[];
    findings: {
        criterion: string;
        requestedChange: string;
    }[];
}>, {
    summary: string;
    verdict: "passed" | "needs_changes";
    evidenceReferences: string[];
    findings: {
        criterion: string;
        requestedChange: string;
    }[];
}, {
    summary: string;
    verdict: "passed" | "needs_changes";
    evidenceReferences: string[];
    findings: {
        criterion: string;
        requestedChange: string;
    }[];
}>;
export type PlanReviewResult = z.infer<typeof planReviewResultSchema>;
export declare function planBlock(intent: unknown): PlanBlock | undefined;
export declare function latestPlanNode(graph: GraphRecord, key: string): GraphNodeRecord;
export declare function planWorkPacket(graph: GraphRecord, node: GraphNodeRecord): string;
/** 任务依赖指向最后一道门；评审不能被下游绕过。 */
export declare function planTasksToNodes(tasks: Array<{
    key: string;
    title: string;
    task: string;
    dependencies?: string[];
    acceptance: string[];
    verification?: TaskVerificationContract;
    review?: string;
}>, constraints?: string[]): GraphNodeInput[];
