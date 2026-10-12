import type { Tool, ToolContext } from "../types.js";
export interface SearchFilesArgs {
    query: string;
    mode?: "literal" | "regex";
    path?: string;
    glob?: string;
    caseSensitive?: boolean;
    contextLines?: number;
    offset?: number;
    limit?: number;
}
export interface SearchContextLine {
    line: number;
    text: string;
}
export interface SearchFilesMatch {
    path: string;
    line: number;
    /** One-based original UTF-16 column; casing-generated marks belong to their source letter. */
    column: number;
    anchor: string;
    text: string;
    before: SearchContextLine[];
    after: SearchContextLine[];
}
export interface SearchFilesResult {
    matches: SearchFilesMatch[];
    offset: number;
    limit: number;
    hasMore: boolean;
    nextOffset?: number;
    scannedFiles: number;
    unreadableFiles?: string[];
    unreadableDirectories?: string[];
    fileLimitReached?: boolean;
}
export declare function createSearchFilesTool(context: ToolContext): Tool<SearchFilesArgs, SearchFilesResult>;
