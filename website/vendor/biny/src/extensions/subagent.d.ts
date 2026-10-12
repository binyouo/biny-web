import { PermissionManager } from "../permission/PermissionManager.js";
import { z } from "zod";
import type { AgentConfig } from "../config/schema.js";
import type { AgentTool, AgentUsage, ModelRequestContext, ModelRequestObserver } from "../agent/core/types.js";
import type { ModelSettings } from "../llm/modelFactory.js";
import { type ModelUsageObserver } from "../observability/usage.js";
import { SubagentTaskIncompleteError } from "../runtime/SubagentTaskManager.js";
import type { SubagentAccessMode } from "../runtime/SubagentTaskManager.js";
import type { TaskCommunication } from "../runtime/TaskCommunication.js";
import type { TaskVerificationContract } from "../runtime/taskVerification.js";
import { ToolRegistry } from "../tools/registry.js";
import { ToolScheduler } from "../tools/scheduler.js";
import { type EditingMode } from "../tools/file/editingMode.js";
import type { ToolContext, ToolExecutionContext } from "../tools/types.js";
import { type Tool } from "../tools/types.js";
import { type SubagentDefinition } from "./agents.js";
import { WorkerSession, type WorkerExecution } from "../runtime/WorkerSession.js";
export declare const taskVerificationSchema: z.ZodEffects<z.ZodObject<{
    objective: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
    checks: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        command: z.ZodString;
        cwd: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        definitionPaths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        command: string;
        id?: string | undefined;
        timeoutMs?: number | undefined;
        cwd?: string | undefined;
        definitionPaths?: string[] | undefined;
    }, {
        command: string;
        id?: string | undefined;
        timeoutMs?: number | undefined;
        cwd?: string | undefined;
        definitionPaths?: string[] | undefined;
    }>, "many">;
    artifactPaths: z.ZodArray<z.ZodString, "many">;
    allowedRepairPaths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    maxAttempts: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    objective: string;
    checks: {
        command: string;
        id?: string | undefined;
        timeoutMs?: number | undefined;
        cwd?: string | undefined;
        definitionPaths?: string[] | undefined;
    }[];
    artifactPaths: string[];
    context?: string | undefined;
    maxAttempts?: number | undefined;
    allowedRepairPaths?: string[] | undefined;
}, {
    objective: string;
    checks: {
        command: string;
        id?: string | undefined;
        timeoutMs?: number | undefined;
        cwd?: string | undefined;
        definitionPaths?: string[] | undefined;
    }[];
    artifactPaths: string[];
    context?: string | undefined;
    maxAttempts?: number | undefined;
    allowedRepairPaths?: string[] | undefined;
}>, TaskVerificationContract, {
    objective: string;
    checks: {
        command: string;
        id?: string | undefined;
        timeoutMs?: number | undefined;
        cwd?: string | undefined;
        definitionPaths?: string[] | undefined;
    }[];
    artifactPaths: string[];
    context?: string | undefined;
    maxAttempts?: number | undefined;
    allowedRepairPaths?: string[] | undefined;
}>;
declare const subagentSchema: z.ZodObject<{
    task: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    agent: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodBoolean>;
    constraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    verification: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        objective: z.ZodString;
        context: z.ZodOptional<z.ZodString>;
        checks: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            command: z.ZodString;
            cwd: z.ZodOptional<z.ZodString>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            definitionPaths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            command: string;
            id?: string | undefined;
            timeoutMs?: number | undefined;
            cwd?: string | undefined;
            definitionPaths?: string[] | undefined;
        }, {
            command: string;
            id?: string | undefined;
            timeoutMs?: number | undefined;
            cwd?: string | undefined;
            definitionPaths?: string[] | undefined;
        }>, "many">;
        artifactPaths: z.ZodArray<z.ZodString, "many">;
        allowedRepairPaths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        maxAttempts: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        objective: string;
        checks: {
            command: string;
            id?: string | undefined;
            timeoutMs?: number | undefined;
            cwd?: string | undefined;
            definitionPaths?: string[] | undefined;
        }[];
        artifactPaths: string[];
        context?: string | undefined;
        maxAttempts?: number | undefined;
        allowedRepairPaths?: string[] | undefined;
    }, {
        objective: string;
        checks: {
            command: string;
            id?: string | undefined;
            timeoutMs?: number | undefined;
            cwd?: string | undefined;
            definitionPaths?: string[] | undefined;
        }[];
        artifactPaths: string[];
        context?: string | undefined;
        maxAttempts?: number | undefined;
        allowedRepairPaths?: string[] | undefined;
    }>, TaskVerificationContract, {
        objective: string;
        checks: {
            command: string;
            id?: string | undefined;
            timeoutMs?: number | undefined;
            cwd?: string | undefined;
            definitionPaths?: string[] | undefined;
        }[];
        artifactPaths: string[];
        context?: string | undefined;
        maxAttempts?: number | undefined;
        allowedRepairPaths?: string[] | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    task: string;
    name?: string | undefined;
    background?: boolean | undefined;
    agent?: string | undefined;
    description?: string | undefined;
    constraints?: string[] | undefined;
    verification?: TaskVerificationContract | undefined;
}, {
    task: string;
    name?: string | undefined;
    background?: boolean | undefined;
    agent?: string | undefined;
    description?: string | undefined;
    constraints?: string[] | undefined;
    verification?: {
        objective: string;
        checks: {
            command: string;
            id?: string | undefined;
            timeoutMs?: number | undefined;
            cwd?: string | undefined;
            definitionPaths?: string[] | undefined;
        }[];
        artifactPaths: string[];
        context?: string | undefined;
        maxAttempts?: number | undefined;
        allowedRepairPaths?: string[] | undefined;
    } | undefined;
}>;
export type SubagentToolInput = z.infer<typeof subagentSchema>;
export interface SubagentOptions {
    workspaceRoot: string;
    config: AgentConfig;
    permissionManager?: PermissionManager;
    /** 不带别名时返回 subagent 默认模型设置；带别名时返回该模型别名的设置。 */
    getModelSettings: (modelAlias?: string) => ModelSettings;
    /** 每次委派时重新读取具名定义，允许会话期间编辑生效。 */
    loadAgentDefinitions?: () => Promise<SubagentDefinition[]>;
    toolRegistry: ToolRegistry;
    onUsage?: ModelUsageObserver;
    onRequestMetrics?: ModelRequestObserver;
    goalBudgetStopped?: (context: ModelRequestContext | undefined) => boolean;
    runTask?: (input: SubagentToolInput, context: ToolExecutionContext) => Promise<unknown>;
    readTaskResult?: (input: {
        taskRunId: string;
        waitMs?: number;
        afterRevision?: number;
    }, context: ToolExecutionContext) => Promise<unknown>;
    communication?: TaskCommunication;
    continueTask?: (taskRunId: string, message: string, requestId: string, signal?: AbortSignal) => Promise<unknown>;
    cancelTask?: (taskRunId: string, reason?: string) => unknown;
}
export declare function createSubagentTool(options: SubagentOptions): Tool<SubagentToolInput, unknown>;
export declare function createTaskStatusTool(options: SubagentOptions): Tool<{
    taskRunId: string;
    waitMs?: number;
    afterRevision?: number;
}, unknown>;
export declare function createTaskControlTools(options: SubagentOptions): Tool[];
/** Executes one already-admitted child task. Concurrency and deadlines belong to SubagentTaskManager. */
export declare function runSubagentTask(options: SubagentOptions, task: string, signal?: AbortSignal, accessMode?: SubagentAccessMode, agentName?: string, execution?: WorkerExecution): Promise<string>;
export interface PreparedSubagentTask {
    run(signal?: AbortSignal): Promise<string>;
    close(): Promise<void>;
}
export declare function prepareSubagentTask(input: SubagentOptions, task: string, accessMode: SubagentAccessMode, agentName?: string, execution?: WorkerExecution): Promise<PreparedSubagentTask>;
/** 子代理工作协议：子代理是有边界的执行工，不继承主 Agent 的全部身份和权限。 */
export declare function buildSubagentSystemPrompt(accessMode: SubagentAccessMode, definition?: SubagentDefinition): string;
export declare function createSubagentTools(registry: ToolRegistry, allowedTools: readonly string[], options?: CreateSubagentToolsOptions): AgentTool[];
export interface CreateSubagentToolsOptions {
    permission?: {
        manager: PermissionManager;
        workspaceRoot: string;
    };
    onBlocked?: (error: SubagentTaskIncompleteError) => void;
    onActivity?: () => void;
    editing?: {
        mode: EditingMode;
        context: ToolContext;
    };
    accessMode?: SubagentAccessMode;
    scheduler?: ToolScheduler<unknown>;
    session?: WorkerSession;
}
export declare function createReadOnlyTools(registry: ToolRegistry, allowedTools: readonly string[]): AgentTool[];
export declare function enforceSubagentCostBudget(config: AgentConfig, usage: AgentUsage, modelAlias?: string): void;
export declare function subagentCostBudgetReached(config: AgentConfig, usages: readonly AgentUsage[], modelAlias?: string): boolean;
export declare function subagentMaxOutputTokens(config: AgentConfig, modelMaxOutputTokens?: number, modelAlias?: string): number;
export declare function isSensitiveSubagentPath(value: string): boolean;
export {};
