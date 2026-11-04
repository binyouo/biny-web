/** 真实浏览器连接的协议边界；会话标识防止重连后误用旧标签 ID。 */
import { z } from "zod";
export declare const relayUrlSchema: z.ZodString;
export declare const relayTargetSchema: z.ZodObject<{
    browserId: z.ZodString;
    tabId: z.ZodNumber;
}, z.core.$strict>;
export declare const relayBinarySchema: z.ZodObject<{
    mimeType: z.ZodString;
    data: z.ZodString;
}, z.core.$strip>;
export declare const relaySchemas: {
    status: z.ZodObject<{}, z.core.$strict>;
    tabs: z.ZodObject<{
        browserId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    open: z.ZodObject<{
        browserId: z.ZodString;
        url: z.ZodString;
    }, z.core.$strict>;
    read: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        maxCharacters: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    evaluate: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        code: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    navigate: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        url: z.ZodString;
        waitUntil: z.ZodOptional<z.ZodEnum<{
            none: "none";
            domcontentloaded: "domcontentloaded";
            load: "load";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    back: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    }, z.core.$strict>;
    forward: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
    }, z.core.$strict>;
    click: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        selector: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    fill: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        value: z.ZodString;
        selector: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    press: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        selector: z.ZodOptional<z.ZodString>;
        key: z.ZodEnum<{
            Enter: "Enter";
            Tab: "Tab";
            Escape: "Escape";
            Backspace: "Backspace";
            ArrowUp: "ArrowUp";
            ArrowDown: "ArrowDown";
            ArrowLeft: "ArrowLeft";
            ArrowRight: "ArrowRight";
        }>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    screenshot: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        fullPage: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>;
    scroll: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        selector: z.ZodOptional<z.ZodString>;
        deltaX: z.ZodOptional<z.ZodNumber>;
        deltaY: z.ZodNumber;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    wait: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        selector: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodEnum<{
            hidden: "hidden";
            domcontentloaded: "domcontentloaded";
            load: "load";
            visible: "visible";
            attached: "attached";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    upload: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        files: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            mimeType: z.ZodString;
            data: z.ZodString;
        }, z.core.$strip>>;
        selector: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    download: z.ZodObject<{
        browserId: z.ZodString;
        tabId: z.ZodNumber;
        url: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        frameId: z.ZodOptional<z.ZodString>;
        documentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
};
export type RelayMethod = keyof typeof relaySchemas;
export declare const relayOpenedTabSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    tabId: z.ZodNumber;
    windowId: z.ZodNumber;
    url: z.ZodString;
}, z.core.$strict>;
export declare const relayStatusSchema: z.ZodObject<{
    running: z.ZodBoolean;
    connected: z.ZodBoolean;
    browsers: z.ZodArray<z.ZodObject<{
        browserId: z.ZodString;
        browserName: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type RelayStatus = z.infer<typeof relayStatusSchema>;
export declare const relayTabSchema: z.ZodObject<{
    id: z.ZodNumber;
    windowId: z.ZodNumber;
    url: z.ZodString;
    title: z.ZodString;
    active: z.ZodBoolean;
}, z.core.$strip>;
export declare const relayPageSchema: z.ZodObject<{
    url: z.ZodString;
    title: z.ZodString;
    text: z.ZodString;
    interactive: z.ZodArray<z.ZodObject<{
        tag: z.ZodString;
        name: z.ZodString;
        selector: z.ZodString;
    }, z.core.$strip>>;
    frameId: z.ZodOptional<z.ZodString>;
    documentId: z.ZodOptional<z.ZodString>;
    frames: z.ZodOptional<z.ZodArray<z.ZodObject<{
        frameId: z.ZodString;
        documentId: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare function isRelayMutation(method: RelayMethod): boolean;
export declare class BrowserRelayError extends Error {
    readonly code: "unavailable" | "invalid" | "busy" | "unknown";
    constructor(code: "unavailable" | "invalid" | "busy" | "unknown", message: string);
}
