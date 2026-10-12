/** 近期 Activity 摘要：当前会话、今日统计和已分析会话，共用日报的时长计算。 */
import type { ActivityStore } from "./store.js";
export declare const ACTIVITY_DIGEST_DEFAULT_LOOKBACK_MIN = 120;
export declare const ACTIVITY_DIGEST_MAX_LOOKBACK_MIN: number;
export interface ActivityDigestResult {
    markdown: string;
    lookbackMin: number;
    sinceIso: string;
    sessions: number;
    analyzed: number;
}
export interface ActivityDigestDeps {
    store: ActivityStore;
    limit?: number;
    maxAnalyzed?: number;
    now?: () => Date;
}
export declare function resolveDigestWindow(lookbackMin: number, now?: Date): string;
export declare function buildActivityDigest(deps: ActivityDigestDeps, lookbackMin?: number): Promise<ActivityDigestResult>;
