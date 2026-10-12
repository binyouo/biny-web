/** 真实浏览器连接的协议边界；会话标识防止重连后误用旧标签 ID。 */
import { z } from "zod";
export declare const relayUrlSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const relayTargetSchema: z.ZodObject<{
    browserId: z.ZodString;
    tabId: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    browserId: string;
    tabId: number;
}, {
    browserId: string;
    tabId: number;
}>;
export declare const relayBinarySchema: z.ZodObject<{
    mimeType: z.ZodString;
    data: z.ZodString;
}, "strip", z.ZodTypeAny, {
    data: string;
    mimeType: string;
}, {
    data: string;
    mimeType: string;
}>;
export declare const relaySchemas: {
    status: z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>;
    tabs: z.ZodObject<{
        browserId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        browserId?: string | undefined;
    }, {
        browserId?: string | undefined;
    }>;
    read: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        maxCharacters: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        browserId: string;
        tabId: number;
        maxCharacters?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }, {
        browserId: string;
        tabId: number;
        maxCharacters?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }>;
    navigate: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        url: z.ZodEffects<z.ZodString, string, string>;
        waitUntil: z.ZodOptional<z.ZodEnum<["none", "domcontentloaded", "load"]>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        url: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        waitUntil?: "none" | "load" | "domcontentloaded" | undefined;
    }, {
        url: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        waitUntil?: "none" | "load" | "domcontentloaded" | undefined;
    }>;
    click: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        selector: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        selector: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }, {
        selector: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }>;
    fill: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        value: z.ZodString;
        selector: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        value: string;
        selector: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }, {
        value: string;
        selector: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }>;
    press: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        selector: z.ZodOptional<z.ZodString>;
        key: z.ZodEnum<["Enter", "Tab", "Escape", "Backspace", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        key: "Escape" | "Tab" | "Enter" | "Backspace" | "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        selector?: string | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }, {
        key: "Escape" | "Tab" | "Enter" | "Backspace" | "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        selector?: string | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }>;
    screenshot: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        fullPage: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        browserId: string;
        tabId: number;
        fullPage?: boolean | undefined;
    }, {
        browserId: string;
        tabId: number;
        fullPage?: boolean | undefined;
    }>;
    scroll: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        selector: z.ZodOptional<z.ZodString>;
        deltaX: z.ZodOptional<z.ZodNumber>;
        deltaY: z.ZodNumber;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        browserId: string;
        tabId: number;
        deltaY: number;
        selector?: string | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
        deltaX?: number | undefined;
    }, {
        browserId: string;
        tabId: number;
        deltaY: number;
        selector?: string | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
        deltaX?: number | undefined;
    }>;
    wait: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        selector: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodEnum<["visible", "hidden", "attached", "domcontentloaded", "load"]>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        browserId: string;
        tabId: number;
        state?: "hidden" | "load" | "visible" | "domcontentloaded" | "attached" | undefined;
        timeoutMs?: number | undefined;
        selector?: string | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }, {
        browserId: string;
        tabId: number;
        state?: "hidden" | "load" | "visible" | "domcontentloaded" | "attached" | undefined;
        timeoutMs?: number | undefined;
        selector?: string | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }>;
    upload: z.ZodObject<{
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
    }, "strict", z.ZodTypeAny, {
        selector: string;
        browserId: string;
        tabId: number;
        files: {
            name: string;
            data: string;
            mimeType: string;
        }[];
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }, {
        selector: string;
        browserId: string;
        tabId: number;
        files: {
            name: string;
            data: string;
            mimeType: string;
        }[];
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }>;
    download: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    } & {
        url: z.ZodEffects<z.ZodString, string, string>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        url: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }, {
        url: string;
        browserId: string;
        tabId: number;
        timeoutMs?: number | undefined;
        frameId?: string | undefined;
        documentId?: string | undefined;
    }>;
};
export type RelayMethod = keyof typeof relaySchemas;
export declare const relayStatusSchema: z.ZodEffects<z.ZodObject<{
    running: z.ZodBoolean;
    connected: z.ZodBoolean;
    browsers: z.ZodArray<z.ZodObject<{
        browserId: z.ZodString;
        browserName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        browserId: string;
        browserName: string;
    }, {
        browserId: string;
        browserName: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    running: boolean;
    connected: boolean;
    browsers: {
        browserId: string;
        browserName: string;
    }[];
}, {
    running: boolean;
    connected: boolean;
    browsers: {
        browserId: string;
        browserName: string;
    }[];
}>, {
    running: boolean;
    connected: boolean;
    browsers: {
        browserId: string;
        browserName: string;
    }[];
}, {
    running: boolean;
    connected: boolean;
    browsers: {
        browserId: string;
        browserName: string;
    }[];
}>;
export type RelayStatus = z.infer<typeof relayStatusSchema>;
export declare const relayTabSchema: z.ZodObject<{
    id: z.ZodNumber;
    windowId: z.ZodNumber;
    url: z.ZodEffects<z.ZodString, string, string>;
    title: z.ZodString;
    active: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: number;
    title: string;
    url: string;
    windowId: number;
    active: boolean;
}, {
    id: number;
    title: string;
    url: string;
    windowId: number;
    active: boolean;
}>;
export declare const relayPageSchema: z.ZodObject<{
    url: z.ZodEffects<z.ZodString, string, string>;
    title: z.ZodString;
    text: z.ZodString;
    interactive: z.ZodArray<z.ZodObject<{
        tag: z.ZodString;
        name: z.ZodString;
        selector: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        selector: string;
        tag: string;
    }, {
        name: string;
        selector: string;
        tag: string;
    }>, "many">;
    frameId: z.ZodOptional<z.ZodString>;
    documentId: z.ZodOptional<z.ZodString>;
    frames: z.ZodOptional<z.ZodArray<z.ZodObject<{
        frameId: z.ZodString;
        documentId: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        frameId: string;
        documentId: string;
    }, {
        url: string;
        frameId: string;
        documentId: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    text: string;
    title: string;
    url: string;
    interactive: {
        name: string;
        selector: string;
        tag: string;
    }[];
    frames?: {
        url: string;
        frameId: string;
        documentId: string;
    }[] | undefined;
    frameId?: string | undefined;
    documentId?: string | undefined;
}, {
    text: string;
    title: string;
    url: string;
    interactive: {
        name: string;
        selector: string;
        tag: string;
    }[];
    frames?: {
        url: string;
        frameId: string;
        documentId: string;
    }[] | undefined;
    frameId?: string | undefined;
    documentId?: string | undefined;
}>;
export declare function isRelayMutation(method: RelayMethod): boolean;
export declare class BrowserRelayError extends Error {
    readonly code: "unavailable" | "invalid" | "busy" | "unknown";
    constructor(code: "unavailable" | "invalid" | "busy" | "unknown", message: string);
}
