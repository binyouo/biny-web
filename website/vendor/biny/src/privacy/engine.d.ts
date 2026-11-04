import { type RedactionSettings } from "./settings.js";
import { type RedactionStore } from "./store.js";
export interface MaskHit {
    kind: string;
    placeholder: string;
    length: number;
}
export interface MaskResult {
    text: string;
    hits: MaskHit[];
}
export interface MaskSegment {
    kind: string;
    original: string;
    masked: string;
    start: number;
    end: number;
}
export interface MaskTextResult extends MaskResult {
    segments: MaskSegment[];
}
export declare function maskText(text: string, settings: RedactionSettings, store?: RedactionStore, field?: string): MaskTextResult;
/** 历史内容复用首次发送时的替换位置；字段语义不同的同文不能共享决定。 */
export declare function maskSentText(text: string, context: string, store: RedactionStore, discover: () => MaskTextResult): MaskTextResult;
export declare function restore(source: string): string;
