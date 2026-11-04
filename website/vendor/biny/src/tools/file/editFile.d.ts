/**
 * 单文件变更工具，默认搜索替换，实验模式使用 Hashline 锚点。
 *
 * update、delete、move 共用同一准备和结果协议；每次调用只提交一个源文件，避免制造跨文件伪事务。
 */
import { z } from "zod";
import type { Tool, ToolContext } from "../types.js";
import { type FileChangeResult } from "./fileChange.js";
import { type HashlineEdit } from "./hashline.js";
export type EditArgs = {
    operation: "update";
    path: string;
    edits: HashlineEdit[];
} | {
    operation: "update";
    path: string;
    old_string: string;
    new_string: string;
    replace_all: boolean;
} | {
    operation: "delete";
    path: string;
} | {
    operation: "move";
    path: string;
    to: string;
};
export declare const editArgsSchema: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
    operation: z.ZodLiteral<"update">;
    path: z.ZodString;
    edits: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        op: z.ZodLiteral<"replace">;
        pos: z.ZodString;
        end: z.ZodOptional<z.ZodString>;
        lines: z.ZodArray<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        op: z.ZodLiteral<"append">;
        pos: z.ZodOptional<z.ZodString>;
        lines: z.ZodArray<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        op: z.ZodLiteral<"prepend">;
        pos: z.ZodOptional<z.ZodString>;
        lines: z.ZodArray<z.ZodString>;
    }, z.core.$strict>], "op">>;
}, z.core.$strict>, z.ZodObject<{
    operation: z.ZodLiteral<"delete">;
    path: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    operation: z.ZodLiteral<"move">;
    path: z.ZodString;
    to: z.ZodString;
}, z.core.$strict>], "operation">, z.ZodUnion<readonly [z.ZodObject<{
    operation: z.ZodDefault<z.ZodLiteral<"update">>;
    path: z.ZodString;
    old_string: z.ZodString;
    new_string: z.ZodString;
    replace_all: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>, z.ZodObject<{
    operation: z.ZodLiteral<"delete">;
    path: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    operation: z.ZodLiteral<"move">;
    path: z.ZodString;
    to: z.ZodString;
}, z.core.$strict>]>]>;
export declare function createEditFileTool(context: ToolContext, hashline?: boolean): Tool<EditArgs, FileChangeResult>;
