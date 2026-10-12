/** 按当前 checkpoint 的 claim ID 回查原文；会话和文件目标完全由宿主闭包绑定。 */
import { z } from "zod";
import type { Tool } from "../tools/types.js";
declare const schema: z.ZodObject<{
    claimId: z.ZodString;
    offset: z.ZodOptional<z.ZodNumber>;
    length: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    offset?: number | undefined;
    length?: number | undefined;
}, {
    claimId: string;
    offset?: number | undefined;
    length?: number | undefined;
}>;
export type CheckpointEvidenceArgs = z.infer<typeof schema>;
export declare function createCheckpointEvidenceTool(read: (args: CheckpointEvidenceArgs, signal?: AbortSignal) => Promise<unknown>): Tool;
export {};
