import { ComputerAuditStore } from "./auditStore.js";
import { type ComputerMirrorRequest, type ComputerAction, type ComputerAuditEntry, type ComputerImage, type ComputerPreview, type ComputerStatus, type WindowObserve, type WindowTarget } from "./protocol.js";
export interface DriverReply {
    data: Record<string, unknown>;
    images: ComputerImage[];
    errorCode?: string;
}
export interface ComputerDriver {
    start(): Promise<void>;
    stop(): Promise<void>;
    launchApp?(bundleId: string, signal?: AbortSignal): Promise<DriverReply>;
    list(session: string, pid: number | undefined, signal: AbortSignal, days?: number): Promise<DriverReply>;
    observe(session: string, target: WindowObserve, signal: AbortSignal): Promise<DriverReply>;
    act(session: string, action: ComputerAction, signal: AbortSignal): Promise<DriverReply>;
    mirror?(operation: ComputerMirrorRequest["operation"], args: Record<string, unknown>): Promise<DriverReply>;
}
interface ControllerOptions {
    enabled?: boolean;
    previewEnabled?: boolean;
    actionLogging?: boolean;
    auditStore?: ComputerAuditStore;
    now?: () => number;
    preview?: (frame: ComputerPreview | undefined) => void;
    refreshPreview?: (target: WindowTarget | undefined, signal: AbortSignal) => Promise<ComputerPreview | undefined>;
    authorize?: (session: string, target: WindowTarget, signal: AbortSignal) => Promise<string>;
    authorizeLaunch?: (bundleId: string, signal: AbortSignal) => Promise<void>;
    setPreviewVisible?: (visible: boolean) => void;
    previewIdleMs?: number;
    externalMirrors?: boolean;
    onMirrorChange?: (windowId: string, requestId?: string) => void;
    onPreviewError?: (error: string) => void;
}
export declare class ComputerUseController {
    private readonly driver;
    private readonly options;
    private snapshot;
    private capture?;
    private generation;
    private active?;
    private tail;
    private started;
    private starting?;
    private readonly journal;
    private mirrors;
    private mirrorGeneration;
    private framePump?;
    private previewRefresh?;
    private previewRevision;
    private readonly frameIntervalMs;
    private previewShown;
    private previewTimer?;
    private readonly previewIdleMs;
    constructor(driver: ComputerDriver, options?: ControllerOptions);
    status(): ComputerStatus;
    audit(): ComputerAuditEntry[];
    setLogging(enabled: boolean): void;
    private record;
    enable(): Promise<void>;
    private ensureStarted;
    private waitForStartup;
    disable(): Promise<void>;
    control(control: "pause" | "resume" | "takeover"): void;
    release(session: string): void;
    authorizationChanged(): void;
    /** 当前有效期内的观察目标；PiP 帧泵用它决定重拍哪个窗口。 */
    currentCapture(): {
        target: WindowTarget;
    } | undefined;
    setPreview(enabled: boolean): void;
    dismissPreview(): void;
    /** 已派发动作续期监督窗，不改变用户的预览偏好。 */
    noteActivity(): void;
    private showPreview;
    private hidePreview;
    private armPreviewIdle;
    private clearPreviewIdle;
    private startFramePump;
    private stopFramePump;
    setForeground(enabled: boolean): void;
    crashed(): void;
    private invalidate;
    private now;
    private enqueue;
    launch(session: string, bundleId: string, signal?: AbortSignal): Promise<DriverReply>;
    list(session: string, pid?: number, signal?: AbortSignal, days?: number): Promise<DriverReply>;
    mirror(session: string, input: ComputerMirrorRequest, signal?: AbortSignal): Promise<DriverReply>;
    observe(session: string, target: WindowObserve, signal?: AbortSignal): Promise<DriverReply>;
    private captureWindow;
    act(session: string, input: Omit<ComputerAction, "delivery"> & {
        delivery?: ComputerAction["delivery"];
    }, signal?: AbortSignal): Promise<DriverReply>;
    private verificationUnavailable;
}
export {};
