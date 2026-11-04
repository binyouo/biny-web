export interface LocalFileWriteLockOptions {
    /** Compatibility window for legacy markers that publish neither a PID nor an authority. */
    unownedLegacyMarkerGraceMs?: number;
}
export declare function withLocalFileWriteLock<T>(root: string, lockFileName: string, operation: () => Promise<T>, options?: LocalFileWriteLockOptions): Promise<T>;
