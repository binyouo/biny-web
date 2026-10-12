/** Both counters describe decoded text in UTF-8, never raw process input. */
export declare function captureMetadata(decodedBytes: number, retainedBytes: number): {
    omittedBytes: number;
    truncated: boolean;
};
