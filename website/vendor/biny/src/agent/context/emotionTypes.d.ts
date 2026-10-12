/**
 * Agent 情绪状态的共享类型与纯计算规则。
 *
 * 情绪只影响表达层。状态本身由 Markdown 存储，blendEmotion 负责在注入 prompt 前处理
 * 时间衰减与 base/context 融合。
 */
export interface EmotionState {
    mood: string;
    valence: number;
    energy: number;
    updatedAt: string;
    trigger?: string;
}
export type EmotionScope = "base" | "context";
export interface BlendedEmotion extends EmotionState {
    fatigue: number;
    base?: EmotionState;
    context?: EmotionState;
    source: "base" | "context" | "blended";
}
export declare const BASE_DECAY_MS: number;
export declare const CONTEXT_DECAY_MS: number;
export declare const EMOTION_RESTING_VALENCE = 6;
export declare const DEFAULT_EMOTION_STATE: EmotionState;
/**
 * 计算当前真正注入模型的情绪。
 *
 * 每层的 valence 会线性回到 6；超过窗口后该层变成 cheerful/6，但仍保留它作为一条
 * 已存在的层参与融合。context 的 mood 优先，valence 按 0.3/0.7 融合，energy 以 base
 * 为准。没有 base 文件时使用默认 cheerful base 作为锚点。
 */
export declare function blendEmotion(base: EmotionState | undefined, context: EmotionState | undefined, fatigue: number, now?: Date): BlendedEmotion;
