import type { AgentAssistantMessage, AgentMessage, AgentToolResult, AgentLoopTurnContext, AgentUsage, ModelRequestContext, ModelRequestMetrics, ModelRequestObserver } from "../agent/core/types.js";
import { SessionRecorder } from "../session/recorder.js";
import type { RuntimeEventSink } from "../session/runtimeEvent.js";
import { type ToolRetrySafety } from "../tools/types.js";
import type { TaskMessage, WorkerCommunication } from "./TaskCommunication.js";
export interface WorkerExecution {
    taskId: string;
    persistenceRoot: string;
    parentSessionId?: string;
    parentRunId?: string;
    sessionGoalId?: string;
    resume?: boolean;
    runtimeEventSink?: RuntimeEventSink;
    communication?: WorkerCommunication;
}
export declare function workerSessionId(taskId: string): string;
export declare function readWorkerSessionCheckpoint(persistenceRoot: string, taskId: string): Promise<{
    checkpoint: import("../session/turnStore.js").InterruptedTurn;
    facts: {
        version: 1;
        status: "running" | "completed";
        workspaceRoot: string;
        policy: string;
        taskId: string;
        startedSteps: number;
        usages: {
            inputTokens?: number | undefined;
            cacheReadTokens?: number | undefined;
            outputTokens?: number | undefined;
            totalTokens?: number | undefined;
            reasoningTokens?: number | undefined;
            cacheWriteTokens?: number | undefined;
            cacheMissTokens?: number | undefined;
        }[];
        output?: string | undefined;
        parentSessionId?: string | undefined;
        parentRunId?: string | undefined;
        sessionGoalId?: string | undefined;
    };
    events: import("../session/recorder.js").SessionEvent[];
    replay: import("../session/replay.js").SessionReplay;
}>;
export declare class WorkerSession {
    private readonly execution;
    private readonly task;
    readonly systemPrompt: string;
    readonly messages: AgentMessage[];
    private facts;
    private readonly leases;
    private readonly lease;
    readonly sessionId: string;
    readonly recorder: SessionRecorder;
    private readonly turns;
    private tail;
    private failure?;
    private assistant?;
    private readonly callIds;
    private readonly receivedMessageIds;
    private readonly pendingTools;
    private closed;
    private closePromise?;
    private constructor();
    static open(execution: WorkerExecution, task: string, workspaceRoot: string, policy: unknown, systemPrompt: string, model?: {
        provider: string;
        id: string;
    }): Promise<WorkerSession>;
    get startedSteps(): number;
    get usages(): AgentUsage[];
    get output(): string | undefined;
    requestContext(): ModelRequestContext;
    recordModelRequest(metrics: ModelRequestMetrics): Promise<void>;
    replayModelRequestUsage(observer: ModelRequestObserver | undefined): Promise<void>;
    setAssistant(message: AgentAssistantMessage): void;
    receiveMessages(messages: TaskMessage[]): Promise<AgentMessage[]>;
    beforeRequest(maxSteps: number | undefined): Promise<void>;
    executeTool(tool: string, toolCallId: string, args: unknown, retrySafety: ToolRetrySafety, execute: (beforeDispatch: () => Promise<void>) => Promise<AgentToolResult>): Promise<AgentToolResult>;
    private performTool;
    persistStep(turn: AgentLoopTurnContext): Promise<void>;
    complete(output: string): Promise<void>;
    assertCanContinue(): void;
    close(): Promise<void>;
    private saveFromReplay;
    private save;
    private enqueue;
}
