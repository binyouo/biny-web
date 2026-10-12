import { type BrowserAutomationEndpoint } from "../browser.js";
import type { WebCookiesConfig, WebFetchConfig } from "../../config/schema.js";
import type { Tool } from "../types.js";
import { type HostnameResolver } from "./addressPolicy.js";
export interface WebFetchArgs {
    url: string;
    offset?: number;
    length?: number;
}
export interface WebFetchResult {
    url: string;
    finalUrl: string;
    status: number;
    contentType?: string;
    title?: string;
    totalCharacters: number;
    offset: number;
    content: string;
    hasMore: boolean;
    truncatedAtByteLimit: boolean;
}
export interface WebFetchDependencies {
    browser?: BrowserAutomationEndpoint;
    visibleBrowsing?: boolean;
    resolveHostname?: HostnameResolver;
}
export declare function createWebFetchTool(config?: WebFetchConfig, cookies?: WebCookiesConfig, dependencies?: WebFetchDependencies): Tool<WebFetchArgs, WebFetchResult>;
/** Content-Length 是可以撒谎的，所以按实际读到的字节数收口。WebSearch 也复用这个上限读取。 */
export declare function readBounded(response: Response, maxBytes: number): Promise<{
    text: string;
    truncated: boolean;
}>;
