/** Bounded UTF-8 tail storage for decoded shell output.
 * Equivalence to appendCappedToLimit requires independently well-formed UTF-16
 * chunks, as supplied by StringDecoder and ASCII diagnostics. For out-of-contract
 * lone surrogates, Buffer.from replaces them per chunk with U+FFFD; it does not
 * preserve them or pair surrogates across chunks as the old helper might.
 * This is deliberately not a replacement contract for public appendCapped.
 */
export declare class BoundedUtf8Tail {
    readonly limitBytes: number;
    static readonly blockBytes: number;
    private readonly blocks;
    private head;
    private length;
    private backingBytes;
    constructor(limitBytes: number);
    get retainedBytes(): number;
    get allocatedBlockCount(): number;
    get allocatedBackingBytes(): number;
    append(chunk: string): void;
    toString(): string;
    private at;
}
