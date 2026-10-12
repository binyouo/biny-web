export { extractOpenAiAccountId, openAiCodexHeaders } from "../ai/codexAuth.js";
export declare const CLAUDE_SUBSCRIPTION_BETA = "oauth-2025-04-20,interleaved-thinking-2025-05-14,redact-thinking-2026-02-12,context-management-2025-06-27,prompt-caching-scope-2026-01-05,claude-code-20250219";
export declare const CLAUDE_OAUTH_CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
export declare const CLAUDE_OAUTH_TOKEN_ENDPOINT = "https://platform.claude.com/v1/oauth/token";
export declare const CODEX_OAUTH_CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann";
export declare const CODEX_OAUTH_TOKEN_ENDPOINT = "https://auth.openai.com/oauth/token";
export type SubscriptionOAuthProvider = "claude-code" | "openai-codex";
export interface SubscriptionOAuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    accountId?: string;
}
export declare class SubscriptionOAuthRefreshError extends Error {
    readonly statusCode: number;
    readonly loginRejected: boolean;
    constructor(statusCode: number, provider: string);
}
/**
 * 模型请求前只对实际使用且需要续期的 Provider 调用。登录授权仍由宿主 UI 负责，
 * 这里只维护模型请求必须共用的 refresh_token 协议。
 */
export declare function refreshSubscriptionOAuthTokens(provider: SubscriptionOAuthProvider, tokens: SubscriptionOAuthTokens, signal?: AbortSignal, fetcher?: typeof globalThis.fetch): Promise<SubscriptionOAuthTokens>;
export declare function parseSubscriptionOAuthTokens(payload: unknown, provider: string): SubscriptionOAuthTokens;
