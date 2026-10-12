/**
 * Activity 的日/周聚合。
 *
 * 日报只统计 session 的开始时间落在日期范围内的记录；session 时长、应用切换和
 * 截图/OCR 计数都以完整 session 为单位，不按日期边界裁剪。周结按结束日逐日
 * 聚合七天，以 ISO 周键持久化；周键和结束日期属于不同的参数域。
 */
import type { ActivitySessionAnalysis, ActivityStore } from "./store.js";
import type { AgentModel } from "../agent/core/types.js";
import type { ActivityReportStats } from "./analyzer.js";
export type ActivitySummaryKind = "daily" | "weekly";
export interface ActivitySummaryApplication {
    app: string;
    durationMs: number;
}
export interface ActivitySummaryHour {
    hour: number;
    count: number;
}
export interface ActivitySummaryKeyMoment {
    sessionId: string;
    title: string;
    startedAt: string;
    durationMs: number;
}
export interface ActivitySummaryStats {
    dateKey: string;
    sessionCount: number;
    totalActiveMs: number;
    analyzedCount: number;
    notWorthCount: number;
    snapshotCount: number;
    ocrCharCount: number;
    apps: ActivitySummaryApplication[];
    hours: ActivitySummaryHour[];
    keyMoments: ActivitySummaryKeyMoment[];
    /** 日报与日结共用 SQLite 行；刷新日结后旧日报须重新生成。 */
    report?: string;
    reportGeneratedAt?: number;
    reportStats?: ActivityReportStats;
    reportState?: {
        sessionCount: number;
        pendingModel: number;
        blocked: boolean;
        message?: string;
        narrativeModel?: string;
    };
}
export interface ActivitySummaryRecord {
    kind: "daily";
    dateKey: string;
    summary: string;
    /** 只有 narrative 成功生成时才有值；确定性 fallback 不伪装成模型摘要。 */
    model?: string;
    stats: ActivitySummaryStats;
    isPartial: boolean;
    generatedAt: string;
}
export interface ActivityWeeklySummaryStats {
    weekKey: string;
    startDate: string;
    endDate: string;
    totalActiveMs: number;
    sessionCount: number;
    apps: ActivitySummaryApplication[];
    daily: Array<{
        dateKey: string;
        activeMs: number;
        sessionCount: number;
    }>;
}
export interface ActivityWeeklySummaryRecord {
    kind: "weekly";
    /** ISO week key，例如 2026-W53；不是周一或结束日的日期键。 */
    dateKey: string;
    summary: string | null;
    model?: string;
    stats: ActivityWeeklySummaryStats;
    isPartial: boolean;
    generatedAt: string;
}
export type ActivityAnySummaryRecord = ActivitySummaryRecord | ActivityWeeklySummaryRecord;
export interface ActivitySummaryNarrativeOptions {
    model?: AgentModel;
    signal?: AbortSignal;
    checkpoint?: () => Promise<void>;
    now?: Date;
    withNarrative?: boolean;
}
export interface ActivitySummarySourceSession {
    id: string;
    startedAt: string;
    endedAt?: string;
    snapshotCount: number;
    ocrCharCount: number;
    appNames: string[];
    /** 只包含 event_type = app_focus 的切换事件，顺序与 perAppDurationsForSession 一致。 */
    applicationEvents: Array<{
        occurredAt: string;
        application?: string;
    }>;
    analysis?: ActivitySessionAnalysis;
}
export interface ActivitySummarySource {
    sessions: ActivitySummarySourceSession[];
}
/** 构造指定本地日报范围。 */
export declare function activitySummaryRange(kind: "daily", dateKey: string): {
    start: Date;
    end: Date;
};
export declare function buildActivitySummary(store: ActivityStore, kind: "daily", dateKey: string, now?: Date, sessionLimit?: number): ActivitySummaryRecord;
export declare function refreshActivitySummary(store: ActivityStore, kind: "daily", dateKey: string, now?: Date): ActivitySummaryRecord;
/**
 * 生成并持久化 narrative 日结。模型只接收聚合后的日期统计和 session 标题，
 * 不接触截图/OCR 原文；无模型或调用失败时保留本地确定性摘要。
 */
export declare function refreshActivitySummaryWithNarrative(store: ActivityStore, kind: "daily", dateKey: string, options?: ActivitySummaryNarrativeOptions): Promise<ActivitySummaryRecord>;
export declare function refreshActivitySummaryWithNarrative(store: ActivityStore, kind: "weekly", endDateKey: string, options?: ActivitySummaryNarrativeOptions): Promise<ActivityWeeklySummaryRecord>;
export declare function refreshActivitySummaryWithNarrative(store: ActivityStore, kind: ActivitySummaryKind, dateKey: string, options?: ActivitySummaryNarrativeOptions): Promise<ActivityAnySummaryRecord>;
