import type { ActivityAnalysisSnapshot, ActivityEventType, ActivitySnapshotStorageTier, ActivitySource, ActivityStorageTier } from "./types.js";
import type { ActivityAnySummaryRecord, ActivitySummaryKind, ActivitySummaryRecord, ActivitySummarySource, ActivitySummaryStats, ActivityWeeklySummaryRecord, ActivityWeeklySummaryStats } from "./summary.js";
export interface ActivityEventInput {
    sessionId: string;
    occurredAt: string;
    eventType: ActivityEventType | string;
    source?: ActivitySource;
    application?: string;
    bundleId?: string;
    windowTitle?: string;
    rawText?: string;
    rawOcrText?: string;
    /** 结构化 URL 列：只保留站点、端口和路径，不保存凭据、查询参数或片段。 */
    url?: string;
    /** 截图的幂等键，用于重启后把 OCR 投影回原截图。 */
    captureId?: string;
    mouseEventType?: string;
    mouseButton?: string;
    /** 全局输入监听只保留 keyCode/modifier，不保存字符内容。 */
    keyCode?: number;
    keyModifiers?: number;
    mouseX?: number;
    mouseY?: number;
    /** keypress 聚合的首个 keyDown 时间；occurredAt 保留最后一个 keyDown 时间。 */
    inputEventFirstAt?: string;
    fallbackReason?: string;
    via?: string;
    inputEventCount?: number;
}
export interface ActivityFallbackCaptureInput extends ActivityEventInput {
    jpeg: Uint8Array;
    width?: number;
    height?: number;
    captureTrigger?: string;
    contentHash?: string;
    histogram?: number[];
    histogramChange?: number;
    pixelDiff?: number;
}
export interface ActivitySessionRecord {
    id: string;
    startedAt: string;
    endedAt?: string;
    snapshotCount: number;
    eventCount: number;
    applications: string[];
    /** Session 分析投影；未分析的 session 为空，设置页用它做最近会话的标题/摘要。 */
    analysisTitle?: string;
    analysisDescription?: string;
}
export interface ActivityStoreSnapshot {
    sessions: number;
    events: number;
    fallbackCaptures: number;
    storageBytes: number;
    recentSessions: ActivitySessionRecord[];
    analysis?: ActivityAnalysisSnapshot;
}
export type ActivityRecordId = string;
export interface ActivitySearchResult {
    id: ActivityRecordId;
    sessionId: string;
    snapshotId?: string;
    createdAt?: number;
    occurredAt: string;
    source: ActivitySource;
    eventType: string;
    application?: string;
    windowTitle?: string;
    summary: string;
    /** 已脱敏的 OCR 投影；只在主动搜索/回看时返回，原始截图不会进入工具结果。 */
    ocrText?: string;
    url?: string;
    fallbackReason?: string;
    snapshotPath?: string;
    mouseButton?: string;
    keyCode?: number;
    keyModifiers?: number;
    mouseX?: number;
    mouseY?: number;
    inputEventFirstAt?: string;
}
export interface ActivityStoredEvent extends ActivitySearchResult {
    inputEventCount: number;
    snapshotId?: ActivityRecordId;
    captureId?: string;
}
/** 回看和文件接口使用的截图元数据。 */
export interface ActivitySnapshotRecord {
    id: ActivityRecordId;
    sessionId: string;
    capturedAt: string;
    filePath?: string;
    bytes: number;
    width?: number;
    height?: number;
    trigger?: string;
    contentHash?: string;
    histogram?: number[];
    histogramChange?: number;
    pixelDiff?: number;
    storageTier: ActivitySnapshotStorageTier;
}
/** 单个 session 的可回看事件；文本已经在写入时完成脱敏。 */
export type ActivitySessionEvent = ActivityStoredEvent;
export interface ActivityOcrFrame {
    id: ActivityRecordId;
    sessionId: string;
    snapshotId: ActivityRecordId;
    occurredAt: string;
    text: string;
    application?: string;
    windowTitle?: string;
}
/** 本地 REST 会话元数据使用 Unix 毫秒和显式 null，与内部 ISO 展示模型隔离。 */
export interface ActivityHttpSessionRecord {
    id: string;
    startedAt: number;
    endedAt: number | null;
    durationMs: number | null;
    triggerKind: string;
    appNames: string[];
    eventCount: number;
    snapshotCount: number;
    totalBytes: number;
    analysisStatus: string;
    analysisTitle: string | null;
    analysisDescription: string | null;
    analysisModel: string | null;
    analysisError: string | null;
    analyzedAt: number | null;
    worthMemory: boolean;
    worthKnowledge: boolean;
    isMeeting: boolean;
    storageTier: string;
    entities: Record<string, unknown> | string[];
    topics: string[];
    project: string | null;
    highlights: string[];
    createdAt: number;
    updatedAt: number;
}
export interface ActivityOcrEmbeddingSource {
    id: ActivityRecordId;
    sessionId: string;
    text: string;
}
export interface ActivityOcrEmbeddingRow extends ActivityOcrEmbeddingSource {
    createdAt: number;
    snapshotId: string;
    occurredAt: string;
    startedAt: string;
    application?: string;
    windowTitle?: string;
    embedding: Float32Array;
}
export interface ActivityAnalysisCommit {
    label?: string;
    ref?: string;
    repo?: string;
    hash?: string;
    message?: string;
    url?: string;
}
/** entities 分组；顶层兼容字段仍保留，便于旧报告和语义索引继续工作。 */
export interface ActivityAnalysisEntityDetails {
    prs: ActivityAnalysisReference[];
    issues: ActivityAnalysisReference[];
    commits: ActivityAnalysisCommit[];
    people: string[];
    identifiers: string[];
    repos: string[];
    versions: string[];
    events: string[];
    decisions: string[];
    urls: string[];
}
/** 分析结果里的结构化引用（PR / issue）。字段全部可选，由模型按可见证据填写。 */
export interface ActivityAnalysisReference {
    label?: string;
    ref?: string;
    repo?: string;
    number?: number;
    url?: string;
    title?: string;
}
/** 落库的单个 session 分析结果（activity_sessions 内联字段的内存形态）。 */
export interface ActivitySessionAnalysis {
    sessionId: string;
    analyzedAt: string;
    analyzerModel: string;
    /** 与 session 行同步的分析状态；旧分析行没有该投影时按 analyzed 读取。 */
    analysisStatus?: "pending" | "skipped" | "failed" | "analyzed" | "not_worth";
    project?: string;
    /** session card 的短标题和详细描述；旧分析行可能没有这两列。 */
    title?: string;
    description?: string;
    summary: string;
    topics: string[];
    prs: ActivityAnalysisReference[];
    issues: ActivityAnalysisReference[];
    people: string[];
    versions: string[];
    decisions: string[];
    /** 提到的具体实体（项目、库、服务、文件/页面名等），用于语义检索与实体回溯。 */
    entities: string[];
    /** 值得记住的高光/产出，短句列表；worthMemory 为真时优先写进记忆。 */
    highlights: string[];
    /** entities 中额外抽取的提交、标识符、仓库、事件和 URL。 */
    commits?: ActivityAnalysisCommit[];
    identifiers?: string[];
    repos?: string[];
    events?: string[];
    urls?: string[];
    entityDetails?: ActivityAnalysisEntityDetails;
    /** 该 session 是否值得写入长期记忆。 */
    worthMemory: boolean;
    /** 该 session 是否值得沉淀为知识（报告/摘要里单独标注，供知识层消费）。 */
    worthKnowledge: boolean;
    /** 该 session 是否是会议/沟通（视频/语音/聊天）。 */
    isMeeting: boolean;
    /** 存储档位，默认 standard。 */
    storageTier: ActivityStorageTier;
    confidence: number;
    sourceEventCount: number;
    inputHash: string;
}
/** 报告渲染所需的分析行：关联上 session 的开始时间用于排序与按日过滤。 */
export interface ActivityAnalysisReportRow extends ActivitySessionAnalysis {
    sessionStartedAt: string;
}
/** 日报只看日期内最新 1000 个 session，分析和活动时长都以这批行作为权威。 */
export interface ActivityReportSourceSession {
    id: string;
    startedAt: string;
    endedAt?: string;
    durationMs: number;
    appNames: string[];
    focusEvents: Array<{
        at: string;
        app?: string;
    }>;
    browserUrls: string[];
    analysis?: ActivityAnalysisReportRow;
}
/** 兜底 sweep 找出的「已结束但还没分析」的 session。 */
export interface ActivityPendingAnalysisSession {
    id: string;
    startedAt: string;
    endedAt: string;
    eventCount: number;
    durationMs: number;
    snapshotCount: number;
    appNames: string[];
}
/**
 * 组装分析输入时只读取已脱敏的事件摘要与 OCR 文本。快照路径、输入事件计数都不在这条
 * 查询里；OCR 文本在写入时已脱敏，并由分析层按预算裁剪。
 */
export interface ActivityEventSummary {
    occurredAt: string;
    summary: string;
    application?: string;
    windowTitle?: string;
    eventType?: string;
    ocrText?: string;
    url?: string;
}
/** 单次分析的一致输入与提交前状态；不改变持久化 input_hash 格式。 */
export interface ActivitySessionAnalysisSnapshot {
    session: ActivityPendingAnalysisSession;
    events: ActivityEventSummary[];
    ocrTexts: string[];
    revision: string;
    state: string;
    analysis?: ActivitySessionAnalysis;
}
export type ActivityAnalysisChange = {
    analysis: ActivitySessionAnalysis;
} | {
    status: "skipped" | "failed";
    details: {
        model?: string;
        error?: string;
        analyzedAt?: string;
        description?: string;
    };
};
/** digest / sessions 工具的近期 session 行：session 元数据 + 已落库的分析（可缺）。 */
export interface ActivityRecentSessionRow {
    id: string;
    startedAt: string;
    endedAt?: string;
    eventCount: number;
    analysis?: ActivitySessionAnalysis;
}
/** session 详情：元数据 + 事件摘要 + 分析结果。 */
export interface ActivitySessionDetail {
    id: string;
    startedAt: string;
    endedAt?: string;
    eventCount: number;
    events: ActivitySessionEvent[];
    snapshots: ActivitySnapshotRecord[];
    analysis?: ActivitySessionAnalysis;
}
export declare function resolveActivityDirectory(value: string): string;
export type ActivitySnapshotCompressor = (file: string, target: {
    width: number;
    height: number;
    quality: number;
}) => Promise<{
    data: Buffer;
    width: number;
    height: number;
}>;
export declare class ActivityStore {
    private database?;
    private root?;
    open(directory: string, agentDir: string): Promise<void>;
    close(): Promise<void>;
    startSession(startedAt: string, triggerKind?: string): string;
    endSession(sessionId: string, endedAt: string): void;
    /** 启动时收口上次异常退出遗留的 open session，避免它们继续被日报当作进行中记录。 */
    closeOpenSessions(endedAt: string): void;
    recordEvent(input: ActivityEventInput): ActivityStoredEvent;
    recordFallbackCapture(input: ActivityFallbackCaptureInput): Promise<ActivityStoredEvent>;
    snapshot(limit?: number): ActivityStoreSnapshot;
    search(query: string, limit?: number): ActivitySearchResult[];
    /** 兜底 sweep：每轮优先分析最新开始的已结束 session，避免积压拖延近期活动。 */
    listSessionsPendingAnalysis(limit?: number): ActivityPendingAnalysisSession[];
    /** 指定 session 开始时间范围内的待分析行，日报补分析不能被全局 LIMIT 截断。 */
    listSessionsPendingAnalysisForDateRange(startIso: string, endIso: string, limit?: number): ActivityPendingAnalysisSession[];
    /** 选最新待分析会话，再按时间正序合并相邻且应用集合相交的活动。 */
    mergePendingAdjacent(mergeGapMs?: number): number;
    /** 独立进程清空后也会变化；旧操作不能只依赖本进程的 AbortSignal。 */
    clearRevision(): string;
    /** 原始活动和分析输出的提交版本；读取为常数开销，不扫描历史数据。 */
    activityRevision(): string;
    /** 分析前的 session 元数据；未找到或尚未结束（进行中）时返回 undefined。 */
    getEndedSession(sessionId: string): ActivityPendingAnalysisSession | undefined;
    /** 读取语义事件，并把独立 OCR frame 作为单独输入；截图 event 本身不重复计入事件流。 */
    listSessionEventSummaries(sessionId: string): ActivityEventSummary[];
    /** 分析模型只读取最早完成的 OCR 帧；全量事件读取仍用于输入 hash。 */
    listSessionAnalysisOcrTexts(sessionId: string, limit?: number): string[];
    /** Digest 取最早完成的少量已脱敏 OCR 帧，与会话分析的取样方向一致。 */
    listSessionOcrExcerpts(sessionId: string, limit?: number): string[];
    /** 读取设置页回看所需的事件、OCR 摘要和截图元数据；原始路径只留在主进程内部。 */
    getSessionDetail(sessionId: string, limit?: number): ActivitySessionDetail | undefined;
    getSummary(kind: "daily", dateKey: string): ActivitySummaryRecord | undefined;
    getSummary(kind: "weekly", dateKey: string): ActivityWeeklySummaryRecord | undefined;
    getSummary(kind: ActivitySummaryKind, dateKey: string): ActivityAnySummaryRecord | undefined;
    private summaryFromRow;
    /** REST 只公开摘要字段；日报缓存仍留在同一持久行供内部重用。 */
    getHttpSummary(kind: ActivitySummaryKind, dateKey: string): {
        id: string;
        kind: ActivitySummaryKind;
        dateKey: string;
        summary: string | null;
        stats: ActivitySummaryStats | ActivityWeeklySummaryStats;
        model: string | null;
        isPartial: boolean;
        createdAt: number;
        updatedAt: number;
    } | undefined;
    upsertSummary(summary: ActivityAnySummaryRecord): void;
    /**
     * 提供给 summary.ts 的聚合源。
     *
     * 日报按 session.started_at 选取 session，再读取该 session 的完整时长、appNames、
     * app_focus、累计截图数和 OCR；不能按事件时间或 session 与日期的重叠区间裁剪。
     */
    getActivitySummarySource(startIso: string, endIso: string, limit?: number): ActivitySummarySource;
    /** 只给主进程读取截图；相对路径经过根目录约束，renderer 不接触文件系统路径。 */
    getSnapshotPath(snapshotId: ActivityRecordId): string | undefined;
    /**
     * 把独立 OCR 进程返回的文字写回已落库 snapshot。
     *
     * 截图和 OCR 必须分开提交：Vision 可能耗时，不能让它决定截图是否存在；这里仍复用
     * 与首次写入相同的文字处理逻辑，保证搜索与分析看到一致的数据。
     */
    updateSnapshotOcr(snapshotId: ActivityRecordId, rawOcrText: string | undefined): void;
    updateSnapshotOcrByCaptureId(captureId: string, rawOcrText: string | undefined): boolean;
    /** 最近的独立 OCR 帧，供普通聊天上下文和 Activity 分析按预算读取。 */
    listRecentOcrFrames(sinceIso: string, limit?: number): ActivityOcrFrame[];
    /** 当前 embedding 指纹下尚未向量化的整帧 OCR；只读，供后台限量补齐。 */
    listOcrEmbeddingSources(fingerprint: string, limit?: number): ActivityOcrEmbeddingSource[];
    upsertOcrEmbedding(frameId: ActivityRecordId, fingerprint: string, embedding: Float32Array, embeddedAt: string, modelId?: string): boolean;
    listOcrEmbeddingRows(fingerprint: string, limit?: number): ActivityOcrEmbeddingRow[];
    getAnalysis(sessionId: string): ActivitySessionAnalysis | undefined;
    /** 多次查询共享读快照，避免模型收到不同提交版本的事件和 OCR。 */
    readAnalysisSnapshot(sessionId: string): ActivitySessionAnalysisSnapshot | undefined;
    /** 先取得写锁，再核对并提交；不持锁等待模型，也不重置已经变化的行。 */
    commitAnalysisIfCurrent(snapshot: ActivitySessionAnalysisSnapshot, change: ActivityAnalysisChange): boolean;
    /** 仅在调用方的同步读/写事务内使用；状态行不能被 input_hash 过滤。 */
    private captureAnalysisSnapshot;
    /** 输入变化后重新排队分析，不保留已经失效的旧结论。 */
    private resetSessionAnalysis;
    /** 仅重新排队已结束的失败记录，事务内清理旧分析缓存，保留全部采集事实。 */
    retryFailedAnalysis(): number;
    /** 记录模型尚未产出结构化分析时的 session 状态；正文分析行保持为空，便于区分重试和已处理。 */
    recordAnalysisStatus(sessionId: string, status: "pending" | "skipped" | "failed", details?: {
        model?: string;
        error?: string;
        analyzedAt?: string;
        title?: string | null;
        description?: string | null;
    }): void;
    /** 幂等写入：同一 session 重复分析时按主键覆盖。 */
    recordAnalysis(analysis: ActivitySessionAnalysis): void;
    /** 指定时间范围（按 session 开始时间）内的分析行，按时间升序，供报告渲染。 */
    listAnalysisForDateRange(startIso: string, endIso: string): ActivityAnalysisReportRow[];
    listReportSourceForDateRange(startIso: string, endIso: string): ActivityReportSourceSession[];
    /** digest / sessions 工具的近期 session 行，包含已落库的分析。 */
    listRecentSessionsWithAnalysis(sinceIso: string, limit?: number): ActivityRecentSessionRow[];
    listSessionsWithAnalysis(options: {
        sinceIso: string;
        untilIso?: string;
        analysisStatus?: string;
        startedAtOnly?: boolean;
        limit?: number;
        offset?: number;
    }): ActivityRecentSessionRow[];
    /** HTTP 详情使用原始 kind/data 事件和独立 OCR 帧；桌面与 CLI 仍用各自的展示投影。 */
    getHttpSessionDetail(sessionId: string): {
        session: ActivityHttpSessionRecord;
        events: {
            id: string;
            sessionId: string;
            timestamp: number;
            kind: string;
            appName: string | null;
            data: Record<string, unknown>;
            createdAt: number;
        }[];
        snapshots: {
            id: string;
            sessionId: string;
            timestamp: number;
            filePath: string | null;
            width: number;
            height: number;
            sizeBytes: number;
            trigger: string;
            appName: string | null;
            windowTitle: string | null;
            hashHex: string | null;
            histogram: number[] | null;
            diffPct: number | null;
            storageTier: ActivitySnapshotStorageTier;
            createdAt: number;
        }[];
        ocr: {
            id: string;
            snapshotId: string;
            text: string;
            charCount: number;
            createdAt: number;
            hasEmbedding: boolean;
        }[];
    } | undefined;
    /** REST 会话列表按开始时间过滤；内部近期 digest 仍可包含跨越 since 的会话。 */
    listHttpSessions(options: {
        since?: number;
        until?: number;
        analysisStatus?: string;
        limit?: number;
        offset?: number;
    }): ActivityHttpSessionRecord[];
    getLatestApplicationFocus(sessionId: string, untilIso: string): {
        occurredAt: string;
        application?: string;
        bundleId?: string;
    } | undefined;
    listOpenHttpSessions(limit?: number): ActivityHttpSessionRecord[];
    /** 单条历史删除同时清理关联截图与检索索引；进行中的 session 由采集宿主持有。 */
    deleteSession(sessionId: string): Promise<"deleted" | "not_found" | "active">;
    /** session 元数据；不存在返回 undefined（不要求已结束，session_show 也要能看进行中的）。 */
    getSessionRecord(sessionId: string): {
        id: string;
        startedAt: string;
        endedAt?: string;
        eventCount: number;
    } | undefined;
    /** worthMemory=1 的分析行（按分析时间升序），供记忆同步消费。 */
    listWorthMemoryAnalyses(limit?: number): ActivitySessionAnalysis[];
    /** 项目名归一化候选：最近 sinceIso 以来出现次数最多的项目名。 */
    listRecentProjects(sinceIso: string, limit?: number): string[];
    /**
     * 缺当前指纹向量的分析行（未嵌入过，或换过嵌入模型指纹不匹配）。按分析时间升序，
     * 语义检索工具每次调用补嵌入一部分；source_event_count 过滤掉心跳/零星占位。
     */
    clear(): Promise<void>;
    private findStoredEventByCaptureId;
    /** 宿主启动时修复孤儿文件；普通查询开库不扫描目录，也不等待截图文件锁。 */
    reconcileSnapshotFiles(): Promise<void>;
    private insertEvent;
    /**
     * 按 hot/warm/cold 策略维护截图文件。降级和容量淘汰都限制单轮处理量，避免新图
     * 写入时被一轮大清理阻塞；超过 cold 保留期时删除 snapshot 行，让 OCR 按外键级联删除。
     */
    rotateSnapshots(maxStorageMb: number, now?: Date, recompress?: ActivitySnapshotCompressor): Promise<void>;
    private updateSnapshotTier;
    private updateSnapshotStorage;
    private deleteSnapshot;
    /** Activity session 持久化结束时长和更新时间；旧库在打开时补列并回填已结束行。 */
    private ensureSessionColumns;
    private ensureSessionCompatibilityColumns;
    private ensureSummaryColumns;
    private requireDatabase;
    private requireRoot;
}
