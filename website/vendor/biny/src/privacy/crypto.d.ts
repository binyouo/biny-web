/**
 * 一个值的占位符，可重复计算而不登记原值。
 * 供「预览」和「发送时才发现要再次遮蔽的已知值」使用。
 */
export declare function placeholderTag(kind: string, value: string, scope?: string): string;
/** 与 placeholderTag 同形的占位符正文本，用于识别已经存在的占位符。 */
export declare const placeholderPattern: RegExp;
