/**
 * token 用量与费用统计。
 *
 * 费用计算的原则是「算不准就不给数字」：只要有一段 token 缺对应单价，就把 `pricingKnown`
 * 置为 false 并且不返回金额，避免展示出一个偏低的假费用。
 */
import type { AgentUsage } from "../agent/core/types.js";
import type { ModelPricing } from "../config/schema.js";
import type { SessionUsage, UsageOperation, UsageSummary } from "../session/metadata.js";
import type { PromptShapeDiagnostic } from "../llm/promptCache.js";
export interface UsageModelInfo {
    modelAlias: string;
    provider: string;
    model: string;
    pricing?: ModelPricing;
}
export type ModelUsageObserver = (usage: AgentUsage, operation: UsageOperation, modelAlias?: string) => Promise<void> | void;
export declare function createSessionUsage(usage: AgentUsage, operation: UsageOperation, model: UsageModelInfo, time?: string, promptShape?: Pick<PromptShapeDiagnostic, "epochId" | "stablePrefixHash">): SessionUsage;
/**
 * 按单价算费用。缓存命中的 token 单价与普通输入不同，所以先从输入里扣掉缓存读写部分，
 * 再各按各自单价累加。任一段有 token 却缺单价，就整体判为「未知」。
 */
export declare function calculateUsageCost(usage: Pick<SessionUsage, "inputTokens" | "outputTokens" | "cacheReadTokens" | "cacheWriteTokens">, pricing: ModelPricing | undefined): {
    costUsd?: number;
    known: boolean;
};
/**
 * 计算最近一次模型请求的缓存命中率。
 *
 * Biny 的 `inputTokens` 是 provider 回报的完整输入量，已经包含缓存读写部分，因此这里
 * 直接用 cache read 除以完整输入，不能再把缓存 token 加回分母，否则会重复计算。
 */
export declare function calculateCacheHitRate(usage: Pick<SessionUsage, "inputTokens" | "cacheReadTokens" | "latestRequestInputTokens" | "latestRequestCacheReadTokens">): number | undefined;
export declare function summarizeUsage(records: SessionUsage[]): UsageSummary;
type CacheTokenField = "inputTokens" | "cacheReadTokens";
/** Only input/read labels opt into the projection; the other counts and costs retain their contract. */
export declare function formatReportedCacheCount(summary: UsageSummary, field: CacheTokenField, format?: (value: number) => string): string;
export declare function formatUsageSummary(summary: UsageSummary): string;
/**
 * 合并同一回合内多次 provider 请求的用量。
 *
 * 自有 agent loop 下每一步都是一次独立请求，各自有一条用量记录；回合级的 assistant
 * 消息和终态需要它们的合计。任一条价格未知，合计就整体判为未知 —— 和 `calculateUsageCost`
 * 一样，宁可不给数字也不给偏低的假数字。
 */
export declare function sumSessionUsage(records: readonly SessionUsage[]): SessionUsage;
export {};
