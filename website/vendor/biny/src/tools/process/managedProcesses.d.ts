/**
 * 后台 Shell 的模型工具。
 *
 * 启动职责已并入 Bash；这里仅保留读取/枚举和终止两个后续动作，底层生命周期、持久日志与
 * 进程组清理由 ManagedProcessService 统一负责。
 */
import { z } from "zod";
import { ManagedProcessService, type ManagedProcessOutput, type ManagedProcessSnapshot } from "../../runtime/ManagedProcessService.js";
import type { Tool } from "../types.js";
export interface BashOutputArgs {
    /** 省略时列出当前 runtime 记录的后台 Shell。 */
    processId?: string;
    includeExited?: boolean;
    offset?: number;
    maxBytes?: number;
    fromEnd?: boolean;
}
export interface BashOutputResult {
    processes?: ManagedProcessSnapshot[];
    process?: ManagedProcessSnapshot;
    output?: ManagedProcessOutput;
}
export interface KillShellArgs {
    processId: string;
    reason?: string;
}
export declare const managedProcessReadinessSchema: z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"http">;
    url: z.ZodString;
    expectedStatus: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    intervalMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "http";
    url: string;
    timeoutMs?: number | undefined;
    expectedStatus?: number | undefined;
    intervalMs?: number | undefined;
}, {
    type: "http";
    url: string;
    timeoutMs?: number | undefined;
    expectedStatus?: number | undefined;
    intervalMs?: number | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"tcp">;
    host: z.ZodString;
    port: z.ZodNumber;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    intervalMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "tcp";
    host: string;
    port: number;
    timeoutMs?: number | undefined;
    intervalMs?: number | undefined;
}, {
    type: "tcp";
    host: string;
    port: number;
    timeoutMs?: number | undefined;
    intervalMs?: number | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"log">;
    pattern: z.ZodString;
    regex: z.ZodOptional<z.ZodBoolean>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    intervalMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "log";
    pattern: string;
    timeoutMs?: number | undefined;
    regex?: boolean | undefined;
    intervalMs?: number | undefined;
}, {
    type: "log";
    pattern: string;
    timeoutMs?: number | undefined;
    regex?: boolean | undefined;
    intervalMs?: number | undefined;
}>]>, {
    type: "http";
    url: string;
    timeoutMs?: number | undefined;
    expectedStatus?: number | undefined;
    intervalMs?: number | undefined;
} | {
    type: "tcp";
    host: string;
    port: number;
    timeoutMs?: number | undefined;
    intervalMs?: number | undefined;
} | {
    type: "log";
    pattern: string;
    timeoutMs?: number | undefined;
    regex?: boolean | undefined;
    intervalMs?: number | undefined;
}, {
    type: "http";
    url: string;
    timeoutMs?: number | undefined;
    expectedStatus?: number | undefined;
    intervalMs?: number | undefined;
} | {
    type: "tcp";
    host: string;
    port: number;
    timeoutMs?: number | undefined;
    intervalMs?: number | undefined;
} | {
    type: "log";
    pattern: string;
    timeoutMs?: number | undefined;
    regex?: boolean | undefined;
    intervalMs?: number | undefined;
}>;
export declare const managedProcessReadinessParameters: {
    type: "object";
    properties: {
        timeoutMs: {
            type: "integer";
            minimum: number;
            maximum: number;
            description: string;
        };
        intervalMs: {
            type: "integer";
            minimum: number;
            maximum: number;
            description: string;
        };
        type: {
            type: "string";
            enum: string[];
        };
        url: {
            type: "string";
            description: string;
        };
        expectedStatus: {
            type: "integer";
            minimum: number;
            maximum: number;
            description: string;
        };
        host: {
            type: "string";
            description: string;
        };
        port: {
            type: "integer";
            minimum: number;
            maximum: number;
            description: string;
        };
        pattern: {
            type: "string";
            description: string;
        };
        regex: {
            type: "boolean";
            description: string;
        };
    };
    required: string[];
    additionalProperties: boolean;
    description: string;
};
export declare function createManagedProcessTools(service: ManagedProcessService): Array<Tool<unknown, unknown>>;
export declare function createBashOutputTool(service: ManagedProcessService): Tool<BashOutputArgs, BashOutputResult>;
export declare function createKillShellTool(service: ManagedProcessService): Tool<KillShellArgs, ManagedProcessSnapshot>;
