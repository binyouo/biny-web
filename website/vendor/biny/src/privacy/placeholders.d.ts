/** 只规范化形状，不猜测哈希；查不到所属映射的文本原样保留。 */
export declare function restorePlaceholders(text: string, values: ReadonlyMap<string, string>, json?: boolean): string;
