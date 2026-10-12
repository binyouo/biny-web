export declare const maxRegexQueryBytes: number;
export declare const maxRegexBatchLines = 128;
export declare const regexBatchTargetBytes: number;
export interface RegexBatchWindow {
    skipMatches: number;
    remainingMatches: number;
    contextLines: number;
    remainingContext: number;
    hasMore: boolean;
}
export declare class RegexExecutionError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
export declare class CancellableRegexMatcher {
    private readonly worker;
    private readonly signal;
    private readonly batchBytes;
    private pending;
    private stopped;
    private failure;
    private termination;
    private readonly onAbort;
    private readonly onError;
    private readonly onExit;
    private readonly onMessage;
    private constructor();
    static create(query: string, flags: string, signal?: AbortSignal, maxBatchBytes?: number): Promise<CancellableRegexMatcher>;
    match(lines: readonly string[], window: RegexBatchWindow): Promise<Array<number | undefined>>;
    close(): Promise<void>;
    private request;
    private fail;
}
