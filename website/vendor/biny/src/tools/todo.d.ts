/**
 * 计划清单工具模块。
 *
 * 模型用它维护跨回合的工作计划。清单每回合注入 system prompt，所以写进去的内容不会因为
 * 历史压缩而丢失。
 */
import { z } from "zod";
import { type TodoStore } from "../session/todoStore.js";
import type { Tool } from "./types.js";
declare const updateTodosSchema: z.ZodObject<{
    todos: z.ZodArray<z.ZodObject<{
        content: z.ZodString;
        status: z.ZodEnum<{
            completed: "completed";
            pending: "pending";
            in_progress: "in_progress";
        }>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type UpdateTodosArgs = z.infer<typeof updateTodosSchema>;
export interface UpdateTodosResult {
    todos: Array<{
        content: string;
        status: string;
    }>;
    remaining: number;
}
export declare function createTodoTool(store: TodoStore): Tool<UpdateTodosArgs, UpdateTodosResult>;
export {};
