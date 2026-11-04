import { z } from "zod";
import type { Tool, ToolContext } from "../types.js";
import { type FileChangeResult } from "./fileChange.js";
export declare const patchArgsSchema: z.ZodObject<{
    callId: z.ZodString;
    operation: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"create_file">;
        path: z.ZodString;
        diff: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"update_file">;
        path: z.ZodString;
        diff: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"delete_file">;
        path: z.ZodString;
    }, z.core.$strict>], "type">;
}, z.core.$strict>;
export type PatchArgs = z.infer<typeof patchArgsSchema>;
export declare function patchContent(content: string, operation: PatchArgs["operation"]): string;
export declare function createApplyPatchTool(context: ToolContext): Tool<PatchArgs, FileChangeResult>;
