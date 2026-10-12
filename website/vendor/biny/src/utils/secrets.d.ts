export { redactSecrets } from "./redaction.js";
/**
 * 判断是否为受保护的凭据路径。除固定文件名外，还覆盖 `.env` 系列、`config.json.*`
 * 备份，以及路径中任意一段落在 `.ssh` / `.aws` 等目录里的情况。
 */
export declare function isProtectedCredentialPath(value: string): boolean;
export interface SensitiveValueRedactionOptions {
    /** MCP responses have already had connection credentials removed by the host. */
    context?: "mcp-result";
}
/**
 * 生成一份可安全落盘/展示的副本，不改动原值。
 *
 * 相比纯文本打码，这里多了字段名这层信息：`apiKey`、`authorization` 之类字段下的值即使
 * 没有任何可识别前缀，也一律替换掉。
 */
export declare function redactSensitiveValue(value: unknown, options?: SensitiveValueRedactionOptions): unknown;
/** 字段名判定：先去掉分隔符再小写，这样 `api-key`、`api_key`、`ApiKey` 都能一起命中。 */
export declare function isSensitiveFieldName(value: string): boolean;
