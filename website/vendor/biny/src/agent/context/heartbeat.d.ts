export interface HeartbeatSchedule {
    intervalMinutes: number;
    activeHoursStart: number;
    activeHoursEnd: number;
}
/** 开关与节奏由全局配置 `heartbeat` 提供，未配置时走这里。 */
export declare const defaultHeartbeatSchedule: HeartbeatSchedule;
export interface HeartbeatStatus {
    /** 心跳是否随运行时启动；关闭时只有 triggerNow 手动触发可用。 */
    enabled: boolean;
    running: boolean;
    lastHeartbeatAt?: string;
    lastError?: string;
    activeHours: {
        start: number;
        end: number;
    };
}
export interface HeartbeatSchedulerOptions {
    run: (prompt: string, signal: AbortSignal) => void | Promise<void>;
    /** 全局配置的开关；缺省关闭，保持稳定的默认行为。 */
    enabled?: boolean;
    /** 全局配置的节奏；缺省走 defaultHeartbeatSchedule。 */
    schedule?: HeartbeatSchedule;
    configDir?: string;
    now?: () => Date;
    timers?: {
        setInterval: (callback: () => void, ms: number) => ReturnType<typeof setInterval>;
        clearInterval: (handle: ReturnType<typeof setInterval>) => void;
    };
}
export declare class HeartbeatFileStore {
    readonly path: string;
    constructor(configDir?: string);
    ensure(): Promise<void>;
    read(): Promise<string | undefined>;
}
export declare class HeartbeatScheduler {
    private readonly schedule;
    private readonly enabled;
    private readonly run;
    private readonly fileStore;
    private readonly now;
    private readonly timers;
    private timer?;
    private abort;
    private inFlight;
    private lastHeartbeatAt?;
    private lastError?;
    private diaryHintDate?;
    constructor(options: HeartbeatSchedulerOptions);
    start(): void;
    stop(): void;
    triggerNow(): Promise<boolean>;
    status(): HeartbeatStatus;
    private tick;
    /** 提醒和写入分开：由 Agent 读取技能后决定并执行，不能在启动时绕过心跳开关写日记。 */
    private diaryHint;
}
export declare function isActiveHour(schedule: HeartbeatSchedule, date: Date): boolean;
