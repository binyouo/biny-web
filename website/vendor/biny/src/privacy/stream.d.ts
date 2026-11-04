/** 扣留至多 64 字符的占位符候选尾部；无括号时须匹配已知类型的前缀。 */
export declare function pendingTailLength(text: string, kinds?: readonly string[]): number;
/** SSE framing 与模型 delta 分层；互相交错的 choice、tool、content block 独立拼接。 */
export declare class SseRestorer {
    private readonly restoreText;
    private readonly kinds;
    private buffer;
    private readonly queue;
    private readonly pending;
    private readonly wordBoundaries;
    private heldSize;
    constructor(restoreText: (value: string, json?: boolean) => string, kinds?: readonly string[]);
    push(chunk: string, flush?: boolean): string;
    private flushPending;
    private restoreDelta;
    private event;
    private drain;
}
