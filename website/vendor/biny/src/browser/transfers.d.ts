import { z } from "zod";
import type { ToolExecutionContext } from "../tools/types.js";
export declare const transferSchemas: {
    screenshot: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        fullPage: z.ZodOptional<z.ZodBoolean>;
        path: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    download: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        url: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
        path: z.ZodString;
    }, z.core.$strict>;
    upload: z.ZodObject<{
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
        selector: z.ZodString;
        paths: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
};
export interface BrowserFileOptions {
    workspaceRoot: string;
    ignore: string[];
    deniedPaths?: readonly string[];
    signal?: AbortSignal;
    file?: string;
    sessionId?: string;
    onDispatched?(): void;
    onCommit?(evidence: string): void;
    onImage?: ToolExecutionContext["onImage"];
}
export declare function readBrowserUploadFiles(paths: string[], options: BrowserFileOptions): Promise<{
    name: string;
    mimeType: string;
    data: string;
}[]>;
export declare function prepareBrowserFile(requested: string, options: BrowserFileOptions, png?: boolean): (value: unknown) => Promise<{
    path: string;
    bytes: number;
    mimeType: string;
}>;
export declare function prepareBrowserScreenshot(requested: string | undefined, options: BrowserFileOptions): (value: unknown) => Promise<{
    path: string | undefined;
    bytes: number;
    mimeType: string;
    url: string | undefined;
    title: string | undefined;
    imageReturned: boolean;
}>;
export declare function prepareBrowserClipboardRead(value: unknown, includeImage: boolean, onImage?: ToolExecutionContext["onImage"]): {
    imageReturned?: boolean | undefined;
    imageStatus?: "available" | "too_large" | undefined;
    hasImage?: boolean | undefined;
    text: string;
    truncated: boolean;
};
export declare function transferBrowserFile(method: keyof typeof transferSchemas, input: unknown, options: BrowserFileOptions): Promise<unknown>;
