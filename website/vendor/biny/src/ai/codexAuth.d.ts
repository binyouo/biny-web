/** 订阅访问路径共用的请求头和账号标识提取。 */
export declare function openAiCodexHeaders(accessToken?: string): Record<string, string>;
/** 只读取 JWT payload 中的账号 id，不在客户端做签名验证。 */
export declare function extractOpenAiAccountId(token: string): string | undefined;
