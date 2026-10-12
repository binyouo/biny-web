import type { CatalogProviderRequest, ModelCatalogEntry } from "./types.js";
export interface ModelCatalogValidators {
    etag?: string;
    lastModified?: number;
}
export interface ModelCatalogFetchResult {
    models?: ModelCatalogEntry[];
    notModified: boolean;
    etag?: string;
    lastModified?: number;
}
/** `/models` 非 2xx 时保留服务商的 HTTP 状态、地址和错误正文，供桌面端给出可行动提示。 */
export declare class ModelCatalogRequestError extends Error {
    readonly statusCode: number;
    readonly url: string;
    readonly responseBody?: string;
    constructor(message: string, details: {
        statusCode: number;
        url: string;
        responseBody?: string;
    });
}
/** 拉取服务商的实时模型列表；只读，不写入任何凭据或配置。 */
export declare function fetchModelCatalog(request: CatalogProviderRequest, signal?: AbortSignal): Promise<ModelCatalogEntry[]>;
/** 带 HTTP 校验信息拉取目录，Provider Runtime 用它实现跨进程缓存复用。 */
export declare function fetchModelCatalogSnapshot(request: CatalogProviderRequest, signal?: AbortSignal, validators?: ModelCatalogValidators, fetcher?: typeof globalThis.fetch): Promise<ModelCatalogFetchResult>;
/**
 * 解析 `/models` 响应。响应体或条目形状不符合预期时跳过，不抛错，因此返回空数组既可能是
 * 「没有模型」也可能是「响应不认识」。
 */
export declare function parseModelCatalog(value: unknown, provider: string, _protocol: "anthropic" | "openai-compatible", inferReasoningFromId?: boolean): ModelCatalogEntry[];
