import type { RuntimeEventAuthority } from "./RuntimeAuthority.js";
import type { InteractiveRuntimeHandle } from "./InteractiveAgentRuntime.js";
export type AutomationTriggerType = "heartbeat" | "cron" | "interval" | "once";
export type AutomationStatus = "active" | "paused" | "completed" | "failed" | "expired";
export interface AutomationSchedule {
    cron?: string;
    intervalMs?: number;
    at?: string;
    jitterMs?: number;
}
export interface AutomationExecutionTemplate {
    prompt: string;
    sessionId?: string;
}
export interface AutomationRecord {
    automationId: string;
    workspaceId: string;
    name: string;
    triggerType: AutomationTriggerType;
    schedule: AutomationSchedule;
    executionTemplate: AutomationExecutionTemplate;
    status: AutomationStatus;
    nextFireAt?: string;
    lastFireAt?: string;
    fireCount: number;
    consecutiveFailures: number;
    maxFires?: number;
    expiresAt?: string;
    revision: number;
    createdAt: string;
    updatedAt: string;
}
export interface AutomationPendingFire {
    fireId: string;
    automationId: string;
    scheduledAt: string;
    claimToken?: string;
    claimedAt?: string;
    status: "pending" | "running" | "completed" | "failed" | "deferred" | "needs_approval";
    runId?: string;
    error?: string;
    createdAt: string;
}
export interface AutomationCreateInput {
    automationId?: string;
    name: string;
    triggerType: AutomationTriggerType;
    schedule: AutomationSchedule;
    executionTemplate: AutomationExecutionTemplate;
    maxFires?: number;
    expiresAt?: string;
}
/** Host 已经找到目标 session，但它正在运行；调度器应延后 fire，而不是把它记成失败。 */
export declare class AutomationTargetBusyError extends Error {
    readonly sessionId: string;
    readonly code = "automation_target_busy";
    constructor(sessionId: string);
}
export declare class AutomationStore {
    private readonly database;
    private readonly authority;
    private closed;
    private constructor();
    static open(persistenceRoot: string, authority: RuntimeEventAuthority): Promise<AutomationStore>;
    create(input: AutomationCreateInput): AutomationRecord;
    get(automationId: string): AutomationRecord | undefined;
    list(): AutomationRecord[];
    pause(automationId: string): AutomationRecord;
    resume(automationId: string): AutomationRecord;
    delete(automationId: string): void;
    forceFire(automationId: string, scheduledAt?: string): AutomationPendingFire;
    claimDue(now?: Date, limit?: number): AutomationPendingFire[];
    claimFire(fireId: string, claimToken?: `${string}-${string}-${string}-${string}-${string}`): AutomationPendingFire | undefined;
    completeFire(fireId: string, runId: string): AutomationPendingFire;
    failFire(fireId: string, error: string, pauseAfter?: number): AutomationPendingFire;
    deferFire(fireId: string, at: Date, error?: string): AutomationPendingFire;
    bindFireRun(fireId: string, runId: string): AutomationPendingFire;
    /** Host 新 owner 启动时回收上一个 owner 的在途 fire；无法证明结果时停在 needs_approval。 */
    recoverInFlight(): void;
    listPending(automationId?: string): AutomationPendingFire[];
    close(): void;
    private withAutomationEvent;
    private updateStatus;
    private require;
    getFire(fireId: string): AutomationPendingFire | undefined;
    private requireFire;
    private transaction;
    private assertOpen;
}
export interface AutomationSchedulerOptions {
    onActivity?(): void;
    getRuntime: () => InteractiveRuntimeHandle;
    /** 重建 runtime 后数据库连接会替换；scheduler 必须取当前 authority projection。 */
    getStore?: () => AutomationStore;
    store?: AutomationStore;
    /** 为某个 fire 取得专属 session runtime；不传目标时创建新的自动化 session。 */
    createFreshRuntime?: (sessionId?: string) => Promise<InteractiveRuntimeHandle>;
    onRuntimeReplaced?: (runtime: InteractiveRuntimeHandle) => void;
    canStartRun?: () => boolean;
    tickMs?: number;
}
export declare class AutomationScheduler {
    private readonly options;
    private readonly tickMs;
    private timer;
    private readonly pendingFires;
    private readonly fireQueue;
    private readonly activeAutomations;
    private readonly activeSessions;
    private activeFires;
    private closed;
    private recovered;
    constructor(options: AutomationSchedulerOptions);
    start(): void;
    tick(): Promise<void>;
    runNow(automationId: string): Promise<AutomationPendingFire>;
    stop(): void;
    hasActiveWork(): boolean;
    private executeFire;
    private revalidateUnsubmittedFire;
    private enqueueFire;
    private queueDueFires;
    private ensureRecovered;
    private dispatchQueuedFires;
    private store;
}
