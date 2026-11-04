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
    triggerPercent: z.ZodOptional<z.ZodNumber>;
    keepRecentTokens: z.ZodOptional<z.ZodNumber>;
    keepRecentMessages: z.ZodOptional<z.ZodNumber>;
    maxSummaryTokens: z.ZodDefault<z.ZodNumber>;
    summaryModel: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
/** 回合后自动技能提取（自进化）：analyst→author 两步辅助模型，写入受管全局技能根。 */
export declare const skillExtractionSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    minToolCalls: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>>;
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
}, z.core.$strict>;
export type ChatResponseSettings = z.infer<typeof chatResponseSettingsSchema>;
export declare const chatParamsSchema: z.ZodPrefault<z.ZodObject<{
    response: z.ZodOptional<z.ZodObject<{
        streaming: z.ZodOptional<z.ZodBoolean>;
        showTokenUsage: z.ZodOptional<z.ZodBoolean>;
        markdown: z.ZodOptional<z.ZodBoolean>;
        singleDollarMath: z.ZodOptional<z.ZodBoolean>;
        collapseThinking: z.ZodOptional<z.ZodBoolean>;
        openLinksInBrowser: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    hashlineEdit: z.ZodOptional<z.ZodBoolean>;
    cacheMarkers: z.ZodDefault<z.ZodBoolean>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    defaultToolSelection: z.ZodDefault<z.ZodEnum<{
        all: "all";
        auto: "auto";
        none: "none";
    }>>;
    defaultSkillSelection: z.ZodDefault<z.ZodEnum<{
        all: "all";
        auto: "auto";
        none: "none";
    }>>;
    skillExtraction: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        minToolCalls: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>>;
declare const identityPolicySchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    userEnabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>>;
export type IdentityPolicy = z.infer<typeof identityPolicySchema>;
/**
 * Heartbeat 后台巡检的开关与节奏。默认关闭；默认每 30 分钟执行一次，活动时段为 8–23 点。
 * timezone 可选，省略时使用运行机器的本地时区。未知键直接剥离，旧配置仍可安全读取。
 */
export declare const heartbeatConfigSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    intervalMinutes: z.ZodDefault<z.ZodNumber>;
    activeHoursStart: z.ZodDefault<z.ZodNumber>;
    activeHoursEnd: z.ZodDefault<z.ZodNumber>;
    timezone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
/** Provider 与 API ID 是扩展点，内置值只提供默认实现，不限制插件注册的新类型。 */
export declare const modelProviderSchema: z.ZodString;
export declare const providerProtocolSchema: z.ZodEnum<{
    anthropic: "anthropic";
    "openai-compatible": "openai-compatible";
}>;
export declare const reasoningEffortSchema: z.ZodEnum<{
    minimal: "minimal";
    low: "low";
    medium: "medium";
    high: "high";
    xhigh: "xhigh";
    max: "max";
}>;
export declare const thinkingLevelSchema: z.ZodEnum<{
    minimal: "minimal";
    low: "low";
    medium: "medium";
    high: "high";
    xhigh: "xhigh";
    max: "max";
    off: "off";
}>;
export declare const modelApiBackendSchema: z.ZodString;
export declare const modelCompatibilitySchema: z.ZodObject<{
    supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
    supportsReasoning: z.ZodOptional<z.ZodBoolean>;
    supportsVision: z.ZodOptional<z.ZodBoolean>;
    maxTokensField: z.ZodOptional<z.ZodEnum<{
        max_tokens: "max_tokens";
        max_completion_tokens: "max_completion_tokens";
    }>>;
}, z.core.$strip>;
export declare const thinkingLevelMapSchema: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>;
export declare const modelProfileSchema: z.ZodObject<{
    capabilities: z.ZodOptional<z.ZodObject<{
        tools: z.ZodOptional<z.ZodBoolean>;
        parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
        reasoning: z.ZodOptional<z.ZodBoolean>;
        reasoningStream: z.ZodOptional<z.ZodBoolean>;
        reasoningSummary: z.ZodOptional<z.ZodBoolean>;
        vision: z.ZodOptional<z.ZodBoolean>;
        audio: z.ZodOptional<z.ZodBoolean>;
        streaming: z.ZodOptional<z.ZodBoolean>;
        serviceTiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            priority: "priority";
        }>>>;
    }, z.core.$strip>>;
    showInPicker: z.ZodOptional<z.ZodBoolean>;
    contextWindow: z.ZodOptional<z.ZodNumber>;
    maxInputTokens: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    thinkingLevelMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
}, z.core.$strict>;
declare const thinkingSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    effort: z.ZodDefault<z.ZodEnum<{
        minimal: "minimal";
        low: "low";
        medium: "medium";
        high: "high";
        xhigh: "xhigh";
        max: "max";
    }>>;
}, z.core.$strip>>;
export declare const providerEmbeddingModelSchema: z.ZodObject<{
    id: z.ZodString;
    displayName: z.ZodString;
    dimensions: z.ZodOptional<z.ZodNumber>;
    recommendedThreshold: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const providerConfigSchema: z.ZodObject<{
    type: z.ZodString;
    acp: z.ZodOptional<z.ZodObject<{
        command: z.ZodString;
        args: z.ZodDefault<z.ZodArray<z.ZodString>>;
        env: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
        promptTimeoutMs: z.ZodDefault<z.ZodNumber>;
        maxOutputBytes: z.ZodDefault<z.ZodNumber>;
        allowMemory: z.ZodDefault<z.ZodBoolean>;
        authMethodId: z.ZodOptional<z.ZodString>;
        modeId: z.ZodOptional<z.ZodString>;
        mcpServers: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    displayName: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    protocol: z.ZodOptional<z.ZodEnum<{
        anthropic: "anthropic";
        "openai-compatible": "openai-compatible";
    }>>;
    baseUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
    apiKeyEnv: z.ZodOptional<z.ZodString>;
    requiresApiKey: z.ZodOptional<z.ZodBoolean>;
    modelsRequiresApiKey: z.ZodOptional<z.ZodBoolean>;
    authMode: z.ZodOptional<z.ZodEnum<{
        "api-key": "api-key";
        "oauth-bearer": "oauth-bearer";
    }>>;
    oauth: z.ZodOptional<z.ZodObject<{
        provider: z.ZodString;
        refreshToken: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodNumber;
        accountId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    retry: z.ZodOptional<z.ZodObject<{
        maxAttempts: z.ZodDefault<z.ZodNumber>;
        initialDelayMs: z.ZodDefault<z.ZodNumber>;
        maxDelayMs: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    modelsEndpoint: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    apiBackend: z.ZodOptional<z.ZodString>;
    compatibility: z.ZodOptional<z.ZodObject<{
        supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
        supportsReasoning: z.ZodOptional<z.ZodBoolean>;
        supportsVision: z.ZodOptional<z.ZodBoolean>;
        maxTokensField: z.ZodOptional<z.ZodEnum<{
            max_tokens: "max_tokens";
            max_completion_tokens: "max_completion_tokens";
        }>>;
    }, z.core.$strip>>;
    applyPatchProtocol: z.ZodOptional<z.ZodEnum<{
        "openai-structured": "openai-structured";
        off: "off";
    }>>;
    modelProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        capabilities: z.ZodOptional<z.ZodObject<{
            tools: z.ZodOptional<z.ZodBoolean>;
            parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
            reasoning: z.ZodOptional<z.ZodBoolean>;
            reasoningStream: z.ZodOptional<z.ZodBoolean>;
            reasoningSummary: z.ZodOptional<z.ZodBoolean>;
            vision: z.ZodOptional<z.ZodBoolean>;
            audio: z.ZodOptional<z.ZodBoolean>;
            streaming: z.ZodOptional<z.ZodBoolean>;
            serviceTiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                priority: "priority";
            }>>>;
        }, z.core.$strip>>;
        showInPicker: z.ZodOptional<z.ZodBoolean>;
        contextWindow: z.ZodOptional<z.ZodNumber>;
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        thinkingLevelMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
    }, z.core.$strict>>>;
    dataResidency: z.ZodOptional<z.ZodEnum<{
        local: "local";
        external: "external";
    }>>;
    embeddingModels: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        displayName: z.ZodString;
        dimensions: z.ZodOptional<z.ZodNumber>;
        recommendedThreshold: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
}, z.core.$strip>;
declare const modelPricingSchema: z.ZodObject<{
    inputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
    outputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
    cacheReadPerMillionTokens: z.ZodOptional<z.ZodNumber>;
    cacheWritePerMillionTokens: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
declare const mcpServerSchema: z.ZodObject<{
    exposure: z.ZodOptional<z.ZodEnum<{
        direct: "direct";
        codemode: "codemode";
        deferred: "deferred";
        hidden: "hidden";
    }>>;
    toolExposure: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
        direct: "direct";
        codemode: "codemode";
        deferred: "deferred";
        hidden: "hidden";
    }>>>;
    toolContracts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodLiteral<"file-change-v1">>>;
    id: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        stdio: "stdio";
        http: "http";
    }>>;
    transportProtocol: z.ZodOptional<z.ZodEnum<{
        "streamable-http": "streamable-http";
        sse: "sse";
    }>>;
    command: z.ZodOptional<z.ZodString>;
    args: z.ZodDefault<z.ZodArray<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    credentialRefs: z.ZodOptional<z.ZodObject<{
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strip>>;
    cwd: z.ZodOptional<z.ZodString>;
    stderr: z.ZodDefault<z.ZodEnum<{
        pipe: "pipe";
        inherit: "inherit";
        ignore: "ignore";
    }>>;
    url: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    oauth: z.ZodOptional<z.ZodObject<{
        clientId: z.ZodOptional<z.ZodString>;
        scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        redirectPort: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    startupTimeoutMs: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const defaultSubagentAllowedTools: readonly ["Read", "Glob", "Grep", "Write", "Edit", "Bash"];
declare const extensionsSchema: z.ZodPrefault<z.ZodObject<{
    mcp: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        exposure: z.ZodOptional<z.ZodEnum<{
            direct: "direct";
            codemode: "codemode";
            deferred: "deferred";
            hidden: "hidden";
        }>>;
        toolExposure: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
            direct: "direct";
            codemode: "codemode";
            deferred: "deferred";
            hidden: "hidden";
        }>>>;
        toolContracts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodLiteral<"file-change-v1">>>;
        id: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<{
            stdio: "stdio";
            http: "http";
        }>>;
        transportProtocol: z.ZodOptional<z.ZodEnum<{
            "streamable-http": "streamable-http";
            sse: "sse";
        }>>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodDefault<z.ZodArray<z.ZodString>>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        credentialRefs: z.ZodOptional<z.ZodObject<{
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strip>>;
        cwd: z.ZodOptional<z.ZodString>;
        stderr: z.ZodDefault<z.ZodEnum<{
            pipe: "pipe";
            inherit: "inherit";
            ignore: "ignore";
        }>>;
        url: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        oauth: z.ZodOptional<z.ZodObject<{
            clientId: z.ZodOptional<z.ZodString>;
            scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            redirectPort: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        startupTimeoutMs: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
    skillDefaults: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    skillProjectOverrides: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodBoolean>>>;
    plugins: z.ZodDefault<z.ZodArray<z.ZodString>>;
    globalPlugins: z.ZodDefault<z.ZodArray<z.ZodString>>;
    subagent: z.ZodPrefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        runtime: z.ZodOptional<z.ZodEnum<{
            builtin: "builtin";
            auto: "auto";
            acp: "acp";
            codex: "codex";
            "claude-code": "claude-code";
        }>>;
        providerAlias: z.ZodOptional<z.ZodString>;
        maxSteps: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodDefault<z.ZodNumber>;
        maxConcurrentSubagents: z.ZodDefault<z.ZodNumber>;
        maxPendingSubagents: z.ZodDefault<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        inactivityTimeoutMs: z.ZodDefault<z.ZodNumber>;
        model: z.ZodOptional<z.ZodString>;
        maxCostUsd: z.ZodOptional<z.ZodNumber>;
        allowedTools: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            Write: "Write";
            Edit: "Edit";
            Read: "Read";
            Glob: "Glob";
            Grep: "Grep";
            Bash: "Bash";
        }>>>;
        agentPaths: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>>;
/**
 * 出站脱敏：发给模型厂商前，把密钥与个人信息换成占位符，回复再换回原值。
 * 只有一个开关，不保存任何具体值（值只在运行进程内存里）。
 */
declare const redactionSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>>;
declare const webSearchSchema: z.ZodDefault<z.ZodObject<{
    provider: z.ZodDefault<z.ZodEnum<{
        google: "google";
        xiaohongshu: "xiaohongshu";
    }>>;
    visibleBrowsing: z.ZodDefault<z.ZodBoolean>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    maxResults: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>>;
/**
 * 共享 cookie jar：桌面端内嵌浏览器登录后写入，`WebSearch` 的 Google provider 和
 * `WebFetch` 读取，用来访问需要登录态的页面。
 *
 * 打开它意味着模型选定的 URL 会带上真实登录凭据（只发给域名匹配的站点）。`WebFetch`
 * 默认不在免确认工具白名单里，每次抓取仍要用户确认，这是这项能力的主要约束。
 */
declare const webCookiesSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    path: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
declare const webFetchSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    maxBytes: z.ZodDefault<z.ZodNumber>;
    maxRedirects: z.ZodDefault<z.ZodNumber>;
    allowPrivateNetwork: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>>;
declare const hookSchema: z.ZodObject<{
    command: z.ZodString;
    tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
    extensions: z.ZodDefault<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
declare const hooksSchema: z.ZodPrefault<z.ZodObject<{
    beforeTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
        command: z.ZodString;
        tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
        extensions: z.ZodDefault<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
    afterTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
        command: z.ZodString;
        tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
        extensions: z.ZodDefault<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>>;
declare const sandboxSchema: z.ZodDefault<z.ZodObject<{
    mode: z.ZodDefault<z.ZodEnum<{
        off: "off";
        "workspace-write": "workspace-write";
    }>>;
    allowNetwork: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>>;
declare const checkpointsSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>>;
declare const diagnosticsSchema: z.ZodPrefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    autoDetect: z.ZodDefault<z.ZodBoolean>;
    autoDetectTimeoutMs: z.ZodDefault<z.ZodNumber>;
    maxOutputBytes: z.ZodDefault<z.ZodNumber>;
    commands: z.ZodDefault<z.ZodArray<z.ZodObject<{
        extensions: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>>;
declare const webSchema: z.ZodPrefault<z.ZodObject<{
    search: z.ZodDefault<z.ZodObject<{
        provider: z.ZodDefault<z.ZodEnum<{
            google: "google";
            xiaohongshu: "xiaohongshu";
        }>>;
        visibleBrowsing: z.ZodDefault<z.ZodBoolean>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
        maxResults: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    fetch: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
        maxBytes: z.ZodDefault<z.ZodNumber>;
        maxRedirects: z.ZodDefault<z.ZodNumber>;
        allowPrivateNetwork: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    cookies: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        path: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>>;
declare const modelThinkingSchema: z.ZodObject<{
    efforts: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        minimal: "minimal";
        low: "low";
        medium: "medium";
        high: "high";
        xhigh: "xhigh";
        max: "max";
    }>>>;
    defaultEffort: z.ZodDefault<z.ZodEnum<{
        minimal: "minimal";
        low: "low";
        medium: "medium";
        high: "high";
        xhigh: "xhigh";
        max: "max";
    }>>;
    mapping: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        minimal: "minimal";
        low: "low";
        medium: "medium";
        high: "high";
        xhigh: "xhigh";
        max: "max";
    }> & z.core.$partial, z.ZodString>>;
    budgetTokens: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        minimal: "minimal";
        low: "low";
        medium: "medium";
        high: "high";
        xhigh: "xhigh";
        max: "max";
    }> & z.core.$partial, z.ZodNumber>>;
}, z.core.$strip>;
export declare const modelLimitsSchema: z.ZodObject<{
    maxInputTokens: z.ZodOptional<z.ZodNumber>;
    reasoningReserveTokens: z.ZodOptional<z.ZodNumber>;
    toolSchemaReserveTokens: z.ZodOptional<z.ZodNumber>;
    systemPromptReserveTokens: z.ZodOptional<z.ZodNumber>;
    protocolSafetyMarginTokens: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const modelAliasSchema: z.ZodObject<{
    provider: z.ZodString;
    model: z.ZodString;
    dataResidency: z.ZodOptional<z.ZodEnum<{
        local: "local";
        external: "external";
    }>>;
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
        serviceTiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            priority: "priority";
        }>>>;
    }, z.core.$strip>>;
    contextWindow: z.ZodOptional<z.ZodNumber>;
    maxInputTokens: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    limits: z.ZodOptional<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        reasoningReserveTokens: z.ZodOptional<z.ZodNumber>;
        toolSchemaReserveTokens: z.ZodOptional<z.ZodNumber>;
        systemPromptReserveTokens: z.ZodOptional<z.ZodNumber>;
        protocolSafetyMarginTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    apiBackend: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    compatibility: z.ZodOptional<z.ZodObject<{
        supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
        supportsReasoning: z.ZodOptional<z.ZodBoolean>;
        supportsVision: z.ZodOptional<z.ZodBoolean>;
        maxTokensField: z.ZodOptional<z.ZodEnum<{
            max_tokens: "max_tokens";
            max_completion_tokens: "max_completion_tokens";
        }>>;
    }, z.core.$strip>>;
    thinkingLevelMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
    reasoning: z.ZodOptional<z.ZodObject<{
        efforts: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            minimal: "minimal";
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
            max: "max";
        }>>>;
        defaultEffort: z.ZodDefault<z.ZodEnum<{
            minimal: "minimal";
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
            max: "max";
        }>>;
        mapping: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            minimal: "minimal";
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
            max: "max";
        }> & z.core.$partial, z.ZodString>>;
        budgetTokens: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            minimal: "minimal";
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
            max: "max";
        }> & z.core.$partial, z.ZodNumber>>;
    }, z.core.$strip>>;
    pricing: z.ZodOptional<z.ZodObject<{
        inputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
        outputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
        cacheReadPerMillionTokens: z.ZodOptional<z.ZodNumber>;
        cacheWritePerMillionTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const canonicalConfigSchema: z.ZodObject<{
    format: z.ZodLiteral<"biny-config">;
    configVersion: z.ZodLiteral<2>;
    needsEmbeddingRebuild: z.ZodDefault<z.ZodBoolean>;
    defaultModel: z.ZodString;
    toolModel: z.ZodOptional<z.ZodString>;
    visionModel: z.ZodOptional<z.ZodString>;
    visionModelEnabled: z.ZodOptional<z.ZodBoolean>;
    providers: z.ZodRecord<z.ZodString, z.ZodObject<{
        type: z.ZodString;
        acp: z.ZodOptional<z.ZodObject<{
            command: z.ZodString;
            args: z.ZodDefault<z.ZodArray<z.ZodString>>;
            env: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
            promptTimeoutMs: z.ZodDefault<z.ZodNumber>;
            maxOutputBytes: z.ZodDefault<z.ZodNumber>;
            allowMemory: z.ZodDefault<z.ZodBoolean>;
            authMethodId: z.ZodOptional<z.ZodString>;
            modeId: z.ZodOptional<z.ZodString>;
            mcpServers: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        displayName: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        protocol: z.ZodOptional<z.ZodEnum<{
            anthropic: "anthropic";
            "openai-compatible": "openai-compatible";
        }>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodOptional<z.ZodString>;
        apiKeyEnv: z.ZodOptional<z.ZodString>;
        requiresApiKey: z.ZodOptional<z.ZodBoolean>;
        modelsRequiresApiKey: z.ZodOptional<z.ZodBoolean>;
        authMode: z.ZodOptional<z.ZodEnum<{
            "api-key": "api-key";
            "oauth-bearer": "oauth-bearer";
        }>>;
        oauth: z.ZodOptional<z.ZodObject<{
            provider: z.ZodString;
            refreshToken: z.ZodOptional<z.ZodString>;
            expiresAt: z.ZodNumber;
            accountId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        retry: z.ZodOptional<z.ZodObject<{
            maxAttempts: z.ZodDefault<z.ZodNumber>;
            initialDelayMs: z.ZodDefault<z.ZodNumber>;
            maxDelayMs: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
        modelsEndpoint: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiBackend: z.ZodOptional<z.ZodString>;
        compatibility: z.ZodOptional<z.ZodObject<{
            supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
            supportsReasoning: z.ZodOptional<z.ZodBoolean>;
            supportsVision: z.ZodOptional<z.ZodBoolean>;
            maxTokensField: z.ZodOptional<z.ZodEnum<{
                max_tokens: "max_tokens";
                max_completion_tokens: "max_completion_tokens";
            }>>;
        }, z.core.$strip>>;
        applyPatchProtocol: z.ZodOptional<z.ZodEnum<{
            "openai-structured": "openai-structured";
            off: "off";
        }>>;
        modelProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            capabilities: z.ZodOptional<z.ZodObject<{
                tools: z.ZodOptional<z.ZodBoolean>;
                parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
                reasoning: z.ZodOptional<z.ZodBoolean>;
                reasoningStream: z.ZodOptional<z.ZodBoolean>;
                reasoningSummary: z.ZodOptional<z.ZodBoolean>;
                vision: z.ZodOptional<z.ZodBoolean>;
                audio: z.ZodOptional<z.ZodBoolean>;
                streaming: z.ZodOptional<z.ZodBoolean>;
                serviceTiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    priority: "priority";
                }>>>;
            }, z.core.$strip>>;
            showInPicker: z.ZodOptional<z.ZodBoolean>;
            contextWindow: z.ZodOptional<z.ZodNumber>;
            maxInputTokens: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodOptional<z.ZodNumber>;
            thinkingLevelMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
        }, z.core.$strict>>>;
        dataResidency: z.ZodOptional<z.ZodEnum<{
            local: "local";
            external: "external";
        }>>;
        embeddingModels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            displayName: z.ZodString;
            dimensions: z.ZodOptional<z.ZodNumber>;
            recommendedThreshold: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
    }, z.core.$strip>>;
    credentialRevisions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    models: z.ZodRecord<z.ZodString, z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        dataResidency: z.ZodOptional<z.ZodEnum<{
            local: "local";
            external: "external";
        }>>;
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
            serviceTiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                priority: "priority";
            }>>>;
        }, z.core.$strip>>;
        contextWindow: z.ZodOptional<z.ZodNumber>;
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        limits: z.ZodOptional<z.ZodObject<{
            maxInputTokens: z.ZodOptional<z.ZodNumber>;
            reasoningReserveTokens: z.ZodOptional<z.ZodNumber>;
            toolSchemaReserveTokens: z.ZodOptional<z.ZodNumber>;
            systemPromptReserveTokens: z.ZodOptional<z.ZodNumber>;
            protocolSafetyMarginTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        apiBackend: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        compatibility: z.ZodOptional<z.ZodObject<{
            supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
            supportsReasoning: z.ZodOptional<z.ZodBoolean>;
            supportsVision: z.ZodOptional<z.ZodBoolean>;
            maxTokensField: z.ZodOptional<z.ZodEnum<{
                max_tokens: "max_tokens";
                max_completion_tokens: "max_completion_tokens";
            }>>;
        }, z.core.$strip>>;
        thinkingLevelMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
        reasoning: z.ZodOptional<z.ZodObject<{
            efforts: z.ZodDefault<z.ZodArray<z.ZodEnum<{
                minimal: "minimal";
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
                max: "max";
            }>>>;
            defaultEffort: z.ZodDefault<z.ZodEnum<{
                minimal: "minimal";
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
                max: "max";
            }>>;
            mapping: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                minimal: "minimal";
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
                max: "max";
            }> & z.core.$partial, z.ZodString>>;
            budgetTokens: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                minimal: "minimal";
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
                max: "max";
            }> & z.core.$partial, z.ZodNumber>>;
        }, z.core.$strip>>;
        pricing: z.ZodOptional<z.ZodObject<{
            inputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            outputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            cacheReadPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            cacheWritePerMillionTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    thinking: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        effort: z.ZodDefault<z.ZodEnum<{
            minimal: "minimal";
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
            max: "max";
        }>>;
    }, z.core.$strip>>;
    agent: z.ZodDefault<z.ZodObject<{
        rtkEnabled: z.ZodDefault<z.ZodBoolean>;
        toolExecutionMode: z.ZodDefault<z.ZodEnum<{
            direct: "direct";
            code_mode: "code_mode";
        }>>;
        softStepLimit: z.ZodDefault<z.ZodNumber>;
        hardStepLimit: z.ZodDefault<z.ZodNumber>;
        maxToolCalls: z.ZodOptional<z.ZodNumber>;
        maxRepeatedActions: z.ZodOptional<z.ZodNumber>;
        maxConcurrentTools: z.ZodDefault<z.ZodNumber>;
        maxQueuedToolCalls: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>;
    heartbeat: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        intervalMinutes: z.ZodDefault<z.ZodNumber>;
        activeHoursStart: z.ZodDefault<z.ZodNumber>;
        activeHoursEnd: z.ZodDefault<z.ZodNumber>;
        timezone: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    permission: z.ZodPrefault<z.ZodObject<{
        mode: z.ZodDefault<z.ZodEnum<{
            auto: "auto";
            ask: "ask";
            "read-only": "read-only";
            "full-access": "full-access";
        }>>;
        allowTools: z.ZodDefault<z.ZodArray<z.ZodString>>;
        allowPaths: z.ZodDefault<z.ZodArray<z.ZodString>>;
        denyPaths: z.ZodDefault<z.ZodArray<z.ZodString>>;
        criticalAlwaysAsk: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    workspace: z.ZodObject<{
        ignore: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    activity: z.ZodPrefault<z.ZodPipe<z.ZodPreprocess<z.ZodObject<{
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
        ocrLanguages: z.ZodDefault<z.ZodArray<z.ZodString>>;
        ocrEveryNFrames: z.ZodDefault<z.ZodNumber>;
        sensitiveApplications: z.ZodDefault<z.ZodArray<z.ZodString>>;
        maxStorageMb: z.ZodDefault<z.ZodNumber>;
        outputDirectory: z.ZodDefault<z.ZodString>;
    }, z.core.$strict>, unknown>, z.ZodTransform<{
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
    }>>>;
    appshots: z.ZodDefault<z.ZodObject<{
        hotkey: z.ZodDefault<z.ZodString>;
        target: z.ZodDefault<z.ZodEnum<{
            current: "current";
            new: "new";
        }>>;
    }, z.core.$strict>>;
    computer: z.ZodPrefault<z.ZodObject<{
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
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    context: z.ZodPrefault<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxTurnToolResultBytes: z.ZodDefault<z.ZodNumber>;
        instructionsMaxBytes: z.ZodDefault<z.ZodNumber>;
        compaction: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            reserveTokens: z.ZodOptional<z.ZodNumber>;
            triggerPercent: z.ZodOptional<z.ZodNumber>;
            keepRecentTokens: z.ZodOptional<z.ZodNumber>;
            keepRecentMessages: z.ZodOptional<z.ZodNumber>;
            maxSummaryTokens: z.ZodDefault<z.ZodNumber>;
            summaryModel: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        identity: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            userEnabled: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strict>>;
        memory: z.ZodPrefault<z.ZodPipe<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            useMemories: z.ZodDefault<z.ZodBoolean>;
            generateMemories: z.ZodDefault<z.ZodBoolean>;
            queryRewrite: z.ZodDefault<z.ZodBoolean>;
            memoryModel: z.ZodOptional<z.ZodString>;
            rewriteModel: z.ZodOptional<z.ZodString>;
            extractModel: z.ZodOptional<z.ZodString>;
            embeddingModel: z.ZodOptional<z.ZodType<import("../personalization/index.js").EmbeddingModelRef, unknown, z.core.$ZodTypeInternals<import("../personalization/index.js").EmbeddingModelRef, unknown>>>;
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
        }, z.core.$strict>, z.ZodTransform<Omit<{
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
        }>>>;
    }, z.core.$strict>>;
    chat: z.ZodPrefault<z.ZodObject<{
        response: z.ZodOptional<z.ZodObject<{
            streaming: z.ZodOptional<z.ZodBoolean>;
            showTokenUsage: z.ZodOptional<z.ZodBoolean>;
            markdown: z.ZodOptional<z.ZodBoolean>;
            singleDollarMath: z.ZodOptional<z.ZodBoolean>;
            collapseThinking: z.ZodOptional<z.ZodBoolean>;
            openLinksInBrowser: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        hashlineEdit: z.ZodOptional<z.ZodBoolean>;
        cacheMarkers: z.ZodDefault<z.ZodBoolean>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        defaultToolSelection: z.ZodDefault<z.ZodEnum<{
            all: "all";
            auto: "auto";
            none: "none";
        }>>;
        defaultSkillSelection: z.ZodDefault<z.ZodEnum<{
            all: "all";
            auto: "auto";
            none: "none";
        }>>;
        skillExtraction: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            minToolCalls: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    diagnostics: z.ZodPrefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        autoDetect: z.ZodDefault<z.ZodBoolean>;
        autoDetectTimeoutMs: z.ZodDefault<z.ZodNumber>;
        maxOutputBytes: z.ZodDefault<z.ZodNumber>;
        commands: z.ZodDefault<z.ZodArray<z.ZodObject<{
            extensions: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    checkpoints: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    sandbox: z.ZodDefault<z.ZodObject<{
        mode: z.ZodDefault<z.ZodEnum<{
            off: "off";
            "workspace-write": "workspace-write";
        }>>;
        allowNetwork: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    hooks: z.ZodPrefault<z.ZodObject<{
        beforeTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
            command: z.ZodString;
            tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
            extensions: z.ZodDefault<z.ZodArray<z.ZodString>>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>>;
        afterTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
            command: z.ZodString;
            tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
            extensions: z.ZodDefault<z.ZodArray<z.ZodString>>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    web: z.ZodPrefault<z.ZodObject<{
        search: z.ZodDefault<z.ZodObject<{
            provider: z.ZodDefault<z.ZodEnum<{
                google: "google";
                xiaohongshu: "xiaohongshu";
            }>>;
            visibleBrowsing: z.ZodDefault<z.ZodBoolean>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
            maxResults: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
        fetch: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
            maxBytes: z.ZodDefault<z.ZodNumber>;
            maxRedirects: z.ZodDefault<z.ZodNumber>;
            allowPrivateNetwork: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        cookies: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            path: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    imageGen: z.ZodDefault<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        localModel: z.ZodOptional<z.ZodString>;
        aspectRatio: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    telemetry: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        recordInputs: z.ZodDefault<z.ZodBoolean>;
        recordOutputs: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    redaction: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    extensions: z.ZodPrefault<z.ZodObject<{
        mcp: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
            exposure: z.ZodOptional<z.ZodEnum<{
                direct: "direct";
                codemode: "codemode";
                deferred: "deferred";
                hidden: "hidden";
            }>>;
            toolExposure: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
                direct: "direct";
                codemode: "codemode";
                deferred: "deferred";
                hidden: "hidden";
            }>>>;
            toolContracts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodLiteral<"file-change-v1">>>;
            id: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<{
                stdio: "stdio";
                http: "http";
            }>>;
            transportProtocol: z.ZodOptional<z.ZodEnum<{
                "streamable-http": "streamable-http";
                sse: "sse";
            }>>;
            command: z.ZodOptional<z.ZodString>;
            args: z.ZodDefault<z.ZodArray<z.ZodString>>;
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            credentialRefs: z.ZodOptional<z.ZodObject<{
                env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strip>>;
            cwd: z.ZodOptional<z.ZodString>;
            stderr: z.ZodDefault<z.ZodEnum<{
                pipe: "pipe";
                inherit: "inherit";
                ignore: "ignore";
            }>>;
            url: z.ZodOptional<z.ZodString>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            oauth: z.ZodOptional<z.ZodObject<{
                clientId: z.ZodOptional<z.ZodString>;
                scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
                redirectPort: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            startupTimeoutMs: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            enabled: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>>;
        skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
        skillDefaults: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        skillProjectOverrides: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodBoolean>>>;
        plugins: z.ZodDefault<z.ZodArray<z.ZodString>>;
        globalPlugins: z.ZodDefault<z.ZodArray<z.ZodString>>;
        subagent: z.ZodPrefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            runtime: z.ZodOptional<z.ZodEnum<{
                builtin: "builtin";
                auto: "auto";
                acp: "acp";
                codex: "codex";
                "claude-code": "claude-code";
            }>>;
            providerAlias: z.ZodOptional<z.ZodString>;
            maxSteps: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodDefault<z.ZodNumber>;
            maxConcurrentSubagents: z.ZodDefault<z.ZodNumber>;
            maxPendingSubagents: z.ZodDefault<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            inactivityTimeoutMs: z.ZodDefault<z.ZodNumber>;
            model: z.ZodOptional<z.ZodString>;
            maxCostUsd: z.ZodOptional<z.ZodNumber>;
            allowedTools: z.ZodDefault<z.ZodArray<z.ZodEnum<{
                Write: "Write";
                Edit: "Edit";
                Read: "Read";
                Glob: "Glob";
                Grep: "Grep";
                Bash: "Bash";
            }>>>;
            agentPaths: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strict>;
export declare const configSchema: z.ZodPreprocess<z.ZodObject<{
    format: z.ZodLiteral<"biny-config">;
    configVersion: z.ZodLiteral<2>;
    needsEmbeddingRebuild: z.ZodDefault<z.ZodBoolean>;
    defaultModel: z.ZodString;
    toolModel: z.ZodOptional<z.ZodString>;
    visionModel: z.ZodOptional<z.ZodString>;
    visionModelEnabled: z.ZodOptional<z.ZodBoolean>;
    providers: z.ZodRecord<z.ZodString, z.ZodObject<{
        type: z.ZodString;
        acp: z.ZodOptional<z.ZodObject<{
            command: z.ZodString;
            args: z.ZodDefault<z.ZodArray<z.ZodString>>;
            env: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
            promptTimeoutMs: z.ZodDefault<z.ZodNumber>;
            maxOutputBytes: z.ZodDefault<z.ZodNumber>;
            allowMemory: z.ZodDefault<z.ZodBoolean>;
            authMethodId: z.ZodOptional<z.ZodString>;
            modeId: z.ZodOptional<z.ZodString>;
            mcpServers: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        displayName: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        protocol: z.ZodOptional<z.ZodEnum<{
            anthropic: "anthropic";
            "openai-compatible": "openai-compatible";
        }>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodOptional<z.ZodString>;
        apiKeyEnv: z.ZodOptional<z.ZodString>;
        requiresApiKey: z.ZodOptional<z.ZodBoolean>;
        modelsRequiresApiKey: z.ZodOptional<z.ZodBoolean>;
        authMode: z.ZodOptional<z.ZodEnum<{
            "api-key": "api-key";
            "oauth-bearer": "oauth-bearer";
        }>>;
        oauth: z.ZodOptional<z.ZodObject<{
            provider: z.ZodString;
            refreshToken: z.ZodOptional<z.ZodString>;
            expiresAt: z.ZodNumber;
            accountId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        retry: z.ZodOptional<z.ZodObject<{
            maxAttempts: z.ZodDefault<z.ZodNumber>;
            initialDelayMs: z.ZodDefault<z.ZodNumber>;
            maxDelayMs: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
        modelsEndpoint: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        apiBackend: z.ZodOptional<z.ZodString>;
        compatibility: z.ZodOptional<z.ZodObject<{
            supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
            supportsReasoning: z.ZodOptional<z.ZodBoolean>;
            supportsVision: z.ZodOptional<z.ZodBoolean>;
            maxTokensField: z.ZodOptional<z.ZodEnum<{
                max_tokens: "max_tokens";
                max_completion_tokens: "max_completion_tokens";
            }>>;
        }, z.core.$strip>>;
        applyPatchProtocol: z.ZodOptional<z.ZodEnum<{
            "openai-structured": "openai-structured";
            off: "off";
        }>>;
        modelProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            capabilities: z.ZodOptional<z.ZodObject<{
                tools: z.ZodOptional<z.ZodBoolean>;
                parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
                reasoning: z.ZodOptional<z.ZodBoolean>;
                reasoningStream: z.ZodOptional<z.ZodBoolean>;
                reasoningSummary: z.ZodOptional<z.ZodBoolean>;
                vision: z.ZodOptional<z.ZodBoolean>;
                audio: z.ZodOptional<z.ZodBoolean>;
                streaming: z.ZodOptional<z.ZodBoolean>;
                serviceTiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    priority: "priority";
                }>>>;
            }, z.core.$strip>>;
            showInPicker: z.ZodOptional<z.ZodBoolean>;
            contextWindow: z.ZodOptional<z.ZodNumber>;
            maxInputTokens: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodOptional<z.ZodNumber>;
            thinkingLevelMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
        }, z.core.$strict>>>;
        dataResidency: z.ZodOptional<z.ZodEnum<{
            local: "local";
            external: "external";
        }>>;
        embeddingModels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            displayName: z.ZodString;
            dimensions: z.ZodOptional<z.ZodNumber>;
            recommendedThreshold: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
    }, z.core.$strip>>;
    credentialRevisions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    models: z.ZodRecord<z.ZodString, z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        dataResidency: z.ZodOptional<z.ZodEnum<{
            local: "local";
            external: "external";
        }>>;
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
            serviceTiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                priority: "priority";
            }>>>;
        }, z.core.$strip>>;
        contextWindow: z.ZodOptional<z.ZodNumber>;
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        limits: z.ZodOptional<z.ZodObject<{
            maxInputTokens: z.ZodOptional<z.ZodNumber>;
            reasoningReserveTokens: z.ZodOptional<z.ZodNumber>;
            toolSchemaReserveTokens: z.ZodOptional<z.ZodNumber>;
            systemPromptReserveTokens: z.ZodOptional<z.ZodNumber>;
            protocolSafetyMarginTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        apiBackend: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        compatibility: z.ZodOptional<z.ZodObject<{
            supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
            supportsReasoning: z.ZodOptional<z.ZodBoolean>;
            supportsVision: z.ZodOptional<z.ZodBoolean>;
            maxTokensField: z.ZodOptional<z.ZodEnum<{
                max_tokens: "max_tokens";
                max_completion_tokens: "max_completion_tokens";
            }>>;
        }, z.core.$strip>>;
        thinkingLevelMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
        reasoning: z.ZodOptional<z.ZodObject<{
            efforts: z.ZodDefault<z.ZodArray<z.ZodEnum<{
                minimal: "minimal";
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
                max: "max";
            }>>>;
            defaultEffort: z.ZodDefault<z.ZodEnum<{
                minimal: "minimal";
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
                max: "max";
            }>>;
            mapping: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                minimal: "minimal";
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
                max: "max";
            }> & z.core.$partial, z.ZodString>>;
            budgetTokens: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                minimal: "minimal";
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
                max: "max";
            }> & z.core.$partial, z.ZodNumber>>;
        }, z.core.$strip>>;
        pricing: z.ZodOptional<z.ZodObject<{
            inputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            outputPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            cacheReadPerMillionTokens: z.ZodOptional<z.ZodNumber>;
            cacheWritePerMillionTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    thinking: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        effort: z.ZodDefault<z.ZodEnum<{
            minimal: "minimal";
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
            max: "max";
        }>>;
    }, z.core.$strip>>;
    agent: z.ZodDefault<z.ZodObject<{
        rtkEnabled: z.ZodDefault<z.ZodBoolean>;
        toolExecutionMode: z.ZodDefault<z.ZodEnum<{
            direct: "direct";
            code_mode: "code_mode";
        }>>;
        softStepLimit: z.ZodDefault<z.ZodNumber>;
        hardStepLimit: z.ZodDefault<z.ZodNumber>;
        maxToolCalls: z.ZodOptional<z.ZodNumber>;
        maxRepeatedActions: z.ZodOptional<z.ZodNumber>;
        maxConcurrentTools: z.ZodDefault<z.ZodNumber>;
        maxQueuedToolCalls: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>;
    heartbeat: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        intervalMinutes: z.ZodDefault<z.ZodNumber>;
        activeHoursStart: z.ZodDefault<z.ZodNumber>;
        activeHoursEnd: z.ZodDefault<z.ZodNumber>;
        timezone: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    permission: z.ZodPrefault<z.ZodObject<{
        mode: z.ZodDefault<z.ZodEnum<{
            auto: "auto";
            ask: "ask";
            "read-only": "read-only";
            "full-access": "full-access";
        }>>;
        allowTools: z.ZodDefault<z.ZodArray<z.ZodString>>;
        allowPaths: z.ZodDefault<z.ZodArray<z.ZodString>>;
        denyPaths: z.ZodDefault<z.ZodArray<z.ZodString>>;
        criticalAlwaysAsk: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    workspace: z.ZodObject<{
        ignore: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    activity: z.ZodPrefault<z.ZodPipe<z.ZodPreprocess<z.ZodObject<{
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
        ocrLanguages: z.ZodDefault<z.ZodArray<z.ZodString>>;
        ocrEveryNFrames: z.ZodDefault<z.ZodNumber>;
        sensitiveApplications: z.ZodDefault<z.ZodArray<z.ZodString>>;
        maxStorageMb: z.ZodDefault<z.ZodNumber>;
        outputDirectory: z.ZodDefault<z.ZodString>;
    }, z.core.$strict>, unknown>, z.ZodTransform<{
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
    }>>>;
    appshots: z.ZodDefault<z.ZodObject<{
        hotkey: z.ZodDefault<z.ZodString>;
        target: z.ZodDefault<z.ZodEnum<{
            current: "current";
            new: "new";
        }>>;
    }, z.core.$strict>>;
    computer: z.ZodPrefault<z.ZodObject<{
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
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    context: z.ZodPrefault<z.ZodObject<{
        maxInputTokens: z.ZodOptional<z.ZodNumber>;
        maxTurnToolResultBytes: z.ZodDefault<z.ZodNumber>;
        instructionsMaxBytes: z.ZodDefault<z.ZodNumber>;
        compaction: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            reserveTokens: z.ZodOptional<z.ZodNumber>;
            triggerPercent: z.ZodOptional<z.ZodNumber>;
            keepRecentTokens: z.ZodOptional<z.ZodNumber>;
            keepRecentMessages: z.ZodOptional<z.ZodNumber>;
            maxSummaryTokens: z.ZodDefault<z.ZodNumber>;
            summaryModel: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        identity: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            userEnabled: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strict>>;
        memory: z.ZodPrefault<z.ZodPipe<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            useMemories: z.ZodDefault<z.ZodBoolean>;
            generateMemories: z.ZodDefault<z.ZodBoolean>;
            queryRewrite: z.ZodDefault<z.ZodBoolean>;
            memoryModel: z.ZodOptional<z.ZodString>;
            rewriteModel: z.ZodOptional<z.ZodString>;
            extractModel: z.ZodOptional<z.ZodString>;
            embeddingModel: z.ZodOptional<z.ZodType<import("../personalization/index.js").EmbeddingModelRef, unknown, z.core.$ZodTypeInternals<import("../personalization/index.js").EmbeddingModelRef, unknown>>>;
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
        }, z.core.$strict>, z.ZodTransform<Omit<{
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
        }>>>;
    }, z.core.$strict>>;
    chat: z.ZodPrefault<z.ZodObject<{
        response: z.ZodOptional<z.ZodObject<{
            streaming: z.ZodOptional<z.ZodBoolean>;
            showTokenUsage: z.ZodOptional<z.ZodBoolean>;
            markdown: z.ZodOptional<z.ZodBoolean>;
            singleDollarMath: z.ZodOptional<z.ZodBoolean>;
            collapseThinking: z.ZodOptional<z.ZodBoolean>;
            openLinksInBrowser: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        hashlineEdit: z.ZodOptional<z.ZodBoolean>;
        cacheMarkers: z.ZodDefault<z.ZodBoolean>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        defaultToolSelection: z.ZodDefault<z.ZodEnum<{
            all: "all";
            auto: "auto";
            none: "none";
        }>>;
        defaultSkillSelection: z.ZodDefault<z.ZodEnum<{
            all: "all";
            auto: "auto";
            none: "none";
        }>>;
        skillExtraction: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            minToolCalls: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    diagnostics: z.ZodPrefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        autoDetect: z.ZodDefault<z.ZodBoolean>;
        autoDetectTimeoutMs: z.ZodDefault<z.ZodNumber>;
        maxOutputBytes: z.ZodDefault<z.ZodNumber>;
        commands: z.ZodDefault<z.ZodArray<z.ZodObject<{
            extensions: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    checkpoints: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    sandbox: z.ZodDefault<z.ZodObject<{
        mode: z.ZodDefault<z.ZodEnum<{
            off: "off";
            "workspace-write": "workspace-write";
        }>>;
        allowNetwork: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    hooks: z.ZodPrefault<z.ZodObject<{
        beforeTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
            command: z.ZodString;
            tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
            extensions: z.ZodDefault<z.ZodArray<z.ZodString>>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>>;
        afterTool: z.ZodDefault<z.ZodArray<z.ZodObject<{
            command: z.ZodString;
            tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
            extensions: z.ZodDefault<z.ZodArray<z.ZodString>>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    web: z.ZodPrefault<z.ZodObject<{
        search: z.ZodDefault<z.ZodObject<{
            provider: z.ZodDefault<z.ZodEnum<{
                google: "google";
                xiaohongshu: "xiaohongshu";
            }>>;
            visibleBrowsing: z.ZodDefault<z.ZodBoolean>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
            maxResults: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
        fetch: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            timeoutMs: z.ZodDefault<z.ZodNumber>;
            maxBytes: z.ZodDefault<z.ZodNumber>;
            maxRedirects: z.ZodDefault<z.ZodNumber>;
            allowPrivateNetwork: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        cookies: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            path: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    imageGen: z.ZodDefault<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        localModel: z.ZodOptional<z.ZodString>;
        aspectRatio: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    telemetry: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        recordInputs: z.ZodDefault<z.ZodBoolean>;
        recordOutputs: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    redaction: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    extensions: z.ZodPrefault<z.ZodObject<{
        mcp: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
            exposure: z.ZodOptional<z.ZodEnum<{
                direct: "direct";
                codemode: "codemode";
                deferred: "deferred";
                hidden: "hidden";
            }>>;
            toolExposure: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
                direct: "direct";
                codemode: "codemode";
                deferred: "deferred";
                hidden: "hidden";
            }>>>;
            toolContracts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodLiteral<"file-change-v1">>>;
            id: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<{
                stdio: "stdio";
                http: "http";
            }>>;
            transportProtocol: z.ZodOptional<z.ZodEnum<{
                "streamable-http": "streamable-http";
                sse: "sse";
            }>>;
            command: z.ZodOptional<z.ZodString>;
            args: z.ZodDefault<z.ZodArray<z.ZodString>>;
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            credentialRefs: z.ZodOptional<z.ZodObject<{
                env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strip>>;
            cwd: z.ZodOptional<z.ZodString>;
            stderr: z.ZodDefault<z.ZodEnum<{
                pipe: "pipe";
                inherit: "inherit";
                ignore: "ignore";
            }>>;
            url: z.ZodOptional<z.ZodString>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            oauth: z.ZodOptional<z.ZodObject<{
                clientId: z.ZodOptional<z.ZodString>;
                scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
                redirectPort: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            startupTimeoutMs: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            enabled: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>>;
        skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
        skillDefaults: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        skillProjectOverrides: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodBoolean>>>;
        plugins: z.ZodDefault<z.ZodArray<z.ZodString>>;
        globalPlugins: z.ZodDefault<z.ZodArray<z.ZodString>>;
        subagent: z.ZodPrefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            runtime: z.ZodOptional<z.ZodEnum<{
                builtin: "builtin";
                auto: "auto";
                acp: "acp";
                codex: "codex";
                "claude-code": "claude-code";
            }>>;
            providerAlias: z.ZodOptional<z.ZodString>;
            maxSteps: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodDefault<z.ZodNumber>;
            maxConcurrentSubagents: z.ZodDefault<z.ZodNumber>;
            maxPendingSubagents: z.ZodDefault<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            inactivityTimeoutMs: z.ZodDefault<z.ZodNumber>;
            model: z.ZodOptional<z.ZodString>;
            maxCostUsd: z.ZodOptional<z.ZodNumber>;
            allowedTools: z.ZodDefault<z.ZodArray<z.ZodEnum<{
                Write: "Write";
                Edit: "Edit";
                Read: "Read";
                Glob: "Glob";
                Grep: "Grep";
                Bash: "Bash";
            }>>>;
            agentPaths: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strict>, unknown>;
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
export type RedactionConfig = z.infer<typeof redactionSchema>;
export type WebCookiesConfig = z.infer<typeof webCookiesSchema>;
export type WebConfig = z.infer<typeof webSchema>;
export type { ActivityDataResidency, ActivitySettings, MemoryPolicy };
export declare const defaultConfig: AgentConfig;
/** 目录仍可能返回已下线模型，但它们不应进入普通模型选择器。 */
export declare function isRemovedModelId(modelId: string): boolean;
