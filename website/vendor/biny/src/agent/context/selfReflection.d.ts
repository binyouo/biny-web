import type { AgentModel, ModelRequestContext, ModelRequestObserver } from "../core/types.js";
import type { ModelUsageObserver } from "../../observability/usage.js";
import type { SoulStorage, SoulEvolutionResult } from "./soulStorage.js";
import type { EmotionStorage } from "./emotionStorage.js";
export interface SelfReflectionMemoryCandidate {
    content: string;
    evidence?: string;
    activityDerived?: boolean;
}
export interface SelfReflectionActionCandidate {
    taskRunId: string;
    dateKey: string;
    sourceHash: string;
    title: string;
    description: string;
    evidence?: string;
}
export interface SelfReflectionOptions {
    configDir?: string;
    model?: AgentModel;
    memoryContext?: string;
    activityContext?: string;
    allowActivity?: boolean;
    soulStorage?: SoulStorage;
    emotionStorage?: EmotionStorage;
    sessionId?: string;
    signal?: AbortSignal;
    now?: () => Date;
    onUsage?: ModelUsageObserver;
    onModelRequest?: ModelRequestObserver;
    requestContext?: ModelRequestContext;
    promoteMemory?: (candidate: SelfReflectionMemoryCandidate) => Promise<boolean>;
    createTask?: (candidate: SelfReflectionActionCandidate) => Promise<boolean>;
    force?: boolean;
}
export interface SelfReflectionResult {
    dateKey: string;
    written: boolean;
    model?: string;
    memoriesCreated?: number;
    tasksCreated?: number;
    soul?: SoulEvolutionResult;
    emotionUpdated?: boolean;
    errors?: string[];
    reason?: "empty" | "up_to_date" | "no_model";
}
export declare function refreshSelfReflection(dateKey: string, options?: SelfReflectionOptions): Promise<SelfReflectionResult>;
