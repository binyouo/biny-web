import type { WebCookiesConfig, WebSearchConfig } from "../../config/schema.js";
import type { Tool } from "../types.js";
import { type BrowserAutomationEndpoint } from "../browser.js";
declare const recencyValues: readonly ["day", "week", "month", "year"];
type SearchRecency = (typeof recencyValues)[number];
export interface WebSearchArgs {
    query: string;
    maxResults?: number;
    domains?: string[];
    recency?: SearchRecency;
}
export interface WebSearchResult {
    title: string;
    url: string;
    snippet?: string;
    favicon?: string;
}
export interface WebSearchResponse {
    query: string;
    provider: WebSearchConfig["provider"];
    results: WebSearchResult[];
    fetchedAt: string;
}
export declare function createWebSearchTool(config?: WebSearchConfig, _cookies?: WebCookiesConfig, browser?: BrowserAutomationEndpoint): Tool<WebSearchArgs, WebSearchResponse>;
export declare function parseXiaohongshuResults(html: string, maxResults: number): WebSearchResult[];
export declare function parseGoogleResults(html: string, maxResults: number): WebSearchResult[];
export {};
