export type SessionSearchCleanupScope = {
    sourcePath: string;
} | {
    sourceRoot: string;
};
/** 行删除与 SQLite 等锁留在工作线程；同一进程只运行一个清理线程。 */
export declare function deleteSessionSearchRows(databasePath: string, sessionId: string, scope: SessionSearchCleanupScope): Promise<void>;
