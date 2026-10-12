import type { Tool, ToolContext } from "../types.js";
/**
 * Retrieving an archived result is the one tool output the turn budget must not
 * archive again: the model asked for this content explicitly, and re-archiving
 * it would answer an archive reference with another archive reference. The
 * `length` cap above is what bounds it instead.
 */
export declare const readToolResultToolName = "read_tool_result";
export interface ReadToolResultArgs {
    archivePath: string;
    offset?: number;
    length?: number;
}
export interface ReadToolResultResult {
    archivePath: string;
    tool: string;
    archivedAt: string;
    totalCharacters: number;
    offset: number;
    /** Next UTF-16 code-unit offset; pass it unchanged for the next page. */
    nextOffset: number;
    content: string;
    hasMore: boolean;
}
export declare function createReadToolResultTool(context: ToolContext): Tool<ReadToolResultArgs, ReadToolResultResult>;
