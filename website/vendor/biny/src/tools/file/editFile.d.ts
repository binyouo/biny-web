/**
 * 单文件变更工具，默认搜索替换，实验模式使用 Hashline 锚点。
 *
 * update、delete、move 共用同一准备和结果协议；每次调用只提交一个源文件，避免制造跨文件伪事务。
 */
import { z } from "zod";
import type { Tool, ToolContext } from "../types.js";
import type { FileChangeResult } from "./fileChange.js";
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
export declare const editArgsSchema: z.ZodUnion<[z.ZodDiscriminatedUnion<"operation", [z.ZodObject<{
    operation: z.ZodLiteral<"update">;
    path: z.ZodString;
    edits: z.ZodArray<z.ZodDiscriminatedUnion<"op", [z.ZodObject<{
        op: z.ZodLiteral<"replace">;
        pos: z.ZodString;
        end: z.ZodOptional<z.ZodString>;
        lines: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        lines: string[];
        op: "replace";
        pos: string;
        end?: string | undefined;
    }, {
        lines: string[];
        op: "replace";
        pos: string;
        end?: string | undefined;
    }>, z.ZodObject<{
        op: z.ZodLiteral<"append">;
        pos: z.ZodOptional<z.ZodString>;
        lines: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        lines: string[];
        op: "append";
        pos?: string | undefined;
    }, {
        lines: string[];
        op: "append";
        pos?: string | undefined;
    }>, z.ZodObject<{
        op: z.ZodLiteral<"prepend">;
        pos: z.ZodOptional<z.ZodString>;
        lines: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        lines: string[];
        op: "prepend";
        pos?: string | undefined;
    }, {
        lines: string[];
        op: "prepend";
        pos?: string | undefined;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    path: string;
    operation: "update";
    edits: ({
        lines: string[];
        op: "replace";
        pos: string;
        end?: string | undefined;
    } | {
        lines: string[];
        op: "append";
        pos?: string | undefined;
    } | {
        lines: string[];
        op: "prepend";
        pos?: string | undefined;
    })[];
}, {
    path: string;
    operation: "update";
    edits: ({
        lines: string[];
        op: "replace";
        pos: string;
        end?: string | undefined;
    } | {
        lines: string[];
        op: "append";
        pos?: string | undefined;
    } | {
        lines: string[];
        op: "prepend";
        pos?: string | undefined;
    })[];
}>, z.ZodObject<{
    operation: z.ZodLiteral<"delete">;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    operation: "delete";
}, {
    path: string;
    operation: "delete";
}>, z.ZodObject<{
    operation: z.ZodLiteral<"move">;
    path: z.ZodString;
    to: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    to: string;
    operation: "move";
}, {
    path: string;
    to: string;
    operation: "move";
}>]>, z.ZodUnion<[z.ZodObject<{
    operation: z.ZodDefault<z.ZodLiteral<"update">>;
    path: z.ZodString;
    old_string: z.ZodString;
    new_string: z.ZodDefault<z.ZodString>;
    replace_all: z.ZodDefault<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    path: string;
    operation: "update";
    old_string: string;
    new_string: string;
    replace_all: boolean;
}, {
    path: string;
    old_string: string;
    operation?: "update" | undefined;
    new_string?: string | undefined;
    replace_all?: boolean | undefined;
}>, z.ZodObject<{
    operation: z.ZodLiteral<"delete">;
    path: z.ZodString;
}, "strict", z.ZodTypeAny, {
    path: string;
    operation: "delete";
}, {
    path: string;
    operation: "delete";
}>, z.ZodObject<{
    operation: z.ZodLiteral<"move">;
    path: z.ZodString;
    to: z.ZodString;
}, "strict", z.ZodTypeAny, {
    path: string;
    to: string;
    operation: "move";
}, {
    path: string;
    to: string;
    operation: "move";
}>]>]>;
export declare function createEditFileTool(context: ToolContext, hashline?: boolean): Tool<EditArgs, FileChangeResult>;
