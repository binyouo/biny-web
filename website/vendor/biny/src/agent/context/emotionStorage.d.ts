import { type BlendedEmotion, type EmotionState } from "./emotionTypes.js";
import type { FatigueAction } from "./fatigue.js";
export interface EmotionStorageOptions {
    configDir?: string;
    now?: () => Date;
}
export declare class EmotionStorage {
    private readonly root;
    private readonly now;
    constructor(options?: EmotionStorageOptions);
    get directory(): string;
    readBase(): Promise<EmotionState | undefined>;
    writeBase(state: EmotionState): Promise<void>;
    /** 休息只更新能量，锁内读取以保留同时发生的心情变化。 */
    updateRestEnergy(action: FatigueAction): Promise<void>;
    /** 自省和睡醒后的更新不能覆盖生成期间发生的手动情绪变化。 */
    compareAndSetBase(state: EmotionState, expected: EmotionState | undefined): Promise<boolean>;
    readContext(sessionId: string): Promise<EmotionState | undefined>;
    writeContext(sessionId: string, state: EmotionState): Promise<void>;
    readBlended(sessionId: string | undefined, fatigue: number, now?: Date): Promise<BlendedEmotion>;
    listContexts(): Promise<Array<{
        sessionId: string;
        state: EmotionState;
    }>>;
    private readState;
    private writeState;
}
