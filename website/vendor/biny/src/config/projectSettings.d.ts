import { z } from "zod";
export declare const projectSettingsSchema: z.ZodObject<{
    defaultModel: z.ZodOptional<z.ZodString>;
    thinking: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        effort: z.ZodOptional<z.ZodEnum<{
            minimal: "minimal";
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
            max: "max";
        }>>;
    }, z.core.$strict>>;
    agent: z.ZodOptional<z.ZodObject<{
        softStepLimit: z.ZodOptional<z.ZodNumber>;
        hardStepLimit: z.ZodOptional<z.ZodNumber>;
        maxToolCalls: z.ZodOptional<z.ZodNumber>;
        maxRepeatedActions: z.ZodOptional<z.ZodNumber>;
        maxConcurrentTools: z.ZodOptional<z.ZodNumber>;
        maxQueuedToolCalls: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    context: z.ZodOptional<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxTurnToolResultBytes: z.ZodOptional<z.ZodNumber>;
        instructionsMaxBytes: z.ZodOptional<z.ZodNumber>;
        compaction: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            reserveTokens: z.ZodOptional<z.ZodNumber>;
            triggerPercent: z.ZodOptional<z.ZodNumber>;
            keepRecentTokens: z.ZodOptional<z.ZodNumber>;
            keepRecentMessages: z.ZodOptional<z.ZodNumber>;
            maxSummaryTokens: z.ZodOptional<z.ZodNumber>;
            summaryModel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    sandbox: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<{
            off: "off";
            "workspace-write": "workspace-write";
        }>>;
        allowNetwork: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    checkpoints: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    diagnostics: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        autoDetect: z.ZodOptional<z.ZodBoolean>;
        autoDetectTimeoutMs: z.ZodOptional<z.ZodNumber>;
        maxOutputBytes: z.ZodOptional<z.ZodNumber>;
        commands: z.ZodOptional<z.ZodArray<z.ZodObject<{
            extensions: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ProjectSettings = z.infer<typeof projectSettingsSchema>;
export declare const projectSettingsDocumentSchema: z.ZodObject<{
    defaultModel: z.ZodOptional<z.ZodString>;
    thinking: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        effort: z.ZodOptional<z.ZodEnum<{
            minimal: "minimal";
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
            max: "max";
        }>>;
    }, z.core.$strict>>;
    agent: z.ZodOptional<z.ZodObject<{
        softStepLimit: z.ZodOptional<z.ZodNumber>;
        hardStepLimit: z.ZodOptional<z.ZodNumber>;
        maxToolCalls: z.ZodOptional<z.ZodNumber>;
        maxRepeatedActions: z.ZodOptional<z.ZodNumber>;
        maxConcurrentTools: z.ZodOptional<z.ZodNumber>;
        maxQueuedToolCalls: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    context: z.ZodOptional<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxTurnToolResultBytes: z.ZodOptional<z.ZodNumber>;
        instructionsMaxBytes: z.ZodOptional<z.ZodNumber>;
        compaction: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            reserveTokens: z.ZodOptional<z.ZodNumber>;
            triggerPercent: z.ZodOptional<z.ZodNumber>;
            keepRecentTokens: z.ZodOptional<z.ZodNumber>;
            keepRecentMessages: z.ZodOptional<z.ZodNumber>;
            maxSummaryTokens: z.ZodOptional<z.ZodNumber>;
            summaryModel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    sandbox: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<{
            off: "off";
            "workspace-write": "workspace-write";
        }>>;
        allowNetwork: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    checkpoints: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    diagnostics: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        autoDetect: z.ZodOptional<z.ZodBoolean>;
        autoDetectTimeoutMs: z.ZodOptional<z.ZodNumber>;
        maxOutputBytes: z.ZodOptional<z.ZodNumber>;
        commands: z.ZodOptional<z.ZodArray<z.ZodObject<{
            extensions: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    format: z.ZodLiteral<"biny-project-settings">;
    configVersion: z.ZodLiteral<2>;
}, z.core.$strict>;
export type ProjectSettingsDocument = z.infer<typeof projectSettingsDocumentSchema>;
export declare function loadProjectSettings(workspaceRoot: string): Promise<ProjectSettings>;
/** 保存稀疏的项目覆盖；format/configVersion 由这里统一维护，不参与全局配置 merge。 */
export declare function saveProjectSettings(workspaceRoot: string, settings: ProjectSettings): Promise<ProjectSettings>;
export declare function updateProjectSettings(workspaceRoot: string, update: (current: ProjectSettings) => ProjectSettings | Promise<ProjectSettings>): Promise<ProjectSettings>;
