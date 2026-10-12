/** 把可追溯的 Activity 报告骨架改写为第一人称日志，失败时保留骨架。 */
import type { AgentModel } from "../agent/core/types.js";
import { type ActivityReportResult } from "./analyzer.js";
import type { ActivityStore } from "./store.js";
export interface ActivityReportNarrativeOptions {
    model?: AgentModel;
    skeleton?: boolean;
    signal?: AbortSignal;
    checkpoint?: () => Promise<void>;
    store?: ActivityStore;
}
export declare function narrateActivityReport(report: ActivityReportResult, options?: ActivityReportNarrativeOptions): Promise<ActivityReportResult>;
