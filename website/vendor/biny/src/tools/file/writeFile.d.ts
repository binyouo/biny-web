import type { Tool, ToolContext } from "../types.js";
import type { FileChangeResult } from "./fileChange.js";
import { readUtf8FileForEdit } from "./safeFileIo.js";
export interface WriteFileArgs {
    path: string;
    content: string;
}
export declare function createWriteFileTool(context: ToolContext): Tool<WriteFileArgs, FileChangeResult>;
export declare function readOptionalFile(filePath: string, signal?: AbortSignal, requireValidUtf8?: boolean): Promise<{
    content: string;
    snapshot: Awaited<ReturnType<typeof readUtf8FileForEdit>>["snapshot"] | null;
}>;
