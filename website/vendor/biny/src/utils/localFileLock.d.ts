export declare function withLocalFileWriteLock<T>(root: string, lockFileName: string, operation: () => Promise<T>): Promise<T>;
