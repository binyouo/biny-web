import type { TaskCommunication } from "../runtime/TaskCommunication.js";
import { type AgentConfig } from "../config/schema.js";
import { type AgentConfigStore } from "../config/store.js";
import type { SkillExtractionNotice, SkillExtractionOutcome } from "./skillExtraction.js";
import { type ModelChoice, type ModelManager, type ModelRuntimeInfo, type ThinkingSelection } from "../llm/ModelManager.js";
import { PermissionManager, type PermissionMode } from "../permission/PermissionManager.js";
import { type SessionSummary } from "../session/events.js";
import { SessionRecorder, type SessionEvent } from "../session/recorder.js";
import { type SessionReplay } from "../session/replay.js";
import { type RuntimeEventSink, type RuntimeHighWater } from "../session/runtimeEvent.js";
import type { CapabilityStore } from "../runtime/CapabilityStore.js";
import { type InterruptedTurn } from "../session/turnStore.js";
import type { ToolRegistry } from "../tools/registry.js";
import type { AgentModel, AgentMessage, AgentUsage } from "./core/types.js";
import type { AgentPermissionRequest, AgentPermissionResult, AgentRuntimeContext, AgentSessionEvent, AgentTurnOutcome } from "./types.js";
import { type ChatDiaryRefreshResult } from "./context/chatDiary.js";
import { type SelfReflectionActionCandidate } from "./context/selfReflection.js";
import { LocalMemory } from "./context/LocalMemory.js";
import { IdentityStorage } from "./context/identityStorage.js";
import { SessionSearchIndex } from "../session/searchIndex.js";
import { type MemoryEmbeddingRuntimeStatus } from "./context/MemoryEmbeddingService.js";
import { CrystalService } from "./context/crystalService.js";
import type { ContextStatus } from "./context/types.js";
import { type ModelRequestSummary } from "../observability/modelRequests.js";
import type { SessionUsage, UsageOperation, UsageSummary } from "../session/metadata.js";
import type { EmbeddingModelRuntime, LocalEmbeddingModelId } from "../llm/embedding/types.js";
import { type AgentAttachment } from "../attachments/store.js";
import { TodoStore } from "../session/todoStore.js";
import type { SessionGoalExpectation, SessionGoalStore } from "../runtime/SessionGoalStore.js";
import { type AgentPersonalizationState, type ChatPersonalizationOverridePatch, type GlobalPersonalizationUpdate } from "../personalization/index.js";
import type { MemoryEntry, MemorySearchOptions, MemorySearchResult, MemorySimilarSearchOptions, MemorySimilarityScan } from "./context/memoryTypes.js";
import { type AgentCapabilitySelection } from "./capabilitySelection.js";
import type { CheckpointEvidenceArgs } from "../extensions/checkpointEvidence.js";
import type { CapabilityPreselectionInput } from "./capabilityPreselection.js";
export interface AgentSessionOptions {
    workspaceRoot: string;
    persistenceRoot?: string;
    configStore?: AgentConfigStore;
    config: AgentConfig;
    model?: AgentModel;
    /** Activity 本地嵌入边界；宿主可共享已加载运行时，测试可注入协议 fake。 */
    getActivityEmbeddingRuntime?: () => Promise<EmbeddingModelRuntime | undefined>;
    toolRegistry: ToolRegistry;
    permissionManager: PermissionManager;
    recorder: SessionRecorder;
    modelManager?: ModelManager;
    skillPrompt?: string | ((selection?: AgentCapabilitySelection["skills"], runId?: string) => string | undefined | Promise<string | undefined>);
    /** 具名子代理定义元数据段（Task 可用的 agent 列表）。 */
    subagentPrompt?: string;
    skillPaths?: string[] | ((selection?: AgentCapabilitySelection["skills"], runId?: string) => string[]);
    selectCapabilities?: (input: CapabilityPreselectionInput, runId?: string) => Promise<AgentCapabilitySelection>;
    prepareToolDiscovery?: AgentRuntimeContext["prepareToolDiscovery"];
    /** MCP 服务器 initialize 返回的 instructions 汇总；重连后会变化，因此每回合实时读取。 */
    mcpPrompt?: () => string;
    /** 模型自己维护的计划清单；每回合实时读取，历史压缩不会让它丢失。 */
    todoPrompt?: () => string | undefined;
    /** Todo 真值源；session resume 与模型计划工具共用同一个实例。 */
    todoStore?: TodoStore;
    sessionGoals?: SessionGoalStore;
    taskCommunication?: TaskCommunication;
    /** 回合内首次改动工作区前建快照，供 /undo 回退；不在 git 仓库时省略。 */
    createCheckpoint?: (label: string) => Promise<unknown>;
    /** 已解析的附件物理目录；工具读取、重试与会话恢复共用，不是项目持久化根。 */
    attachmentRoot?: string;
    /** Host composition root 注入 SQLite authority；独立 AgentSession 可省略。 */
    runtimeEventSink?: RuntimeEventSink;
    /** Host-owned MCP/Plugin 调用的统一 Capability authority。 */
    capabilities?: CapabilityStore;
    /** 回合完成后识别出可复用 Recipe；只通知界面，不创建任何对象。 */
    onRecipeReady?: (notice: {
        recipe: import("../session/recipes.js").RecipeSuggestion;
        runId?: string;
    }) => void;
    /** 回合后技能提取（自进化）；由宿主装配辅助模型、技能目录与刷新，失败静默。 */
    extractSkill?: (input: {
        messageId: string;
        events: readonly SessionEvent[];
        minToolCalls: number;
        onNotice: (notice: SkillExtractionNotice) => void;
    }) => Promise<SkillExtractionOutcome | undefined>;
    /** 提取进度只通知界面，不进入消息时间线。 */
    onSkillExtractionUpdate?: (notice: SkillExtractionNotice & {
        runId: string;
    }) => void;
    onTitleGenerated?: (sessionId: string, title: string) => void;
    /** 自省识别出明确未完成行动后的持久化入口；只创建记录，不启动任务。 */
    createSelfReflectionTask?: (candidate: SelfReflectionActionCandidate) => Promise<boolean>;
}
export interface AgentRunOptions {
    abortSignal?: AbortSignal;
    /** 后台发起的消息保留来源，防止被当成用户原话建立日期索引。 */
    source?: "heartbeat" | "auto";
    confirmPermission?: (request: AgentPermissionRequest) => Promise<AgentPermissionResult>;
    /** 本次调用可消费的硬 step 上限；普通根回合默认使用配置的 hardStepLimit。 */
    maxSteps?: number;
    /**
     * 从已有 context 直接续跑，跳过上下文组装，也不再记一条用户消息。
     * 续跑的是同一个回合，不是新的一轮对话。
     */
    continueFrom?: AgentMessage[];
    /** 与 continueFrom 对应的系统提示词；普通根回合由 ContextMemory 生成。 */
    continueSystemPrompt?: string;
    /** 续跑同一 Turn 时不重复追加公开用户消息。 */
    recordSessionUserMessage?: boolean;
    /** 空输入启动新回合，只使用当前会话历史，不生成可见用户消息。 */
    emptyTurn?: boolean;
    attachments?: AgentAttachment[];
    /** Runtime host 为本次执行分配的 invocation identity。 */
    runId?: string;
    /** Runtime host 为本次 assistant 版本分配的消息 identity。 */
    messageId?: string;
    /** 同一个根任务及其 continuation 共用的稳定 turn identity。 */
    turnId?: string;
    /** 重新生成的目标消息；存在时沿同一会话版本槽生成，不追加新的 user_message。 */
    retryOfMessageId?: string;
    /** 编辑时替换的原用户消息 ID；与 retryOfMessageId 相同但会记录新的用户消息版本。 */
    replaceUserMessageId?: string;
    /** 编辑时使用的新用户输入；普通重试仍从目标用户消息读取原输入。 */
    replacementInput?: string;
    /** 编辑时预先分配的新用户消息 ID，供实时事件和 canonical 事件共用。 */
    replacementUserMessageId?: string;
    /** 编辑时要写入的用户消息版本元数据。 */
    replacementUserMessage?: {
        messageId?: string;
        parentMessageId?: string;
        slotId?: string;
    };
    /** 新版本在消息树中的父节点。 */
    retryParentMessageId?: string;
    /** 新版本所属的消息槽。 */
    retrySlotId?: string;
    /** 新版本回复的原始用户消息。 */
    replyToMessageId?: string;
    /** 本轮临时附加到 system context 的外部上下文，不改写要记录的用户原文。 */
    promptContext?: string;
    /** 当前回合临时选择的工具与 Skill；未提供时读取 chat 默认值。 */
    capabilitySelection?: AgentCapabilitySelection;
    /** 原始工具选择与自动筛选的模型声明名单分离；续跑从消息元数据恢复。 */
    toolAccessSelection?: AgentCapabilitySelection["tools"];
    /** 是否允许普通根回合完成后触发低频 context 情绪分析；内部自动任务显式关闭。 */
    emotionAnalysis?: boolean;
}
export type AgentPromptOptions = Pick<AgentRunOptions, "abortSignal" | "confirmPermission" | "attachments" | "runId" | "messageId" | "turnId" | "promptContext" | "capabilitySelection" | "emotionAnalysis">;
export type { AgentAttachment } from "../attachments/store.js";
export interface AgentSessionInfo {
    workspaceRoot: string;
    sessionId: string;
    sessionFile: string;
    provider: string;
    modelLabel: string;
    reasoningLabel: string;
    modelAlias: string;
    thinking: ThinkingSelection;
    contextWindow?: number;
    /** 上下文窗口未由模型元数据声明时为 true。 */
    contextWindowIsFallback?: boolean;
    /** 按模型有效窗口比例计算的可用输入窗口。 */
    effectiveContextWindow?: number;
    effectiveContextWindowPercent?: number;
    contextReserveTokens?: number;
    autoCompactTokenLimit?: number;
    /** 单轮允许注入的输入 token 预算；`getInfo()` 一直带着它，界面用它算上下文用量。 */
    maxInputTokens?: number;
    skills?: string[];
}
export interface ResumedAgentSession extends SessionReplay {
    filePath: string;
    sessionId: string;
}
interface UserAdmissionOptions {
    runId: string;
    turnId: string;
    messageId: string;
    attachments?: AgentAttachment[];
    replaceUserMessageId?: string;
    replacementUserMessageId?: string;
    source?: "heartbeat" | "auto";
}
/**
 * Stateful core agent for one workspace. Hosts use this public surface instead
 * of reaching into the model, recorder, tools or mutable conversation directly.
 */
export declare class AgentSession {
    private readonly options;
    private acpClient?;
    private acpClientKey?;
    private readonly contextMemory;
    private readonly createStagingContextMemory;
    private readonly localMemory;
    private readonly sessionSearchIndex;
    private readonly identityStorage;
    private readonly soulStorage;
    private readonly emotionStorage;
    private readonly fatigueService;
    private readonly emotionAnalysisScheduler;
    private readonly memoryModelFor;
    private readonly toolModel;
    private titleTask?;
    private titleTaskSessionId?;
    private pendingTitleSessionId?;
    private readonly titleAbort;
    private readonly localEmbeddingManager;
    private readonly memoryRetriever;
    private readonly memoryEmbeddingService;
    private readonly crystalService;
    private usageRecords;
    private sessionGoalRequest?;
    private runSessionGoalId?;
    private sessionGoalUsageFailure?;
    private modelRequestRecords;
    private unpersistedRelatedUsage;
    private recorder;
    private turnStore;
    private activeOperation;
    private activeRunMessageQueues;
    private readonly lingeringExternalTools;
    private readonly pendingCrystalTasks;
    private readonly queuedCrystalRuns;
    private readonly pendingMemoryTasks;
    private temporalIndexFlight;
    /** Runtime 已接纳的普通发送；让 canonical user_message 先于前台 generating 状态落盘。 */
    private readonly admittedUserMessages;
    private readonly pendingUserAdmissions;
    /** Only a hint to read fresh selected facts before leaving an owned retry view. */
    private retryScopedView;
    private closed;
    /** checkpoint 持久化结果不确定后只能关闭重开，禁止继续使用已经压缩的内存视图。 */
    private checkpointPersistenceError;
    /** 与 ContextMemory history 一一对应；内部 steering 消息没有持久化引用。 */
    private contextMessageReferences;
    private nextSessionMessageIndex;
    /** 新 root turn 开始时替换；同一 turn 的所有 model step 固定使用这份快照。 */
    private activeConfig;
    private activePersonalization;
    constructor(options: AgentSessionOptions);
    initialize(): Promise<void>;
    /** 技能元数据、具名子代理清单与 MCP instructions 共同构成 system prompt 的扩展段。 */
    private extensionPrompt;
    private skillPrompt;
    private skillPaths;
    private dailyNotesPrompt;
    private activityContextPrompt;
    /**
     * Fork 会话只补充父线程的轻量摘要；分支后的真实历史仍由 ContextMemory 管理，避免把父会话
     * 全量重新塞进每次请求。父线程读取失败时不阻断当前会话。
     */
    private parentThreadPrompt;
    /** 只把当前模型步骤真正可见的工具元数据交给提示词构建器。 */
    private promptTools;
    /** 重新生成也要使用和普通回合相同的稳定系统提示词，只替换消息上下文。 */
    private baseSystemPrompt;
    /** 将上下文准备阶段透传给宿主；完成后清除临时状态，包括未命中记忆的轮次。 */
    private prepareContext;
    private selectedToolNames;
    private prepareCapabilities;
    /** 每次 provider 请求前重新读取情绪，但只替换动态 prompt，不触发上下文重建。 */
    private currentEmotionPrompt;
    private analyzeContextEmotion;
    private recentEmotionMessages;
    /** 上次被打断、尚未收尾的回合；没有则为 undefined。 */
    interruptedTurn(): Promise<InterruptedTurn | undefined>;
    /** Desktop 的空输入入口仅对已暂停的断点改用会话历史；其他恢复仍走原有精确规则。 */
    isPausedInterruptedTurn(turn: InterruptedTurn): Promise<boolean>;
    /** 只补齐 session 中缺失的协议结果；恢复过程不调用任何工具执行函数。 */
    private reconcileInterruptedToolExecutions;
    private readonly capabilityOutcomeResolver;
    private readonly resolveDurableToolOutcome;
    /**
     * 从被打断的地方继续同一个回合。
     *
     * 用的是断点时的完整 context，所以已完成步骤的工具结果都还在，模型不需要重跑它们。
     * 没有可续跑的状态时抛错而不是静默开一个新回合 —— 后者会让用户以为续上了，其实是重来。
     */
    continueInterruptedTurn(runOptions?: AgentRunOptions): AsyncGenerator<AgentSessionEvent>;
    private finishRetryCommit;
    /** 暂停后的空输入沿会话历史开始新回合，不使用旧 turn 的执行断点。 */
    startInterruptedFollowup(runOptions?: AgentRunOptions): AsyncGenerator<AgentSessionEvent>;
    /** 持久记忆存储句柄；读取/自动贡献开关不影响显式 /memory 管理操作。 */
    getLocalMemory(): LocalMemory;
    /** 会话原文检索索引（派生数据，可重建）。 */
    getSessionSearchIndex(): SessionSearchIndex;
    /** 把当前会话 JSONL 的新增消息增量刷入检索索引。 */
    flushSessionSearchIndex(signal?: AbortSignal): Promise<void>;
    private scheduleTemporalIndex;
    getCrystalService(): CrystalService;
    /** 刷新文件型每日工作日志，并按记忆开关自动晋升高置信度自省结果。 */
    refreshDailyDiary(dateKey: string, options?: {
        signal?: AbortSignal;
        force?: boolean;
    }): Promise<ChatDiaryRefreshResult>;
    /** 当前长期记忆配置下的嵌入运行时；自动选择仅使用已配置且可用的 Provider。 */
    getEmbeddingRuntime(): Promise<EmbeddingModelRuntime | undefined>;
    /** 身份资料由同一个 AgentSession 读取，Desktop 也可通过本地存储服务复用这份权威。 */
    getIdentityStorage(): IdentityStorage;
    /** 返回当前 session 的疲劳值，供状态展示和测试观察。 */
    getFatigue(): number;
    private recordFatigueForMessages;
    /** 手动搜索与自动召回共用语义检索；显式 scope 缺省时搜索共享记忆库。 */
    searchMemory(query: string, paths: string[], options?: MemorySearchOptions): Promise<MemorySearchResult>;
    cancelMemoryMaintenance(): boolean;
    memoryEmbeddingStatus(): Promise<MemoryEmbeddingRuntimeStatus>;
    storedMemoryEmbeddingModel(): string | null;
    downloadMemoryEmbeddingModel(model: LocalEmbeddingModelId, signal?: AbortSignal): Promise<void>;
    cancelMemoryEmbeddingDownload(model: LocalEmbeddingModelId): boolean;
    removeMemoryEmbeddingModel(model: LocalEmbeddingModelId): Promise<{
        filesDeleted: number;
        bytesFreed: number;
    }>;
    rebuildMemoryEmbeddingIndex(signal?: AbortSignal): Promise<void>;
    cancelMemoryEmbeddingRebuild(): boolean;
    indexMemoryEntry(entry: MemoryEntry): Promise<void>;
    prepareMemorySynthesis(content: string, signal?: AbortSignal): Promise<((entry: MemoryEntry) => void) | undefined>;
    findMemorySimilarityPairs(entries: readonly MemoryEntry[], minimumSimilarity: number, signal?: AbortSignal): Promise<MemorySimilarityScan>;
    findMemorySimilarEntries(query: string, options: MemorySimilarSearchOptions): Promise<MemoryEntry[] | undefined>;
    removeMemoryEmbeddingEntries(entryIds: readonly string[]): void;
    /** 三端共享的读模型；正文只在 global/chat 配置中，resolved 元数据可安全投影到 session。 */
    getPersonalizationState(): Promise<AgentPersonalizationState>;
    /** 更新当前聊天覆盖。catalog 的内容哈希是跨进程 CAS，过期界面不能覆盖新值。 */
    updateChatPersonalization(patch: ChatPersonalizationOverridePatch, expectedRevision: string): Promise<AgentPersonalizationState>;
    /**
     * 更新全局基础策略。调用方必须带 overview 返回的 configRevision；不支持 versioned CAS 的
     * 嵌入式测试 store 只能读取，不能通过这个入口执行可能丢更新的写入。
     */
    updateGlobalPersonalization(update: GlobalPersonalizationUpdate, expectedRevision: string): Promise<AgentPersonalizationState>;
    runMemoryCommand(args: string[]): Promise<string>;
    runSoulCommand(args: string[]): Promise<string>;
    /** Desktop/TUI 的公开交互入口。 */
    prompt(input: string, options?: AgentPromptOptions): AsyncGenerator<AgentSessionEvent>;
    /**
     * 在同一会话中重新生成指定 assistant 版本。
     *
     * 只把目标之前的活动路径交给模型，新的回答沿原消息的 parent/slot 追加；普通重试不追加
     * user_message，编辑则会在同一用户 slot 写入新的用户版本。原 JSONL 版本仍保留，回放时由
     * 消息树选择活动路径，因此不会产生侧栏子会话。
     */
    retry(targetMessageId: string, options?: AgentRunOptions): AsyncGenerator<AgentSessionEvent>;
    /** 选择同一消息槽的上一/下一回答版本，并立即让新的活动路径生效。 */
    switchMessageVersion(messageId: string, direction: "prev" | "next"): Promise<void>;
    queueSteering(messageId: string, input: string, attachments?: AgentAttachment[]): Promise<void>;
    queueMessage(messageId: string, input: string, attachments?: AgentAttachment[]): Promise<void>;
    /**
     * 在 Host 发布 run.started 前持久化普通用户消息。
     *
     * 这一步只负责 durable admission，不读取 workspace、记忆或模型；真正的上下文准备仍由
     * runTurn 统一完成。runTurn 会复用这里产生的 reference，避免重复写入 user_message。
     */
    admitUserMessage(input: string, options: UserAdmissionOptions): Promise<void>;
    private admitUserMessageOnce;
    private admitTurnFromSelectedRetryView;
    queuedRunMessages(): import("../runtime/agentEvents.js").QueuedRunMessageSnapshot[];
    updateQueuedRunMessage(messageId: string, input: string): Promise<void>;
    removeQueuedRunMessage(messageId: string): Promise<void>;
    moveQueuedRunMessage(messageId: string, targetMessageId: string, placeAfter: boolean): Promise<void>;
    steerQueuedRunMessage(messageId: string): Promise<void>;
    steerAllQueuedRunMessages(): Promise<void>;
    private queueRunMessage;
    private requireActiveRunMessageQueues;
    private requireQueuedMessage;
    private runTurn;
    private runExternalAcp;
    private runTurnLoop;
    runTask(input: string, runOptions?: AgentRunOptions): Promise<AgentTurnOutcome>;
    resume(session: string | undefined): Promise<ResumedAgentSession>;
    /**
     * 开始一个全新的空会话，但不销毁这个 AgentSession。
     *
     * 常驻 runtime 的昂贵基础设施（MCP 连接、记忆索引、技能、工具注册、模型管理）全部保留，
     * 只把会话级状态重置到「刚构造」的样子：换一个全新的 SessionRecorder（新 sessionId）、
     * 清空用量与上下文、丢掉上一会话的权限授予和计划清单。这样 Desktop 点「新聊天」时不必
     * 付出整量重建（重连 MCP、重开 store、重扫 skill）的代价。
     *
     * 只能在空闲时调用——由 InteractiveAgentRuntime 的 maintenance 临界区保证没有进行中的回合。
     * 返回新会话的 sessionId。
     */
    startNewSession(): Promise<string>;
    /** 后台验收与当前会话共用记录器；恢复或切换会话后不得继续持有构造时的实例。 */
    getSessionRecorder(): SessionRecorder;
    listSessions(): Promise<SessionSummary[]>;
    contextStatus(): Promise<ContextStatus>;
    /** 本会话累计用量的快照；evals 和宿主用它做度量，拿到的是副本不是内部数组。 */
    usageSummary(): UsageSummary;
    /** 当前 AgentSession 内原生 Provider 请求的性能快照；正文不进入该汇总。 */
    modelRequestSummary(): ModelRequestSummary;
    private sideModelRequestContext;
    currentSessionGoalRequest(): (SessionGoalExpectation & {
        runId: string;
        generation: number;
    }) | undefined;
    sessionGoalUnavailableReason(): string | undefined;
    private sessionGoalBudgetStopped;
    usageReport(): string;
    /** 当前激活模型不支持媒体时返回明确错误；输入本身已先写入会话，方便恢复和切换模型后重试。 */
    assertAttachmentsSupported(attachments: AgentAttachment[]): void;
    observeModelUsage(usage: AgentUsage, operation: UsageOperation, modelAlias?: string): void;
    private usedExternalContext;
    /** 回合终态后的旁路检测；它读取 canonical session，不增加模型请求或改变回合结果。 */
    private enqueueRecipeSuggestions;
    /**
     * 回合后技能提取（自进化）：只在成功回合触发，由宿主装配的辅助模型与技能目录
     * 完成分析；保存成功后向本回合消息记 metadata 留审计痕迹。任何失败静默。
     */
    private enqueueSkillExtraction;
    readCheckpointEvidence(args: CheckpointEvidenceArgs, signal?: AbortSignal): Promise<unknown>;
    compactConversation(hint?: string, signal?: AbortSignal): Promise<string>;
    private persistContextCheckpoint;
    listModels(): ModelChoice[];
    switchModel(alias: string, thinking?: ThinkingSelection): Promise<ModelRuntimeInfo>;
    refreshModelFromDisk(): Promise<ModelRuntimeInfo>;
    refreshModelCatalog(providerAlias?: string): Promise<ModelChoice[]>;
    getInfo(): AgentSessionInfo;
    getPermissionMode(): PermissionMode;
    /** 装配期 AgentSession 先于宿主 Runtime 构造；宿主构造完成后再用 setter 接上事件通道。 */
    setOnRecipeReady(callback: AgentSessionOptions["onRecipeReady"]): void;
    setOnSkillExtractionUpdate(callback: AgentSessionOptions["onSkillExtractionUpdate"]): void;
    setOnTitleGenerated(callback: AgentSessionOptions["onTitleGenerated"]): void;
    private scheduleTitle;
    setPermissionMode(mode: PermissionMode): Promise<void>;
    runPermissionCommand(args: string[]): Promise<string>;
    recordError(error: unknown, usage?: SessionUsage): void;
    private recordModelRequest;
    private recordTurnOutcome;
    /**
     * 取消前先把当时的模型上下文固定下来。暂停与显式停止保留模型可见边界，
     * 让后续自由输入知道上轮未完成；replaced 只保留真实上下文，避免误称用户放弃任务。
     */
    private recordCancelledTurn;
    /**
     * Host 层收尾时的幂等终态入口。正常 Agent Loop 已经写过 turn_status；
     * 未捕获异常等宿主级失败则由这里补一条 canonical terminal fact。
     */
    readTerminalOutcome(runId: string, turnId: string): Promise<Extract<SessionEvent, {
        type: "turn_status";
    }> | undefined>;
    ensureTerminalOutcome(runId: string, turnId: string, outcome: AgentTurnOutcome): Promise<RuntimeHighWater>;
    recordHostedUserMessage(content: string): void;
    recordHostedAssistantMessage(content: string): void;
    recordHostedToolCall(tool: string, args: unknown, toolCallId: string): number;
    recordHostedToolResult(tool: string, result: unknown, toolCallId: string, sequence: number): void;
    private takeQueuedRunMessages;
    private recordCanonicalMessage;
    private referenceForRecordedMessage;
    private recordIntermediateAssistant;
    close(): Promise<void>;
    private beginOperation;
    private assertNotQuarantined;
    private recordModelUsage;
    private takeRelatedUsage;
    private runtimeContext;
    private persistenceRoot;
    private configStore;
    private readPersonalizationState;
    private providerEmbeddingModels;
    private resolvedMemoryEmbeddingRef;
    private activeMemoryEmbeddingRuntime;
    private refreshMemoryConfig;
    private clearEmbeddingRebuildMarker;
    /**
     * 只把权限模式写回配置文件。
     *
     * 内存里的 config 是运行时创建时读到的快照，之后可能已经落后于磁盘（桌面端多个项目共用
     * 同一份配置，别的运行时切模型、刷新 OAuth token 都会改盘上的内容）。整份写回会把这些改动
     * 覆盖掉——表现出来就是「改一次权限模式，模型被切回旧的默认模型」。因此这里读盘后只改
     * `permission.mode` 再保存。
     */
    private savePermissionMode;
    private supportedAttachments;
    private rehydrateSessionAttachments;
    private scheduleCrystalRun;
}
