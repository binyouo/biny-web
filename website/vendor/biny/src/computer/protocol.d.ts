import { z } from "zod";
export declare const computerAppSchema: z.ZodObject<{
    bundleId: z.ZodString;
    appName: z.ZodString;
    approvedAt: z.ZodOptional<z.ZodString>;
    revokedAt: z.ZodOptional<z.ZodString>;
    lastUsedAt: z.ZodOptional<z.ZodString>;
    useCount: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export type ComputerAppApproval = z.infer<typeof computerAppSchema>;
export declare const computerSettingsSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    previewEnabled: z.ZodDefault<z.ZodBoolean>;
    actionLogging: z.ZodDefault<z.ZodBoolean>;
    strictApproval: z.ZodDefault<z.ZodBoolean>;
    apps: z.ZodDefault<z.ZodArray<z.ZodObject<{
        bundleId: z.ZodString;
        appName: z.ZodString;
        approvedAt: z.ZodOptional<z.ZodString>;
        revokedAt: z.ZodOptional<z.ZodString>;
        lastUsedAt: z.ZodOptional<z.ZodString>;
        useCount: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const maxComputerImageBytes: number;
export declare const windowTargetSchema: z.ZodObject<{
    pid: z.ZodNumber;
    windowId: z.ZodString;
}, z.core.$strict>;
export type WindowTarget = z.infer<typeof windowTargetSchema>;
export declare const computerListSchema: z.ZodObject<{
    pid: z.ZodOptional<z.ZodNumber>;
    days: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const computerMirrorSchema: z.ZodObject<{
    operation: z.ZodEnum<{
        list: "list";
        open: "open";
        close: "close";
    }>;
    pid: z.ZodOptional<z.ZodNumber>;
    windowId: z.ZodOptional<z.ZodString>;
    onMinimize: z.ZodOptional<z.ZodBoolean>;
    all: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ComputerMirrorRequest = z.infer<typeof computerMirrorSchema>;
/** 观察选项不属于窗口身份；审批与动作目标只使用 pid/windowId。 */
export declare const computerWaitSchema: z.ZodObject<{
    text: z.ZodString;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const computerObservationOptions: z.ZodObject<{
    content: z.ZodOptional<z.ZodEnum<{
        image: "image";
        full: "full";
    }>>;
    waitFor: z.ZodOptional<z.ZodObject<{
        text: z.ZodString;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>;
    maxElements: z.ZodOptional<z.ZodNumber>;
    depth: z.ZodOptional<z.ZodNumber>;
    screenshotMaxWidth: z.ZodOptional<z.ZodNumber>;
    interactiveOnly: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare function validateObservationOptions(value: z.infer<typeof computerObservationOptions>, context: z.RefinementCtx): void;
export declare const windowObserveSchema: z.ZodObject<{
    pid: z.ZodNumber;
    windowId: z.ZodString;
    content: z.ZodOptional<z.ZodEnum<{
        image: "image";
        full: "full";
    }>>;
    waitFor: z.ZodOptional<z.ZodObject<{
        text: z.ZodString;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>;
    maxElements: z.ZodOptional<z.ZodNumber>;
    depth: z.ZodOptional<z.ZodNumber>;
    screenshotMaxWidth: z.ZodOptional<z.ZodNumber>;
    interactiveOnly: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type WindowObserve = z.infer<typeof windowObserveSchema>;
export declare const computerActionPayload: z.ZodObject<{
    action: z.ZodEnum<{
        click: "click";
        type_text: "type_text";
        press_key: "press_key";
        scroll: "scroll";
        drag: "drag";
        perform_secondary_action: "perform_secondary_action";
        set_value: "set_value";
        select_text: "select_text";
    }>;
    showCursor: z.ZodOptional<z.ZodBoolean>;
    inputMethod: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        physical: "physical";
        unicode: "unicode";
        ax: "ax";
    }>>;
    button: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        middle: "middle";
    }>>;
    clickCount: z.ZodOptional<z.ZodNumber>;
    strategy: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        physical: "physical";
        ax: "ax";
    }>>;
    coordinateSpace: z.ZodOptional<z.ZodEnum<{
        screenshot: "screenshot";
        screen: "screen";
    }>>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    text: z.ZodOptional<z.ZodString>;
    key: z.ZodOptional<z.ZodString>;
    direction: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        up: "up";
        down: "down";
    }>>;
    pages: z.ZodOptional<z.ZodNumber>;
    x1: z.ZodOptional<z.ZodNumber>;
    y1: z.ZodOptional<z.ZodNumber>;
    x2: z.ZodOptional<z.ZodNumber>;
    y2: z.ZodOptional<z.ZodNumber>;
    value: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    secondaryAction: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodNumber>;
    length: z.ZodOptional<z.ZodNumber>;
    matchText: z.ZodOptional<z.ZodString>;
    prefix: z.ZodOptional<z.ZodString>;
    suffix: z.ZodOptional<z.ZodString>;
    selectionType: z.ZodOptional<z.ZodEnum<{
        text: "text";
        cursor_before: "cursor_before";
        cursor_after: "cursor_after";
    }>>;
    elementToken: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare function validateComputerAction(value: z.infer<typeof computerActionPayload>, context: z.RefinementCtx): void;
export declare const computerActionPayloadSchema: z.ZodObject<{
    action: z.ZodEnum<{
        click: "click";
        type_text: "type_text";
        press_key: "press_key";
        scroll: "scroll";
        drag: "drag";
        perform_secondary_action: "perform_secondary_action";
        set_value: "set_value";
        select_text: "select_text";
    }>;
    showCursor: z.ZodOptional<z.ZodBoolean>;
    inputMethod: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        physical: "physical";
        unicode: "unicode";
        ax: "ax";
    }>>;
    button: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        middle: "middle";
    }>>;
    clickCount: z.ZodOptional<z.ZodNumber>;
    strategy: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        physical: "physical";
        ax: "ax";
    }>>;
    coordinateSpace: z.ZodOptional<z.ZodEnum<{
        screenshot: "screenshot";
        screen: "screen";
    }>>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    text: z.ZodOptional<z.ZodString>;
    key: z.ZodOptional<z.ZodString>;
    direction: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        up: "up";
        down: "down";
    }>>;
    pages: z.ZodOptional<z.ZodNumber>;
    x1: z.ZodOptional<z.ZodNumber>;
    y1: z.ZodOptional<z.ZodNumber>;
    x2: z.ZodOptional<z.ZodNumber>;
    y2: z.ZodOptional<z.ZodNumber>;
    value: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    secondaryAction: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodNumber>;
    length: z.ZodOptional<z.ZodNumber>;
    matchText: z.ZodOptional<z.ZodString>;
    prefix: z.ZodOptional<z.ZodString>;
    suffix: z.ZodOptional<z.ZodString>;
    selectionType: z.ZodOptional<z.ZodEnum<{
        text: "text";
        cursor_before: "cursor_before";
        cursor_after: "cursor_after";
    }>>;
    elementToken: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const computerActionSchema: z.ZodObject<{
    action: z.ZodEnum<{
        click: "click";
        type_text: "type_text";
        press_key: "press_key";
        scroll: "scroll";
        drag: "drag";
        perform_secondary_action: "perform_secondary_action";
        set_value: "set_value";
        select_text: "select_text";
    }>;
    showCursor: z.ZodOptional<z.ZodBoolean>;
    inputMethod: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        physical: "physical";
        unicode: "unicode";
        ax: "ax";
    }>>;
    button: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        middle: "middle";
    }>>;
    clickCount: z.ZodOptional<z.ZodNumber>;
    strategy: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        physical: "physical";
        ax: "ax";
    }>>;
    coordinateSpace: z.ZodOptional<z.ZodEnum<{
        screenshot: "screenshot";
        screen: "screen";
    }>>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    text: z.ZodOptional<z.ZodString>;
    key: z.ZodOptional<z.ZodString>;
    direction: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        up: "up";
        down: "down";
    }>>;
    pages: z.ZodOptional<z.ZodNumber>;
    x1: z.ZodOptional<z.ZodNumber>;
    y1: z.ZodOptional<z.ZodNumber>;
    x2: z.ZodOptional<z.ZodNumber>;
    y2: z.ZodOptional<z.ZodNumber>;
    value: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    secondaryAction: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodNumber>;
    length: z.ZodOptional<z.ZodNumber>;
    matchText: z.ZodOptional<z.ZodString>;
    prefix: z.ZodOptional<z.ZodString>;
    suffix: z.ZodOptional<z.ZodString>;
    selectionType: z.ZodOptional<z.ZodEnum<{
        text: "text";
        cursor_before: "cursor_before";
        cursor_after: "cursor_after";
    }>>;
    elementToken: z.ZodOptional<z.ZodString>;
    captureId: z.ZodString;
    pid: z.ZodNumber;
    windowId: z.ZodString;
}, z.core.$strict>;
export type ComputerAction = z.infer<typeof computerActionSchema>;
export declare const computerSequenceSchema: z.ZodObject<{
    pid: z.ZodNumber;
    windowId: z.ZodString;
    captureId: z.ZodString;
    actions: z.ZodArray<z.ZodObject<{
        length: z.ZodOptional<z.ZodNumber>;
        key: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        text: z.ZodOptional<z.ZodString>;
        action: z.ZodEnum<{
            click: "click";
            type_text: "type_text";
            press_key: "press_key";
            scroll: "scroll";
            drag: "drag";
            perform_secondary_action: "perform_secondary_action";
            set_value: "set_value";
            select_text: "select_text";
        }>;
        showCursor: z.ZodOptional<z.ZodBoolean>;
        inputMethod: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            physical: "physical";
            unicode: "unicode";
            ax: "ax";
        }>>;
        button: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
            middle: "middle";
        }>>;
        clickCount: z.ZodOptional<z.ZodNumber>;
        strategy: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            physical: "physical";
            ax: "ax";
        }>>;
        coordinateSpace: z.ZodOptional<z.ZodEnum<{
            screenshot: "screenshot";
            screen: "screen";
        }>>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        direction: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
            up: "up";
            down: "down";
        }>>;
        pages: z.ZodOptional<z.ZodNumber>;
        x1: z.ZodOptional<z.ZodNumber>;
        y1: z.ZodOptional<z.ZodNumber>;
        x2: z.ZodOptional<z.ZodNumber>;
        y2: z.ZodOptional<z.ZodNumber>;
        secondaryAction: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodNumber>;
        matchText: z.ZodOptional<z.ZodString>;
        prefix: z.ZodOptional<z.ZodString>;
        suffix: z.ZodOptional<z.ZodString>;
        selectionType: z.ZodOptional<z.ZodEnum<{
            text: "text";
            cursor_before: "cursor_before";
            cursor_after: "cursor_after";
        }>>;
        elementToken: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ComputerSequence = z.infer<typeof computerSequenceSchema>;
export declare const computerImageSchema: z.ZodObject<{
    mimeType: z.ZodEnum<{
        "image/png": "image/png";
        "image/jpeg": "image/jpeg";
    }>;
    dataBase64: z.ZodString;
}, z.core.$strict>;
export type ComputerImage = z.infer<typeof computerImageSchema>;
export type ComputerState = "disabled" | "ready" | "paused" | "taken-over" | "unknown";
export interface ComputerStatus {
    state: ComputerState;
    owner?: string;
    preview: boolean;
    actionLogging?: boolean;
    lastOutcome: "not-dispatched" | "completed" | "refused" | "unverified" | "unknown";
    diagnostic?: string;
}
export type ComputerPermissionState = "granted" | "denied" | "unknown";
export interface ComputerAuditEntry {
    at: number;
    action: ComputerAction["action"];
    target: WindowTarget;
    outcome: ComputerStatus["lastOutcome"];
    durationMs: number;
    /** 哪个应用被操作了 —— 事后翻日志时第一个想知道的就是它。 */
    bundleId?: string;
    /** 失败时的结构化错误码。 */
    errorCode?: string;
}
export interface ComputerActionLimit {
    action: ComputerAction["action"];
    code: string;
    message: string;
}
export interface ComputerDiagnostics {
    workerPath: string;
    hostPath: string;
    expectedVersion: string;
    driverVersion?: string;
    uptimeSeconds?: number;
    /** 助手二进制是否真的在磁盘上；与「已加载」是两件事。 */
    helperPresent?: boolean;
    /** 焦点守卫是否武装成功；未武装时动作可能把用户前台窗口带走。 */
    focusGuard?: "armed" | "unavailable";
    sdkLoaded: boolean;
    runtimeReady: boolean;
    permissions: {
        accessibility: ComputerPermissionState;
        screenRecording: ComputerPermissionState;
    };
    strictApproval: boolean;
    approvals: ComputerAppApproval[];
    audit: ComputerAuditEntry[];
    error?: string;
    actionLimits?: ComputerActionLimit[];
}
export interface ComputerPreview {
    image: ComputerImage;
    target: WindowTarget;
    capturedAt: number;
    cursor?: {
        x: number;
        y: number;
        expiresAt: number;
        eventId?: number;
        action?: "click" | "drag" | "type" | "scroll";
        symbol?: string;
        image?: ComputerImage;
        hotspot?: {
            x: number;
            y: number;
        };
    };
}
export type ComputerControl = "pause" | "resume" | "takeover" | "stop";
export interface ComputerDesktopApi {
    onNavigate?(listener: (target: {
        sessionId?: string;
        projectId?: string;
        revealBrowser?: boolean;
    }) => void): () => void;
    status(): Promise<ComputerStatus>;
    enable(): Promise<ComputerStatus>;
    control(control: ComputerControl): Promise<ComputerStatus>;
    preview(enabled: boolean): Promise<ComputerStatus>;
    logging(enabled: boolean): Promise<ComputerStatus>;
    diagnostics(): Promise<ComputerDiagnostics>;
    requestAccessibility(): Promise<ComputerDiagnostics>;
    testSetup(): Promise<ComputerDiagnostics>;
    strict(enabled: boolean): Promise<ComputerDiagnostics>;
    approve(bundleId: string): Promise<ComputerDiagnostics>;
    revoke(bundleId: string): Promise<ComputerDiagnostics>;
}
export declare const computerIpc: {
    readonly navigate: "desktop:computer:navigate";
    readonly strict: "desktop:computer:strict";
    readonly approve: "desktop:computer:approve";
    readonly revoke: "desktop:computer:revoke";
    readonly status: "desktop:computer:status";
    readonly enable: "desktop:computer:enable";
    readonly control: "desktop:computer:control";
    readonly preview: "desktop:computer:preview";
    readonly logging: "desktop:computer:logging";
    readonly diagnostics: "desktop:computer:diagnostics";
    readonly accessibility: "desktop:computer:accessibility";
    readonly test: "desktop:computer:test";
};
