import type { AgentModel, ModelRequestContext, ModelRequestObserver } from "../core/types.js";
import type { ModelUsageObserver } from "../../observability/usage.js";
export interface CompletedChatDiaryEntry {
    sessionId: string;
    turnId: string;
    workspaceRoot: string;
    /** 补写历史 session 时可直接提供显示名，避免把全局 session 分区名当作路径。 */
    projectName?: string;
    userMessage: string;
    assistantMessage: string;
    occurredAt?: Date;
}
export interface ChatDiaryRefreshOptions {
    allowActivity?: boolean;
    configDir?: string;
    agentDir?: string;
    model?: AgentModel;
    signal?: AbortSignal;
    force?: boolean;
    onUsage?: ModelUsageObserver;
    onModelRequest?: ModelRequestObserver;
    requestContext?: ModelRequestContext;
}
export interface ChatDiaryRefreshResult {
    dateKey: string;
    written: boolean;
    backfilled: number;
    model?: string;
    reason?: "empty" | "up_to_date" | "superseded";
}
/** 显式日记刷新时补入单轮事实，以 session 和 turn 标识去重。 */
export declare function appendCompletedChatDiaryEntry(entry: CompletedChatDiaryEntry, options?: {
    configDir?: string;
}): Promise<string>;
/**
 * 从全局 session JSONL 补写指定日期缺失的聊天回合；每次最多处理 500 个缺失候选。
 * 已有 marker 不占预算，让后续刷新继续推进；writer 仍在锁内做最终幂等去重。
 */
export declare function backfillDailyChatDiaryEntries(dateKey: string, options?: {
    configDir?: string;
    agentDir?: string;
}): Promise<number>;
/**
 * 生成指定日期的整体聊天日报。输入只来自 Markdown 的聊天/Activity section，不读取
 * durable memory；同一 source fingerprint 已生成过时直接跳过，避免日结重复调用模型。
 */
export declare function refreshChatDailyDiary(dateKey: string, options?: ChatDiaryRefreshOptions): Promise<ChatDiaryRefreshResult>;
