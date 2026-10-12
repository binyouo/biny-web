import type { Tool, ToolContext } from "../types.js";
export interface ReadFileArgs {
    path: string;
    startLine?: number;
    lineCount?: number;
}
export interface ReadFileResult {
    path: string;
    content: string;
    startLine: number;
    endLine: number;
    hasMore: boolean;
    nextStartLine?: number;
}
export declare function createReadFileTool(context: ToolContext, hashline?: boolean): Tool<ReadFileArgs, ReadFileResult>;
