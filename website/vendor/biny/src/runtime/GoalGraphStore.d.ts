import type { InteractiveRuntimeHandle } from "./InteractiveAgentRuntime.js";
import type { CommandRuntime } from "./CommandRuntime.js";
import type { RuntimeEventAuthority } from "./RuntimeAuthority.js";
import { type DurableTaskRunStore } from "./TaskRunStore.js";
import { type TaskClosureResult } from "./TaskClosure.js";
import { type TaskCommandExecutor } from "./taskVerification.js";
export type GraphStatus = "draft" | "running" | "paused" | "completed" | "failed" | "blocked" | "cancelled";
export type GraphNodeStatus = "pending" | "ready" | "running" | "completed" | "failed" | "blocked" | "cancelled";
export type GraphMode = "fixed" | "supervised";
export type SupervisorCheckpoint = "needs_attention" | "settled";
export interface GraphNodeInput {
    nodeKey: string;
    prompt: string;
    dependencies?: string[];
    intent?: unknown;
    verification?: unknown;
}
export interface GraphNodeRecord {
    nodeId: string;
    graphId: string;
    nodeKey: string;
    status: GraphNodeStatus;
    dependencies: string[];
    intent: unknown;
    taskRunId?: string;
    artifact?: unknown;
    replacesNodeId?: string;
    revision: number;
}
export interface GraphRecord {
    graphId: string;
    workspaceId: string;
    status: GraphStatus;
    mode: GraphMode;
    supervisorSessionId?: string;
    maxReplans: number;
    replanCount: number;
    revision: number;
    payload: unknown;
    createdAt: string;
    updatedAt: string;
    nodes: GraphNodeRecord[];
}
export interface SupervisedGraphInput {
    graphId?: string;
    supervisorSessionId: string;
    supervisorRunId?: string;
    nodes: readonly GraphNodeInput[];
    payload?: unknown;
    maxReplans?: number;
}
export interface GraphWakeRecord {
    wakeId: string;
    graphId: string;
    kind: "dispatch" | "supervisor";
    reason: string;
    status: "pending" | "claimed" | "completed" | "discarded" | "blocked";
    attempt: number;
    graphRevision?: number;
    checkpoint?: SupervisorCheckpoint;
    sessionId?: string;
    runId?: string;
    createdAt: string;
    completedAt?: string;
}
export interface GraphClaim {
    claimId: string;
    graphId: string;
    nodeId: string;
    intentFingerprint: string;
    claimToken: string;
    status: string;
    claimedAt: string;
}
export declare class GoalGraphStore {
    private readonly database;
    private readonly authority;
    private closed;
    private readonly changeListeners;
    subscribe(listener: () => void): () => void;
    private constructor();
    static open(persistenceRoot: string, authority: RuntimeEventAuthority): Promise<GoalGraphStore>;
    createGraph(nodes: readonly GraphNodeInput[], payload?: unknown, graphId?: string): GraphRecord;
    createSupervisedGraph(input: SupervisedGraphInput): GraphRecord;
    private createGraphRecord;
    getGraph(graphId: string): GraphRecord | undefined;
    listGraphs(): GraphRecord[];
    listSupervisedGraphIds(sessionId: string): string[];
    startGraph(graphId: string): GraphRecord;
    startSupervisedDraft(graphId: string, sessionId: string, revision: number): GraphRecord;
    reviseSupervisedDraft(graphId: string, sessionId: string, revision: number, nodes: GraphNodeInput[], payload: unknown): GraphRecord;
    reworkSupervisedNode(graphId: string, sessionId: string, nodeId: string): GraphRecord;
    pauseGraph(graphId: string): GraphRecord;
    resumeGraph(graphId: string): GraphRecord;
    cancelGraph(graphId: string): GraphRecord;
    inspectGraph(graphId: string): GraphRecord;
    addSupervisedNodes(graphId: string, sessionId: string, nodes: readonly GraphNodeInput[]): GraphRecord;
    replaceSupervisedNode(graphId: string, sessionId: string, nodeId: string, replacement: {
        nodeKey: string;
        prompt: string;
    }): GraphRecord;
    finishSupervisedGraph(graphId: string, sessionId: string, status: "completed" | "failed" | "blocked", summary?: string): GraphRecord;
    readyNodes(graphId: string): GraphNodeRecord[];
    claimIntent(graphId: string, nodeId: string, claimToken?: `${string}-${string}-${string}-${string}-${string}`, taskRunId?: string): GraphClaim | undefined;
    /** Async preparation must still own the current node claim before dispatch. */
    canDispatchClaim(claim: GraphClaim): boolean;
    /** Release only a current scheduler claim with no durable dispatch evidence; keep pause intact. */
    releaseUndispatchedClaim(claim: GraphClaim, reason: string): boolean;
    completeNode(graphId: string, nodeId: string, status: Exclude<GraphNodeStatus, "pending" | "ready" | "running">, artifact?: unknown, taskRunId?: string): GraphRecord;
    /** task.approve 复用 TaskRun 闭环后，由 Graph 自己补齐唯一的节点投影。 */
    projectTaskClosure(taskRunId: string, result: TaskClosureResult): GraphRecord | undefined;
    /** Host 启动时回收上一个进程留下的 running claim，避免 Graph 永久停滞。 */
    recoverRunningNodes(taskRuns?: DurableTaskRunStore): void;
    noteSupervisorCheckpoint(graphId: string, checkpoint: SupervisorCheckpoint): GraphRecord;
    createWake(graphId: string, reason: string): string;
    claimWake(graphId: string): string | undefined;
    listSupervisorWakes(): GraphWakeRecord[];
    claimSupervisorWake(wakeId: string): GraphWakeRecord | undefined;
    finishSupervisorWake(wakeId: string, status: "completed" | "discarded" | "blocked"): void;
    runtimeRun(runId: string): ReturnType<RuntimeEventAuthority["getRun"]>;
    completeWake(wakeId: string): void;
    listRunningGraphIds(): string[];
    listGraphEvents(graphId: string, options?: {
        afterSequence?: number;
        limit?: number;
    }): ReturnType<RuntimeEventAuthority["readEvents"]>;
    close(): void;
    private updateGraph;
    private projectGraphStatus;
    /** 把 running 节点退回 ready/blocked 并放弃当前 claim；Host 重启回收与 supervisor 的 busy 重试共用。 */
    recoverNode(graphId: string, nodeId: string, status: "ready" | "blocked", reason: string, taskRunId?: string): GraphRecord;
    private nodes;
    private requireSupervisedGraph;
    private assertReplanAvailable;
    private touchGraph;
    /** 展示与调度共享同一检查点定义，审批事实只读取 TaskRun，不复制到节点状态。 */
    supervisorCheckpoint(graph: GraphRecord): SupervisorCheckpoint | undefined;
    private queueCurrentSupervisorCheckpoint;
    private createSupervisorWake;
    private requireGraph;
    private withGraphEvent;
    private assertOpen;
}
export interface GraphSupervisorOptions {
    onActivity?(): void;
    store?: GoalGraphStore;
    getStore?: () => GoalGraphStore;
    runtime?: InteractiveRuntimeHandle;
    getRuntime?: () => InteractiveRuntimeHandle;
    taskRuns?: DurableTaskRunStore;
    getTaskRuns?: () => DurableTaskRunStore | undefined;
    getTaskCommandExecutor?: () => TaskCommandExecutor | undefined;
    getWorkspaceRoot?: () => string;
    getWorkspaceIgnore?: () => readonly string[];
    resolveSupervisorRuntime?: (sessionId: string) => Promise<InteractiveRuntimeHandle>;
    resolveSupervisorCommands?: (sessionId: string) => Promise<CommandRuntime>;
    supervisorSessionExists?: (sessionId: string) => Promise<boolean>;
}
export declare class GraphSupervisor {
    private readonly options;
    private scheduled;
    private started;
    private scanning;
    private active;
    private stopped;
    constructor(options: GraphSupervisorOptions);
    hasActiveWork(): boolean;
    start(): void;
    /** Host 写操作、工具完成及会话恢复空闲时唤醒；合并同一批通知，不维护另一份队列。 */
    requestTick(): void;
    stop(): void;
    tick(): Promise<void>;
    private scan;
    private executeSupervisorWake;
    private executeNode;
    private transitionTask;
    private runtime;
    private supervisorRuntime;
    private store;
    private taskRuns;
}
