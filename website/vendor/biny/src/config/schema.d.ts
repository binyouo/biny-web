/**
 * Runtime configuration schema.
 *
 * Providers own credentials and endpoints, while model aliases own model IDs and
 * capabilities. Only the canonical multi-model format is accepted.
 */
import { z } from "zod";
export { acpConfigSchema, type AcpConfig } from "../acp/config.js";
import { type ActivityDataResidency, type ActivitySettings } from "../activity/settings.js";
import { type MemoryPolicy } from "../personalization/index.js";
/**
 * 自动压缩策略。reserve/keep 缺省时按当前模型可用输入预算动态缩放；显式配置时作为额外上限。
 * 触发阈值优先级：显式 reserveTokens > triggerPercent > 模型参考线/动态推导。
 */
export declare const compactionSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    reserveTokens: z.ZodOptional<z.ZodNumber>;
    /** 触发阈值 = 当前输入预算 × 该百分比；与显式 reserveTokens 同时配置时以后者为准。 */
    triggerPercent: z.ZodOptional<z.ZodNumber>;
    /** 与 keepRecentTokens 共同构成保留段双上限，取更保守（保留更少）的安全切分点。 */
    keepRecentTokens: z.ZodOptional<z.ZodNumber>;
    keepRecentMessages: z.ZodOptional<z.ZodNumber>;
    maxSummaryTokens: z.ZodDefault<z.ZodNumber>;
    /** 压缩摘要专用模型别名；缺省跟随当前对话模型。 */
    summaryModel: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    maxSummaryTokens: number;
    reserveTokens?: number | undefined;
    triggerPercent?: number | undefined;
    keepRecentTokens?: number | undefined;
    keepRecentMessages?: number | undefined;
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
/** 回合后自动技能提取（自进化）：analyst→author 两步辅助模型，写入受管全局技能根。 */
export declare const skillExtractionSchema: z.ZodDefault<z.ZodObject<{
    /** 总开关；关闭后成功回合不再触发旁路分析。 */
    enabled: z.ZodDefault<z.ZodBoolean>;
    /** 本回合工具调用数达到阈值才分析，避免普通问答也跑辅助模型。 */
    minToolCalls: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    minToolCalls: number;
}, {
    enabled?: boolean | undefined;
    minToolCalls?: number | undefined;
}>>;
export type SkillExtractionConfig = z.infer<typeof skillExtractionSchema>;
/**
 * 聊天采样参数（全局）。temperature 缺省不下发请求体（跟随模型/provider 默认）；
 * maxOutputTokens 缺省跟随模型别名配置，显式配置后全局覆盖。
 */
export declare const chatResponseSettingsSchema: z.ZodObject<{
    streaming: z.ZodOptional<z.ZodBoolean>;
    showTokenUsage: z.ZodOptional<z.ZodBoolean>;
    markdown: z.ZodOptional<z.ZodBoolean>;
    singleDollarMath: z.ZodOptional<z.ZodBoolean>;
    collapseThinking: z.ZodOptional<z.ZodBoolean>;
    openLinksInBrowser: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    streaming?: boolean | undefined;
    showTokenUsage?: boolean | undefined;
    markdown?: boolean | undefined;
    singleDollarMath?: boolean | undefined;
    collapseThinking?: boolean | undefined;
    openLinksInBrowser?: boolean | undefined;
}, {
    streaming?: boolean | undefined;
    showTokenUsage?: boolean | undefined;
    markdown?: boolean | undefined;
    singleDollarMath?: boolean | undefined;
    collapseThinking?: boolean | undefined;
    openLinksInBrowser?: boolean | undefined;
}>;
export type ChatResponseSettings = z.infer<typeof chatResponseSettingsSchema>;
export declare const chatParamsSchema: z.ZodDefault<z.ZodObject<{
    /** Desktop 展示偏好；不改变 Provider 流式协议或已落盘的消息内容。 */
    response: z.ZodOptional<z.ZodObject<{
        streaming: z.ZodOptional<z.ZodBoolean>;
        showTokenUsage: z.ZodOptional<z.ZodBoolean>;
        markdown: z.ZodOptional<z.ZodBoolean>;
        singleDollarMath: z.ZodOptional<z.ZodBoolean>;
        collapseThinking: z.ZodOptional<z.ZodBoolean>;
        openLinksInBrowser: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        streaming?: boolean | undefined;
        showTokenUsage?: boolean | undefined;
        markdown?: boolean | undefined;
        singleDollarMath?: boolean | undefined;
        collapseThinking?: boolean | undefined;
        openLinksInBrowser?: boolean | undefined;
    }, {
        streaming?: boolean | undefined;
        showTokenUsage?: boolean | undefined;
        markdown?: boolean | undefined;
        singleDollarMath?: boolean | undefined;
        collapseThinking?: boolean | undefined;
        openLinksInBrowser?: boolean | undefined;
    }>>;
    /** 实验开关：覆盖协议自动选择，让 Read/Edit 使用行哈希。 */
    hashlineEdit: z.ZodOptional<z.ZodBoolean>;
    /** Prompt 缓存标记：按协议给 system 和请求尾部打断言点以命中服务商缓存；严格网关不认时可关闭。 */
    cacheMarkers: z.ZodDefault<z.ZodBoolean>;
    /** 采样温度 0–2；越低越确定，越高越发散。 */
    temperature: z.ZodOptional<z.ZodNumber>;
    /** 单次回复的最大输出 token 数。 */
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    /** 默认把哪些工具暴露给模型；单条消息可在 Composer 中覆盖。 */
    defaultToolSelection: z.ZodDefault<z.ZodEnum<["auto", "all", "none"]>>;
    /** 默认把哪些 Skill 元数据暴露给模型；单条消息可在 Composer 中覆盖。 */
    defaultSkillSelection: z.ZodDefault<z.ZodEnum<["auto", "all", "none"]>>;
    skillExtraction: z.ZodDefault<z.ZodObject<{
        /** 总开关；关闭后成功回合不再触发旁路分析。 */
        enabled: z.ZodDefault<z.ZodBoolean>;
        /** 本回合工具调用数达到阈值才分析，避免普通问答也跑辅助模型。 */
        minToolCalls: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        minToolCalls: number;
    }, {
        enabled?: boolean | undefined;
        minToolCalls?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    cacheMarkers: boolean;
    defaultToolSelection: "none" | "auto" | "all";
    defaultSkillSelection: "none" | "auto" | "all";
    skillExtraction: {
        enabled: boolean;
        minToolCalls: number;
    };
    response?: {
        streaming?: boolean | undefined;
        showTokenUsage?: boolean | undefined;
        markdown?: boolean | undefined;
        singleDollarMath?: boolean | undefined;
        collapseThinking?: boolean | undefined;
        openLinksInBrowser?: boolean | undefined;
    } | undefined;
    hashlineEdit?: boolean | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
}, {
    response?: {
        streaming?: boolean | undefined;
        showTokenUsage?: boolean | undefined;
        markdown?: boolean | undefined;
        singleDollarMath?: boolean | undefined;
        collapseThinking?: boolean | undefined;
        openLinksInBrowser?: boolean | undefined;
    } | undefined;
    hashlineEdit?: boolean | undefined;
    cacheMarkers?: boolean | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    defaultToolSelection?: "none" | "auto" | "all" | undefined;
    defaultSkillSelection?: "none" | "auto" | "all" | undefined;
    skillExtraction?: {
        enabled?: boolean | undefined;
        minToolCalls?: number | undefined;
    } | undefined;
}>>;
declare const identityPolicySchema: z.ZodDefault<z.ZodObject<{
    /** 用户资料区块的全局开关；核心 Soul 始终来自应用内置资源。 */
    enabled: z.ZodDefault<z.ZodBoolean>;
    /** USER.md 是否进入模型上下文；用户资料可以独立关闭。 */
    userEnabled: z.ZodDefault<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    enabled: boolean;
    userEnabled: boolean;
}, {
    enabled?: boolean | undefined;
    userEnabled?: boolean | undefined;
}>>;
export type IdentityPolicy = z.infer<typeof identityPolicySchema>;
export declare const crystalSettingsSchema: z.ZodDefault<z.ZodObject<{
    passiveEnabled: z.ZodDefault<z.ZodBoolean>;
    semanticScanEnabled: z.ZodDefault<z.ZodBoolean>;
    contour: z.ZodDefault<z.ZodObject<{
        count: z.ZodNumber;
        turns: z.ZodNumber;
        spread: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        count: number;
        turns: number;
        spread: number;
    }, {
        count: number;
        turns: number;
        spread: number;
    }>>;
    nucleus: z.ZodDefault<z.ZodObject<{
        count: z.ZodNumber;
        turns: z.ZodNumber;
        spread: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        count: number;
        turns: number;
        spread: number;
    }, {
        count: number;
        turns: number;
        spread: number;
    }>>;
    dormantDays: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    passiveEnabled: boolean;
    semanticScanEnabled: boolean;
    contour: {
        count: number;
        turns: number;
        spread: number;
    };
    nucleus: {
        count: number;
        turns: number;
        spread: number;
    };
    dormantDays: number;
}, {
    passiveEnabled?: boolean | undefined;
    semanticScanEnabled?: boolean | undefined;
    contour?: {
        count: number;
        turns: number;
        spread: number;
    } | undefined;
    nucleus?: {
        count: number;
        turns: number;
        spread: number;
    } | undefined;
    dormantDays?: number | undefined;
}>>;
export type CrystalSettings = z.infer<typeof crystalSettingsSchema>;
/**
 * 心跳(Heartbeat)后台巡检的开关与节奏。默认关闭,由用户显式开启;默认节奏与
 * 默认(30 分钟间隔、8–23 点活动时段)。未知键直接剥离,旧配置里的遗留
 * heartbeat 对象可以安全落入新结构。
 */
export declare const heartbeatConfigSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    intervalMinutes: z.ZodDefault<z.ZodNumber>;
    activeHoursStart: z.ZodDefault<z.ZodNumber>;
    activeHoursEnd: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    intervalMinutes: number;
    activeHoursStart: number;
    activeHoursEnd: number;
}, {
    enabled?: boolean | undefined;
    intervalMinutes?: number | undefined;
    activeHoursStart?: number | undefined;
    activeHoursEnd?: number | undefined;
}>>;
/** Provider 与 API ID 是扩展点，内置值只提供默认实现，不限制插件注册的新类型。 */
export declare const modelProviderSchema: z.ZodString;
export declare const providerProtocolSchema: z.ZodEnum<["anthropic", "openai-compatible"]>;
export declare const reasoningEffortSchema: z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>;
export declare const thinkingLevelSchema: z.ZodEnum<["off", "minimal", "low", "medium", "high", "xhigh", "max"]>;
export declare const modelApiBackendSchema: z.ZodString;
export declare const modelCompatibilitySchema: z.ZodObject<{
    supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
    supportsReasoning: z.ZodOptional<z.ZodBoolean>;
    supportsVision: z.ZodOptional<z.ZodBoolean>;
    maxTokensField: z.ZodOptional<z.ZodEnum<["max_tokens", "max_completion_tokens"]>>;
}, "strip", z.ZodTypeAny, {
    supportsDeveloperRole?: boolean | undefined;
    supportsReasoning?: boolean | undefined;
    supportsVision?: boolean | undefined;
    maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
}, {
    supportsDeveloperRole?: boolean | undefined;
    supportsReasoning?: boolean | undefined;
    supportsVision?: boolean | undefined;
    maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
}>;
export declare const thinkingLevelMapSchema: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>, Record<string, string | null>, Record<string, string | null>>;
export declare const modelProfileSchema: z.ZodObject<{
    /** 只保存用户主动修改的能力；未填写时跟随当前目录。 */
    capabilities: z.ZodOptional<z.ZodObject<{
        tools: z.ZodOptional<z.ZodBoolean>;
        parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
        reasoning: z.ZodOptional<z.ZodBoolean>;
        reasoningStream: z.ZodOptional<z.ZodBoolean>;
        reasoningSummary: z.ZodOptional<z.ZodBoolean>;
        vision: z.ZodOptional<z.ZodBoolean>;
        audio: z.ZodOptional<z.ZodBoolean>;
        streaming: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        audio?: boolean | undefined;
        reasoning?: boolean | undefined;
        tools?: boolean | undefined;
        streaming?: boolean | undefined;
        parallelToolCalls?: boolean | undefined;
        reasoningStream?: boolean | undefined;
        reasoningSummary?: boolean | undefined;
        vision?: boolean | undefined;
    }, {
        audio?: boolean | undefined;
        reasoning?: boolean | undefined;
        tools?: boolean | undefined;
        streaming?: boolean | undefined;
        parallelToolCalls?: boolean | undefined;
        reasoningStream?: boolean | undefined;
        reasoningSummary?: boolean | undefined;
        vision?: boolean | undefined;
    }>>;
    /** 仅控制模型选择器可见性，停用时保留配置和已有会话引用。 */
    showInPicker: z.ZodOptional<z.ZodBoolean>;
    contextWindow: z.ZodOptional<z.ZodNumber>;
    maxInputTokens: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    thinkingLevelMap: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>, Record<string, string | null>, Record<string, string | null>>>;
}, "strict", z.ZodTypeAny, {
    maxOutputTokens?: number | undefined;
    maxInputTokens?: number | undefined;
    capabilities?: {
        audio?: boolean | undefined;
        reasoning?: boolean | undefined;
        tools?: boolean | undefined;
        streaming?: boolean | undefined;
        parallelToolCalls?: boolean | undefined;
        reasoningStream?: boolean | undefined;
        reasoningSummary?: boolean | undefined;
        vision?: boolean | undefined;
    } | undefined;
    showInPicker?: boolean | undefined;
    contextWindow?: number | undefined;
    thinkingLevelMap?: Record<string, string | null> | undefined;
}, {
    maxOutputTokens?: number | undefined;
    maxInputTokens?: number | undefined;
    capabilities?: {
        audio?: boolean | undefined;
        reasoning?: boolean | undefined;
        tools?: boolean | undefined;
        streaming?: boolean | undefined;
        parallelToolCalls?: boolean | undefined;
        reasoningStream?: boolean | undefined;
        reasoningSummary?: boolean | undefined;
        vision?: boolean | undefined;
    } | undefined;
    showInPicker?: boolean | undefined;
    contextWindow?: number | undefined;
    thinkingLevelMap?: Record<string, string | null> | undefined;
}>;
declare const thinkingSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    effort: z.ZodDefault<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    effort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
}, {
    enabled?: boolean | undefined;
    effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
}>>;
export declare const providerEmbeddingModelSchema: z.ZodObject<{
    id: z.ZodString;
    displayName: z.ZodString;
    dimensions: z.ZodOptional<z.ZodNumber>;
    /** 语义召回的最低相似度；未配置时使用运行时推荐值。 */
    recommendedThreshold: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    id: string;
    displayName: string;
    dimensions?: number | undefined;
    recommendedThreshold?: number | undefined;
}, {
    id: string;
    displayName: string;
    dimensions?: number | undefined;
    recommendedThreshold?: number | undefined;
}>;
declare const providerConfigSchema: z.ZodEffects<z.ZodObject<{
    type: z.ZodString;
    acp: z.ZodOptional<z.ZodObject<{
        command: z.ZodString;
        args: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        env: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
        promptTimeoutMs: z.ZodDefault<z.ZodNumber>;
        maxOutputBytes: z.ZodDefault<z.ZodNumber>;
        allowMemory: z.ZodDefault<z.ZodBoolean>;
        authMethodId: z.ZodOptional<z.ZodString>;
        modeId: z.ZodOptional<z.ZodString>;
        mcpServers: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        command: string;
        args: string[];
        env: Record<string, string>;
        promptTimeoutMs: number;
        maxOutputBytes: number;
        allowMemory: boolean;
        mcpServers: string[];
        authMethodId?: string | undefined;
        modeId?: string | undefined;
    }, {
        command: string;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
        promptTimeoutMs?: number | undefined;
        maxOutputBytes?: number | undefined;
        allowMemory?: boolean | undefined;
        authMethodId?: string | undefined;
        modeId?: string | undefined;
        mcpServers?: string[] | undefined;
    }>>;
    /** 缺省启用；停用保留连接、凭据和模型选择。 */
    enabled: z.ZodOptional<z.ZodBoolean>;
    /** 用户自定义服务商的显示名；内置目录服务商不使用，列表标签优先于端点主机名。 */
    displayName: z.ZodOptional<z.ZodString>;
    /**
     * 用户为该服务商挑的品牌图标 id（`assets/provider-icon-data` 的键）。
     * 缺省表示没有覆盖，渲染层按目录默认图标回退。
     */
    icon: z.ZodOptional<z.ZodString>;
    protocol: z.ZodOptional<z.ZodEnum<["anthropic", "openai-compatible"]>>;
    baseUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
    apiKeyEnv: z.ZodOptional<z.ZodString>;
    requiresApiKey: z.ZodOptional<z.ZodBoolean>;
    /** 模型目录的鉴权要求独立于聊天请求；未设置时沿用 requiresApiKey。 */
    modelsRequiresApiKey: z.ZodOptional<z.ZodBoolean>;
    authMode: z.ZodOptional<z.ZodEnum<["api-key", "oauth-bearer"]>>;
    oauth: z.ZodOptional<z.ZodObject<{
        provider: z.ZodString;
        refreshToken: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodNumber;
        accountId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        provider: string;
        expiresAt: number;
        refreshToken?: string | undefined;
        accountId?: string | undefined;
    }, {
        provider: string;
        expiresAt: number;
        refreshToken?: string | undefined;
        accountId?: string | undefined;
    }>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    retry: z.ZodOptional<z.ZodObject<{
        maxAttempts: z.ZodDefault<z.ZodNumber>;
        initialDelayMs: z.ZodDefault<z.ZodNumber>;
        maxDelayMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxAttempts: number;
        initialDelayMs: number;
        maxDelayMs: number;
    }, {
        maxAttempts?: number | undefined;
        initialDelayMs?: number | undefined;
        maxDelayMs?: number | undefined;
    }>>;
    modelsEndpoint: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    apiBackend: z.ZodOptional<z.ZodString>;
    compatibility: z.ZodOptional<z.ZodObject<{
        supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
        supportsReasoning: z.ZodOptional<z.ZodBoolean>;
        supportsVision: z.ZodOptional<z.ZodBoolean>;
        maxTokensField: z.ZodOptional<z.ZodEnum<["max_tokens", "max_completion_tokens"]>>;
    }, "strip", z.ZodTypeAny, {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    }, {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    }>>;
    /** 自定义 Responses 端点须明确声明，不根据模型名称推断协议支持。 */
    applyPatchProtocol: z.ZodOptional<z.ZodEnum<["openai-structured", "off"]>>;
    modelProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        /** 只保存用户主动修改的能力；未填写时跟随当前目录。 */
        capabilities: z.ZodOptional<z.ZodObject<{
            tools: z.ZodOptional<z.ZodBoolean>;
            parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
            reasoning: z.ZodOptional<z.ZodBoolean>;
            reasoningStream: z.ZodOptional<z.ZodBoolean>;
            reasoningSummary: z.ZodOptional<z.ZodBoolean>;
            vision: z.ZodOptional<z.ZodBoolean>;
            audio: z.ZodOptional<z.ZodBoolean>;
            streaming: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        }, {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        }>>;
        /** 仅控制模型选择器可见性，停用时保留配置和已有会话引用。 */
        showInPicker: z.ZodOptional<z.ZodBoolean>;
        contextWindow: z.ZodOptional<z.ZodNumber>;
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        thinkingLevelMap: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>, Record<string, string | null>, Record<string, string | null>>>;
    }, "strict", z.ZodTypeAny, {
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        showInPicker?: boolean | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
    }, {
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        showInPicker?: boolean | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
    }>>>;
    /** 外部端点不得凭 URL 推断本地性；未来本地服务必须显式声明。 */
    dataResidency: z.ZodOptional<z.ZodEnum<["local", "external"]>>;
    /** 仅显式声明的 provider embedding 型号会进入目录；不会从聊天模型或 ID 猜测。 */
    embeddingModels: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        displayName: z.ZodString;
        dimensions: z.ZodOptional<z.ZodNumber>;
        /** 语义召回的最低相似度；未配置时使用运行时推荐值。 */
        recommendedThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        displayName: string;
        dimensions?: number | undefined;
        recommendedThreshold?: number | undefined;
    }, {
        id: string;
        displayName: string;
        dimensions?: number | undefined;
        recommendedThreshold?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: string;
    displayName?: string | undefined;
    retry?: {
        maxAttempts: number;
        initialDelayMs: number;
        maxDelayMs: number;
    } | undefined;
    apiKeyEnv?: string | undefined;
    enabled?: boolean | undefined;
    apiKey?: string | undefined;
    acp?: {
        command: string;
        args: string[];
        env: Record<string, string>;
        promptTimeoutMs: number;
        maxOutputBytes: number;
        allowMemory: boolean;
        mcpServers: string[];
        authMethodId?: string | undefined;
        modeId?: string | undefined;
    } | undefined;
    icon?: string | undefined;
    protocol?: "anthropic" | "openai-compatible" | undefined;
    baseUrl?: string | undefined;
    requiresApiKey?: boolean | undefined;
    modelsRequiresApiKey?: boolean | undefined;
    authMode?: "api-key" | "oauth-bearer" | undefined;
    oauth?: {
        provider: string;
        expiresAt: number;
        refreshToken?: string | undefined;
        accountId?: string | undefined;
    } | undefined;
    timeoutMs?: number | undefined;
    modelsEndpoint?: string | undefined;
    headers?: Record<string, string> | undefined;
    apiBackend?: string | undefined;
    compatibility?: {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    } | undefined;
    applyPatchProtocol?: "off" | "openai-structured" | undefined;
    modelProfiles?: Record<string, {
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        showInPicker?: boolean | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
    }> | undefined;
    dataResidency?: "external" | "local" | undefined;
    embeddingModels?: {
        id: string;
        displayName: string;
        dimensions?: number | undefined;
        recommendedThreshold?: number | undefined;
    }[] | undefined;
}, {
    type: string;
    displayName?: string | undefined;
    retry?: {
        maxAttempts?: number | undefined;
        initialDelayMs?: number | undefined;
        maxDelayMs?: number | undefined;
    } | undefined;
    apiKeyEnv?: string | undefined;
    enabled?: boolean | undefined;
    apiKey?: string | undefined;
    acp?: {
        command: string;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
        promptTimeoutMs?: number | undefined;
        maxOutputBytes?: number | undefined;
        allowMemory?: boolean | undefined;
        authMethodId?: string | undefined;
        modeId?: string | undefined;
        mcpServers?: string[] | undefined;
    } | undefined;
    icon?: string | undefined;
    protocol?: "anthropic" | "openai-compatible" | undefined;
    baseUrl?: string | undefined;
    requiresApiKey?: boolean | undefined;
    modelsRequiresApiKey?: boolean | undefined;
    authMode?: "api-key" | "oauth-bearer" | undefined;
    oauth?: {
        provider: string;
        expiresAt: number;
        refreshToken?: string | undefined;
        accountId?: string | undefined;
    } | undefined;
    timeoutMs?: number | undefined;
    modelsEndpoint?: string | undefined;
    headers?: Record<string, string> | undefined;
    apiBackend?: string | undefined;
    compatibility?: {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    } | undefined;
    applyPatchProtocol?: "off" | "openai-structured" | undefined;
    modelProfiles?: Record<string, {
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        showInPicker?: boolean | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
    }> | undefined;
    dataResidency?: "external" | "local" | undefined;
    embeddingModels?: {
        id: string;
        displayName: string;
        dimensions?: number | undefined;
        recommendedThreshold?: number | undefined;
    }[] | undefined;
}>, {
    type: string;
    displayName?: string | undefined;
    retry?: {
        maxAttempts: number;
        initialDelayMs: number;
        maxDelayMs: number;
    } | undefined;
    apiKeyEnv?: string | undefined;
    enabled?: boolean | undefined;
    apiKey?: string | undefined;
    acp?: {
        command: string;
        args: string[];
        env: Record<string, string>;
        promptTimeoutMs: number;
        maxOutputBytes: number;
        allowMemory: boolean;
        mcpServers: string[];
        authMethodId?: string | undefined;
        modeId?: string | undefined;
    } | undefined;
    icon?: string | undefined;
    protocol?: "anthropic" | "openai-compatible" | undefined;
    baseUrl?: string | undefined;
    requiresApiKey?: boolean | undefined;
    modelsRequiresApiKey?: boolean | undefined;
    authMode?: "api-key" | "oauth-bearer" | undefined;
    oauth?: {
        provider: string;
        expiresAt: number;
        refreshToken?: string | undefined;
        accountId?: string | undefined;
    } | undefined;
    timeoutMs?: number | undefined;
    modelsEndpoint?: string | undefined;
    headers?: Record<string, string> | undefined;
    apiBackend?: string | undefined;
    compatibility?: {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    } | undefined;
    applyPatchProtocol?: "off" | "openai-structured" | undefined;
    modelProfiles?: Record<string, {
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        showInPicker?: boolean | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
    }> | undefined;
    dataResidency?: "external" | "local" | undefined;
    embeddingModels?: {
        id: string;
        displayName: string;
        dimensions?: number | undefined;
        recommendedThreshold?: number | undefined;
    }[] | undefined;
}, {
    type: string;
    displayName?: string | undefined;
    retry?: {
        maxAttempts?: number | undefined;
        initialDelayMs?: number | undefined;
        maxDelayMs?: number | undefined;
    } | undefined;
    apiKeyEnv?: string | undefined;
    enabled?: boolean | undefined;
    apiKey?: string | undefined;
    acp?: {
        command: string;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
        promptTimeoutMs?: number | undefined;
        maxOutputBytes?: number | undefined;
        allowMemory?: boolean | undefined;
        authMethodId?: string | undefined;
        modeId?: string | undefined;
        mcpServers?: string[] | undefined;
    } | undefined;
    icon?: string | undefined;
    protocol?: "anthropic" | "openai-compatible" | undefined;
    baseUrl?: string | undefined;
    requiresApiKey?: boolean | undefined;
    modelsRequiresApiKey?: boolean | undefined;
    authMode?: "api-key" | "oauth-bearer" | undefined;
    oauth?: {
        provider: string;
        expiresAt: number;
        refreshToken?: string | undefined;
        accountId?: string | undefined;
    } | undefined;
    timeoutMs?: number | undefined;
    modelsEndpoint?: string | undefined;
    headers?: Record<string, string> | undefined;
    apiBackend?: string | undefined;
    compatibility?: {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    } | undefined;
    applyPatchProtocol?: "off" | "openai-structured" | undefined;
    modelProfiles?: Record<string, {
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        showInPicker?: boolean | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
    }> | undefined;
    dataResidency?: "external" | "local" | undefined;
    embeddingModels?: {
        id: string;
        displayName: string;
        dimensions?: number | undefined;
        recommendedThreshold?: number | undefined;
    }[] | undefined;
}>;
declare const modelPricingSchema: z.ZodObject<{
    inputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
    outputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
    cacheReadPerMillionTokens: z.ZodOptional<z.ZodNumber>;
    cacheWritePerMillionTokens: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    inputPerMillionTokens?: number | undefined;
    outputPerMillionTokens?: number | undefined;
    cacheReadPerMillionTokens?: number | undefined;
    cacheWritePerMillionTokens?: number | undefined;
}, {
    inputPerMillionTokens?: number | undefined;
    outputPerMillionTokens?: number | undefined;
    cacheReadPerMillionTokens?: number | undefined;
    cacheWritePerMillionTokens?: number | undefined;
}>;
declare const mcpServerSchema: z.ZodEffects<z.ZodObject<{
    exposure: z.ZodOptional<z.ZodEnum<["direct", "codemode", "deferred", "hidden"]>>;
    toolExposure: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<["direct", "codemode", "deferred", "hidden"]>>>;
    /** 按服务端原始工具名显式启用固定契约，不依据远端 annotations 自动启用。 */
    toolContracts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodLiteral<"file-change-v1">>>;
    /** 用于凭据 account 稳定关联；旧配置没有该字段时在下一次桌面保存时补齐。 */
    id: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["stdio", "http"]>>;
    /** Remote 新配置可显式选择协议；缺省时保留 streamable HTTP -> SSE 回退。 */
    transportProtocol: z.ZodOptional<z.ZodEnum<["streamable-http", "sse"]>>;
    command: z.ZodOptional<z.ZodString>;
    args: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    /** env/header 的值保存在 Keychain；这里仅保存 account 引用。 */
    credentialRefs: z.ZodOptional<z.ZodObject<{
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        env?: Record<string, string> | undefined;
        headers?: Record<string, string> | undefined;
    }, {
        env?: Record<string, string> | undefined;
        headers?: Record<string, string> | undefined;
    }>>;
    cwd: z.ZodOptional<z.ZodString>;
    stderr: z.ZodDefault<z.ZodEnum<["ignore", "inherit", "pipe"]>>;
    url: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    oauth: z.ZodOptional<z.ZodObject<{
        clientId: z.ZodOptional<z.ZodString>;
        scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        redirectPort: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        clientId?: string | undefined;
        scopes?: string[] | undefined;
        redirectPort?: number | undefined;
    }, {
        clientId?: string | undefined;
        scopes?: string[] | undefined;
        redirectPort?: number | undefined;
    }>>;
    startupTimeoutMs: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    args: string[];
    stderr: "inherit" | "ignore" | "pipe";
    id?: string | undefined;
    type?: "stdio" | "http" | undefined;
    command?: string | undefined;
    url?: string | undefined;
    env?: Record<string, string> | undefined;
    oauth?: {
        clientId?: string | undefined;
        scopes?: string[] | undefined;
        redirectPort?: number | undefined;
    } | undefined;
    timeoutMs?: number | undefined;
    headers?: Record<string, string> | undefined;
    exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
    toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
    toolContracts?: Record<string, "file-change-v1"> | undefined;
    description?: string | undefined;
    transportProtocol?: "streamable-http" | "sse" | undefined;
    credentialRefs?: {
        env?: Record<string, string> | undefined;
        headers?: Record<string, string> | undefined;
    } | undefined;
    cwd?: string | undefined;
    startupTimeoutMs?: number | undefined;
}, {
    id?: string | undefined;
    type?: "stdio" | "http" | undefined;
    command?: string | undefined;
    url?: string | undefined;
    enabled?: boolean | undefined;
    args?: string[] | undefined;
    env?: Record<string, string> | undefined;
    oauth?: {
        clientId?: string | undefined;
        scopes?: string[] | undefined;
        redirectPort?: number | undefined;
    } | undefined;
    timeoutMs?: number | undefined;
    headers?: Record<string, string> | undefined;
    exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
    toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
    toolContracts?: Record<string, "file-change-v1"> | undefined;
    description?: string | undefined;
    transportProtocol?: "streamable-http" | "sse" | undefined;
    credentialRefs?: {
        env?: Record<string, string> | undefined;
        headers?: Record<string, string> | undefined;
    } | undefined;
    cwd?: string | undefined;
    stderr?: "inherit" | "ignore" | "pipe" | undefined;
    startupTimeoutMs?: number | undefined;
}>, {
    enabled: boolean;
    args: string[];
    stderr: "inherit" | "ignore" | "pipe";
    id?: string | undefined;
    type?: "stdio" | "http" | undefined;
    command?: string | undefined;
    url?: string | undefined;
    env?: Record<string, string> | undefined;
    oauth?: {
        clientId?: string | undefined;
        scopes?: string[] | undefined;
        redirectPort?: number | undefined;
    } | undefined;
    timeoutMs?: number | undefined;
    headers?: Record<string, string> | undefined;
    exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
    toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
    toolContracts?: Record<string, "file-change-v1"> | undefined;
    description?: string | undefined;
    transportProtocol?: "streamable-http" | "sse" | undefined;
    credentialRefs?: {
        env?: Record<string, string> | undefined;
        headers?: Record<string, string> | undefined;
    } | undefined;
    cwd?: string | undefined;
    startupTimeoutMs?: number | undefined;
}, {
    id?: string | undefined;
    type?: "stdio" | "http" | undefined;
    command?: string | undefined;
    url?: string | undefined;
    enabled?: boolean | undefined;
    args?: string[] | undefined;
    env?: Record<string, string> | undefined;
    oauth?: {
        clientId?: string | undefined;
        scopes?: string[] | undefined;
        redirectPort?: number | undefined;
    } | undefined;
    timeoutMs?: number | undefined;
    headers?: Record<string, string> | undefined;
    exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
    toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
    toolContracts?: Record<string, "file-change-v1"> | undefined;
    description?: string | undefined;
    transportProtocol?: "streamable-http" | "sse" | undefined;
    credentialRefs?: {
        env?: Record<string, string> | undefined;
        headers?: Record<string, string> | undefined;
    } | undefined;
    cwd?: string | undefined;
    stderr?: "inherit" | "ignore" | "pipe" | undefined;
    startupTimeoutMs?: number | undefined;
}>;
export declare const defaultSubagentAllowedTools: readonly ["Read", "Glob", "Grep", "Write", "Edit", "Bash"];
declare const extensionsSchema: z.ZodDefault<z.ZodObject<{
    mcp: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
        exposure: z.ZodOptional<z.ZodEnum<["direct", "codemode", "deferred", "hidden"]>>;
        toolExposure: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<["direct", "codemode", "deferred", "hidden"]>>>;
        /** 按服务端原始工具名显式启用固定契约，不依据远端 annotations 自动启用。 */
        toolContracts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodLiteral<"file-change-v1">>>;
        /** 用于凭据 account 稳定关联；旧配置没有该字段时在下一次桌面保存时补齐。 */
        id: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["stdio", "http"]>>;
        /** Remote 新配置可显式选择协议；缺省时保留 streamable HTTP -> SSE 回退。 */
        transportProtocol: z.ZodOptional<z.ZodEnum<["streamable-http", "sse"]>>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        /** env/header 的值保存在 Keychain；这里仅保存 account 引用。 */
        credentialRefs: z.ZodOptional<z.ZodObject<{
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            env?: Record<string, string> | undefined;
            headers?: Record<string, string> | undefined;
        }, {
            env?: Record<string, string> | undefined;
            headers?: Record<string, string> | undefined;
        }>>;
        cwd: z.ZodOptional<z.ZodString>;
        stderr: z.ZodDefault<z.ZodEnum<["ignore", "inherit", "pipe"]>>;
        url: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        oauth: z.ZodOptional<z.ZodObject<{
            clientId: z.ZodOptional<z.ZodString>;
            scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            redirectPort: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            clientId?: string | undefined;
            scopes?: string[] | undefined;
            redirectPort?: number | undefined;
        }, {
            clientId?: string | undefined;
            scopes?: string[] | undefined;
            redirectPort?: number | undefined;
        }>>;
        startupTimeoutMs: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        args: string[];
        stderr: "inherit" | "ignore" | "pipe";
        id?: string | undefined;
        type?: "stdio" | "http" | undefined;
        command?: string | undefined;
        url?: string | undefined;
        env?: Record<string, string> | undefined;
        oauth?: {
            clientId?: string | undefined;
            scopes?: string[] | undefined;
            redirectPort?: number | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        headers?: Record<string, string> | undefined;
        exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
        toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
        toolContracts?: Record<string, "file-change-v1"> | undefined;
        description?: string | undefined;
        transportProtocol?: "streamable-http" | "sse" | undefined;
        credentialRefs?: {
            env?: Record<string, string> | undefined;
            headers?: Record<string, string> | undefined;
        } | undefined;
        cwd?: string | undefined;
        startupTimeoutMs?: number | undefined;
    }, {
        id?: string | undefined;
        type?: "stdio" | "http" | undefined;
        command?: string | undefined;
        url?: string | undefined;
        enabled?: boolean | undefined;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
        oauth?: {
            clientId?: string | undefined;
            scopes?: string[] | undefined;
            redirectPort?: number | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        headers?: Record<string, string> | undefined;
        exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
        toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
        toolContracts?: Record<string, "file-change-v1"> | undefined;
        description?: string | undefined;
        transportProtocol?: "streamable-http" | "sse" | undefined;
        credentialRefs?: {
            env?: Record<string, string> | undefined;
            headers?: Record<string, string> | undefined;
        } | undefined;
        cwd?: string | undefined;
        stderr?: "inherit" | "ignore" | "pipe" | undefined;
        startupTimeoutMs?: number | undefined;
    }>, {
        enabled: boolean;
        args: string[];
        stderr: "inherit" | "ignore" | "pipe";
        id?: string | undefined;
        type?: "stdio" | "http" | undefined;
        command?: string | undefined;
        url?: string | undefined;
        env?: Record<string, string> | undefined;
        oauth?: {
            clientId?: string | undefined;
            scopes?: string[] | undefined;
            redirectPort?: number | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        headers?: Record<string, string> | undefined;
        exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
        toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
        toolContracts?: Record<string, "file-change-v1"> | undefined;
        description?: string | undefined;
        transportProtocol?: "streamable-http" | "sse" | undefined;
        credentialRefs?: {
            env?: Record<string, string> | undefined;
            headers?: Record<string, string> | undefined;
        } | undefined;
        cwd?: string | undefined;
        startupTimeoutMs?: number | undefined;
    }, {
        id?: string | undefined;
        type?: "stdio" | "http" | undefined;
        command?: string | undefined;
        url?: string | undefined;
        enabled?: boolean | undefined;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
        oauth?: {
            clientId?: string | undefined;
            scopes?: string[] | undefined;
            redirectPort?: number | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        headers?: Record<string, string> | undefined;
        exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
        toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
        toolContracts?: Record<string, "file-change-v1"> | undefined;
        description?: string | undefined;
        transportProtocol?: "streamable-http" | "sse" | undefined;
        credentialRefs?: {
            env?: Record<string, string> | undefined;
            headers?: Record<string, string> | undefined;
        } | undefined;
        cwd?: string | undefined;
        stderr?: "inherit" | "ignore" | "pipe" | undefined;
        startupTimeoutMs?: number | undefined;
    }>>>;
    skills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    skillDefaults: z.ZodDefault<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodBoolean>, Record<string, boolean>, Record<string, boolean>>>;
    skillProjectOverrides: z.ZodDefault<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodBoolean>, Record<string, boolean>, Record<string, boolean>>>, Record<string, Record<string, boolean>>, Record<string, Record<string, boolean>>>>;
    plugins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** 全局配置目录下的 Plugin 路径；只允许在 ~/.config/biny/plugins 内解析。 */
    globalPlugins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    subagent: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        maxSteps: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodDefault<z.ZodNumber>;
        maxConcurrentSubagents: z.ZodDefault<z.ZodNumber>;
        maxPendingSubagents: z.ZodDefault<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        inactivityTimeoutMs: z.ZodDefault<z.ZodNumber>;
        model: z.ZodOptional<z.ZodString>;
        maxCostUsd: z.ZodOptional<z.ZodNumber>;
        allowedTools: z.ZodDefault<z.ZodArray<z.ZodEnum<["Read", "Glob", "Grep", "Write", "Edit", "Bash"]>, "many">>;
        agentPaths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        maxOutputTokens: number;
        maxConcurrentSubagents: number;
        maxPendingSubagents: number;
        inactivityTimeoutMs: number;
        allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
        agentPaths: string[];
        model?: string | undefined;
        timeoutMs?: number | undefined;
        maxSteps?: number | undefined;
        maxCostUsd?: number | undefined;
    }, {
        model?: string | undefined;
        enabled?: boolean | undefined;
        maxOutputTokens?: number | undefined;
        timeoutMs?: number | undefined;
        maxSteps?: number | undefined;
        maxConcurrentSubagents?: number | undefined;
        maxPendingSubagents?: number | undefined;
        inactivityTimeoutMs?: number | undefined;
        maxCostUsd?: number | undefined;
        allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
        agentPaths?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    mcp: Record<string, {
        enabled: boolean;
        args: string[];
        stderr: "inherit" | "ignore" | "pipe";
        id?: string | undefined;
        type?: "stdio" | "http" | undefined;
        command?: string | undefined;
        url?: string | undefined;
        env?: Record<string, string> | undefined;
        oauth?: {
            clientId?: string | undefined;
            scopes?: string[] | undefined;
            redirectPort?: number | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        headers?: Record<string, string> | undefined;
        exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
        toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
        toolContracts?: Record<string, "file-change-v1"> | undefined;
        description?: string | undefined;
        transportProtocol?: "streamable-http" | "sse" | undefined;
        credentialRefs?: {
            env?: Record<string, string> | undefined;
            headers?: Record<string, string> | undefined;
        } | undefined;
        cwd?: string | undefined;
        startupTimeoutMs?: number | undefined;
    }>;
    skills: string[];
    plugins: string[];
    subagent: {
        enabled: boolean;
        maxOutputTokens: number;
        maxConcurrentSubagents: number;
        maxPendingSubagents: number;
        inactivityTimeoutMs: number;
        allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
        agentPaths: string[];
        model?: string | undefined;
        timeoutMs?: number | undefined;
        maxSteps?: number | undefined;
        maxCostUsd?: number | undefined;
    };
    skillDefaults: Record<string, boolean>;
    skillProjectOverrides: Record<string, Record<string, boolean>>;
    globalPlugins: string[];
}, {
    mcp?: Record<string, {
        id?: string | undefined;
        type?: "stdio" | "http" | undefined;
        command?: string | undefined;
        url?: string | undefined;
        enabled?: boolean | undefined;
        args?: string[] | undefined;
        env?: Record<string, string> | undefined;
        oauth?: {
            clientId?: string | undefined;
            scopes?: string[] | undefined;
            redirectPort?: number | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        headers?: Record<string, string> | undefined;
        exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
        toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
        toolContracts?: Record<string, "file-change-v1"> | undefined;
        description?: string | undefined;
        transportProtocol?: "streamable-http" | "sse" | undefined;
        credentialRefs?: {
            env?: Record<string, string> | undefined;
            headers?: Record<string, string> | undefined;
        } | undefined;
        cwd?: string | undefined;
        stderr?: "inherit" | "ignore" | "pipe" | undefined;
        startupTimeoutMs?: number | undefined;
    }> | undefined;
    skills?: string[] | undefined;
    plugins?: string[] | undefined;
    subagent?: {
        model?: string | undefined;
        enabled?: boolean | undefined;
        maxOutputTokens?: number | undefined;
        timeoutMs?: number | undefined;
        maxSteps?: number | undefined;
        maxConcurrentSubagents?: number | undefined;
        maxPendingSubagents?: number | undefined;
        inactivityTimeoutMs?: number | undefined;
        maxCostUsd?: number | undefined;
        allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
        agentPaths?: string[] | undefined;
    } | undefined;
    skillDefaults?: Record<string, boolean> | undefined;
    skillProjectOverrides?: Record<string, Record<string, boolean>> | undefined;
    globalPlugins?: string[] | undefined;
}>>;
declare const webSearchSchema: z.ZodDefault<z.ZodObject<{
    provider: z.ZodDefault<z.ZodEnum<["google", "xiaohongshu"]>>;
    visibleBrowsing: z.ZodDefault<z.ZodBoolean>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    maxResults: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    provider: "google" | "xiaohongshu";
    timeoutMs: number;
    visibleBrowsing: boolean;
    maxResults: number;
}, {
    provider?: "google" | "xiaohongshu" | undefined;
    timeoutMs?: number | undefined;
    visibleBrowsing?: boolean | undefined;
    maxResults?: number | undefined;
}>>;
/**
 * 共享 cookie jar：桌面端内嵌浏览器登录后写入，`WebSearch` 的 Google provider 和
 * `WebFetch` 读取，用来访问需要登录态的页面。
 *
 * 打开它意味着模型选定的 URL 会带上真实登录凭据（只发给域名匹配的站点）。`WebFetch`
 * 默认不在免确认工具白名单里，每次抓取仍要用户确认，这是这项能力的主要约束。
 */
declare const webCookiesSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    /** jar 文件位置；留空用桌面端 userData 下的共享路径，桌面端与 CLI 因此读到同一份。 */
    path: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    path?: string | undefined;
}, {
    path?: string | undefined;
    enabled?: boolean | undefined;
}>>;
declare const webFetchSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    maxBytes: z.ZodDefault<z.ZodNumber>;
    maxRedirects: z.ZodDefault<z.ZodNumber>;
    allowPrivateNetwork: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    timeoutMs: number;
    maxBytes: number;
    maxRedirects: number;
    allowPrivateNetwork: boolean;
}, {
    enabled?: boolean | undefined;
    timeoutMs?: number | undefined;
    maxBytes?: number | undefined;
    maxRedirects?: number | undefined;
    allowPrivateNetwork?: boolean | undefined;
}>>;
declare const hookSchema: z.ZodObject<{
    command: z.ZodString;
    /** 只对这些工具触发；留空表示全部。 */
    tools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** 只对这些扩展名的目标路径触发；留空表示不按扩展名过滤。 */
    extensions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    command: string;
    tools: string[];
    extensions: string[];
    timeoutMs: number;
}, {
    command: string;
    tools?: string[] | undefined;
    extensions?: string[] | undefined;
    timeoutMs?: number | undefined;
}>;
declare const hooksSchema: z.ZodDefault<z.ZodObject<{
    /** 工具执行前触发；非零退出会阻止这次调用。 */
    beforeTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
        command: z.ZodString;
        /** 只对这些工具触发；留空表示全部。 */
        tools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** 只对这些扩展名的目标路径触发；留空表示不按扩展名过滤。 */
        extensions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        command: string;
        tools: string[];
        extensions: string[];
        timeoutMs: number;
    }, {
        command: string;
        tools?: string[] | undefined;
        extensions?: string[] | undefined;
        timeoutMs?: number | undefined;
    }>, "many">>;
    /** 工具执行后触发；输出附在结果上，退出码不影响调用结果。 */
    afterTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
        command: z.ZodString;
        /** 只对这些工具触发；留空表示全部。 */
        tools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** 只对这些扩展名的目标路径触发；留空表示不按扩展名过滤。 */
        extensions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        command: string;
        tools: string[];
        extensions: string[];
        timeoutMs: number;
    }, {
        command: string;
        tools?: string[] | undefined;
        extensions?: string[] | undefined;
        timeoutMs?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    beforeTool: {
        command: string;
        tools: string[];
        extensions: string[];
        timeoutMs: number;
    }[];
    afterTool: {
        command: string;
        tools: string[];
        extensions: string[];
        timeoutMs: number;
    }[];
}, {
    beforeTool?: {
        command: string;
        tools?: string[] | undefined;
        extensions?: string[] | undefined;
        timeoutMs?: number | undefined;
    }[] | undefined;
    afterTool?: {
        command: string;
        tools?: string[] | undefined;
        extensions?: string[] | undefined;
        timeoutMs?: number | undefined;
    }[] | undefined;
}>>;
declare const sandboxSchema: z.ZodDefault<z.ZodObject<{
    /**
     * `workspace-write`：命令仍以当前用户权限运行，但内核层面只允许写工作区、临时目录和常见
     * 缓存目录。这是独立于命令字符串判定的第二道边界。目前只有 macOS 有实现。
     * `off` 仅关闭写入范围限制；permission.denyPaths 和禁网配置仍需系统沙箱强制执行。
     */
    mode: z.ZodDefault<z.ZodEnum<["off", "workspace-write"]>>;
    allowNetwork: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    mode: "off" | "workspace-write";
    allowNetwork: boolean;
}, {
    mode?: "off" | "workspace-write" | undefined;
    allowNetwork?: boolean | undefined;
}>>;
declare const checkpointsSchema: z.ZodDefault<z.ZodObject<{
    /** 每个回合首次改动工作区前自动建一个快照，供 /undo 回退。仅在 git 仓库内生效。 */
    enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
}, {
    enabled?: boolean | undefined;
}>>;
declare const diagnosticsSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    /** 自动识别项目本地已安装的检查工具（目前是 TypeScript）；只用本地二进制，不联网安装。 */
    autoDetect: z.ZodDefault<z.ZodBoolean>;
    autoDetectTimeoutMs: z.ZodDefault<z.ZodNumber>;
    maxOutputBytes: z.ZodDefault<z.ZodNumber>;
    commands: z.ZodDefault<z.ZodArray<z.ZodObject<{
        extensions: z.ZodArray<z.ZodString, "many">;
        command: z.ZodString;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        command: string;
        extensions: string[];
        timeoutMs: number;
    }, {
        command: string;
        extensions: string[];
        timeoutMs?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    maxOutputBytes: number;
    autoDetect: boolean;
    autoDetectTimeoutMs: number;
    commands: {
        command: string;
        extensions: string[];
        timeoutMs: number;
    }[];
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
declare const webSchema: z.ZodDefault<z.ZodObject<{
    search: z.ZodDefault<z.ZodObject<{
        provider: z.ZodDefault<z.ZodEnum<["google", "xiaohongshu"]>>;
        visibleBrowsing: z.ZodDefault<z.ZodBoolean>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
        maxResults: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        provider: "google" | "xiaohongshu";
        timeoutMs: number;
        visibleBrowsing: boolean;
        maxResults: number;
    }, {
        provider?: "google" | "xiaohongshu" | undefined;
        timeoutMs?: number | undefined;
        visibleBrowsing?: boolean | undefined;
        maxResults?: number | undefined;
    }>>;
    fetch: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
        maxBytes: z.ZodDefault<z.ZodNumber>;
        maxRedirects: z.ZodDefault<z.ZodNumber>;
        allowPrivateNetwork: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        timeoutMs: number;
        maxBytes: number;
        maxRedirects: number;
        allowPrivateNetwork: boolean;
    }, {
        enabled?: boolean | undefined;
        timeoutMs?: number | undefined;
        maxBytes?: number | undefined;
        maxRedirects?: number | undefined;
        allowPrivateNetwork?: boolean | undefined;
    }>>;
    cookies: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        /** jar 文件位置；留空用桌面端 userData 下的共享路径，桌面端与 CLI 因此读到同一份。 */
        path: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        path?: string | undefined;
    }, {
        path?: string | undefined;
        enabled?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    search: {
        provider: "google" | "xiaohongshu";
        timeoutMs: number;
        visibleBrowsing: boolean;
        maxResults: number;
    };
    fetch: {
        enabled: boolean;
        timeoutMs: number;
        maxBytes: number;
        maxRedirects: number;
        allowPrivateNetwork: boolean;
    };
    cookies: {
        enabled: boolean;
        path?: string | undefined;
    };
}, {
    search?: {
        provider?: "google" | "xiaohongshu" | undefined;
        timeoutMs?: number | undefined;
        visibleBrowsing?: boolean | undefined;
        maxResults?: number | undefined;
    } | undefined;
    fetch?: {
        enabled?: boolean | undefined;
        timeoutMs?: number | undefined;
        maxBytes?: number | undefined;
        maxRedirects?: number | undefined;
        allowPrivateNetwork?: boolean | undefined;
    } | undefined;
    cookies?: {
        path?: string | undefined;
        enabled?: boolean | undefined;
    } | undefined;
}>>;
declare const modelThinkingSchema: z.ZodEffects<z.ZodObject<{
    efforts: z.ZodDefault<z.ZodArray<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, "many">>;
    defaultEffort: z.ZodDefault<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>>;
    mapping: z.ZodOptional<z.ZodRecord<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, z.ZodString>>;
    budgetTokens: z.ZodOptional<z.ZodRecord<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
    defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
    mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
    budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
}, {
    efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
    defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
    budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
}>, {
    efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
    defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
    mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
    budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
}, {
    efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
    defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
    budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
}>;
export declare const modelLimitsSchema: z.ZodObject<{
    maxInputTokens: z.ZodOptional<z.ZodNumber>;
    reasoningReserveTokens: z.ZodOptional<z.ZodNumber>;
    toolSchemaReserveTokens: z.ZodOptional<z.ZodNumber>;
    systemPromptReserveTokens: z.ZodOptional<z.ZodNumber>;
    protocolSafetyMarginTokens: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    maxInputTokens?: number | undefined;
    reasoningReserveTokens?: number | undefined;
    toolSchemaReserveTokens?: number | undefined;
    systemPromptReserveTokens?: number | undefined;
    protocolSafetyMarginTokens?: number | undefined;
}, {
    maxInputTokens?: number | undefined;
    reasoningReserveTokens?: number | undefined;
    toolSchemaReserveTokens?: number | undefined;
    systemPromptReserveTokens?: number | undefined;
    protocolSafetyMarginTokens?: number | undefined;
}>;
declare const modelAliasSchema: z.ZodObject<{
    provider: z.ZodString;
    model: z.ZodString;
    /** 仅作为未来隐私白名单的显式声明，当前 v1 不会因此放行 Activity。 */
    dataResidency: z.ZodOptional<z.ZodEnum<["local", "external"]>>;
    displayName: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    supportsTools: z.ZodOptional<z.ZodBoolean>;
    capabilities: z.ZodOptional<z.ZodObject<{
        tools: z.ZodOptional<z.ZodBoolean>;
        parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
        reasoning: z.ZodOptional<z.ZodBoolean>;
        reasoningStream: z.ZodOptional<z.ZodBoolean>;
        reasoningSummary: z.ZodOptional<z.ZodBoolean>;
        vision: z.ZodOptional<z.ZodBoolean>;
        audio: z.ZodOptional<z.ZodBoolean>;
        streaming: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        audio?: boolean | undefined;
        reasoning?: boolean | undefined;
        tools?: boolean | undefined;
        streaming?: boolean | undefined;
        parallelToolCalls?: boolean | undefined;
        reasoningStream?: boolean | undefined;
        reasoningSummary?: boolean | undefined;
        vision?: boolean | undefined;
    }, {
        audio?: boolean | undefined;
        reasoning?: boolean | undefined;
        tools?: boolean | undefined;
        streaming?: boolean | undefined;
        parallelToolCalls?: boolean | undefined;
        reasoningStream?: boolean | undefined;
        reasoningSummary?: boolean | undefined;
        vision?: boolean | undefined;
    }>>;
    contextWindow: z.ZodOptional<z.ZodNumber>;
    maxInputTokens: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    limits: z.ZodOptional<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        reasoningReserveTokens: z.ZodOptional<z.ZodNumber>;
        toolSchemaReserveTokens: z.ZodOptional<z.ZodNumber>;
        systemPromptReserveTokens: z.ZodOptional<z.ZodNumber>;
        protocolSafetyMarginTokens: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        maxInputTokens?: number | undefined;
        reasoningReserveTokens?: number | undefined;
        toolSchemaReserveTokens?: number | undefined;
        systemPromptReserveTokens?: number | undefined;
        protocolSafetyMarginTokens?: number | undefined;
    }, {
        maxInputTokens?: number | undefined;
        reasoningReserveTokens?: number | undefined;
        toolSchemaReserveTokens?: number | undefined;
        systemPromptReserveTokens?: number | undefined;
        protocolSafetyMarginTokens?: number | undefined;
    }>>;
    /** Model-level API and compatibility override the provider defaults. */
    apiBackend: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    compatibility: z.ZodOptional<z.ZodObject<{
        supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
        supportsReasoning: z.ZodOptional<z.ZodBoolean>;
        supportsVision: z.ZodOptional<z.ZodBoolean>;
        maxTokensField: z.ZodOptional<z.ZodEnum<["max_tokens", "max_completion_tokens"]>>;
    }, "strip", z.ZodTypeAny, {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    }, {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    }>>;
    /** Canonical capability map. Missing/null levels are unsupported. */
    thinkingLevelMap: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>, Record<string, string | null>, Record<string, string | null>>>;
    reasoning: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        efforts: z.ZodDefault<z.ZodArray<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, "many">>;
        defaultEffort: z.ZodDefault<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>>;
        mapping: z.ZodOptional<z.ZodRecord<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, z.ZodString>>;
        budgetTokens: z.ZodOptional<z.ZodRecord<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
        defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
        mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
        budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
    }, {
        efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
        defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
        mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
        budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
    }>, {
        efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
        defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
        mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
        budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
    }, {
        efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
        defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
        mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
        budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
    }>>;
    pricing: z.ZodOptional<z.ZodObject<{
        inputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
        outputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
        cacheReadPerMillionTokens: z.ZodOptional<z.ZodNumber>;
        cacheWritePerMillionTokens: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        inputPerMillionTokens?: number | undefined;
        outputPerMillionTokens?: number | undefined;
        cacheReadPerMillionTokens?: number | undefined;
        cacheWritePerMillionTokens?: number | undefined;
    }, {
        inputPerMillionTokens?: number | undefined;
        outputPerMillionTokens?: number | undefined;
        cacheReadPerMillionTokens?: number | undefined;
        cacheWritePerMillionTokens?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    model: string;
    provider: string;
    reasoning?: {
        efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
        defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
        mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
        budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
    } | undefined;
    displayName?: string | undefined;
    maxOutputTokens?: number | undefined;
    maxInputTokens?: number | undefined;
    capabilities?: {
        audio?: boolean | undefined;
        reasoning?: boolean | undefined;
        tools?: boolean | undefined;
        streaming?: boolean | undefined;
        parallelToolCalls?: boolean | undefined;
        reasoningStream?: boolean | undefined;
        reasoningSummary?: boolean | undefined;
        vision?: boolean | undefined;
    } | undefined;
    contextWindow?: number | undefined;
    thinkingLevelMap?: Record<string, string | null> | undefined;
    baseUrl?: string | undefined;
    headers?: Record<string, string> | undefined;
    apiBackend?: string | undefined;
    compatibility?: {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    } | undefined;
    dataResidency?: "external" | "local" | undefined;
    description?: string | undefined;
    supportsTools?: boolean | undefined;
    limits?: {
        maxInputTokens?: number | undefined;
        reasoningReserveTokens?: number | undefined;
        toolSchemaReserveTokens?: number | undefined;
        systemPromptReserveTokens?: number | undefined;
        protocolSafetyMarginTokens?: number | undefined;
    } | undefined;
    pricing?: {
        inputPerMillionTokens?: number | undefined;
        outputPerMillionTokens?: number | undefined;
        cacheReadPerMillionTokens?: number | undefined;
        cacheWritePerMillionTokens?: number | undefined;
    } | undefined;
}, {
    model: string;
    provider: string;
    reasoning?: {
        efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
        defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
        mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
        budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
    } | undefined;
    displayName?: string | undefined;
    maxOutputTokens?: number | undefined;
    maxInputTokens?: number | undefined;
    capabilities?: {
        audio?: boolean | undefined;
        reasoning?: boolean | undefined;
        tools?: boolean | undefined;
        streaming?: boolean | undefined;
        parallelToolCalls?: boolean | undefined;
        reasoningStream?: boolean | undefined;
        reasoningSummary?: boolean | undefined;
        vision?: boolean | undefined;
    } | undefined;
    contextWindow?: number | undefined;
    thinkingLevelMap?: Record<string, string | null> | undefined;
    baseUrl?: string | undefined;
    headers?: Record<string, string> | undefined;
    apiBackend?: string | undefined;
    compatibility?: {
        supportsDeveloperRole?: boolean | undefined;
        supportsReasoning?: boolean | undefined;
        supportsVision?: boolean | undefined;
        maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
    } | undefined;
    dataResidency?: "external" | "local" | undefined;
    description?: string | undefined;
    supportsTools?: boolean | undefined;
    limits?: {
        maxInputTokens?: number | undefined;
        reasoningReserveTokens?: number | undefined;
        toolSchemaReserveTokens?: number | undefined;
        systemPromptReserveTokens?: number | undefined;
        protocolSafetyMarginTokens?: number | undefined;
    } | undefined;
    pricing?: {
        inputPerMillionTokens?: number | undefined;
        outputPerMillionTokens?: number | undefined;
        cacheReadPerMillionTokens?: number | undefined;
        cacheWritePerMillionTokens?: number | undefined;
    } | undefined;
}>;
declare const canonicalConfigSchema: z.ZodEffects<z.ZodObject<{
    format: z.ZodLiteral<"biny-config">;
    configVersion: z.ZodLiteral<2>;
    needsEmbeddingRebuild: z.ZodDefault<z.ZodBoolean>;
    defaultModel: z.ZodString;
    /** 活动分析、摘要与建议共用的工具模型；省略时从可用配置自动选择。 */
    toolModel: z.ZodOptional<z.ZodString>;
    providers: z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
        type: z.ZodString;
        acp: z.ZodOptional<z.ZodObject<{
            command: z.ZodString;
            args: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            env: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
            promptTimeoutMs: z.ZodDefault<z.ZodNumber>;
            maxOutputBytes: z.ZodDefault<z.ZodNumber>;
            allowMemory: z.ZodDefault<z.ZodBoolean>;
            authMethodId: z.ZodOptional<z.ZodString>;
            modeId: z.ZodOptional<z.ZodString>;
            mcpServers: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        }, {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        }>>;
        /** 缺省启用；停用保留连接、凭据和模型选择。 */
        enabled: z.ZodOptional<z.ZodBoolean>;
        /** 用户自定义服务商的显示名；内置目录服务商不使用，列表标签优先于端点主机名。 */
        displayName: z.ZodOptional<z.ZodString>;
        /**
         * 用户为该服务商挑的品牌图标 id（`assets/provider-icon-data` 的键）。
         * 缺省表示没有覆盖，渲染层按目录默认图标回退。
         */
        icon: z.ZodOptional<z.ZodString>;
        protocol: z.ZodOptional<z.ZodEnum<["anthropic", "openai-compatible"]>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodOptional<z.ZodString>;
        apiKeyEnv: z.ZodOptional<z.ZodString>;
        requiresApiKey: z.ZodOptional<z.ZodBoolean>;
        /** 模型目录的鉴权要求独立于聊天请求；未设置时沿用 requiresApiKey。 */
        modelsRequiresApiKey: z.ZodOptional<z.ZodBoolean>;
        authMode: z.ZodOptional<z.ZodEnum<["api-key", "oauth-bearer"]>>;
        oauth: z.ZodOptional<z.ZodObject<{
            provider: z.ZodString;
            refreshToken: z.ZodOptional<z.ZodString>;
            expiresAt: z.ZodNumber;
            accountId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        }, {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        retry: z.ZodOptional<z.ZodObject<{
            maxAttempts: z.ZodDefault<z.ZodNumber>;
            initialDelayMs: z.ZodDefault<z.ZodNumber>;
            maxDelayMs: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        }, {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        }>>;
        modelsEndpoint: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiBackend: z.ZodOptional<z.ZodString>;
        compatibility: z.ZodOptional<z.ZodObject<{
            supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
            supportsReasoning: z.ZodOptional<z.ZodBoolean>;
            supportsVision: z.ZodOptional<z.ZodBoolean>;
            maxTokensField: z.ZodOptional<z.ZodEnum<["max_tokens", "max_completion_tokens"]>>;
        }, "strip", z.ZodTypeAny, {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        }, {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        }>>;
        /** 自定义 Responses 端点须明确声明，不根据模型名称推断协议支持。 */
        applyPatchProtocol: z.ZodOptional<z.ZodEnum<["openai-structured", "off"]>>;
        modelProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            /** 只保存用户主动修改的能力；未填写时跟随当前目录。 */
            capabilities: z.ZodOptional<z.ZodObject<{
                tools: z.ZodOptional<z.ZodBoolean>;
                parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
                reasoning: z.ZodOptional<z.ZodBoolean>;
                reasoningStream: z.ZodOptional<z.ZodBoolean>;
                reasoningSummary: z.ZodOptional<z.ZodBoolean>;
                vision: z.ZodOptional<z.ZodBoolean>;
                audio: z.ZodOptional<z.ZodBoolean>;
                streaming: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            }, {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            }>>;
            /** 仅控制模型选择器可见性，停用时保留配置和已有会话引用。 */
            showInPicker: z.ZodOptional<z.ZodBoolean>;
            contextWindow: z.ZodOptional<z.ZodNumber>;
            maxInputTokens: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodOptional<z.ZodNumber>;
            thinkingLevelMap: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>, Record<string, string | null>, Record<string, string | null>>>;
        }, "strict", z.ZodTypeAny, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }>>>;
        /** 外部端点不得凭 URL 推断本地性；未来本地服务必须显式声明。 */
        dataResidency: z.ZodOptional<z.ZodEnum<["local", "external"]>>;
        /** 仅显式声明的 provider embedding 型号会进入目录；不会从聊天模型或 ID 猜测。 */
        embeddingModels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            displayName: z.ZodString;
            dimensions: z.ZodOptional<z.ZodNumber>;
            /** 语义召回的最低相似度；未配置时使用运行时推荐值。 */
            recommendedThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }, {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>>;
    /** 凭据正文保存在 Keychain；这里仅保存并发 CAS 使用的非机密版本 nonce。 */
    credentialRevisions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    models: z.ZodRecord<z.ZodString, z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        /** 仅作为未来隐私白名单的显式声明，当前 v1 不会因此放行 Activity。 */
        dataResidency: z.ZodOptional<z.ZodEnum<["local", "external"]>>;
        displayName: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        supportsTools: z.ZodOptional<z.ZodBoolean>;
        capabilities: z.ZodOptional<z.ZodObject<{
            tools: z.ZodOptional<z.ZodBoolean>;
            parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
            reasoning: z.ZodOptional<z.ZodBoolean>;
            reasoningStream: z.ZodOptional<z.ZodBoolean>;
            reasoningSummary: z.ZodOptional<z.ZodBoolean>;
            vision: z.ZodOptional<z.ZodBoolean>;
            audio: z.ZodOptional<z.ZodBoolean>;
            streaming: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        }, {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        }>>;
        contextWindow: z.ZodOptional<z.ZodNumber>;
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        limits: z.ZodOptional<z.ZodObject<{
            maxInputTokens: z.ZodOptional<z.ZodNumber>;
            reasoningReserveTokens: z.ZodOptional<z.ZodNumber>;
            toolSchemaReserveTokens: z.ZodOptional<z.ZodNumber>;
            systemPromptReserveTokens: z.ZodOptional<z.ZodNumber>;
            protocolSafetyMarginTokens: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        }, {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        }>>;
        /** Model-level API and compatibility override the provider defaults. */
        apiBackend: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        compatibility: z.ZodOptional<z.ZodObject<{
            supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
            supportsReasoning: z.ZodOptional<z.ZodBoolean>;
            supportsVision: z.ZodOptional<z.ZodBoolean>;
            maxTokensField: z.ZodOptional<z.ZodEnum<["max_tokens", "max_completion_tokens"]>>;
        }, "strip", z.ZodTypeAny, {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        }, {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        }>>;
        /** Canonical capability map. Missing/null levels are unsupported. */
        thinkingLevelMap: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>, Record<string, string | null>, Record<string, string | null>>>;
        reasoning: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            efforts: z.ZodDefault<z.ZodArray<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, "many">>;
            defaultEffort: z.ZodDefault<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>>;
            mapping: z.ZodOptional<z.ZodRecord<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, z.ZodString>>;
            budgetTokens: z.ZodOptional<z.ZodRecord<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        }, {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        }>, {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        }, {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        }>>;
        pricing: z.ZodOptional<z.ZodObject<{
            inputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            outputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            cacheReadPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            cacheWritePerMillionTokens: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        }, {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model: string;
        provider: string;
        reasoning?: {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }, {
        model: string;
        provider: string;
        reasoning?: {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>>;
    thinking: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        effort: z.ZodDefault<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        effort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
    }, {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    }>>;
    agent: z.ZodDefault<z.ZodObject<{
        /** code_mode adds an isolated script tool alongside ordinary tool calls. */
        toolExecutionMode: z.ZodDefault<z.ZodEnum<["direct", "code_mode"]>>;
        softStepLimit: z.ZodDefault<z.ZodNumber>;
        hardStepLimit: z.ZodDefault<z.ZodNumber>;
        maxToolCalls: z.ZodOptional<z.ZodNumber>;
        maxRepeatedActions: z.ZodDefault<z.ZodNumber>;
        maxConcurrentTools: z.ZodDefault<z.ZodNumber>;
        maxQueuedToolCalls: z.ZodDefault<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        toolExecutionMode: "direct" | "code_mode";
        softStepLimit: number;
        hardStepLimit: number;
        maxRepeatedActions: number;
        maxConcurrentTools: number;
        maxQueuedToolCalls: number;
        maxToolCalls?: number | undefined;
    }, {
        toolExecutionMode?: "direct" | "code_mode" | undefined;
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    }>>;
    heartbeat: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        intervalMinutes: z.ZodDefault<z.ZodNumber>;
        activeHoursStart: z.ZodDefault<z.ZodNumber>;
        activeHoursEnd: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        intervalMinutes: number;
        activeHoursStart: number;
        activeHoursEnd: number;
    }, {
        enabled?: boolean | undefined;
        intervalMinutes?: number | undefined;
        activeHoursStart?: number | undefined;
        activeHoursEnd?: number | undefined;
    }>>;
    permission: z.ZodDefault<z.ZodObject<{
        mode: z.ZodDefault<z.ZodEnum<["ask", "read-only", "auto", "full-access"]>>;
        allowTools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        allowPaths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        denyPaths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        criticalAlwaysAsk: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        mode: "auto" | "ask" | "read-only" | "full-access";
        allowTools: string[];
        allowPaths: string[];
        denyPaths: string[];
        criticalAlwaysAsk: boolean;
    }, {
        mode?: "auto" | "ask" | "read-only" | "full-access" | undefined;
        allowTools?: string[] | undefined;
        allowPaths?: string[] | undefined;
        denyPaths?: string[] | undefined;
        criticalAlwaysAsk?: boolean | undefined;
    }>>;
    workspace: z.ZodObject<{
        ignore: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        ignore: string[];
    }, {
        ignore: string[];
    }>;
    activity: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        captureDebounceMs: z.ZodDefault<z.ZodNumber>;
        heartbeatMs: z.ZodDefault<z.ZodNumber>;
        idleTimeoutMs: z.ZodDefault<z.ZodNumber>;
        inputPauseMs: z.ZodDefault<z.ZodNumber>;
        visualPollMs: z.ZodDefault<z.ZodNumber>;
        browserPollIntervalMs: z.ZodDefault<z.ZodNumber>;
        jpegQuality: z.ZodDefault<z.ZodNumber>;
        histogramChangeThreshold: z.ZodDefault<z.ZodNumber>;
        pixelDiffThreshold: z.ZodDefault<z.ZodNumber>;
        pixelTolerance: z.ZodDefault<z.ZodNumber>;
        ocrEnabled: z.ZodDefault<z.ZodBoolean>;
        inputMonitoringEnabled: z.ZodDefault<z.ZodBoolean>;
        ocrLanguages: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        ocrEveryNFrames: z.ZodDefault<z.ZodNumber>;
        sensitiveApplications: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        maxStorageMb: z.ZodDefault<z.ZodNumber>;
        outputDirectory: z.ZodDefault<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    }, {
        enabled?: boolean | undefined;
        captureDebounceMs?: number | undefined;
        heartbeatMs?: number | undefined;
        idleTimeoutMs?: number | undefined;
        inputPauseMs?: number | undefined;
        visualPollMs?: number | undefined;
        browserPollIntervalMs?: number | undefined;
        jpegQuality?: number | undefined;
        histogramChangeThreshold?: number | undefined;
        pixelDiffThreshold?: number | undefined;
        pixelTolerance?: number | undefined;
        ocrEnabled?: boolean | undefined;
        inputMonitoringEnabled?: boolean | undefined;
        ocrLanguages?: string[] | undefined;
        ocrEveryNFrames?: number | undefined;
        sensitiveApplications?: string[] | undefined;
        maxStorageMb?: number | undefined;
        outputDirectory?: string | undefined;
    }>, {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    }, unknown>, {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    }, unknown>>;
    appshots: z.ZodDefault<z.ZodObject<{
        hotkey: z.ZodDefault<z.ZodString>;
        target: z.ZodDefault<z.ZodEnum<["current", "new"]>>;
    }, "strict", z.ZodTypeAny, {
        target: "current" | "new";
        hotkey: string;
    }, {
        target?: "current" | "new" | undefined;
        hotkey?: string | undefined;
    }>>;
    computer: z.ZodDefault<z.ZodEffects<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        previewEnabled: z.ZodDefault<z.ZodBoolean>;
        actionLogging: z.ZodDefault<z.ZodBoolean>;
        strictApproval: z.ZodDefault<z.ZodBoolean>;
        apps: z.ZodDefault<z.ZodArray<z.ZodObject<{
            bundleId: z.ZodString;
            appName: z.ZodString;
            approvedAt: z.ZodOptional<z.ZodString>;
            revokedAt: z.ZodOptional<z.ZodString>;
            lastUsedAt: z.ZodOptional<z.ZodString>;
            useCount: z.ZodDefault<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }, {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        enabled: boolean;
        previewEnabled: boolean;
        actionLogging: boolean;
        strictApproval: boolean;
        apps: {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }[];
    }, {
        enabled?: boolean | undefined;
        previewEnabled?: boolean | undefined;
        actionLogging?: boolean | undefined;
        strictApproval?: boolean | undefined;
        apps?: {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }[] | undefined;
    }>, {
        enabled: boolean;
        previewEnabled: boolean;
        actionLogging: boolean;
        strictApproval: boolean;
        apps: {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }[];
    }, {
        enabled?: boolean | undefined;
        previewEnabled?: boolean | undefined;
        actionLogging?: boolean | undefined;
        strictApproval?: boolean | undefined;
        apps?: {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }[] | undefined;
    }>>;
    crystal: z.ZodDefault<z.ZodObject<{
        passiveEnabled: z.ZodDefault<z.ZodBoolean>;
        semanticScanEnabled: z.ZodDefault<z.ZodBoolean>;
        contour: z.ZodDefault<z.ZodObject<{
            count: z.ZodNumber;
            turns: z.ZodNumber;
            spread: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            count: number;
            turns: number;
            spread: number;
        }, {
            count: number;
            turns: number;
            spread: number;
        }>>;
        nucleus: z.ZodDefault<z.ZodObject<{
            count: z.ZodNumber;
            turns: z.ZodNumber;
            spread: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            count: number;
            turns: number;
            spread: number;
        }, {
            count: number;
            turns: number;
            spread: number;
        }>>;
        dormantDays: z.ZodDefault<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        passiveEnabled: boolean;
        semanticScanEnabled: boolean;
        contour: {
            count: number;
            turns: number;
            spread: number;
        };
        nucleus: {
            count: number;
            turns: number;
            spread: number;
        };
        dormantDays: number;
    }, {
        passiveEnabled?: boolean | undefined;
        semanticScanEnabled?: boolean | undefined;
        contour?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        nucleus?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        dormantDays?: number | undefined;
    }>>;
    context: z.ZodDefault<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxTurnToolResultBytes: z.ZodDefault<z.ZodNumber>;
        instructionsMaxBytes: z.ZodDefault<z.ZodNumber>;
        compaction: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            reserveTokens: z.ZodOptional<z.ZodNumber>;
            /** 触发阈值 = 当前输入预算 × 该百分比；与显式 reserveTokens 同时配置时以后者为准。 */
            triggerPercent: z.ZodOptional<z.ZodNumber>;
            /** 与 keepRecentTokens 共同构成保留段双上限，取更保守（保留更少）的安全切分点。 */
            keepRecentTokens: z.ZodOptional<z.ZodNumber>;
            keepRecentMessages: z.ZodOptional<z.ZodNumber>;
            maxSummaryTokens: z.ZodDefault<z.ZodNumber>;
            /** 压缩摘要专用模型别名；缺省跟随当前对话模型。 */
            summaryModel: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            maxSummaryTokens: number;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
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
        identity: z.ZodDefault<z.ZodObject<{
            /** 用户资料区块的全局开关；核心 Soul 始终来自应用内置资源。 */
            enabled: z.ZodDefault<z.ZodBoolean>;
            /** USER.md 是否进入模型上下文；用户资料可以独立关闭。 */
            userEnabled: z.ZodDefault<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            enabled: boolean;
            userEnabled: boolean;
        }, {
            enabled?: boolean | undefined;
            userEnabled?: boolean | undefined;
        }>>;
        memory: z.ZodDefault<z.ZodEffects<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            useMemories: z.ZodDefault<z.ZodBoolean>;
            generateMemories: z.ZodDefault<z.ZodBoolean>;
            queryRewrite: z.ZodDefault<z.ZodBoolean>;
            memoryModel: z.ZodOptional<z.ZodString>;
            rewriteModel: z.ZodOptional<z.ZodString>;
            extractModel: z.ZodOptional<z.ZodString>;
            embeddingModel: z.ZodOptional<z.ZodType<import("../personalization/index.js").EmbeddingModelRef, z.ZodTypeDef, import("../personalization/index.js").EmbeddingModelRef>>;
            similarityThreshold: z.ZodDefault<z.ZodNumber>;
            excludeExternalContext: z.ZodDefault<z.ZodBoolean>;
            maxRecalled: z.ZodDefault<z.ZodNumber>;
            sleepEnabled: z.ZodDefault<z.ZodBoolean>;
            sleepTime: z.ZodDefault<z.ZodString>;
            archiveRetentionDays: z.ZodDefault<z.ZodNumber>;
            temporaryTtl: z.ZodDefault<z.ZodNumber>;
            similarityMergeThreshold: z.ZodDefault<z.ZodNumber>;
            useLlm: z.ZodDefault<z.ZodBoolean>;
            llmMergeLow: z.ZodDefault<z.ZodNumber>;
            llmBatchSize: z.ZodDefault<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        }>, Omit<{
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, "enabled"> & {
            enabled: boolean;
        }, {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        memory: Omit<{
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, "enabled"> & {
            enabled: boolean;
        };
        maxTurnToolResultBytes: number;
        instructionsMaxBytes: number;
        compaction: {
            enabled: boolean;
            maxSummaryTokens: number;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            summaryModel?: string | undefined;
        };
        identity: {
            enabled: boolean;
            userEnabled: boolean;
        };
        maxInputTokens?: number | undefined;
    }, {
        memory?: {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        } | undefined;
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
        identity?: {
            enabled?: boolean | undefined;
            userEnabled?: boolean | undefined;
        } | undefined;
    }>>;
    chat: z.ZodDefault<z.ZodObject<{
        /** Desktop 展示偏好；不改变 Provider 流式协议或已落盘的消息内容。 */
        response: z.ZodOptional<z.ZodObject<{
            streaming: z.ZodOptional<z.ZodBoolean>;
            showTokenUsage: z.ZodOptional<z.ZodBoolean>;
            markdown: z.ZodOptional<z.ZodBoolean>;
            singleDollarMath: z.ZodOptional<z.ZodBoolean>;
            collapseThinking: z.ZodOptional<z.ZodBoolean>;
            openLinksInBrowser: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        }, {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        }>>;
        /** 实验开关：覆盖协议自动选择，让 Read/Edit 使用行哈希。 */
        hashlineEdit: z.ZodOptional<z.ZodBoolean>;
        /** Prompt 缓存标记：按协议给 system 和请求尾部打断言点以命中服务商缓存；严格网关不认时可关闭。 */
        cacheMarkers: z.ZodDefault<z.ZodBoolean>;
        /** 采样温度 0–2；越低越确定，越高越发散。 */
        temperature: z.ZodOptional<z.ZodNumber>;
        /** 单次回复的最大输出 token 数。 */
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        /** 默认把哪些工具暴露给模型；单条消息可在 Composer 中覆盖。 */
        defaultToolSelection: z.ZodDefault<z.ZodEnum<["auto", "all", "none"]>>;
        /** 默认把哪些 Skill 元数据暴露给模型；单条消息可在 Composer 中覆盖。 */
        defaultSkillSelection: z.ZodDefault<z.ZodEnum<["auto", "all", "none"]>>;
        skillExtraction: z.ZodDefault<z.ZodObject<{
            /** 总开关；关闭后成功回合不再触发旁路分析。 */
            enabled: z.ZodDefault<z.ZodBoolean>;
            /** 本回合工具调用数达到阈值才分析，避免普通问答也跑辅助模型。 */
            minToolCalls: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            minToolCalls: number;
        }, {
            enabled?: boolean | undefined;
            minToolCalls?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        cacheMarkers: boolean;
        defaultToolSelection: "none" | "auto" | "all";
        defaultSkillSelection: "none" | "auto" | "all";
        skillExtraction: {
            enabled: boolean;
            minToolCalls: number;
        };
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
    }, {
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        cacheMarkers?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        defaultToolSelection?: "none" | "auto" | "all" | undefined;
        defaultSkillSelection?: "none" | "auto" | "all" | undefined;
        skillExtraction?: {
            enabled?: boolean | undefined;
            minToolCalls?: number | undefined;
        } | undefined;
    }>>;
    diagnostics: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        /** 自动识别项目本地已安装的检查工具（目前是 TypeScript）；只用本地二进制，不联网安装。 */
        autoDetect: z.ZodDefault<z.ZodBoolean>;
        autoDetectTimeoutMs: z.ZodDefault<z.ZodNumber>;
        maxOutputBytes: z.ZodDefault<z.ZodNumber>;
        commands: z.ZodDefault<z.ZodArray<z.ZodObject<{
            extensions: z.ZodArray<z.ZodString, "many">;
            command: z.ZodString;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            command: string;
            extensions: string[];
            timeoutMs: number;
        }, {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        maxOutputBytes: number;
        autoDetect: boolean;
        autoDetectTimeoutMs: number;
        commands: {
            command: string;
            extensions: string[];
            timeoutMs: number;
        }[];
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
    checkpoints: z.ZodDefault<z.ZodObject<{
        /** 每个回合首次改动工作区前自动建一个快照，供 /undo 回退。仅在 git 仓库内生效。 */
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
    }, {
        enabled?: boolean | undefined;
    }>>;
    sandbox: z.ZodDefault<z.ZodObject<{
        /**
         * `workspace-write`：命令仍以当前用户权限运行，但内核层面只允许写工作区、临时目录和常见
         * 缓存目录。这是独立于命令字符串判定的第二道边界。目前只有 macOS 有实现。
         * `off` 仅关闭写入范围限制；permission.denyPaths 和禁网配置仍需系统沙箱强制执行。
         */
        mode: z.ZodDefault<z.ZodEnum<["off", "workspace-write"]>>;
        allowNetwork: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        mode: "off" | "workspace-write";
        allowNetwork: boolean;
    }, {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    }>>;
    hooks: z.ZodDefault<z.ZodObject<{
        /** 工具执行前触发；非零退出会阻止这次调用。 */
        beforeTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
            command: z.ZodString;
            /** 只对这些工具触发；留空表示全部。 */
            tools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            /** 只对这些扩展名的目标路径触发；留空表示不按扩展名过滤。 */
            extensions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }, {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }>, "many">>;
        /** 工具执行后触发；输出附在结果上，退出码不影响调用结果。 */
        afterTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
            command: z.ZodString;
            /** 只对这些工具触发；留空表示全部。 */
            tools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            /** 只对这些扩展名的目标路径触发；留空表示不按扩展名过滤。 */
            extensions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }, {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        beforeTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
        afterTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
    }, {
        beforeTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
        afterTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
    }>>;
    web: z.ZodDefault<z.ZodObject<{
        search: z.ZodDefault<z.ZodObject<{
            provider: z.ZodDefault<z.ZodEnum<["google", "xiaohongshu"]>>;
            visibleBrowsing: z.ZodDefault<z.ZodBoolean>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
            maxResults: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            provider: "google" | "xiaohongshu";
            timeoutMs: number;
            visibleBrowsing: boolean;
            maxResults: number;
        }, {
            provider?: "google" | "xiaohongshu" | undefined;
            timeoutMs?: number | undefined;
            visibleBrowsing?: boolean | undefined;
            maxResults?: number | undefined;
        }>>;
        fetch: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
            maxBytes: z.ZodDefault<z.ZodNumber>;
            maxRedirects: z.ZodDefault<z.ZodNumber>;
            allowPrivateNetwork: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            timeoutMs: number;
            maxBytes: number;
            maxRedirects: number;
            allowPrivateNetwork: boolean;
        }, {
            enabled?: boolean | undefined;
            timeoutMs?: number | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            allowPrivateNetwork?: boolean | undefined;
        }>>;
        cookies: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            /** jar 文件位置；留空用桌面端 userData 下的共享路径，桌面端与 CLI 因此读到同一份。 */
            path: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            path?: string | undefined;
        }, {
            path?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        search: {
            provider: "google" | "xiaohongshu";
            timeoutMs: number;
            visibleBrowsing: boolean;
            maxResults: number;
        };
        fetch: {
            enabled: boolean;
            timeoutMs: number;
            maxBytes: number;
            maxRedirects: number;
            allowPrivateNetwork: boolean;
        };
        cookies: {
            enabled: boolean;
            path?: string | undefined;
        };
    }, {
        search?: {
            provider?: "google" | "xiaohongshu" | undefined;
            timeoutMs?: number | undefined;
            visibleBrowsing?: boolean | undefined;
            maxResults?: number | undefined;
        } | undefined;
        fetch?: {
            enabled?: boolean | undefined;
            timeoutMs?: number | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            allowPrivateNetwork?: boolean | undefined;
        } | undefined;
        cookies?: {
            path?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    }>>;
    telemetry: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        recordInputs: z.ZodDefault<z.ZodBoolean>;
        recordOutputs: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        recordInputs: boolean;
        recordOutputs: boolean;
    }, {
        enabled?: boolean | undefined;
        recordInputs?: boolean | undefined;
        recordOutputs?: boolean | undefined;
    }>>;
    extensions: z.ZodDefault<z.ZodObject<{
        mcp: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
            exposure: z.ZodOptional<z.ZodEnum<["direct", "codemode", "deferred", "hidden"]>>;
            toolExposure: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<["direct", "codemode", "deferred", "hidden"]>>>;
            /** 按服务端原始工具名显式启用固定契约，不依据远端 annotations 自动启用。 */
            toolContracts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodLiteral<"file-change-v1">>>;
            /** 用于凭据 account 稳定关联；旧配置没有该字段时在下一次桌面保存时补齐。 */
            id: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<["stdio", "http"]>>;
            /** Remote 新配置可显式选择协议；缺省时保留 streamable HTTP -> SSE 回退。 */
            transportProtocol: z.ZodOptional<z.ZodEnum<["streamable-http", "sse"]>>;
            command: z.ZodOptional<z.ZodString>;
            args: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            /** env/header 的值保存在 Keychain；这里仅保存 account 引用。 */
            credentialRefs: z.ZodOptional<z.ZodObject<{
                env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            }, {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            }>>;
            cwd: z.ZodOptional<z.ZodString>;
            stderr: z.ZodDefault<z.ZodEnum<["ignore", "inherit", "pipe"]>>;
            url: z.ZodOptional<z.ZodString>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            oauth: z.ZodOptional<z.ZodObject<{
                clientId: z.ZodOptional<z.ZodString>;
                scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                redirectPort: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            }, {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            }>>;
            startupTimeoutMs: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            enabled: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }>, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }>>>;
        skills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        skillDefaults: z.ZodDefault<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodBoolean>, Record<string, boolean>, Record<string, boolean>>>;
        skillProjectOverrides: z.ZodDefault<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodBoolean>, Record<string, boolean>, Record<string, boolean>>>, Record<string, Record<string, boolean>>, Record<string, Record<string, boolean>>>>;
        plugins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** 全局配置目录下的 Plugin 路径；只允许在 ~/.config/biny/plugins 内解析。 */
        globalPlugins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        subagent: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            maxSteps: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodDefault<z.ZodNumber>;
            maxConcurrentSubagents: z.ZodDefault<z.ZodNumber>;
            maxPendingSubagents: z.ZodDefault<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            inactivityTimeoutMs: z.ZodDefault<z.ZodNumber>;
            model: z.ZodOptional<z.ZodString>;
            maxCostUsd: z.ZodOptional<z.ZodNumber>;
            allowedTools: z.ZodDefault<z.ZodArray<z.ZodEnum<["Read", "Glob", "Grep", "Write", "Edit", "Bash"]>, "many">>;
            agentPaths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            maxOutputTokens: number;
            maxConcurrentSubagents: number;
            maxPendingSubagents: number;
            inactivityTimeoutMs: number;
            allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
            agentPaths: string[];
            model?: string | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxCostUsd?: number | undefined;
        }, {
            model?: string | undefined;
            enabled?: boolean | undefined;
            maxOutputTokens?: number | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxConcurrentSubagents?: number | undefined;
            maxPendingSubagents?: number | undefined;
            inactivityTimeoutMs?: number | undefined;
            maxCostUsd?: number | undefined;
            allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
            agentPaths?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        mcp: Record<string, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }>;
        skills: string[];
        plugins: string[];
        subagent: {
            enabled: boolean;
            maxOutputTokens: number;
            maxConcurrentSubagents: number;
            maxPendingSubagents: number;
            inactivityTimeoutMs: number;
            allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
            agentPaths: string[];
            model?: string | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxCostUsd?: number | undefined;
        };
        skillDefaults: Record<string, boolean>;
        skillProjectOverrides: Record<string, Record<string, boolean>>;
        globalPlugins: string[];
    }, {
        mcp?: Record<string, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }> | undefined;
        skills?: string[] | undefined;
        plugins?: string[] | undefined;
        subagent?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            maxOutputTokens?: number | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxConcurrentSubagents?: number | undefined;
            maxPendingSubagents?: number | undefined;
            inactivityTimeoutMs?: number | undefined;
            maxCostUsd?: number | undefined;
            allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
            agentPaths?: string[] | undefined;
        } | undefined;
        skillDefaults?: Record<string, boolean> | undefined;
        skillProjectOverrides?: Record<string, Record<string, boolean>> | undefined;
        globalPlugins?: string[] | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    format: "biny-config";
    permission: {
        mode: "auto" | "ask" | "read-only" | "full-access";
        allowTools: string[];
        allowPaths: string[];
        denyPaths: string[];
        criticalAlwaysAsk: boolean;
    };
    models: Record<string, {
        model: string;
        provider: string;
        reasoning?: {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>;
    providers: Record<string, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>;
    chat: {
        cacheMarkers: boolean;
        defaultToolSelection: "none" | "auto" | "all";
        defaultSkillSelection: "none" | "auto" | "all";
        skillExtraction: {
            enabled: boolean;
            minToolCalls: number;
        };
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
    };
    workspace: {
        ignore: string[];
    };
    activity: {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    };
    extensions: {
        mcp: Record<string, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }>;
        skills: string[];
        plugins: string[];
        subagent: {
            enabled: boolean;
            maxOutputTokens: number;
            maxConcurrentSubagents: number;
            maxPendingSubagents: number;
            inactivityTimeoutMs: number;
            allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
            agentPaths: string[];
            model?: string | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxCostUsd?: number | undefined;
        };
        skillDefaults: Record<string, boolean>;
        skillProjectOverrides: Record<string, Record<string, boolean>>;
        globalPlugins: string[];
    };
    agent: {
        toolExecutionMode: "direct" | "code_mode";
        softStepLimit: number;
        hardStepLimit: number;
        maxRepeatedActions: number;
        maxConcurrentTools: number;
        maxQueuedToolCalls: number;
        maxToolCalls?: number | undefined;
    };
    configVersion: 2;
    web: {
        search: {
            provider: "google" | "xiaohongshu";
            timeoutMs: number;
            visibleBrowsing: boolean;
            maxResults: number;
        };
        fetch: {
            enabled: boolean;
            timeoutMs: number;
            maxBytes: number;
            maxRedirects: number;
            allowPrivateNetwork: boolean;
        };
        cookies: {
            enabled: boolean;
            path?: string | undefined;
        };
    };
    context: {
        memory: Omit<{
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, "enabled"> & {
            enabled: boolean;
        };
        maxTurnToolResultBytes: number;
        instructionsMaxBytes: number;
        compaction: {
            enabled: boolean;
            maxSummaryTokens: number;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            summaryModel?: string | undefined;
        };
        identity: {
            enabled: boolean;
            userEnabled: boolean;
        };
        maxInputTokens?: number | undefined;
    };
    needsEmbeddingRebuild: boolean;
    defaultModel: string;
    thinking: {
        enabled: boolean;
        effort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
    };
    heartbeat: {
        enabled: boolean;
        intervalMinutes: number;
        activeHoursStart: number;
        activeHoursEnd: number;
    };
    appshots: {
        target: "current" | "new";
        hotkey: string;
    };
    computer: {
        enabled: boolean;
        previewEnabled: boolean;
        actionLogging: boolean;
        strictApproval: boolean;
        apps: {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }[];
    };
    crystal: {
        passiveEnabled: boolean;
        semanticScanEnabled: boolean;
        contour: {
            count: number;
            turns: number;
            spread: number;
        };
        nucleus: {
            count: number;
            turns: number;
            spread: number;
        };
        dormantDays: number;
    };
    diagnostics: {
        enabled: boolean;
        maxOutputBytes: number;
        autoDetect: boolean;
        autoDetectTimeoutMs: number;
        commands: {
            command: string;
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    checkpoints: {
        enabled: boolean;
    };
    sandbox: {
        mode: "off" | "workspace-write";
        allowNetwork: boolean;
    };
    hooks: {
        beforeTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
        afterTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    telemetry: {
        enabled: boolean;
        recordInputs: boolean;
        recordOutputs: boolean;
    };
    toolModel?: string | undefined;
    credentialRevisions?: Record<string, string> | undefined;
}, {
    format: "biny-config";
    models: Record<string, {
        model: string;
        provider: string;
        reasoning?: {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>;
    providers: Record<string, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>;
    workspace: {
        ignore: string[];
    };
    configVersion: 2;
    defaultModel: string;
    permission?: {
        mode?: "auto" | "ask" | "read-only" | "full-access" | undefined;
        allowTools?: string[] | undefined;
        allowPaths?: string[] | undefined;
        denyPaths?: string[] | undefined;
        criticalAlwaysAsk?: boolean | undefined;
    } | undefined;
    chat?: {
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        cacheMarkers?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        defaultToolSelection?: "none" | "auto" | "all" | undefined;
        defaultSkillSelection?: "none" | "auto" | "all" | undefined;
        skillExtraction?: {
            enabled?: boolean | undefined;
            minToolCalls?: number | undefined;
        } | undefined;
    } | undefined;
    activity?: unknown;
    extensions?: {
        mcp?: Record<string, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }> | undefined;
        skills?: string[] | undefined;
        plugins?: string[] | undefined;
        subagent?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            maxOutputTokens?: number | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxConcurrentSubagents?: number | undefined;
            maxPendingSubagents?: number | undefined;
            inactivityTimeoutMs?: number | undefined;
            maxCostUsd?: number | undefined;
            allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
            agentPaths?: string[] | undefined;
        } | undefined;
        skillDefaults?: Record<string, boolean> | undefined;
        skillProjectOverrides?: Record<string, Record<string, boolean>> | undefined;
        globalPlugins?: string[] | undefined;
    } | undefined;
    agent?: {
        toolExecutionMode?: "direct" | "code_mode" | undefined;
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    } | undefined;
    web?: {
        search?: {
            provider?: "google" | "xiaohongshu" | undefined;
            timeoutMs?: number | undefined;
            visibleBrowsing?: boolean | undefined;
            maxResults?: number | undefined;
        } | undefined;
        fetch?: {
            enabled?: boolean | undefined;
            timeoutMs?: number | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            allowPrivateNetwork?: boolean | undefined;
        } | undefined;
        cookies?: {
            path?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    context?: {
        memory?: {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        } | undefined;
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
        identity?: {
            enabled?: boolean | undefined;
            userEnabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    needsEmbeddingRebuild?: boolean | undefined;
    toolModel?: string | undefined;
    credentialRevisions?: Record<string, string> | undefined;
    thinking?: {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    } | undefined;
    heartbeat?: {
        enabled?: boolean | undefined;
        intervalMinutes?: number | undefined;
        activeHoursStart?: number | undefined;
        activeHoursEnd?: number | undefined;
    } | undefined;
    appshots?: {
        target?: "current" | "new" | undefined;
        hotkey?: string | undefined;
    } | undefined;
    computer?: {
        enabled?: boolean | undefined;
        previewEnabled?: boolean | undefined;
        actionLogging?: boolean | undefined;
        strictApproval?: boolean | undefined;
        apps?: {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }[] | undefined;
    } | undefined;
    crystal?: {
        passiveEnabled?: boolean | undefined;
        semanticScanEnabled?: boolean | undefined;
        contour?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        nucleus?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        dormantDays?: number | undefined;
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
    hooks?: {
        beforeTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
        afterTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
    } | undefined;
    telemetry?: {
        enabled?: boolean | undefined;
        recordInputs?: boolean | undefined;
        recordOutputs?: boolean | undefined;
    } | undefined;
}>, {
    format: "biny-config";
    permission: {
        mode: "auto" | "ask" | "read-only" | "full-access";
        allowTools: string[];
        allowPaths: string[];
        denyPaths: string[];
        criticalAlwaysAsk: boolean;
    };
    models: Record<string, {
        model: string;
        provider: string;
        reasoning?: {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>;
    providers: Record<string, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>;
    chat: {
        cacheMarkers: boolean;
        defaultToolSelection: "none" | "auto" | "all";
        defaultSkillSelection: "none" | "auto" | "all";
        skillExtraction: {
            enabled: boolean;
            minToolCalls: number;
        };
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
    };
    workspace: {
        ignore: string[];
    };
    activity: {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    };
    extensions: {
        mcp: Record<string, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }>;
        skills: string[];
        plugins: string[];
        subagent: {
            enabled: boolean;
            maxOutputTokens: number;
            maxConcurrentSubagents: number;
            maxPendingSubagents: number;
            inactivityTimeoutMs: number;
            allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
            agentPaths: string[];
            model?: string | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxCostUsd?: number | undefined;
        };
        skillDefaults: Record<string, boolean>;
        skillProjectOverrides: Record<string, Record<string, boolean>>;
        globalPlugins: string[];
    };
    agent: {
        toolExecutionMode: "direct" | "code_mode";
        softStepLimit: number;
        hardStepLimit: number;
        maxRepeatedActions: number;
        maxConcurrentTools: number;
        maxQueuedToolCalls: number;
        maxToolCalls?: number | undefined;
    };
    configVersion: 2;
    web: {
        search: {
            provider: "google" | "xiaohongshu";
            timeoutMs: number;
            visibleBrowsing: boolean;
            maxResults: number;
        };
        fetch: {
            enabled: boolean;
            timeoutMs: number;
            maxBytes: number;
            maxRedirects: number;
            allowPrivateNetwork: boolean;
        };
        cookies: {
            enabled: boolean;
            path?: string | undefined;
        };
    };
    context: {
        memory: Omit<{
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, "enabled"> & {
            enabled: boolean;
        };
        maxTurnToolResultBytes: number;
        instructionsMaxBytes: number;
        compaction: {
            enabled: boolean;
            maxSummaryTokens: number;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            summaryModel?: string | undefined;
        };
        identity: {
            enabled: boolean;
            userEnabled: boolean;
        };
        maxInputTokens?: number | undefined;
    };
    needsEmbeddingRebuild: boolean;
    defaultModel: string;
    thinking: {
        enabled: boolean;
        effort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
    };
    heartbeat: {
        enabled: boolean;
        intervalMinutes: number;
        activeHoursStart: number;
        activeHoursEnd: number;
    };
    appshots: {
        target: "current" | "new";
        hotkey: string;
    };
    computer: {
        enabled: boolean;
        previewEnabled: boolean;
        actionLogging: boolean;
        strictApproval: boolean;
        apps: {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }[];
    };
    crystal: {
        passiveEnabled: boolean;
        semanticScanEnabled: boolean;
        contour: {
            count: number;
            turns: number;
            spread: number;
        };
        nucleus: {
            count: number;
            turns: number;
            spread: number;
        };
        dormantDays: number;
    };
    diagnostics: {
        enabled: boolean;
        maxOutputBytes: number;
        autoDetect: boolean;
        autoDetectTimeoutMs: number;
        commands: {
            command: string;
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    checkpoints: {
        enabled: boolean;
    };
    sandbox: {
        mode: "off" | "workspace-write";
        allowNetwork: boolean;
    };
    hooks: {
        beforeTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
        afterTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    telemetry: {
        enabled: boolean;
        recordInputs: boolean;
        recordOutputs: boolean;
    };
    toolModel?: string | undefined;
    credentialRevisions?: Record<string, string> | undefined;
}, {
    format: "biny-config";
    models: Record<string, {
        model: string;
        provider: string;
        reasoning?: {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>;
    providers: Record<string, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>;
    workspace: {
        ignore: string[];
    };
    configVersion: 2;
    defaultModel: string;
    permission?: {
        mode?: "auto" | "ask" | "read-only" | "full-access" | undefined;
        allowTools?: string[] | undefined;
        allowPaths?: string[] | undefined;
        denyPaths?: string[] | undefined;
        criticalAlwaysAsk?: boolean | undefined;
    } | undefined;
    chat?: {
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        cacheMarkers?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        defaultToolSelection?: "none" | "auto" | "all" | undefined;
        defaultSkillSelection?: "none" | "auto" | "all" | undefined;
        skillExtraction?: {
            enabled?: boolean | undefined;
            minToolCalls?: number | undefined;
        } | undefined;
    } | undefined;
    activity?: unknown;
    extensions?: {
        mcp?: Record<string, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }> | undefined;
        skills?: string[] | undefined;
        plugins?: string[] | undefined;
        subagent?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            maxOutputTokens?: number | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxConcurrentSubagents?: number | undefined;
            maxPendingSubagents?: number | undefined;
            inactivityTimeoutMs?: number | undefined;
            maxCostUsd?: number | undefined;
            allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
            agentPaths?: string[] | undefined;
        } | undefined;
        skillDefaults?: Record<string, boolean> | undefined;
        skillProjectOverrides?: Record<string, Record<string, boolean>> | undefined;
        globalPlugins?: string[] | undefined;
    } | undefined;
    agent?: {
        toolExecutionMode?: "direct" | "code_mode" | undefined;
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    } | undefined;
    web?: {
        search?: {
            provider?: "google" | "xiaohongshu" | undefined;
            timeoutMs?: number | undefined;
            visibleBrowsing?: boolean | undefined;
            maxResults?: number | undefined;
        } | undefined;
        fetch?: {
            enabled?: boolean | undefined;
            timeoutMs?: number | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            allowPrivateNetwork?: boolean | undefined;
        } | undefined;
        cookies?: {
            path?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    context?: {
        memory?: {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        } | undefined;
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
        identity?: {
            enabled?: boolean | undefined;
            userEnabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    needsEmbeddingRebuild?: boolean | undefined;
    toolModel?: string | undefined;
    credentialRevisions?: Record<string, string> | undefined;
    thinking?: {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    } | undefined;
    heartbeat?: {
        enabled?: boolean | undefined;
        intervalMinutes?: number | undefined;
        activeHoursStart?: number | undefined;
        activeHoursEnd?: number | undefined;
    } | undefined;
    appshots?: {
        target?: "current" | "new" | undefined;
        hotkey?: string | undefined;
    } | undefined;
    computer?: {
        enabled?: boolean | undefined;
        previewEnabled?: boolean | undefined;
        actionLogging?: boolean | undefined;
        strictApproval?: boolean | undefined;
        apps?: {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }[] | undefined;
    } | undefined;
    crystal?: {
        passiveEnabled?: boolean | undefined;
        semanticScanEnabled?: boolean | undefined;
        contour?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        nucleus?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        dormantDays?: number | undefined;
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
    hooks?: {
        beforeTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
        afterTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
    } | undefined;
    telemetry?: {
        enabled?: boolean | undefined;
        recordInputs?: boolean | undefined;
        recordOutputs?: boolean | undefined;
    } | undefined;
}>;
export declare const configSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    format: z.ZodLiteral<"biny-config">;
    configVersion: z.ZodLiteral<2>;
    needsEmbeddingRebuild: z.ZodDefault<z.ZodBoolean>;
    defaultModel: z.ZodString;
    /** 活动分析、摘要与建议共用的工具模型；省略时从可用配置自动选择。 */
    toolModel: z.ZodOptional<z.ZodString>;
    providers: z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
        type: z.ZodString;
        acp: z.ZodOptional<z.ZodObject<{
            command: z.ZodString;
            args: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            env: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
            promptTimeoutMs: z.ZodDefault<z.ZodNumber>;
            maxOutputBytes: z.ZodDefault<z.ZodNumber>;
            allowMemory: z.ZodDefault<z.ZodBoolean>;
            authMethodId: z.ZodOptional<z.ZodString>;
            modeId: z.ZodOptional<z.ZodString>;
            mcpServers: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        }, {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        }>>;
        /** 缺省启用；停用保留连接、凭据和模型选择。 */
        enabled: z.ZodOptional<z.ZodBoolean>;
        /** 用户自定义服务商的显示名；内置目录服务商不使用，列表标签优先于端点主机名。 */
        displayName: z.ZodOptional<z.ZodString>;
        /**
         * 用户为该服务商挑的品牌图标 id（`assets/provider-icon-data` 的键）。
         * 缺省表示没有覆盖，渲染层按目录默认图标回退。
         */
        icon: z.ZodOptional<z.ZodString>;
        protocol: z.ZodOptional<z.ZodEnum<["anthropic", "openai-compatible"]>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodOptional<z.ZodString>;
        apiKeyEnv: z.ZodOptional<z.ZodString>;
        requiresApiKey: z.ZodOptional<z.ZodBoolean>;
        /** 模型目录的鉴权要求独立于聊天请求；未设置时沿用 requiresApiKey。 */
        modelsRequiresApiKey: z.ZodOptional<z.ZodBoolean>;
        authMode: z.ZodOptional<z.ZodEnum<["api-key", "oauth-bearer"]>>;
        oauth: z.ZodOptional<z.ZodObject<{
            provider: z.ZodString;
            refreshToken: z.ZodOptional<z.ZodString>;
            expiresAt: z.ZodNumber;
            accountId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        }, {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        retry: z.ZodOptional<z.ZodObject<{
            maxAttempts: z.ZodDefault<z.ZodNumber>;
            initialDelayMs: z.ZodDefault<z.ZodNumber>;
            maxDelayMs: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        }, {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        }>>;
        modelsEndpoint: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiBackend: z.ZodOptional<z.ZodString>;
        compatibility: z.ZodOptional<z.ZodObject<{
            supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
            supportsReasoning: z.ZodOptional<z.ZodBoolean>;
            supportsVision: z.ZodOptional<z.ZodBoolean>;
            maxTokensField: z.ZodOptional<z.ZodEnum<["max_tokens", "max_completion_tokens"]>>;
        }, "strip", z.ZodTypeAny, {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        }, {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        }>>;
        /** 自定义 Responses 端点须明确声明，不根据模型名称推断协议支持。 */
        applyPatchProtocol: z.ZodOptional<z.ZodEnum<["openai-structured", "off"]>>;
        modelProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            /** 只保存用户主动修改的能力；未填写时跟随当前目录。 */
            capabilities: z.ZodOptional<z.ZodObject<{
                tools: z.ZodOptional<z.ZodBoolean>;
                parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
                reasoning: z.ZodOptional<z.ZodBoolean>;
                reasoningStream: z.ZodOptional<z.ZodBoolean>;
                reasoningSummary: z.ZodOptional<z.ZodBoolean>;
                vision: z.ZodOptional<z.ZodBoolean>;
                audio: z.ZodOptional<z.ZodBoolean>;
                streaming: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            }, {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            }>>;
            /** 仅控制模型选择器可见性，停用时保留配置和已有会话引用。 */
            showInPicker: z.ZodOptional<z.ZodBoolean>;
            contextWindow: z.ZodOptional<z.ZodNumber>;
            maxInputTokens: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodOptional<z.ZodNumber>;
            thinkingLevelMap: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>, Record<string, string | null>, Record<string, string | null>>>;
        }, "strict", z.ZodTypeAny, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }>>>;
        /** 外部端点不得凭 URL 推断本地性；未来本地服务必须显式声明。 */
        dataResidency: z.ZodOptional<z.ZodEnum<["local", "external"]>>;
        /** 仅显式声明的 provider embedding 型号会进入目录；不会从聊天模型或 ID 猜测。 */
        embeddingModels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            displayName: z.ZodString;
            dimensions: z.ZodOptional<z.ZodNumber>;
            /** 语义召回的最低相似度；未配置时使用运行时推荐值。 */
            recommendedThreshold: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }, {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>>;
    /** 凭据正文保存在 Keychain；这里仅保存并发 CAS 使用的非机密版本 nonce。 */
    credentialRevisions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    models: z.ZodRecord<z.ZodString, z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        /** 仅作为未来隐私白名单的显式声明，当前 v1 不会因此放行 Activity。 */
        dataResidency: z.ZodOptional<z.ZodEnum<["local", "external"]>>;
        displayName: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        supportsTools: z.ZodOptional<z.ZodBoolean>;
        capabilities: z.ZodOptional<z.ZodObject<{
            tools: z.ZodOptional<z.ZodBoolean>;
            parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
            reasoning: z.ZodOptional<z.ZodBoolean>;
            reasoningStream: z.ZodOptional<z.ZodBoolean>;
            reasoningSummary: z.ZodOptional<z.ZodBoolean>;
            vision: z.ZodOptional<z.ZodBoolean>;
            audio: z.ZodOptional<z.ZodBoolean>;
            streaming: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        }, {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        }>>;
        contextWindow: z.ZodOptional<z.ZodNumber>;
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        limits: z.ZodOptional<z.ZodObject<{
            maxInputTokens: z.ZodOptional<z.ZodNumber>;
            reasoningReserveTokens: z.ZodOptional<z.ZodNumber>;
            toolSchemaReserveTokens: z.ZodOptional<z.ZodNumber>;
            systemPromptReserveTokens: z.ZodOptional<z.ZodNumber>;
            protocolSafetyMarginTokens: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        }, {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        }>>;
        /** Model-level API and compatibility override the provider defaults. */
        apiBackend: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        compatibility: z.ZodOptional<z.ZodObject<{
            supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
            supportsReasoning: z.ZodOptional<z.ZodBoolean>;
            supportsVision: z.ZodOptional<z.ZodBoolean>;
            maxTokensField: z.ZodOptional<z.ZodEnum<["max_tokens", "max_completion_tokens"]>>;
        }, "strip", z.ZodTypeAny, {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        }, {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        }>>;
        /** Canonical capability map. Missing/null levels are unsupported. */
        thinkingLevelMap: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>, Record<string, string | null>, Record<string, string | null>>>;
        reasoning: z.ZodOptional<z.ZodEffects<z.ZodObject<{
            efforts: z.ZodDefault<z.ZodArray<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, "many">>;
            defaultEffort: z.ZodDefault<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>>;
            mapping: z.ZodOptional<z.ZodRecord<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, z.ZodString>>;
            budgetTokens: z.ZodOptional<z.ZodRecord<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>, z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        }, {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        }>, {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        }, {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        }>>;
        pricing: z.ZodOptional<z.ZodObject<{
            inputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            outputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            cacheReadPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            cacheWritePerMillionTokens: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        }, {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model: string;
        provider: string;
        reasoning?: {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }, {
        model: string;
        provider: string;
        reasoning?: {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>>;
    thinking: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        effort: z.ZodDefault<z.ZodEnum<["minimal", "low", "medium", "high", "xhigh", "max"]>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        effort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
    }, {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    }>>;
    agent: z.ZodDefault<z.ZodObject<{
        /** code_mode adds an isolated script tool alongside ordinary tool calls. */
        toolExecutionMode: z.ZodDefault<z.ZodEnum<["direct", "code_mode"]>>;
        softStepLimit: z.ZodDefault<z.ZodNumber>;
        hardStepLimit: z.ZodDefault<z.ZodNumber>;
        maxToolCalls: z.ZodOptional<z.ZodNumber>;
        maxRepeatedActions: z.ZodDefault<z.ZodNumber>;
        maxConcurrentTools: z.ZodDefault<z.ZodNumber>;
        maxQueuedToolCalls: z.ZodDefault<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        toolExecutionMode: "direct" | "code_mode";
        softStepLimit: number;
        hardStepLimit: number;
        maxRepeatedActions: number;
        maxConcurrentTools: number;
        maxQueuedToolCalls: number;
        maxToolCalls?: number | undefined;
    }, {
        toolExecutionMode?: "direct" | "code_mode" | undefined;
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    }>>;
    heartbeat: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        intervalMinutes: z.ZodDefault<z.ZodNumber>;
        activeHoursStart: z.ZodDefault<z.ZodNumber>;
        activeHoursEnd: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        intervalMinutes: number;
        activeHoursStart: number;
        activeHoursEnd: number;
    }, {
        enabled?: boolean | undefined;
        intervalMinutes?: number | undefined;
        activeHoursStart?: number | undefined;
        activeHoursEnd?: number | undefined;
    }>>;
    permission: z.ZodDefault<z.ZodObject<{
        mode: z.ZodDefault<z.ZodEnum<["ask", "read-only", "auto", "full-access"]>>;
        allowTools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        allowPaths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        denyPaths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        criticalAlwaysAsk: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        mode: "auto" | "ask" | "read-only" | "full-access";
        allowTools: string[];
        allowPaths: string[];
        denyPaths: string[];
        criticalAlwaysAsk: boolean;
    }, {
        mode?: "auto" | "ask" | "read-only" | "full-access" | undefined;
        allowTools?: string[] | undefined;
        allowPaths?: string[] | undefined;
        denyPaths?: string[] | undefined;
        criticalAlwaysAsk?: boolean | undefined;
    }>>;
    workspace: z.ZodObject<{
        ignore: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        ignore: string[];
    }, {
        ignore: string[];
    }>;
    activity: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        captureDebounceMs: z.ZodDefault<z.ZodNumber>;
        heartbeatMs: z.ZodDefault<z.ZodNumber>;
        idleTimeoutMs: z.ZodDefault<z.ZodNumber>;
        inputPauseMs: z.ZodDefault<z.ZodNumber>;
        visualPollMs: z.ZodDefault<z.ZodNumber>;
        browserPollIntervalMs: z.ZodDefault<z.ZodNumber>;
        jpegQuality: z.ZodDefault<z.ZodNumber>;
        histogramChangeThreshold: z.ZodDefault<z.ZodNumber>;
        pixelDiffThreshold: z.ZodDefault<z.ZodNumber>;
        pixelTolerance: z.ZodDefault<z.ZodNumber>;
        ocrEnabled: z.ZodDefault<z.ZodBoolean>;
        inputMonitoringEnabled: z.ZodDefault<z.ZodBoolean>;
        ocrLanguages: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        ocrEveryNFrames: z.ZodDefault<z.ZodNumber>;
        sensitiveApplications: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        maxStorageMb: z.ZodDefault<z.ZodNumber>;
        outputDirectory: z.ZodDefault<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    }, {
        enabled?: boolean | undefined;
        captureDebounceMs?: number | undefined;
        heartbeatMs?: number | undefined;
        idleTimeoutMs?: number | undefined;
        inputPauseMs?: number | undefined;
        visualPollMs?: number | undefined;
        browserPollIntervalMs?: number | undefined;
        jpegQuality?: number | undefined;
        histogramChangeThreshold?: number | undefined;
        pixelDiffThreshold?: number | undefined;
        pixelTolerance?: number | undefined;
        ocrEnabled?: boolean | undefined;
        inputMonitoringEnabled?: boolean | undefined;
        ocrLanguages?: string[] | undefined;
        ocrEveryNFrames?: number | undefined;
        sensitiveApplications?: string[] | undefined;
        maxStorageMb?: number | undefined;
        outputDirectory?: string | undefined;
    }>, {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    }, unknown>, {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    }, unknown>>;
    appshots: z.ZodDefault<z.ZodObject<{
        hotkey: z.ZodDefault<z.ZodString>;
        target: z.ZodDefault<z.ZodEnum<["current", "new"]>>;
    }, "strict", z.ZodTypeAny, {
        target: "current" | "new";
        hotkey: string;
    }, {
        target?: "current" | "new" | undefined;
        hotkey?: string | undefined;
    }>>;
    computer: z.ZodDefault<z.ZodEffects<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        previewEnabled: z.ZodDefault<z.ZodBoolean>;
        actionLogging: z.ZodDefault<z.ZodBoolean>;
        strictApproval: z.ZodDefault<z.ZodBoolean>;
        apps: z.ZodDefault<z.ZodArray<z.ZodObject<{
            bundleId: z.ZodString;
            appName: z.ZodString;
            approvedAt: z.ZodOptional<z.ZodString>;
            revokedAt: z.ZodOptional<z.ZodString>;
            lastUsedAt: z.ZodOptional<z.ZodString>;
            useCount: z.ZodDefault<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }, {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        enabled: boolean;
        previewEnabled: boolean;
        actionLogging: boolean;
        strictApproval: boolean;
        apps: {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }[];
    }, {
        enabled?: boolean | undefined;
        previewEnabled?: boolean | undefined;
        actionLogging?: boolean | undefined;
        strictApproval?: boolean | undefined;
        apps?: {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }[] | undefined;
    }>, {
        enabled: boolean;
        previewEnabled: boolean;
        actionLogging: boolean;
        strictApproval: boolean;
        apps: {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }[];
    }, {
        enabled?: boolean | undefined;
        previewEnabled?: boolean | undefined;
        actionLogging?: boolean | undefined;
        strictApproval?: boolean | undefined;
        apps?: {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }[] | undefined;
    }>>;
    crystal: z.ZodDefault<z.ZodObject<{
        passiveEnabled: z.ZodDefault<z.ZodBoolean>;
        semanticScanEnabled: z.ZodDefault<z.ZodBoolean>;
        contour: z.ZodDefault<z.ZodObject<{
            count: z.ZodNumber;
            turns: z.ZodNumber;
            spread: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            count: number;
            turns: number;
            spread: number;
        }, {
            count: number;
            turns: number;
            spread: number;
        }>>;
        nucleus: z.ZodDefault<z.ZodObject<{
            count: z.ZodNumber;
            turns: z.ZodNumber;
            spread: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            count: number;
            turns: number;
            spread: number;
        }, {
            count: number;
            turns: number;
            spread: number;
        }>>;
        dormantDays: z.ZodDefault<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        passiveEnabled: boolean;
        semanticScanEnabled: boolean;
        contour: {
            count: number;
            turns: number;
            spread: number;
        };
        nucleus: {
            count: number;
            turns: number;
            spread: number;
        };
        dormantDays: number;
    }, {
        passiveEnabled?: boolean | undefined;
        semanticScanEnabled?: boolean | undefined;
        contour?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        nucleus?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        dormantDays?: number | undefined;
    }>>;
    context: z.ZodDefault<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxTurnToolResultBytes: z.ZodDefault<z.ZodNumber>;
        instructionsMaxBytes: z.ZodDefault<z.ZodNumber>;
        compaction: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            reserveTokens: z.ZodOptional<z.ZodNumber>;
            /** 触发阈值 = 当前输入预算 × 该百分比；与显式 reserveTokens 同时配置时以后者为准。 */
            triggerPercent: z.ZodOptional<z.ZodNumber>;
            /** 与 keepRecentTokens 共同构成保留段双上限，取更保守（保留更少）的安全切分点。 */
            keepRecentTokens: z.ZodOptional<z.ZodNumber>;
            keepRecentMessages: z.ZodOptional<z.ZodNumber>;
            maxSummaryTokens: z.ZodDefault<z.ZodNumber>;
            /** 压缩摘要专用模型别名；缺省跟随当前对话模型。 */
            summaryModel: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            maxSummaryTokens: number;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
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
        identity: z.ZodDefault<z.ZodObject<{
            /** 用户资料区块的全局开关；核心 Soul 始终来自应用内置资源。 */
            enabled: z.ZodDefault<z.ZodBoolean>;
            /** USER.md 是否进入模型上下文；用户资料可以独立关闭。 */
            userEnabled: z.ZodDefault<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            enabled: boolean;
            userEnabled: boolean;
        }, {
            enabled?: boolean | undefined;
            userEnabled?: boolean | undefined;
        }>>;
        memory: z.ZodDefault<z.ZodEffects<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            useMemories: z.ZodDefault<z.ZodBoolean>;
            generateMemories: z.ZodDefault<z.ZodBoolean>;
            queryRewrite: z.ZodDefault<z.ZodBoolean>;
            memoryModel: z.ZodOptional<z.ZodString>;
            rewriteModel: z.ZodOptional<z.ZodString>;
            extractModel: z.ZodOptional<z.ZodString>;
            embeddingModel: z.ZodOptional<z.ZodType<import("../personalization/index.js").EmbeddingModelRef, z.ZodTypeDef, import("../personalization/index.js").EmbeddingModelRef>>;
            similarityThreshold: z.ZodDefault<z.ZodNumber>;
            excludeExternalContext: z.ZodDefault<z.ZodBoolean>;
            maxRecalled: z.ZodDefault<z.ZodNumber>;
            sleepEnabled: z.ZodDefault<z.ZodBoolean>;
            sleepTime: z.ZodDefault<z.ZodString>;
            archiveRetentionDays: z.ZodDefault<z.ZodNumber>;
            temporaryTtl: z.ZodDefault<z.ZodNumber>;
            similarityMergeThreshold: z.ZodDefault<z.ZodNumber>;
            useLlm: z.ZodDefault<z.ZodBoolean>;
            llmMergeLow: z.ZodDefault<z.ZodNumber>;
            llmBatchSize: z.ZodDefault<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        }>, Omit<{
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, "enabled"> & {
            enabled: boolean;
        }, {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        memory: Omit<{
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, "enabled"> & {
            enabled: boolean;
        };
        maxTurnToolResultBytes: number;
        instructionsMaxBytes: number;
        compaction: {
            enabled: boolean;
            maxSummaryTokens: number;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            summaryModel?: string | undefined;
        };
        identity: {
            enabled: boolean;
            userEnabled: boolean;
        };
        maxInputTokens?: number | undefined;
    }, {
        memory?: {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        } | undefined;
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
        identity?: {
            enabled?: boolean | undefined;
            userEnabled?: boolean | undefined;
        } | undefined;
    }>>;
    chat: z.ZodDefault<z.ZodObject<{
        /** Desktop 展示偏好；不改变 Provider 流式协议或已落盘的消息内容。 */
        response: z.ZodOptional<z.ZodObject<{
            streaming: z.ZodOptional<z.ZodBoolean>;
            showTokenUsage: z.ZodOptional<z.ZodBoolean>;
            markdown: z.ZodOptional<z.ZodBoolean>;
            singleDollarMath: z.ZodOptional<z.ZodBoolean>;
            collapseThinking: z.ZodOptional<z.ZodBoolean>;
            openLinksInBrowser: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        }, {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        }>>;
        /** 实验开关：覆盖协议自动选择，让 Read/Edit 使用行哈希。 */
        hashlineEdit: z.ZodOptional<z.ZodBoolean>;
        /** Prompt 缓存标记：按协议给 system 和请求尾部打断言点以命中服务商缓存；严格网关不认时可关闭。 */
        cacheMarkers: z.ZodDefault<z.ZodBoolean>;
        /** 采样温度 0–2；越低越确定，越高越发散。 */
        temperature: z.ZodOptional<z.ZodNumber>;
        /** 单次回复的最大输出 token 数。 */
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        /** 默认把哪些工具暴露给模型；单条消息可在 Composer 中覆盖。 */
        defaultToolSelection: z.ZodDefault<z.ZodEnum<["auto", "all", "none"]>>;
        /** 默认把哪些 Skill 元数据暴露给模型；单条消息可在 Composer 中覆盖。 */
        defaultSkillSelection: z.ZodDefault<z.ZodEnum<["auto", "all", "none"]>>;
        skillExtraction: z.ZodDefault<z.ZodObject<{
            /** 总开关；关闭后成功回合不再触发旁路分析。 */
            enabled: z.ZodDefault<z.ZodBoolean>;
            /** 本回合工具调用数达到阈值才分析，避免普通问答也跑辅助模型。 */
            minToolCalls: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            minToolCalls: number;
        }, {
            enabled?: boolean | undefined;
            minToolCalls?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        cacheMarkers: boolean;
        defaultToolSelection: "none" | "auto" | "all";
        defaultSkillSelection: "none" | "auto" | "all";
        skillExtraction: {
            enabled: boolean;
            minToolCalls: number;
        };
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
    }, {
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        cacheMarkers?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        defaultToolSelection?: "none" | "auto" | "all" | undefined;
        defaultSkillSelection?: "none" | "auto" | "all" | undefined;
        skillExtraction?: {
            enabled?: boolean | undefined;
            minToolCalls?: number | undefined;
        } | undefined;
    }>>;
    diagnostics: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        /** 自动识别项目本地已安装的检查工具（目前是 TypeScript）；只用本地二进制，不联网安装。 */
        autoDetect: z.ZodDefault<z.ZodBoolean>;
        autoDetectTimeoutMs: z.ZodDefault<z.ZodNumber>;
        maxOutputBytes: z.ZodDefault<z.ZodNumber>;
        commands: z.ZodDefault<z.ZodArray<z.ZodObject<{
            extensions: z.ZodArray<z.ZodString, "many">;
            command: z.ZodString;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            command: string;
            extensions: string[];
            timeoutMs: number;
        }, {
            command: string;
            extensions: string[];
            timeoutMs?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        maxOutputBytes: number;
        autoDetect: boolean;
        autoDetectTimeoutMs: number;
        commands: {
            command: string;
            extensions: string[];
            timeoutMs: number;
        }[];
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
    checkpoints: z.ZodDefault<z.ZodObject<{
        /** 每个回合首次改动工作区前自动建一个快照，供 /undo 回退。仅在 git 仓库内生效。 */
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
    }, {
        enabled?: boolean | undefined;
    }>>;
    sandbox: z.ZodDefault<z.ZodObject<{
        /**
         * `workspace-write`：命令仍以当前用户权限运行，但内核层面只允许写工作区、临时目录和常见
         * 缓存目录。这是独立于命令字符串判定的第二道边界。目前只有 macOS 有实现。
         * `off` 仅关闭写入范围限制；permission.denyPaths 和禁网配置仍需系统沙箱强制执行。
         */
        mode: z.ZodDefault<z.ZodEnum<["off", "workspace-write"]>>;
        allowNetwork: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        mode: "off" | "workspace-write";
        allowNetwork: boolean;
    }, {
        mode?: "off" | "workspace-write" | undefined;
        allowNetwork?: boolean | undefined;
    }>>;
    hooks: z.ZodDefault<z.ZodObject<{
        /** 工具执行前触发；非零退出会阻止这次调用。 */
        beforeTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
            command: z.ZodString;
            /** 只对这些工具触发；留空表示全部。 */
            tools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            /** 只对这些扩展名的目标路径触发；留空表示不按扩展名过滤。 */
            extensions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }, {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }>, "many">>;
        /** 工具执行后触发；输出附在结果上，退出码不影响调用结果。 */
        afterTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
            command: z.ZodString;
            /** 只对这些工具触发；留空表示全部。 */
            tools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            /** 只对这些扩展名的目标路径触发；留空表示不按扩展名过滤。 */
            extensions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }, {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        beforeTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
        afterTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
    }, {
        beforeTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
        afterTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
    }>>;
    web: z.ZodDefault<z.ZodObject<{
        search: z.ZodDefault<z.ZodObject<{
            provider: z.ZodDefault<z.ZodEnum<["google", "xiaohongshu"]>>;
            visibleBrowsing: z.ZodDefault<z.ZodBoolean>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
            maxResults: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            provider: "google" | "xiaohongshu";
            timeoutMs: number;
            visibleBrowsing: boolean;
            maxResults: number;
        }, {
            provider?: "google" | "xiaohongshu" | undefined;
            timeoutMs?: number | undefined;
            visibleBrowsing?: boolean | undefined;
            maxResults?: number | undefined;
        }>>;
        fetch: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
            maxBytes: z.ZodDefault<z.ZodNumber>;
            maxRedirects: z.ZodDefault<z.ZodNumber>;
            allowPrivateNetwork: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            timeoutMs: number;
            maxBytes: number;
            maxRedirects: number;
            allowPrivateNetwork: boolean;
        }, {
            enabled?: boolean | undefined;
            timeoutMs?: number | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            allowPrivateNetwork?: boolean | undefined;
        }>>;
        cookies: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            /** jar 文件位置；留空用桌面端 userData 下的共享路径，桌面端与 CLI 因此读到同一份。 */
            path: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            path?: string | undefined;
        }, {
            path?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        search: {
            provider: "google" | "xiaohongshu";
            timeoutMs: number;
            visibleBrowsing: boolean;
            maxResults: number;
        };
        fetch: {
            enabled: boolean;
            timeoutMs: number;
            maxBytes: number;
            maxRedirects: number;
            allowPrivateNetwork: boolean;
        };
        cookies: {
            enabled: boolean;
            path?: string | undefined;
        };
    }, {
        search?: {
            provider?: "google" | "xiaohongshu" | undefined;
            timeoutMs?: number | undefined;
            visibleBrowsing?: boolean | undefined;
            maxResults?: number | undefined;
        } | undefined;
        fetch?: {
            enabled?: boolean | undefined;
            timeoutMs?: number | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            allowPrivateNetwork?: boolean | undefined;
        } | undefined;
        cookies?: {
            path?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    }>>;
    telemetry: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        recordInputs: z.ZodDefault<z.ZodBoolean>;
        recordOutputs: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        recordInputs: boolean;
        recordOutputs: boolean;
    }, {
        enabled?: boolean | undefined;
        recordInputs?: boolean | undefined;
        recordOutputs?: boolean | undefined;
    }>>;
    extensions: z.ZodDefault<z.ZodObject<{
        mcp: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodObject<{
            exposure: z.ZodOptional<z.ZodEnum<["direct", "codemode", "deferred", "hidden"]>>;
            toolExposure: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<["direct", "codemode", "deferred", "hidden"]>>>;
            /** 按服务端原始工具名显式启用固定契约，不依据远端 annotations 自动启用。 */
            toolContracts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodLiteral<"file-change-v1">>>;
            /** 用于凭据 account 稳定关联；旧配置没有该字段时在下一次桌面保存时补齐。 */
            id: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<["stdio", "http"]>>;
            /** Remote 新配置可显式选择协议；缺省时保留 streamable HTTP -> SSE 回退。 */
            transportProtocol: z.ZodOptional<z.ZodEnum<["streamable-http", "sse"]>>;
            command: z.ZodOptional<z.ZodString>;
            args: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            /** env/header 的值保存在 Keychain；这里仅保存 account 引用。 */
            credentialRefs: z.ZodOptional<z.ZodObject<{
                env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            }, {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            }>>;
            cwd: z.ZodOptional<z.ZodString>;
            stderr: z.ZodDefault<z.ZodEnum<["ignore", "inherit", "pipe"]>>;
            url: z.ZodOptional<z.ZodString>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            oauth: z.ZodOptional<z.ZodObject<{
                clientId: z.ZodOptional<z.ZodString>;
                scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                redirectPort: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            }, {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            }>>;
            startupTimeoutMs: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            enabled: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }>, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }>>>;
        skills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        skillDefaults: z.ZodDefault<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodBoolean>, Record<string, boolean>, Record<string, boolean>>>;
        skillProjectOverrides: z.ZodDefault<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodBoolean>, Record<string, boolean>, Record<string, boolean>>>, Record<string, Record<string, boolean>>, Record<string, Record<string, boolean>>>>;
        plugins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        /** 全局配置目录下的 Plugin 路径；只允许在 ~/.config/biny/plugins 内解析。 */
        globalPlugins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        subagent: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            maxSteps: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodDefault<z.ZodNumber>;
            maxConcurrentSubagents: z.ZodDefault<z.ZodNumber>;
            maxPendingSubagents: z.ZodDefault<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            inactivityTimeoutMs: z.ZodDefault<z.ZodNumber>;
            model: z.ZodOptional<z.ZodString>;
            maxCostUsd: z.ZodOptional<z.ZodNumber>;
            allowedTools: z.ZodDefault<z.ZodArray<z.ZodEnum<["Read", "Glob", "Grep", "Write", "Edit", "Bash"]>, "many">>;
            agentPaths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            maxOutputTokens: number;
            maxConcurrentSubagents: number;
            maxPendingSubagents: number;
            inactivityTimeoutMs: number;
            allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
            agentPaths: string[];
            model?: string | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxCostUsd?: number | undefined;
        }, {
            model?: string | undefined;
            enabled?: boolean | undefined;
            maxOutputTokens?: number | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxConcurrentSubagents?: number | undefined;
            maxPendingSubagents?: number | undefined;
            inactivityTimeoutMs?: number | undefined;
            maxCostUsd?: number | undefined;
            allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
            agentPaths?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        mcp: Record<string, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }>;
        skills: string[];
        plugins: string[];
        subagent: {
            enabled: boolean;
            maxOutputTokens: number;
            maxConcurrentSubagents: number;
            maxPendingSubagents: number;
            inactivityTimeoutMs: number;
            allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
            agentPaths: string[];
            model?: string | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxCostUsd?: number | undefined;
        };
        skillDefaults: Record<string, boolean>;
        skillProjectOverrides: Record<string, Record<string, boolean>>;
        globalPlugins: string[];
    }, {
        mcp?: Record<string, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }> | undefined;
        skills?: string[] | undefined;
        plugins?: string[] | undefined;
        subagent?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            maxOutputTokens?: number | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxConcurrentSubagents?: number | undefined;
            maxPendingSubagents?: number | undefined;
            inactivityTimeoutMs?: number | undefined;
            maxCostUsd?: number | undefined;
            allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
            agentPaths?: string[] | undefined;
        } | undefined;
        skillDefaults?: Record<string, boolean> | undefined;
        skillProjectOverrides?: Record<string, Record<string, boolean>> | undefined;
        globalPlugins?: string[] | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    format: "biny-config";
    permission: {
        mode: "auto" | "ask" | "read-only" | "full-access";
        allowTools: string[];
        allowPaths: string[];
        denyPaths: string[];
        criticalAlwaysAsk: boolean;
    };
    models: Record<string, {
        model: string;
        provider: string;
        reasoning?: {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>;
    providers: Record<string, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>;
    chat: {
        cacheMarkers: boolean;
        defaultToolSelection: "none" | "auto" | "all";
        defaultSkillSelection: "none" | "auto" | "all";
        skillExtraction: {
            enabled: boolean;
            minToolCalls: number;
        };
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
    };
    workspace: {
        ignore: string[];
    };
    activity: {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    };
    extensions: {
        mcp: Record<string, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }>;
        skills: string[];
        plugins: string[];
        subagent: {
            enabled: boolean;
            maxOutputTokens: number;
            maxConcurrentSubagents: number;
            maxPendingSubagents: number;
            inactivityTimeoutMs: number;
            allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
            agentPaths: string[];
            model?: string | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxCostUsd?: number | undefined;
        };
        skillDefaults: Record<string, boolean>;
        skillProjectOverrides: Record<string, Record<string, boolean>>;
        globalPlugins: string[];
    };
    agent: {
        toolExecutionMode: "direct" | "code_mode";
        softStepLimit: number;
        hardStepLimit: number;
        maxRepeatedActions: number;
        maxConcurrentTools: number;
        maxQueuedToolCalls: number;
        maxToolCalls?: number | undefined;
    };
    configVersion: 2;
    web: {
        search: {
            provider: "google" | "xiaohongshu";
            timeoutMs: number;
            visibleBrowsing: boolean;
            maxResults: number;
        };
        fetch: {
            enabled: boolean;
            timeoutMs: number;
            maxBytes: number;
            maxRedirects: number;
            allowPrivateNetwork: boolean;
        };
        cookies: {
            enabled: boolean;
            path?: string | undefined;
        };
    };
    context: {
        memory: Omit<{
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, "enabled"> & {
            enabled: boolean;
        };
        maxTurnToolResultBytes: number;
        instructionsMaxBytes: number;
        compaction: {
            enabled: boolean;
            maxSummaryTokens: number;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            summaryModel?: string | undefined;
        };
        identity: {
            enabled: boolean;
            userEnabled: boolean;
        };
        maxInputTokens?: number | undefined;
    };
    needsEmbeddingRebuild: boolean;
    defaultModel: string;
    thinking: {
        enabled: boolean;
        effort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
    };
    heartbeat: {
        enabled: boolean;
        intervalMinutes: number;
        activeHoursStart: number;
        activeHoursEnd: number;
    };
    appshots: {
        target: "current" | "new";
        hotkey: string;
    };
    computer: {
        enabled: boolean;
        previewEnabled: boolean;
        actionLogging: boolean;
        strictApproval: boolean;
        apps: {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }[];
    };
    crystal: {
        passiveEnabled: boolean;
        semanticScanEnabled: boolean;
        contour: {
            count: number;
            turns: number;
            spread: number;
        };
        nucleus: {
            count: number;
            turns: number;
            spread: number;
        };
        dormantDays: number;
    };
    diagnostics: {
        enabled: boolean;
        maxOutputBytes: number;
        autoDetect: boolean;
        autoDetectTimeoutMs: number;
        commands: {
            command: string;
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    checkpoints: {
        enabled: boolean;
    };
    sandbox: {
        mode: "off" | "workspace-write";
        allowNetwork: boolean;
    };
    hooks: {
        beforeTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
        afterTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    telemetry: {
        enabled: boolean;
        recordInputs: boolean;
        recordOutputs: boolean;
    };
    toolModel?: string | undefined;
    credentialRevisions?: Record<string, string> | undefined;
}, {
    format: "biny-config";
    models: Record<string, {
        model: string;
        provider: string;
        reasoning?: {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>;
    providers: Record<string, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>;
    workspace: {
        ignore: string[];
    };
    configVersion: 2;
    defaultModel: string;
    permission?: {
        mode?: "auto" | "ask" | "read-only" | "full-access" | undefined;
        allowTools?: string[] | undefined;
        allowPaths?: string[] | undefined;
        denyPaths?: string[] | undefined;
        criticalAlwaysAsk?: boolean | undefined;
    } | undefined;
    chat?: {
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        cacheMarkers?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        defaultToolSelection?: "none" | "auto" | "all" | undefined;
        defaultSkillSelection?: "none" | "auto" | "all" | undefined;
        skillExtraction?: {
            enabled?: boolean | undefined;
            minToolCalls?: number | undefined;
        } | undefined;
    } | undefined;
    activity?: unknown;
    extensions?: {
        mcp?: Record<string, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }> | undefined;
        skills?: string[] | undefined;
        plugins?: string[] | undefined;
        subagent?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            maxOutputTokens?: number | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxConcurrentSubagents?: number | undefined;
            maxPendingSubagents?: number | undefined;
            inactivityTimeoutMs?: number | undefined;
            maxCostUsd?: number | undefined;
            allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
            agentPaths?: string[] | undefined;
        } | undefined;
        skillDefaults?: Record<string, boolean> | undefined;
        skillProjectOverrides?: Record<string, Record<string, boolean>> | undefined;
        globalPlugins?: string[] | undefined;
    } | undefined;
    agent?: {
        toolExecutionMode?: "direct" | "code_mode" | undefined;
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    } | undefined;
    web?: {
        search?: {
            provider?: "google" | "xiaohongshu" | undefined;
            timeoutMs?: number | undefined;
            visibleBrowsing?: boolean | undefined;
            maxResults?: number | undefined;
        } | undefined;
        fetch?: {
            enabled?: boolean | undefined;
            timeoutMs?: number | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            allowPrivateNetwork?: boolean | undefined;
        } | undefined;
        cookies?: {
            path?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    context?: {
        memory?: {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        } | undefined;
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
        identity?: {
            enabled?: boolean | undefined;
            userEnabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    needsEmbeddingRebuild?: boolean | undefined;
    toolModel?: string | undefined;
    credentialRevisions?: Record<string, string> | undefined;
    thinking?: {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    } | undefined;
    heartbeat?: {
        enabled?: boolean | undefined;
        intervalMinutes?: number | undefined;
        activeHoursStart?: number | undefined;
        activeHoursEnd?: number | undefined;
    } | undefined;
    appshots?: {
        target?: "current" | "new" | undefined;
        hotkey?: string | undefined;
    } | undefined;
    computer?: {
        enabled?: boolean | undefined;
        previewEnabled?: boolean | undefined;
        actionLogging?: boolean | undefined;
        strictApproval?: boolean | undefined;
        apps?: {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }[] | undefined;
    } | undefined;
    crystal?: {
        passiveEnabled?: boolean | undefined;
        semanticScanEnabled?: boolean | undefined;
        contour?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        nucleus?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        dormantDays?: number | undefined;
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
    hooks?: {
        beforeTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
        afterTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
    } | undefined;
    telemetry?: {
        enabled?: boolean | undefined;
        recordInputs?: boolean | undefined;
        recordOutputs?: boolean | undefined;
    } | undefined;
}>, {
    format: "biny-config";
    permission: {
        mode: "auto" | "ask" | "read-only" | "full-access";
        allowTools: string[];
        allowPaths: string[];
        denyPaths: string[];
        criticalAlwaysAsk: boolean;
    };
    models: Record<string, {
        model: string;
        provider: string;
        reasoning?: {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>;
    providers: Record<string, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>;
    chat: {
        cacheMarkers: boolean;
        defaultToolSelection: "none" | "auto" | "all";
        defaultSkillSelection: "none" | "auto" | "all";
        skillExtraction: {
            enabled: boolean;
            minToolCalls: number;
        };
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
    };
    workspace: {
        ignore: string[];
    };
    activity: {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    };
    extensions: {
        mcp: Record<string, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }>;
        skills: string[];
        plugins: string[];
        subagent: {
            enabled: boolean;
            maxOutputTokens: number;
            maxConcurrentSubagents: number;
            maxPendingSubagents: number;
            inactivityTimeoutMs: number;
            allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
            agentPaths: string[];
            model?: string | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxCostUsd?: number | undefined;
        };
        skillDefaults: Record<string, boolean>;
        skillProjectOverrides: Record<string, Record<string, boolean>>;
        globalPlugins: string[];
    };
    agent: {
        toolExecutionMode: "direct" | "code_mode";
        softStepLimit: number;
        hardStepLimit: number;
        maxRepeatedActions: number;
        maxConcurrentTools: number;
        maxQueuedToolCalls: number;
        maxToolCalls?: number | undefined;
    };
    configVersion: 2;
    web: {
        search: {
            provider: "google" | "xiaohongshu";
            timeoutMs: number;
            visibleBrowsing: boolean;
            maxResults: number;
        };
        fetch: {
            enabled: boolean;
            timeoutMs: number;
            maxBytes: number;
            maxRedirects: number;
            allowPrivateNetwork: boolean;
        };
        cookies: {
            enabled: boolean;
            path?: string | undefined;
        };
    };
    context: {
        memory: Omit<{
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, "enabled"> & {
            enabled: boolean;
        };
        maxTurnToolResultBytes: number;
        instructionsMaxBytes: number;
        compaction: {
            enabled: boolean;
            maxSummaryTokens: number;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            summaryModel?: string | undefined;
        };
        identity: {
            enabled: boolean;
            userEnabled: boolean;
        };
        maxInputTokens?: number | undefined;
    };
    needsEmbeddingRebuild: boolean;
    defaultModel: string;
    thinking: {
        enabled: boolean;
        effort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
    };
    heartbeat: {
        enabled: boolean;
        intervalMinutes: number;
        activeHoursStart: number;
        activeHoursEnd: number;
    };
    appshots: {
        target: "current" | "new";
        hotkey: string;
    };
    computer: {
        enabled: boolean;
        previewEnabled: boolean;
        actionLogging: boolean;
        strictApproval: boolean;
        apps: {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }[];
    };
    crystal: {
        passiveEnabled: boolean;
        semanticScanEnabled: boolean;
        contour: {
            count: number;
            turns: number;
            spread: number;
        };
        nucleus: {
            count: number;
            turns: number;
            spread: number;
        };
        dormantDays: number;
    };
    diagnostics: {
        enabled: boolean;
        maxOutputBytes: number;
        autoDetect: boolean;
        autoDetectTimeoutMs: number;
        commands: {
            command: string;
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    checkpoints: {
        enabled: boolean;
    };
    sandbox: {
        mode: "off" | "workspace-write";
        allowNetwork: boolean;
    };
    hooks: {
        beforeTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
        afterTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    telemetry: {
        enabled: boolean;
        recordInputs: boolean;
        recordOutputs: boolean;
    };
    toolModel?: string | undefined;
    credentialRevisions?: Record<string, string> | undefined;
}, {
    format: "biny-config";
    models: Record<string, {
        model: string;
        provider: string;
        reasoning?: {
            efforts?: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[] | undefined;
            defaultEffort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>;
    providers: Record<string, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts?: number | undefined;
            initialDelayMs?: number | undefined;
            maxDelayMs?: number | undefined;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            promptTimeoutMs?: number | undefined;
            maxOutputBytes?: number | undefined;
            allowMemory?: boolean | undefined;
            authMethodId?: string | undefined;
            modeId?: string | undefined;
            mcpServers?: string[] | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>;
    workspace: {
        ignore: string[];
    };
    configVersion: 2;
    defaultModel: string;
    permission?: {
        mode?: "auto" | "ask" | "read-only" | "full-access" | undefined;
        allowTools?: string[] | undefined;
        allowPaths?: string[] | undefined;
        denyPaths?: string[] | undefined;
        criticalAlwaysAsk?: boolean | undefined;
    } | undefined;
    chat?: {
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        cacheMarkers?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        defaultToolSelection?: "none" | "auto" | "all" | undefined;
        defaultSkillSelection?: "none" | "auto" | "all" | undefined;
        skillExtraction?: {
            enabled?: boolean | undefined;
            minToolCalls?: number | undefined;
        } | undefined;
    } | undefined;
    activity?: unknown;
    extensions?: {
        mcp?: Record<string, {
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            enabled?: boolean | undefined;
            args?: string[] | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            stderr?: "inherit" | "ignore" | "pipe" | undefined;
            startupTimeoutMs?: number | undefined;
        }> | undefined;
        skills?: string[] | undefined;
        plugins?: string[] | undefined;
        subagent?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            maxOutputTokens?: number | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxConcurrentSubagents?: number | undefined;
            maxPendingSubagents?: number | undefined;
            inactivityTimeoutMs?: number | undefined;
            maxCostUsd?: number | undefined;
            allowedTools?: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[] | undefined;
            agentPaths?: string[] | undefined;
        } | undefined;
        skillDefaults?: Record<string, boolean> | undefined;
        skillProjectOverrides?: Record<string, Record<string, boolean>> | undefined;
        globalPlugins?: string[] | undefined;
    } | undefined;
    agent?: {
        toolExecutionMode?: "direct" | "code_mode" | undefined;
        softStepLimit?: number | undefined;
        hardStepLimit?: number | undefined;
        maxToolCalls?: number | undefined;
        maxRepeatedActions?: number | undefined;
        maxConcurrentTools?: number | undefined;
        maxQueuedToolCalls?: number | undefined;
    } | undefined;
    web?: {
        search?: {
            provider?: "google" | "xiaohongshu" | undefined;
            timeoutMs?: number | undefined;
            visibleBrowsing?: boolean | undefined;
            maxResults?: number | undefined;
        } | undefined;
        fetch?: {
            enabled?: boolean | undefined;
            timeoutMs?: number | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            allowPrivateNetwork?: boolean | undefined;
        } | undefined;
        cookies?: {
            path?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    context?: {
        memory?: {
            enabled?: boolean | undefined;
            useMemories?: boolean | undefined;
            generateMemories?: boolean | undefined;
            queryRewrite?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
            similarityThreshold?: number | undefined;
            excludeExternalContext?: boolean | undefined;
            maxRecalled?: number | undefined;
            sleepEnabled?: boolean | undefined;
            sleepTime?: string | undefined;
            archiveRetentionDays?: number | undefined;
            temporaryTtl?: number | undefined;
            similarityMergeThreshold?: number | undefined;
            useLlm?: boolean | undefined;
            llmMergeLow?: number | undefined;
            llmBatchSize?: number | undefined;
        } | undefined;
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
        identity?: {
            enabled?: boolean | undefined;
            userEnabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    needsEmbeddingRebuild?: boolean | undefined;
    toolModel?: string | undefined;
    credentialRevisions?: Record<string, string> | undefined;
    thinking?: {
        enabled?: boolean | undefined;
        effort?: "max" | "low" | "medium" | "high" | "minimal" | "xhigh" | undefined;
    } | undefined;
    heartbeat?: {
        enabled?: boolean | undefined;
        intervalMinutes?: number | undefined;
        activeHoursStart?: number | undefined;
        activeHoursEnd?: number | undefined;
    } | undefined;
    appshots?: {
        target?: "current" | "new" | undefined;
        hotkey?: string | undefined;
    } | undefined;
    computer?: {
        enabled?: boolean | undefined;
        previewEnabled?: boolean | undefined;
        actionLogging?: boolean | undefined;
        strictApproval?: boolean | undefined;
        apps?: {
            bundleId: string;
            appName: string;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
            useCount?: number | undefined;
        }[] | undefined;
    } | undefined;
    crystal?: {
        passiveEnabled?: boolean | undefined;
        semanticScanEnabled?: boolean | undefined;
        contour?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        nucleus?: {
            count: number;
            turns: number;
            spread: number;
        } | undefined;
        dormantDays?: number | undefined;
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
    hooks?: {
        beforeTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
        afterTool?: {
            command: string;
            tools?: string[] | undefined;
            extensions?: string[] | undefined;
            timeoutMs?: number | undefined;
        }[] | undefined;
    } | undefined;
    telemetry?: {
        enabled?: boolean | undefined;
        recordInputs?: boolean | undefined;
        recordOutputs?: boolean | undefined;
    } | undefined;
}>, {
    format: "biny-config";
    permission: {
        mode: "auto" | "ask" | "read-only" | "full-access";
        allowTools: string[];
        allowPaths: string[];
        denyPaths: string[];
        criticalAlwaysAsk: boolean;
    };
    models: Record<string, {
        model: string;
        provider: string;
        reasoning?: {
            efforts: ("max" | "low" | "medium" | "high" | "minimal" | "xhigh")[];
            defaultEffort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
            mapping?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", string>> | undefined;
            budgetTokens?: Partial<Record<"max" | "low" | "medium" | "high" | "minimal" | "xhigh", number>> | undefined;
        } | undefined;
        displayName?: string | undefined;
        maxOutputTokens?: number | undefined;
        maxInputTokens?: number | undefined;
        capabilities?: {
            audio?: boolean | undefined;
            reasoning?: boolean | undefined;
            tools?: boolean | undefined;
            streaming?: boolean | undefined;
            parallelToolCalls?: boolean | undefined;
            reasoningStream?: boolean | undefined;
            reasoningSummary?: boolean | undefined;
            vision?: boolean | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        thinkingLevelMap?: Record<string, string | null> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        dataResidency?: "external" | "local" | undefined;
        description?: string | undefined;
        supportsTools?: boolean | undefined;
        limits?: {
            maxInputTokens?: number | undefined;
            reasoningReserveTokens?: number | undefined;
            toolSchemaReserveTokens?: number | undefined;
            systemPromptReserveTokens?: number | undefined;
            protocolSafetyMarginTokens?: number | undefined;
        } | undefined;
        pricing?: {
            inputPerMillionTokens?: number | undefined;
            outputPerMillionTokens?: number | undefined;
            cacheReadPerMillionTokens?: number | undefined;
            cacheWritePerMillionTokens?: number | undefined;
        } | undefined;
    }>;
    providers: Record<string, {
        type: string;
        displayName?: string | undefined;
        retry?: {
            maxAttempts: number;
            initialDelayMs: number;
            maxDelayMs: number;
        } | undefined;
        apiKeyEnv?: string | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        acp?: {
            command: string;
            args: string[];
            env: Record<string, string>;
            promptTimeoutMs: number;
            maxOutputBytes: number;
            allowMemory: boolean;
            mcpServers: string[];
            authMethodId?: string | undefined;
            modeId?: string | undefined;
        } | undefined;
        icon?: string | undefined;
        protocol?: "anthropic" | "openai-compatible" | undefined;
        baseUrl?: string | undefined;
        requiresApiKey?: boolean | undefined;
        modelsRequiresApiKey?: boolean | undefined;
        authMode?: "api-key" | "oauth-bearer" | undefined;
        oauth?: {
            provider: string;
            expiresAt: number;
            refreshToken?: string | undefined;
            accountId?: string | undefined;
        } | undefined;
        timeoutMs?: number | undefined;
        modelsEndpoint?: string | undefined;
        headers?: Record<string, string> | undefined;
        apiBackend?: string | undefined;
        compatibility?: {
            supportsDeveloperRole?: boolean | undefined;
            supportsReasoning?: boolean | undefined;
            supportsVision?: boolean | undefined;
            maxTokensField?: "max_tokens" | "max_completion_tokens" | undefined;
        } | undefined;
        applyPatchProtocol?: "off" | "openai-structured" | undefined;
        modelProfiles?: Record<string, {
            maxOutputTokens?: number | undefined;
            maxInputTokens?: number | undefined;
            capabilities?: {
                audio?: boolean | undefined;
                reasoning?: boolean | undefined;
                tools?: boolean | undefined;
                streaming?: boolean | undefined;
                parallelToolCalls?: boolean | undefined;
                reasoningStream?: boolean | undefined;
                reasoningSummary?: boolean | undefined;
                vision?: boolean | undefined;
            } | undefined;
            showInPicker?: boolean | undefined;
            contextWindow?: number | undefined;
            thinkingLevelMap?: Record<string, string | null> | undefined;
        }> | undefined;
        dataResidency?: "external" | "local" | undefined;
        embeddingModels?: {
            id: string;
            displayName: string;
            dimensions?: number | undefined;
            recommendedThreshold?: number | undefined;
        }[] | undefined;
    }>;
    chat: {
        cacheMarkers: boolean;
        defaultToolSelection: "none" | "auto" | "all";
        defaultSkillSelection: "none" | "auto" | "all";
        skillExtraction: {
            enabled: boolean;
            minToolCalls: number;
        };
        response?: {
            streaming?: boolean | undefined;
            showTokenUsage?: boolean | undefined;
            markdown?: boolean | undefined;
            singleDollarMath?: boolean | undefined;
            collapseThinking?: boolean | undefined;
            openLinksInBrowser?: boolean | undefined;
        } | undefined;
        hashlineEdit?: boolean | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
    };
    workspace: {
        ignore: string[];
    };
    activity: {
        enabled: boolean;
        captureDebounceMs: number;
        heartbeatMs: number;
        idleTimeoutMs: number;
        inputPauseMs: number;
        visualPollMs: number;
        browserPollIntervalMs: number;
        jpegQuality: number;
        histogramChangeThreshold: number;
        pixelDiffThreshold: number;
        pixelTolerance: number;
        ocrEnabled: boolean;
        inputMonitoringEnabled: boolean;
        ocrLanguages: string[];
        ocrEveryNFrames: number;
        sensitiveApplications: string[];
        maxStorageMb: number;
        outputDirectory: string;
    };
    extensions: {
        mcp: Record<string, {
            enabled: boolean;
            args: string[];
            stderr: "inherit" | "ignore" | "pipe";
            id?: string | undefined;
            type?: "stdio" | "http" | undefined;
            command?: string | undefined;
            url?: string | undefined;
            env?: Record<string, string> | undefined;
            oauth?: {
                clientId?: string | undefined;
                scopes?: string[] | undefined;
                redirectPort?: number | undefined;
            } | undefined;
            timeoutMs?: number | undefined;
            headers?: Record<string, string> | undefined;
            exposure?: "hidden" | "direct" | "codemode" | "deferred" | undefined;
            toolExposure?: Record<string, "hidden" | "direct" | "codemode" | "deferred"> | undefined;
            toolContracts?: Record<string, "file-change-v1"> | undefined;
            description?: string | undefined;
            transportProtocol?: "streamable-http" | "sse" | undefined;
            credentialRefs?: {
                env?: Record<string, string> | undefined;
                headers?: Record<string, string> | undefined;
            } | undefined;
            cwd?: string | undefined;
            startupTimeoutMs?: number | undefined;
        }>;
        skills: string[];
        plugins: string[];
        subagent: {
            enabled: boolean;
            maxOutputTokens: number;
            maxConcurrentSubagents: number;
            maxPendingSubagents: number;
            inactivityTimeoutMs: number;
            allowedTools: ("Bash" | "Read" | "Glob" | "Grep" | "Write" | "Edit")[];
            agentPaths: string[];
            model?: string | undefined;
            timeoutMs?: number | undefined;
            maxSteps?: number | undefined;
            maxCostUsd?: number | undefined;
        };
        skillDefaults: Record<string, boolean>;
        skillProjectOverrides: Record<string, Record<string, boolean>>;
        globalPlugins: string[];
    };
    agent: {
        toolExecutionMode: "direct" | "code_mode";
        softStepLimit: number;
        hardStepLimit: number;
        maxRepeatedActions: number;
        maxConcurrentTools: number;
        maxQueuedToolCalls: number;
        maxToolCalls?: number | undefined;
    };
    configVersion: 2;
    web: {
        search: {
            provider: "google" | "xiaohongshu";
            timeoutMs: number;
            visibleBrowsing: boolean;
            maxResults: number;
        };
        fetch: {
            enabled: boolean;
            timeoutMs: number;
            maxBytes: number;
            maxRedirects: number;
            allowPrivateNetwork: boolean;
        };
        cookies: {
            enabled: boolean;
            path?: string | undefined;
        };
    };
    context: {
        memory: Omit<{
            useMemories: boolean;
            generateMemories: boolean;
            queryRewrite: boolean;
            similarityThreshold: number;
            excludeExternalContext: boolean;
            maxRecalled: number;
            sleepEnabled: boolean;
            sleepTime: string;
            archiveRetentionDays: number;
            temporaryTtl: number;
            similarityMergeThreshold: number;
            useLlm: boolean;
            llmMergeLow: number;
            llmBatchSize: number;
            enabled?: boolean | undefined;
            memoryModel?: string | undefined;
            rewriteModel?: string | undefined;
            extractModel?: string | undefined;
            embeddingModel?: import("../personalization/index.js").EmbeddingModelRef | undefined;
        }, "enabled"> & {
            enabled: boolean;
        };
        maxTurnToolResultBytes: number;
        instructionsMaxBytes: number;
        compaction: {
            enabled: boolean;
            maxSummaryTokens: number;
            reserveTokens?: number | undefined;
            triggerPercent?: number | undefined;
            keepRecentTokens?: number | undefined;
            keepRecentMessages?: number | undefined;
            summaryModel?: string | undefined;
        };
        identity: {
            enabled: boolean;
            userEnabled: boolean;
        };
        maxInputTokens?: number | undefined;
    };
    needsEmbeddingRebuild: boolean;
    defaultModel: string;
    thinking: {
        enabled: boolean;
        effort: "max" | "low" | "medium" | "high" | "minimal" | "xhigh";
    };
    heartbeat: {
        enabled: boolean;
        intervalMinutes: number;
        activeHoursStart: number;
        activeHoursEnd: number;
    };
    appshots: {
        target: "current" | "new";
        hotkey: string;
    };
    computer: {
        enabled: boolean;
        previewEnabled: boolean;
        actionLogging: boolean;
        strictApproval: boolean;
        apps: {
            bundleId: string;
            appName: string;
            useCount: number;
            approvedAt?: string | undefined;
            revokedAt?: string | undefined;
            lastUsedAt?: string | undefined;
        }[];
    };
    crystal: {
        passiveEnabled: boolean;
        semanticScanEnabled: boolean;
        contour: {
            count: number;
            turns: number;
            spread: number;
        };
        nucleus: {
            count: number;
            turns: number;
            spread: number;
        };
        dormantDays: number;
    };
    diagnostics: {
        enabled: boolean;
        maxOutputBytes: number;
        autoDetect: boolean;
        autoDetectTimeoutMs: number;
        commands: {
            command: string;
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    checkpoints: {
        enabled: boolean;
    };
    sandbox: {
        mode: "off" | "workspace-write";
        allowNetwork: boolean;
    };
    hooks: {
        beforeTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
        afterTool: {
            command: string;
            tools: string[];
            extensions: string[];
            timeoutMs: number;
        }[];
    };
    telemetry: {
        enabled: boolean;
        recordInputs: boolean;
        recordOutputs: boolean;
    };
    toolModel?: string | undefined;
    credentialRevisions?: Record<string, string> | undefined;
}, unknown>;
export type AgentConfig = z.infer<typeof canonicalConfigSchema>;
export type HeartbeatConfig = AgentConfig["heartbeat"];
export type CompactionConfig = AgentConfig["context"]["compaction"];
export type ChatParamsConfig = AgentConfig["chat"];
export type ModelProvider = z.infer<typeof modelProviderSchema>;
export type ProviderConfig = z.infer<typeof providerConfigSchema>;
export type ModelProfile = z.infer<typeof modelProfileSchema>;
export type ProviderEmbeddingModelConfig = z.infer<typeof providerEmbeddingModelSchema>;
export type ModelAliasConfig = z.infer<typeof modelAliasSchema>;
export type ReasoningEffort = z.infer<typeof reasoningEffortSchema>;
export type ThinkingLevel = z.infer<typeof thinkingLevelSchema>;
export type ThinkingLevelMap = z.infer<typeof thinkingLevelMapSchema>;
export type ModelApiBackend = z.infer<typeof modelApiBackendSchema>;
export type ModelCompatibility = z.infer<typeof modelCompatibilitySchema>;
export type ModelThinkingConfig = z.infer<typeof modelThinkingSchema>;
export type ModelReasoningConfig = z.infer<typeof thinkingSchema>;
export type ModelPricing = z.infer<typeof modelPricingSchema>;
export type ModelLimits = z.infer<typeof modelLimitsSchema>;
export type McpServerConfig = z.infer<typeof mcpServerSchema>;
export type ExtensionsConfig = z.infer<typeof extensionsSchema>;
export type HookConfig = z.infer<typeof hookSchema>;
export type HooksConfig = z.infer<typeof hooksSchema>;
export type SandboxConfig = z.infer<typeof sandboxSchema>;
export type CheckpointsConfig = z.infer<typeof checkpointsSchema>;
export type DiagnosticsConfig = z.infer<typeof diagnosticsSchema>;
export type WebFetchConfig = z.infer<typeof webFetchSchema>;
export type WebSearchConfig = z.infer<typeof webSearchSchema>;
export type WebCookiesConfig = z.infer<typeof webCookiesSchema>;
export type WebConfig = z.infer<typeof webSchema>;
export type { ActivityDataResidency, ActivitySettings, MemoryPolicy };
export declare const defaultConfig: AgentConfig;
/** 目录仍可能返回已下线模型，但它们不应进入普通模型选择器。 */
export declare function isRemovedModelId(modelId: string): boolean;
