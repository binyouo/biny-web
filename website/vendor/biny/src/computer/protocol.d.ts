import { z } from "zod";
export declare const computerAppSchema: z.ZodObject<{
    bundleId: z.ZodString;
    appName: z.ZodString;
    approvedAt: z.ZodOptional<z.ZodString>;
    revokedAt: z.ZodOptional<z.ZodString>;
    lastUsedAt: z.ZodOptional<z.ZodString>;
    useCount: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    bundleId: string;
    appName: string;
    useCount: number;
    approvedAt?: string | undefined;
    revokedAt?: string | undefined;
    lastUsedAt?: string | undefined;
}, {
    bundleId: string;
    appName: string;
    approvedAt?: string | undefined;
    revokedAt?: string | undefined;
    lastUsedAt?: string | undefined;
    useCount?: number | undefined;
}>;
export type ComputerAppApproval = z.infer<typeof computerAppSchema>;
export declare const computerSettingsSchema: z.ZodEffects<z.ZodObject<{
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
    }, "strict", z.ZodTypeAny, {
        bundleId: string;
        appName: string;
        useCount: number;
        approvedAt?: string | undefined;
        revokedAt?: string | undefined;
        lastUsedAt?: string | undefined;
    }, {
        bundleId: string;
        appName: string;
        approvedAt?: string | undefined;
        revokedAt?: string | undefined;
        lastUsedAt?: string | undefined;
        useCount?: number | undefined;
    }>, "many">>;
}, "strict", z.ZodTypeAny, {
    enabled: boolean;
    previewEnabled: boolean;
    actionLogging: boolean;
    strictApproval: boolean;
    apps: {
        bundleId: string;
        appName: string;
        useCount: number;
        approvedAt?: string | undefined;
        revokedAt?: string | undefined;
        lastUsedAt?: string | undefined;
    }[];
}, {
    enabled?: boolean | undefined;
    previewEnabled?: boolean | undefined;
    actionLogging?: boolean | undefined;
    strictApproval?: boolean | undefined;
    apps?: {
        bundleId: string;
        appName: string;
        approvedAt?: string | undefined;
        revokedAt?: string | undefined;
        lastUsedAt?: string | undefined;
        useCount?: number | undefined;
    }[] | undefined;
}>, {
    enabled: boolean;
    previewEnabled: boolean;
    actionLogging: boolean;
    strictApproval: boolean;
    apps: {
        bundleId: string;
        appName: string;
        useCount: number;
        approvedAt?: string | undefined;
        revokedAt?: string | undefined;
        lastUsedAt?: string | undefined;
    }[];
}, {
    enabled?: boolean | undefined;
    previewEnabled?: boolean | undefined;
    actionLogging?: boolean | undefined;
    strictApproval?: boolean | undefined;
    apps?: {
        bundleId: string;
        appName: string;
        approvedAt?: string | undefined;
        revokedAt?: string | undefined;
        lastUsedAt?: string | undefined;
        useCount?: number | undefined;
    }[] | undefined;
}>;
export declare const maxComputerImageBytes: number;
export declare const windowTargetSchema: z.ZodObject<{
    pid: z.ZodNumber;
    windowId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    pid: number;
    windowId: string;
}, {
    pid: number;
    windowId: string;
}>;
export type WindowTarget = z.infer<typeof windowTargetSchema>;
export declare const computerListSchema: z.ZodObject<{
    pid: z.ZodOptional<z.ZodNumber>;
    days: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    pid?: number | undefined;
    days?: number | undefined;
}, {
    pid?: number | undefined;
    days?: number | undefined;
}>;
export declare const computerMirrorSchema: z.ZodEffects<z.ZodObject<{
    operation: z.ZodEnum<["open", "close", "list"]>;
    pid: z.ZodOptional<z.ZodNumber>;
    windowId: z.ZodOptional<z.ZodString>;
    onMinimize: z.ZodOptional<z.ZodBoolean>;
    all: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    operation: "close" | "list" | "open";
    all?: boolean | undefined;
    pid?: number | undefined;
    windowId?: string | undefined;
    onMinimize?: boolean | undefined;
}, {
    operation: "close" | "list" | "open";
    all?: boolean | undefined;
    pid?: number | undefined;
    windowId?: string | undefined;
    onMinimize?: boolean | undefined;
}>, {
    operation: "close" | "list" | "open";
    all?: boolean | undefined;
    pid?: number | undefined;
    windowId?: string | undefined;
    onMinimize?: boolean | undefined;
}, {
    operation: "close" | "list" | "open";
    all?: boolean | undefined;
    pid?: number | undefined;
    windowId?: string | undefined;
    onMinimize?: boolean | undefined;
}>;
export type ComputerMirrorRequest = z.infer<typeof computerMirrorSchema>;
/** 观察选项不属于窗口身份；审批与动作目标只使用 pid/windowId。 */
export declare const windowObserveSchema: z.ZodObject<{
    pid: z.ZodNumber;
    windowId: z.ZodString;
} & {
    maxElements: z.ZodOptional<z.ZodNumber>;
    depth: z.ZodOptional<z.ZodNumber>;
    screenshotMaxWidth: z.ZodOptional<z.ZodNumber>;
    interactiveOnly: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    pid: number;
    windowId: string;
    maxElements?: number | undefined;
    depth?: number | undefined;
    screenshotMaxWidth?: number | undefined;
    interactiveOnly?: boolean | undefined;
}, {
    pid: number;
    windowId: string;
    maxElements?: number | undefined;
    depth?: number | undefined;
    screenshotMaxWidth?: number | undefined;
    interactiveOnly?: boolean | undefined;
}>;
export type WindowObserve = z.infer<typeof windowObserveSchema>;
export declare const computerActionSchema: z.ZodEffects<z.ZodObject<{
    pid: z.ZodNumber;
    windowId: z.ZodString;
} & {
    action: z.ZodEnum<["click", "type_text", "press_key", "scroll", "drag", "perform_secondary_action", "set_value", "select_text"]>;
    captureId: z.ZodString;
    delivery: z.ZodDefault<z.ZodEnum<["background", "foreground"]>>;
    /**
     * 这一次不要动作指示器。对应参照 CLI 的 `--no-cursor`（"hides the lens for one action"）。
     * 守护进程侧的字段名就是 `show_cursor`；早先只有守护进程认识它，四个调用层都没接 ——
     * 能力在、路不通。
     */
    showCursor: z.ZodOptional<z.ZodBoolean>;
    /** physical 先验证整段文本可由当前键盘布局表达；ax 按元素写入。 */
    inputMethod: z.ZodOptional<z.ZodEnum<["auto", "physical", "unicode", "ax"]>>;
    button: z.ZodOptional<z.ZodEnum<["left", "right", "middle"]>>;
    clickCount: z.ZodOptional<z.ZodNumber>;
    strategy: z.ZodOptional<z.ZodEnum<["auto", "physical", "ax"]>>;
    coordinateSpace: z.ZodOptional<z.ZodEnum<["screenshot", "screen"]>>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    text: z.ZodOptional<z.ZodString>;
    key: z.ZodOptional<z.ZodString>;
    direction: z.ZodOptional<z.ZodEnum<["up", "down", "left", "right"]>>;
    pages: z.ZodOptional<z.ZodNumber>;
    x1: z.ZodOptional<z.ZodNumber>;
    y1: z.ZodOptional<z.ZodNumber>;
    x2: z.ZodOptional<z.ZodNumber>;
    y2: z.ZodOptional<z.ZodNumber>;
    value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    location: z.ZodOptional<z.ZodNumber>;
    length: z.ZodOptional<z.ZodNumber>;
    elementToken: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    action: "click" | "drag" | "scroll" | "type_text" | "press_key" | "perform_secondary_action" | "set_value" | "select_text";
    pid: number;
    windowId: string;
    captureId: string;
    delivery: "background" | "foreground";
    direction?: "left" | "right" | "up" | "down" | undefined;
    x1?: number | undefined;
    x2?: number | undefined;
    x?: number | undefined;
    y1?: number | undefined;
    y2?: number | undefined;
    y?: number | undefined;
    key?: string | undefined;
    length?: number | undefined;
    button?: "middle" | "left" | "right" | undefined;
    location?: number | undefined;
    text?: string | undefined;
    value?: string | number | boolean | undefined;
    showCursor?: boolean | undefined;
    inputMethod?: "unicode" | "auto" | "physical" | "ax" | undefined;
    clickCount?: number | undefined;
    strategy?: "auto" | "physical" | "ax" | undefined;
    coordinateSpace?: "screenshot" | "screen" | undefined;
    pages?: number | undefined;
    elementToken?: string | undefined;
}, {
    action: "click" | "drag" | "scroll" | "type_text" | "press_key" | "perform_secondary_action" | "set_value" | "select_text";
    pid: number;
    windowId: string;
    captureId: string;
    direction?: "left" | "right" | "up" | "down" | undefined;
    x1?: number | undefined;
    x2?: number | undefined;
    x?: number | undefined;
    y1?: number | undefined;
    y2?: number | undefined;
    y?: number | undefined;
    key?: string | undefined;
    length?: number | undefined;
    button?: "middle" | "left" | "right" | undefined;
    location?: number | undefined;
    text?: string | undefined;
    value?: string | number | boolean | undefined;
    delivery?: "background" | "foreground" | undefined;
    showCursor?: boolean | undefined;
    inputMethod?: "unicode" | "auto" | "physical" | "ax" | undefined;
    clickCount?: number | undefined;
    strategy?: "auto" | "physical" | "ax" | undefined;
    coordinateSpace?: "screenshot" | "screen" | undefined;
    pages?: number | undefined;
    elementToken?: string | undefined;
}>, {
    action: "click" | "drag" | "scroll" | "type_text" | "press_key" | "perform_secondary_action" | "set_value" | "select_text";
    pid: number;
    windowId: string;
    captureId: string;
    delivery: "background" | "foreground";
    direction?: "left" | "right" | "up" | "down" | undefined;
    x1?: number | undefined;
    x2?: number | undefined;
    x?: number | undefined;
    y1?: number | undefined;
    y2?: number | undefined;
    y?: number | undefined;
    key?: string | undefined;
    length?: number | undefined;
    button?: "middle" | "left" | "right" | undefined;
    location?: number | undefined;
    text?: string | undefined;
    value?: string | number | boolean | undefined;
    showCursor?: boolean | undefined;
    inputMethod?: "unicode" | "auto" | "physical" | "ax" | undefined;
    clickCount?: number | undefined;
    strategy?: "auto" | "physical" | "ax" | undefined;
    coordinateSpace?: "screenshot" | "screen" | undefined;
    pages?: number | undefined;
    elementToken?: string | undefined;
}, {
    action: "click" | "drag" | "scroll" | "type_text" | "press_key" | "perform_secondary_action" | "set_value" | "select_text";
    pid: number;
    windowId: string;
    captureId: string;
    direction?: "left" | "right" | "up" | "down" | undefined;
    x1?: number | undefined;
    x2?: number | undefined;
    x?: number | undefined;
    y1?: number | undefined;
    y2?: number | undefined;
    y?: number | undefined;
    key?: string | undefined;
    length?: number | undefined;
    button?: "middle" | "left" | "right" | undefined;
    location?: number | undefined;
    text?: string | undefined;
    value?: string | number | boolean | undefined;
    delivery?: "background" | "foreground" | undefined;
    showCursor?: boolean | undefined;
    inputMethod?: "unicode" | "auto" | "physical" | "ax" | undefined;
    clickCount?: number | undefined;
    strategy?: "auto" | "physical" | "ax" | undefined;
    coordinateSpace?: "screenshot" | "screen" | undefined;
    pages?: number | undefined;
    elementToken?: string | undefined;
}>;
export type ComputerAction = z.infer<typeof computerActionSchema>;
export declare const computerImageSchema: z.ZodObject<{
    mimeType: z.ZodEnum<["image/png", "image/jpeg"]>;
    dataBase64: z.ZodString;
}, "strict", z.ZodTypeAny, {
    mimeType: "image/png" | "image/jpeg";
    dataBase64: string;
}, {
    mimeType: "image/png" | "image/jpeg";
    dataBase64: string;
}>;
export type ComputerImage = z.infer<typeof computerImageSchema>;
export type ComputerState = "disabled" | "ready" | "paused" | "taken-over" | "unknown";
export interface ComputerStatus {
    state: ComputerState;
    owner?: string;
    preview: boolean;
    foregroundAllowed: boolean;
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
}
export type ComputerControl = "pause" | "resume" | "takeover" | "stop";
export interface ComputerDesktopApi {
    onNavigate?(listener: (target: {
        sessionId?: string;
        projectId?: string;
    }) => void): () => void;
    status(): Promise<ComputerStatus>;
    enable(): Promise<ComputerStatus>;
    control(control: ComputerControl): Promise<ComputerStatus>;
    preview(enabled: boolean): Promise<ComputerStatus>;
    foreground(enabled: boolean): Promise<ComputerStatus>;
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
    readonly foreground: "desktop:computer:foreground";
    readonly logging: "desktop:computer:logging";
    readonly diagnostics: "desktop:computer:diagnostics";
    readonly accessibility: "desktop:computer:accessibility";
    readonly test: "desktop:computer:test";
};
