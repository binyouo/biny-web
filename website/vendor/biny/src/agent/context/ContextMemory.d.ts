import { type ContextTokenInput } from "./tokenUsage.js";
import type { AgentContext, AgentMessage, AgentModel, AgentTool, AgentUsage, ModelRequestContext, ModelRequestObserver } from "../core/types.js";
import { LocalMemory } from "./LocalMemory.js";
import { WorkspaceContext } from "./WorkspaceContext.js";
import type { CompactionResult, ContextBudgetStatus, ContextStatus } from "./types.js";
import type { ModelUsageObserver } from "../../observability/usage.js";
import type { SessionContextCheckpoint, SessionContextState } from "../../session/metadata.js";
import type { ModelContextBudget } from "../../ai/types.js";
import type { AgentAttachment } from "../AgentSession.js";
import type { PersonalizationMetadata } from "../../session/metadata.js";
import { type PromptEpochReason } from "../../llm/promptCache.js";
import type { HybridMemoryRetriever } from "./HybridMemoryRetriever.js";
import type { PromptBundle } from "../prompts.js";
export interface ContextCompactionOptions {
    /** 在每次摘要请求前复核宿主预算；拒绝保留原历史，不记录摘要失败。 */
    canRequestSummary?: () => boolean;
    /** 注入时钟用于确定性验证失败冷却，不进入用户配置。 */
    now?: () => number;
    /** Provider endpoint、模型配置等发生变化后，旧 usage 和失败键不能复用。 */
    configurationIdentity?: () => string;
    /** 失败冷却须先落盘，再尝试后续模型请求。 */
    onFailure?: () => Promise<void>;
    enabled?: boolean;
    reserveTokens?: number;
    /** 触发阈值 = 当前输入预算 × 该百分比；显式 reserveTokens 优先。 */
    triggerPercent?: number;
    keepRecentTokens?: number;
    /** 保留段的消息条数上限；与 keepRecentTokens 双上限，取更保守的切分点。 */
    keepRecentMessages?: number;
    maxSummaryTokens?: number;
    /**
     * 运行时注入的压缩摘要模型；缺省回退当前对话模型。属于注入能力而非持久化配置，
     * 解析失败由注入方负责降级，这里不做额外校验。
     */
    resolveSummaryModel?: () => AgentModel;
    /** 与已解析摘要模型配套的容量；直接注入的宿主可显式提供。 */
    resolveSummaryBudget?: (model: AgentModel) => ModelContextBudget | undefined;
}
/**
 * Stateful model context for one agent session. It owns conversation history,
 * compaction and prompt assembly; workspace discovery stays in WorkspaceContext.
 */
export declare class ContextMemory {
    private readonly getModel;
    private readonly workspace;
    private readonly localMemory;
    private readonly maxTokens;
    private readonly instructionMaxBytes;
    private readonly onUsage;
    private readonly compactionOptions;
    private readonly onModelRequest;
    private readonly getModelRequestContext;
    private readonly memoryRetriever?;
    private readonly allowActivity;
    private readonly history;
    private summary;
    private checkpoint;
    private checkpointState;
    private checkpointEvidenceDraft;
    private compactedMessages;
    private lastCompactedAt;
    private lastBudget;
    private memoryUseEnabled;
    private memoryRecall;
    private memoryInjectedSummaries;
    private memoryRecallDegraded;
    private personalization;
    private promptEpoch;
    private promptEpochReason;
    private promptEpochCreatedAt;
    private promptProvider;
    private promptModel;
    private toolSchemaHash;
    private usageAnchor;
    private pendingRequest;
    private compactionFailure;
    private checkpointProjectionEnabled;
    private readonly resolveBudget;
    constructor(getModel: () => AgentModel, workspace: WorkspaceContext, localMemory: LocalMemory | undefined, maxTokens: number, instructionMaxBytes: number, onUsage?: ModelUsageObserver, getBudgetLimits?: () => ModelContextBudget, compactionOptions?: ContextCompactionOptions, onModelRequest?: ModelRequestObserver, getModelRequestContext?: () => ModelRequestContext | undefined, memoryRetriever?: HybridMemoryRetriever | undefined, allowActivity?: () => boolean);
    initialize(): Promise<void>;
    prepareTurn(input: string, prompt: PromptBundle | string, signal?: AbortSignal, attachments?: AgentAttachment[], useMemories?: boolean): Promise<PreparedAgentContext>;
    /** 逐阶段交还控制权，让宿主在耗时检索和压缩期间即可显示真实进度。 */
    prepareTurnProgress(input: string, prompt: PromptBundle | string | Promise<PromptBundle | string>, signal?: AbortSignal, attachments?: AgentAttachment[], useMemories?: boolean, includeInput?: boolean): AsyncGenerator<import("./types.js").PreparationStage, PreparedAgentContext>;
    replaceHistory(messages: AgentMessage[]): void;
    /**
     * checkpoint 是历史事实的低权限模型投影，不进入 system prompt，也不写回 canonical history。
     * 当前用户要求与系统规则始终优先；原始证据仍由 append-only session 保存。
     */
    projectCompactionCheckpoint(messages: AgentMessage[]): AgentMessage[];
    private currentCheckpointMessage;
    /**
     * 每次 provider 请求前的轻量上下文治理。把较早的 tool result 正文替换成一个占位说明，从最旧的
     * 开始，直到估算落回预算内。消息条数、角色、toolCallId 全部不变，配对关系天然保住；
     * 原文早就在 session JSONL；超出回合预算的结果则有 `.biny/tool-results` 引用。占位符
     * 会保留可重新读取的 archivePath 或一小段预览，只影响下一次推理，不改写持久化事实。
     *
     * 保留 `keepRecentToolResults` 条最近的结果不动：模型当下正要用的就是它们。
     */
    pruneToolResultsForStep(messages: AgentMessage[], keepRecentToolResults?: number): AgentMessage[];
    getBudget(): ContextBudgetStatus;
    recordProviderUsage(usage: AgentUsage, cacheHitRate?: number): void;
    snapshot(): SessionContextState;
    persistedState(): SessionContextState | undefined;
    getHistory(): AgentMessage[];
    setCheckpoint(checkpoint: SessionContextCheckpoint): void;
    getPromptEpoch(): number;
    getPromptEpochReason(): PromptEpochReason;
    getPromptEpochCreatedAt(): string;
    /** 稳定前缀发生不可忽略的变化时开启新 epoch；旧 JSONL 消息仍保持 append-only。 */
    advancePromptEpoch(reason: PromptEpochReason): void;
    observePromptModel(provider: string, modelId: string): void;
    observeToolResult(tool: string, args: unknown, result: unknown): void;
    compact(hint?: string, signal?: AbortSignal): Promise<CompactionResult>;
    /**
     * Provider 在长回合中拒绝上下文时，只压缩已经闭合的消息前缀。
     * 保留段按 assistant + tool-result 批次切分，不能把工具调用和结果从中间拆开。
     */
    compactRunContext(messages: AgentMessage[], signal?: AbortSignal): Promise<RunContextCompaction | undefined>;
    /** 完整 step 落库后，用下一请求的真实候选形状判断是否需要主动压缩闭合消息前缀。 */
    shouldCompactRunContext(context: AgentContext): boolean;
    compactRunContextIfNeeded(context: AgentContext, signal?: AbortSignal, projectedContext?: AgentContext): Promise<RunContextCompaction | undefined>;
    private compactClosedRunContext;
    restore(messages: AgentMessage[], state?: ContextBudgetStatus | SessionContextState): void;
    setPersonalization(metadata: PersonalizationMetadata, useMemories?: boolean): void;
    /** 丢弃缓存的工作区快照与 repo map；新会话或工作区在会话外被改动（如切分支）时调用。 */
    invalidateWorkspace(): void;
    status(): Promise<ContextStatus>;
    /** 在投影、剪枝和动态工具刷新之后采样，每一步替换上一请求的用量。 */
    recordRequest(input: ContextTokenInput): void;
    /** 工具变化必须在构建 requestContext 前推进缓存 epoch；token 只在 recordRequest 统计。 */
    recordToolSchema(tools: readonly AgentTool[]): void;
    formatCompaction(result: CompactionResult): string;
    private compactMessages;
    private shouldCompact;
    private compactionLimits;
    private createSummary;
    /** 语义召回条目；向量不可用时自动召回保持为空。 */
    private findRelevantMemory;
    private compactionStatus;
    private refreshEstimatedBudget;
    private syncBudgetMetadata;
    private currentBudget;
    private inputBudget;
}
export interface PreparedAgentContext {
    systemPrompt?: string;
    messages: AgentMessage[];
    compaction?: CompactionResult;
}
export interface RunContextCompaction {
    compacted: true;
    messages: AgentMessage[];
    summary: string;
    compactedMessageCount: number;
    retainedMessageCount: number;
    tokensBefore: number;
    checkpoint?: NonNullable<CompactionResult["checkpoint"]>;
}
export declare function truncateTextToTokens(value: string, maxTokens: number): string;
