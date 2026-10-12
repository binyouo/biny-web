import type { Tool, ToolContext } from "../types.js";
export interface ListFilesArgs {
    path?: string;
    pattern?: string;
    cursor?: string;
    limit?: number;
}
export interface ListFilesResult {
    files: string[];
    hasMore: boolean;
    nextCursor?: string;
    unreadableDirectories?: string[];
}
export declare function createListFilesTool(context: ToolContext): Tool<ListFilesArgs, ListFilesResult>;
