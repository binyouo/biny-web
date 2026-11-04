import type { Tool, ToolContext } from "../types.js";
export interface ReadFileArgs {
    path: string;
    startLine?: number;
    lineCount?: number;
    offset?: number;
    length?: number;
}
export interface ReadFileResult {
    path: string;
    content: string;
    startLine: number;
    endLine: number;
    hasMore: boolean;
    nextStartLine?: number;
}
export interface ReadArchivedResult {
    path: string;
    tool: string;
    archivedAt: string;
    totalCharacters: number;
    offset: number;
    /** Next UTF-16 code-unit offset; pass it unchanged for the next page. */
    nextOffset: number;
    content: string;
    hasMore: boolean;
}
export declare function createReadFileTool(context: ToolContext, hashline?: boolean): Tool<ReadFileArgs, ReadFileResult | ReadArchivedResult>;
