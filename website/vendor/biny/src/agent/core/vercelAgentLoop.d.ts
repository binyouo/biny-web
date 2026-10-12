import { LocalPromptProjectionCache, type PromptShapeDiagnostic } from "../../llm/promptCache.js";
import type { AgentAssistantMessage, AgentContext, AgentEvent, AgentLoopConfig, AgentMessage, AgentTool, AgentToolResult, AgentToolResultMessage, ModelStreamOptions } from "./types.js";
import { type DirectCallDiagnostics } from "./vercelModelAdapter.js";
import { EventQueue } from "./EventQueue.js";
export interface VercelLoopState {
    context: AgentContext;
    config: AgentLoopConfig;
    signal: AbortSignal | undefined;
    model: AgentLoopConfig["model"];
    vercelModel: AgentLoopConfig["vercelModel"];
    maxRetries: number | undefined;
    modelOptions: ModelStreamOptions | undefined;
    tools: AgentTool[];
    newMessages: AgentMessage[];
    hasPendingMessages: boolean;
    /** 只承接工具执行和模型重试产生的展示事件，不参与控制流或持久化排序。 */
    displayEvents: EventQueue<AgentLoopDisplayEvent>;
    toolResults: Map<string, AgentToolResult>;
    lastStep: VercelStepRecord | undefined;
    completedSteps: number;
    terminateRequested: boolean;
    stopRequested: boolean;
    streamFailure: string | undefined;
    directModelError: unknown;
    sequentialToolTail: Promise<void>;
    currentText: string;
    currentReasoning: Map<string, {
        text: string;
        providerMetadata?: Record<string, unknown>;
    }>;
    currentToolCalls: Array<{
        id: string;
        name: string;
        arguments: Record<string, unknown>;
    }>;
    widgetInputs: Map<string, {
        text: string;
        publishedAt: number;
    }>;
    directCall: DirectCallDiagnostics | undefined;
    directAttempts: Array<{
        startedAtMs: number;
        durationMs?: number;
        error?: string;
    }>;
    directPromptMessages: AgentMessage[] | undefined;
    previousPromptShape: PromptShapeDiagnostic | undefined;
    promptProjectionCache: LocalPromptProjectionCache;
    promptShapeSkipEpoch: number | undefined;
    outputProducedSinceStep: boolean;
}
interface VercelStepRecord {
    message: AgentAssistantMessage;
    toolResults: AgentToolResultMessage[];
    messages: AgentMessage[];
    hadToolCalls: boolean;
    error?: string;
}
type AgentLoopDisplayEvent = Extract<AgentEvent, {
    type: "tool_execution_start" | "tool_execution_update" | "tool_execution_end" | "model_retry";
}>;
export declare function vercelAgentLoopContinue(context: AgentContext, config: AgentLoopConfig, signal?: AbortSignal): AsyncGenerator<AgentEvent, AgentMessage[], void>;
export declare function assistantSnapshot(state: VercelLoopState): AgentAssistantMessage;
export {};
