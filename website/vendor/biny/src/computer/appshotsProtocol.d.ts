import { z } from "zod";
export declare const appshotsSettingsSchema: z.ZodObject<{
    hotkey: z.ZodDefault<z.ZodString>;
    target: z.ZodDefault<z.ZodEnum<["current", "new"]>>;
}, "strict", z.ZodTypeAny, {
    target: "current" | "new";
    hotkey: string;
}, {
    target?: "current" | "new" | undefined;
    hotkey?: string | undefined;
}>;
export type AppshotsSettings = z.infer<typeof appshotsSettingsSchema>;
export interface AppshotsState {
    settings: AppshotsSettings;
    active: boolean;
    capturing: boolean;
    error?: string;
}
export interface AppshotSource {
    appName: string;
    bundleId: string;
    pid: number;
    windowId: number;
    title?: string;
}
export type AppshotEvent = {
    type: "starting";
    id: string;
    target: AppshotsSettings["target"];
} | {
    type: "captured";
    id: string;
    target: AppshotsSettings["target"];
    source: AppshotSource;
} | {
    type: "failed";
    id: string;
    error: string;
};
export interface AppshotsApi {
    state(): Promise<AppshotsState>;
    settings(value: AppshotsSettings): Promise<AppshotsState>;
    prewarm(): Promise<AppshotsState>;
    capture(): Promise<AppshotsState>;
    attach(projectId: string, id: string): Promise<{
        name: string;
        path: string;
        mimeType: string;
        size: number;
    }>;
    onEvent(listener: (event: AppshotEvent) => void): () => void;
}
export declare const appshotsIpc: {
    readonly state: "desktop:appshots:state";
    readonly settings: "desktop:appshots:settings";
    readonly prewarm: "desktop:appshots:prewarm";
    readonly capture: "desktop:appshots:capture";
    readonly attach: "desktop:appshots:attach";
    readonly event: "desktop:appshots:event";
};
