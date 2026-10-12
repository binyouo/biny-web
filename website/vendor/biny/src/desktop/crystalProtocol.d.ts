/** 桌面结晶操作的输入边界；展示直接复用核心领域类型。 */
import { z } from "zod";
import type { CrystalOverview } from "../agent/context/crystalTypes.js";
import type { CrystalDetail } from "../agent/context/crystalService.js";
export declare const desktopCrystalRequestSchema: z.ZodDiscriminatedUnion<"action", [z.ZodObject<{
    action: z.ZodLiteral<"overview">;
}, "strict", z.ZodTypeAny, {
    action: "overview";
}, {
    action: "overview";
}>, z.ZodObject<{
    action: z.ZodLiteral<"detail">;
    id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    action: "detail";
}, {
    id: string;
    action: "detail";
}>, z.ZodObject<{
    action: z.ZodLiteral<"seed">;
    name: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    name: string;
    action: "seed";
    sessionId?: string | undefined;
}, {
    name: string;
    action: "seed";
    sessionId?: string | undefined;
}>, z.ZodObject<{
    action: z.ZodLiteral<"type">;
    id: z.ZodString;
    type: z.ZodEnum<["entity", "concept", "claim", "process", "rule", "project"]>;
}, "strict", z.ZodTypeAny, {
    id: string;
    type: "project" | "process" | "claim" | "entity" | "concept" | "rule";
    action: "type";
}, {
    id: string;
    type: "project" | "process" | "claim" | "entity" | "concept" | "rule";
    action: "type";
}>, z.ZodObject<{
    action: z.ZodLiteral<"slot">;
    id: z.ZodString;
    slot: z.ZodNullable<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    id: string;
    slot: number | null;
    action: "slot";
}, {
    id: string;
    slot: number | null;
    action: "slot";
}>, z.ZodObject<{
    action: z.ZodLiteral<"dormant">;
    id: z.ZodString;
    dormant: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    id: string;
    action: "dormant";
    dormant: boolean;
}, {
    id: string;
    action: "dormant";
    dormant: boolean;
}>, z.ZodObject<{
    action: z.ZodLiteral<"checklist">;
    id: z.ZodString;
    fields: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodObject<{
        value: z.ZodString;
        conflict: z.ZodBoolean;
    }, "strict", z.ZodTypeAny, {
        value: string;
        conflict: boolean;
    }, {
        value: string;
        conflict: boolean;
    }>>, Record<string, {
        value: string;
        conflict: boolean;
    }>, Record<string, {
        value: string;
        conflict: boolean;
    }>>;
}, "strict", z.ZodTypeAny, {
    id: string;
    action: "checklist";
    fields: Record<string, {
        value: string;
        conflict: boolean;
    }>;
}, {
    id: string;
    action: "checklist";
    fields: Record<string, {
        value: string;
        conflict: boolean;
    }>;
}>, z.ZodObject<{
    action: z.ZodLiteral<"note">;
    id: z.ZodString;
    text: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    text: string;
    action: "note";
}, {
    id: string;
    text: string;
    action: "note";
}>, z.ZodObject<{
    action: z.ZodLiteral<"prefill">;
    id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    action: "prefill";
}, {
    id: string;
    action: "prefill";
}>, z.ZodObject<{
    action: z.ZodLiteral<"confirm">;
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    id: string;
    action: "confirm";
    name?: string | undefined;
}, {
    id: string;
    action: "confirm";
    name?: string | undefined;
}>]>;
export type DesktopCrystalRequest = z.infer<typeof desktopCrystalRequestSchema>;
export interface DesktopCrystalSnapshot {
    overview: CrystalOverview;
    detail?: CrystalDetail & {
        materialPreviews: Record<number, string>;
    };
}
