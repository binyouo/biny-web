import { z } from "zod";
export declare const projectSettingsSchema: z.ZodObject<{
    defaultModel: z.ZodOptional<z.ZodString>;
    thinking: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        effort: z.ZodOptional<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>>;
    }, "strict", z.ZodTypeAny, {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    }, {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    }>>;
    agent: z.ZodOptional<z.ZodObject<{
        softStepLimit: z.ZodOptional<z.ZodNumber>;
        hardStepLimit: z.ZodOptional<z.ZodNumber>;
        maxToolCalls: z.ZodOptional<z.ZodNumber>;
        maxRepeatedActions: z.ZodOptional<z.ZodNumber>;
        maxConcurrentTools: z.ZodOptional<z.ZodNumber>;
        maxQueuedToolCalls: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    }, {
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    }>>;
    context: z.ZodOptional<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxTurnToolResultBytes: z.ZodOptional<z.ZodNumber>;
        instructionsMaxBytes: z.ZodOptional<z.ZodNumber>;
        compaction: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            reserveTokens: z.ZodOptional<z.ZodNumber>;
            /** 触发阈值 = 当前输入预算 × 该百分比；显式 reserveTokens 优先。 */
            triggerPercent: z.ZodOptional<z.ZodNumber>;
            keepRecentTokens: z.ZodOptional<z.ZodNumber>;
            /** 与 keepRecentTokens 双上限，取更保守（保留更少）的切分点。 */
            keepRecentMessages: z.ZodOptional<z.ZodNumber>;
            maxSummaryTokens: z.ZodOptional<z.ZodNumber>;
            /** 引用全局 config 已定义的模型别名；缺省跟随当前对话模型。 */
            summaryModel: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        }, {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        maxInputTokens?: number | undefined;
        maxTurnToolResultBytes?: number | undefined;
        instructionsMaxBytes?: number | undefined;
        compaction?: {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        } | undefined;
    }, {
        maxInputTokens?: number | undefined;
        maxTurnToolResultBytes?: number | undefined;
        instructionsMaxBytes?: number | undefined;
        compaction?: {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        } | undefined;
    }>>;
    sandbox: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["off", "workspace-write"]>>;
        allowNetwork: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    }, {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    }>>;
    checkpoints: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>>;
    diagnostics: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        autoDetect: z.ZodOptional<z.ZodBoolean>;
        autoDetectTimeoutMs: z.ZodOptional<z.ZodNumber>;
        maxOutputBytes: z.ZodOptional<z.ZodNumber>;
        commands: z.ZodOptional<z.ZodArray<z.ZodObject<{
            extensions: z.ZodArray<z.ZodString, "many">;
            command: z.ZodString;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }, {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        enabled?: boolean | undefined;
        maxOutputBytes?: number | undefined;
        autoDetect?: boolean | undefined;
        autoDetectTimeoutMs?: number | undefined;
        commands?: {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }[] | undefined;
    }, {
        enabled?: boolean | undefined;
        maxOutputBytes?: number | undefined;
        autoDetect?: boolean | undefined;
        autoDetectTimeoutMs?: number | undefined;
        commands?: {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }[] | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    agent?: {
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    } | undefined;
    context?: {
        maxInputTokens?: number | undefined;
        maxTurnToolResultBytes?: number | undefined;
        instructionsMaxBytes?: number | undefined;
        compaction?: {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        } | undefined;
    } | undefined;
    defaultModel?: string | undefined;
    thinking?: {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    } | undefined;
    diagnostics?: {
        enabled?: boolean | undefined;
        maxOutputBytes?: number | undefined;
        autoDetect?: boolean | undefined;
        autoDetectTimeoutMs?: number | undefined;
        commands?: {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }[] | undefined;
    } | undefined;
    checkpoints?: {
        enabled?: boolean | undefined;
    } | undefined;
    sandbox?: {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    } | undefined;
}, {
    agent?: {
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    } | undefined;
    context?: {
        maxInputTokens?: number | undefined;
        maxTurnToolResultBytes?: number | undefined;
        instructionsMaxBytes?: number | undefined;
        compaction?: {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        } | undefined;
    } | undefined;
    defaultModel?: string | undefined;
    thinking?: {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    } | undefined;
    diagnostics?: {
        enabled?: boolean | undefined;
        maxOutputBytes?: number | undefined;
        autoDetect?: boolean | undefined;
        autoDetectTimeoutMs?: number | undefined;
        commands?: {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }[] | undefined;
    } | undefined;
    checkpoints?: {
        enabled?: boolean | undefined;
    } | undefined;
    sandbox?: {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    } | undefined;
}>;
export type ProjectSettings = z.infer<typeof projectSettingsSchema>;
export declare const projectSettingsDocumentSchema: z.ZodObject<{
    defaultModel: z.ZodOptional<z.ZodString>;
    thinking: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        effort: z.ZodOptional<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>>;
    }, "strict", z.ZodTypeAny, {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    }, {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    }>>;
    agent: z.ZodOptional<z.ZodObject<{
        softStepLimit: z.ZodOptional<z.ZodNumber>;
        hardStepLimit: z.ZodOptional<z.ZodNumber>;
        maxToolCalls: z.ZodOptional<z.ZodNumber>;
        maxRepeatedActions: z.ZodOptional<z.ZodNumber>;
        maxConcurrentTools: z.ZodOptional<z.ZodNumber>;
        maxQueuedToolCalls: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    }, {
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    }>>;
    context: z.ZodOptional<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxTurnToolResultBytes: z.ZodOptional<z.ZodNumber>;
        instructionsMaxBytes: z.ZodOptional<z.ZodNumber>;
        compaction: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            reserveTokens: z.ZodOptional<z.ZodNumber>;
            /** 触发阈值 = 当前输入预算 × 该百分比；显式 reserveTokens 优先。 */
            triggerPercent: z.ZodOptional<z.ZodNumber>;
            keepRecentTokens: z.ZodOptional<z.ZodNumber>;
            /** 与 keepRecentTokens 双上限，取更保守（保留更少）的切分点。 */
            keepRecentMessages: z.ZodOptional<z.ZodNumber>;
            maxSummaryTokens: z.ZodOptional<z.ZodNumber>;
            /** 引用全局 config 已定义的模型别名；缺省跟随当前对话模型。 */
            summaryModel: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        }, {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        maxInputTokens?: number | undefined;
        maxTurnToolResultBytes?: number | undefined;
        instructionsMaxBytes?: number | undefined;
        compaction?: {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        } | undefined;
    }, {
        maxInputTokens?: number | undefined;
        maxTurnToolResultBytes?: number | undefined;
        instructionsMaxBytes?: number | undefined;
        compaction?: {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        } | undefined;
    }>>;
    sandbox: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["off", "workspace-write"]>>;
        allowNetwork: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    }, {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    }>>;
    checkpoints: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>>;
    diagnostics: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        autoDetect: z.ZodOptional<z.ZodBoolean>;
        autoDetectTimeoutMs: z.ZodOptional<z.ZodNumber>;
        maxOutputBytes: z.ZodOptional<z.ZodNumber>;
        commands: z.ZodOptional<z.ZodArray<z.ZodObject<{
            extensions: z.ZodArray<z.ZodString, "many">;
            command: z.ZodString;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }, {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        enabled?: boolean | undefined;
        maxOutputBytes?: number | undefined;
        autoDetect?: boolean | undefined;
        autoDetectTimeoutMs?: number | undefined;
        commands?: {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }[] | undefined;
    }, {
        enabled?: boolean | undefined;
        maxOutputBytes?: number | undefined;
        autoDetect?: boolean | undefined;
        autoDetectTimeoutMs?: number | undefined;
        commands?: {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }[] | undefined;
    }>>;
} & {
    format: z.ZodLiteral<"biny-project-settings">;
    configVersion: z.ZodLiteral<2>;
}, "strict", z.ZodTypeAny, {
    format: "biny-project-settings";
    configVersion: 2;
    agent?: {
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    } | undefined;
    context?: {
        maxInputTokens?: number | undefined;
        maxTurnToolResultBytes?: number | undefined;
        instructionsMaxBytes?: number | undefined;
        compaction?: {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        } | undefined;
    } | undefined;
    defaultModel?: string | undefined;
    thinking?: {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    } | undefined;
    diagnostics?: {
        enabled?: boolean | undefined;
        maxOutputBytes?: number | undefined;
        autoDetect?: boolean | undefined;
        autoDetectTimeoutMs?: number | undefined;
        commands?: {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }[] | undefined;
    } | undefined;
    checkpoints?: {
        enabled?: boolean | undefined;
    } | undefined;
    sandbox?: {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    } | undefined;
}, {
    format: "biny-project-settings";
    configVersion: 2;
    agent?: {
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    } | undefined;
    context?: {
        maxInputTokens?: number | undefined;
        maxTurnToolResultBytes?: number | undefined;
        instructionsMaxBytes?: number | undefined;
        compaction?: {
            enabled?: boolean | undefined;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            maxSummaryTokens?: number | undefined;
            summaryModel?: string | undefined;
        } | undefined;
    } | undefined;
    defaultModel?: string | undefined;
    thinking?: {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    } | undefined;
    diagnostics?: {
        enabled?: boolean | undefined;
        maxOutputBytes?: number | undefined;
        autoDetect?: boolean | undefined;
        autoDetectTimeoutMs?: number | undefined;
        commands?: {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }[] | undefined;
    } | undefined;
    checkpoints?: {
        enabled?: boolean | undefined;
    } | undefined;
    sandbox?: {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    } | undefined;
}>;
export type ProjectSettingsDocument = z.infer<typeof projectSettingsDocumentSchema>;
export declare function loadProjectSettings(workspaceRoot: string): Promise<ProjectSettings>;
/** 保存稀疏的项目覆盖；format/configVersion 由这里统一维护，不参与全局配置 merge。 */
export declare function saveProjectSettings(workspaceRoot: string, settings: ProjectSettings): Promise<ProjectSettings>;
export declare function updateProjectSettings(workspaceRoot: string, update: (current: ProjectSettings) => ProjectSettings | Promise<ProjectSettings>): Promise<ProjectSettings>;
