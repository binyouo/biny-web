import { type BlendedEmotion, type EmotionState } from "./emotionTypes.js";
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
    readContext(sessionId: string): Promise<EmotionState | undefined>;
    writeContext(sessionId: string, state: EmotionState, signal?: AbortSignal): Promise<void>;
    readBlended(sessionId: string | undefined, fatigue: number, now?: Date): Promise<BlendedEmotion>;
    listContexts(): Promise<Array<{
        sessionId: string;
        state: EmotionState;
    }>>;
    private readState;
    private writeState;
}
