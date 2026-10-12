import { z } from "zod";
export declare const transferSchemas: {
    screenshot: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        fullPage: z.ZodOptional<z.ZodBoolean>;
    } & {
        path: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        path: string;
        browserId: string;
        tabId: number;
        fullPage?: boolean | undefined;
    }, {
        path: string;
        browserId: string;
        tabId: number;
        fullPage?: boolean | undefined;
    }>;
    download: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        url: z.ZodEffects<z.ZodString, string, string>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        path: string;
        url: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }, {
        path: string;
        url: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }>;
    upload: z.ZodObject<Omit<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        files: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            mimeType: z.ZodString;
            data: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            data: string;
            mimeType: string;
        }, {
            name: string;
            data: string;
            mimeType: string;
        }>, "many">;
        selector: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, "files"> & {
        paths: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        selector: string;
        browserId: string;
        tabId: number;
        paths: string[];
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }, {
        selector: string;
        browserId: string;
        tabId: number;
        paths: string[];
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }>;
};
export declare function transferBrowserFile(method: keyof typeof transferSchemas, input: unknown, options: {
    workspaceRoot: string;
    ignore: string[];
    deniedPaths?: readonly string[];
    signal?: AbortSignal;
    file?: string;
    sessionId?: string;
    onDispatched?(): void;
    onCommit?(evidence: string): void;
}): Promise<unknown>;
