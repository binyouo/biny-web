/**
 * provider 请求重试。
 *
 * 以「包一层 fetch」的方式实现，provider transport 统一复用，也方便测试注入
 * 假 fetch。
 */
export interface RetryPolicy {
    maxAttempts: number;
    initialDelayMs: number;
    maxDelayMs: number;
}
export interface RetryAttemptMetrics {
    attempt: number;
    durationMs: number;
    status?: number;
    error?: string;
    willRetry: boolean;
    retryDelayMs?: number;
}
export type RetryAttemptObserver = (attempt: RetryAttemptMetrics) => void;
/** 只重试传输层和临时性 HTTP 失败，成功响应与客户端错误直接透传。 */
export declare function createRetryFetch(policy: RetryPolicy, baseFetch?: typeof fetch, onAttempt?: RetryAttemptObserver): typeof fetch;
