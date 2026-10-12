export type FatigueLevel = "awake" | "tired" | "sleepy" | "sleeping";
export type FatigueAction = "sleep" | "wake" | "rest";
export interface FatigueState {
    fatigue: number;
    messageCount: number;
    lastMessageTime: string;
    lastRestTime: string;
    manualSleep: boolean;
    manualWake: boolean;
}
export interface FatigueStatus {
    fatigue: number;
    level: FatigueLevel;
    messageCount: number;
    isNight: boolean;
    manualSleep: boolean;
    manualWake: boolean;
    lastRestTime: string;
}
export interface FatigueServiceOptions {
    agentDir?: string;
    now?: () => Date;
}
export declare class FatigueService {
    private readonly filePath;
    private readonly now;
    private readonly emotions;
    private state;
    constructor(options?: FatigueServiceOptions);
    get path(): string;
    initialize(): Promise<void>;
    read(): Promise<FatigueState>;
    recordMessage(): Promise<FatigueStatus>;
    change(action: FatigueAction): Promise<FatigueStatus>;
    status(): FatigueStatus;
    getFatigue(): number;
    currentStatus(): Promise<FatigueStatus>;
    private mutate;
    private refreshSleep;
    private readState;
    private writeState;
}
export declare function fatigueLevel(value: number): FatigueLevel;
export declare function fatigueTimeBonus(date: Date): number;
