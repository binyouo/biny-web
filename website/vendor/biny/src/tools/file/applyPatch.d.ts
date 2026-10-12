import { z } from "zod";
import type { Tool, ToolContext } from "../types.js";
import type { FileChangeResult } from "./fileChange.js";
export declare const patchArgsSchema: z.ZodObject<{
    callId: z.ZodString;
    operation: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"create_file">;
        path: z.ZodString;
        diff: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "create_file";
        path: string;
        diff: string;
    }, {
        type: "create_file";
        path: string;
        diff: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"update_file">;
        path: z.ZodString;
        diff: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "update_file";
        path: string;
        diff: string;
    }, {
        type: "update_file";
        path: string;
        diff: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"delete_file">;
        path: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "delete_file";
        path: string;
    }, {
        type: "delete_file";
        path: string;
    }>]>;
}, "strict", z.ZodTypeAny, {
    operation: {
        type: "create_file";
        path: string;
        diff: string;
    } | {
        type: "update_file";
        path: string;
        diff: string;
    } | {
        type: "delete_file";
        path: string;
    };
    callId: string;
}, {
    operation: {
        type: "create_file";
        path: string;
        diff: string;
    } | {
        type: "update_file";
        path: string;
        diff: string;
    } | {
        type: "delete_file";
        path: string;
    };
    callId: string;
}>;
export type PatchArgs = z.infer<typeof patchArgsSchema>;
export declare function patchContent(content: string, operation: PatchArgs["operation"]): string;
export declare function createApplyPatchTool(context: ToolContext): Tool<PatchArgs, FileChangeResult>;
