import { type MaskHit, type MaskSegment } from "./engine.js";
import { type RedactionStore } from "./store.js";
import type { RedactionSettings } from "./settings.js";
type Transform = (value: string, path: string[], key: string) => string;
/** 只替换字符串 token；其余字节（包括空白、数字精度与字段顺序）保留。 */
export declare function walkJsonValues(source: string, transform: Transform, observe?: (value: string, path: string[], stringValue: boolean) => void, locate?: (path: string[], start: number, end: number) => void): string | undefined;
export interface MaskJsonSegment {
    path: string;
    original: string;
    masked: string;
    segments: MaskSegment[];
    role?: string;
    truncated?: boolean;
}
export interface MaskJsonResult {
    text: string;
    hits: MaskHit[];
    segments: MaskJsonSegment[];
}
export declare function maskJson(source: string, settings: RedactionSettings, store?: RedactionStore): MaskJsonResult;
/** 嵌套 JSON 的工具参数须先按内层字符串转义，再按外层字符串转义。 */
export declare function restoreJson(source: string, restoreText?: (value: string) => string): string;
export type { RedactionSettings };
