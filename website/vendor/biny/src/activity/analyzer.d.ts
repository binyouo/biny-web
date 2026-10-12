import type { AgentModel } from "../agent/core/types.js";
import type { ActivityPendingAnalysisSession, ActivityReportSourceSession, ActivitySessionAnalysis, ActivityStore } from "./store.js";
/** 零星 session 判定：三个条件同时成立才跳过模型。 */
export declare const ACTIVITY_ANALYSIS_MIN_SESSION_DURATION_MS = 30000;
export declare const ACTIVITY_ANALYSIS_MIN_EVENTS = 20;
export declare const ACTIVITY_ANALYSIS_MIN_SNAPSHOTS = 3;
/** 单个 session 放进分析 prompt 的 OCR 字符预算。 */
export declare const ACTIVITY_ANALYSIS_MAX_OCR_CHARS = 18000;
/** 单个 session 放进分析 prompt 的事件上限。 */
export declare const ACTIVITY_ANALYSIS_MAX_EVENTS_IN_PROMPT = 80;
/** 心跳/零星 session 的占位摘要；报告渲染会把这类占位过滤掉。 */
export declare const ACTIVITY_TRIVIAL_SUMMARY = "\u96F6\u661F\u6D3B\u52A8";
/** 模型两次输出都无法解析时落库的占位摘要；同样不进报告。 */
export declare const ACTIVITY_ANALYSIS_FAILED_SUMMARY = "\u6D3B\u52A8\u5206\u6790\u5931\u8D25";
export type ActivityAnalysisOutcome = {
    status: "analyzed";
    analysis: ActivitySessionAnalysis;
    cached: boolean;
} | {
    status: "trivial";
    analysis: ActivitySessionAnalysis;
} | {
    status: "skipped";
    reason: "session_not_ended" | "no_model" | "session_changed";
} | {
    status: "error";
    error: string;
};
export interface ActivityMemoryCandidate {
    type: "project" | "feedback" | "reference" | "user";
    content: string;
    why: string;
}
export interface ActivityMemoryWriteContext {
    sessionId: string;
    analyzedAt: string;
    project?: string;
    /** Activity 分析和记忆写入共用同一个模型实例，避免模型漂移和重复创建。 */
    model: AgentModel;
    signal?: AbortSignal;
    checkpoint?: () => Promise<void>;
}
export interface ActivityAnalyzerDeps {
    store: ActivityStore;
    /**
     * 分析所用模型。省略时需要模型的 session 标记为 skipped，不生成伪分析内容；
     * 配置工具模型后可显式重分析。
     */
    model?: AgentModel;
    signal?: AbortSignal;
    checkpoint?: () => Promise<void>;
    /** 可注入时钟，便于测试固定 analyzedAt 与「今天」。 */
    now?: () => Date;
    /** 分析完成后把模型挑出的稳定事实写入统一记忆库；失败不能影响 Activity 分析结果。 */
    writeMemories?: (candidates: readonly ActivityMemoryCandidate[], context: ActivityMemoryWriteContext) => Promise<void>;
    /** 分析完成后的统一主题投影；重复调用必须由下游锚点去重。 */
    onAnalyzed?: (analysis: ActivitySessionAnalysis, session: ActivityPendingAnalysisSession, signal?: AbortSignal) => Promise<void>;
    /** 有资源所有者时收集投影任务；未提供时调用方等待投影完成。 */
    deferProjection?: (task: Promise<void>) => void;
}
export interface ActivitySweepResult {
    evaluated: number;
    analyzed: number;
    trivial: number;
    blocked: number;
    errors: number;
}
export interface ActivityReportRange {
    startIso: string;
    endIso: string;
    label: string;
}
export interface ActivityReportResult {
    date: string;
    startIso: string;
    endIso: string;
    markdown: string;
    /** 有模型叙事时记录来源；缺失表示确定性的结构化骨架。 */
    narrativeModel?: string;
    /** 范围内可入报告的分析行数（已过滤零星/失败占位）。 */
    sessionCount: number;
    /** 报告不触发会话分析，保持零值以兼容已有结果结构。 */
    analyzedNow: number;
    /** 范围内尚未保存分析的已结束 session 数。 */
    pendingModel: number;
    /** 是否有已结束 session 尚未完成独立分析。 */
    blocked: boolean;
    /** blocked 时携带的原因说明。 */
    message?: string;
    /** SQLite 日报缓存命中，叙事层据此避免再次调用模型。 */
    cached?: boolean;
    stats: ActivityReportStats;
}
export interface ActivityReportStats {
    sessionCount: number;
    analyzedCount: number;
    totalActiveMinutes: number;
    clusterCount: number;
    topApps: Array<{
        app: string;
        minutes: number;
    }>;
}
/**
 * 分析单个已结束 session。幂等：输入 hash 未变时直接返回已落库结果，不重复调用模型。
 * 存储故障交给调用方处理；模型失败记录 failed，供显式重试。
 * 模型等待中输入或已有结果发生变化时不提交旧结果，保留最新状态。
 */
export declare function analyzeActivitySession(deps: ActivityAnalyzerDeps, sessionId: string, force?: boolean): Promise<ActivityAnalysisOutcome>;
/** 兜底 sweep：每轮从最新的已结束 pending session 开始处理。 */
export declare function analyzePendingActivitySessions(deps: ActivityAnalyzerDeps, limit?: number): Promise<ActivitySweepResult>;
/**
 * 生成指定日期的工作日记。只读取已保存分析并按项目分组渲染确定性骨架；
 * 待分析会话由显式分析或周期 sweep 处理，叙事由 reportNarrative 单独负责。
 */
export declare function buildActivityReport(deps: ActivityAnalyzerDeps, date: string, options?: {
    force?: boolean;
    skeletonOnly?: boolean;
}): Promise<ActivityReportResult>;
/** 日报和日结保存在同一 SQLite 行，叙事成功后可以用最终正文覆盖骨架。 */
export declare function persistActivityReport(store: ActivityStore, result: ActivityReportResult, now?: Date): void;
/**
 * 把日报结果和未完成原因渲染成工具/CLI 都能直接输出的文本。
 * 这里仅输出已经选定的骨架或叙事，避免不同入口再改写一次。
 */
export declare function formatActivityReportResult(result: ActivityReportResult): string;
/**
 * 生成写入 `memory/YYYY-MM-DD.md` 的每日摘要。
 * 文件是按日的可重建投影；session 仍保留在 ActivityStore 中作为可追溯来源。
 */
export declare function formatActivityDailyNote(result: ActivityReportResult): string;
/** 1000 条最新 session 聚合为主题；OCR 和窗口标题不参与日报骨架或叙事输入。 */
export declare function renderActivityReport(sessions: readonly ActivityReportSourceSession[], label: string): {
    markdown: string;
    stats: ActivityReportStats;
};
/**
 * 解析 activity report 的日期参数。`today`/`yesterday` 相对当前本地时间，`YYYY-MM-DD`
 * 按本地日界解析；start/end 转为 UTC ISO，存储层会将其转换为 epoch-ms 查询参数。
 */
export declare function resolveActivityReportRange(date: string, now?: Date): ActivityReportRange;
