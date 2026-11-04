import type { DatabaseSync } from "node:sqlite";
import { SessionSearchStore, type SessionSearchRefreshOptions } from "./searchIndexStore.js";
export * from "./searchIndexStore.js";
export declare class SessionSearchIndex extends SessionSearchStore {
    private workerLease;
    private indexingController;
    private readonly pending;
    private closing;
    refreshAll(options?: SessionSearchRefreshOptions): Promise<void>;
    indexSessionFile(sessionId: string, filePath: string, signal?: AbortSignal): Promise<number>;
    close(): Promise<void>;
    private indexingSignal;
    protected open(): DatabaseSync;
    private ensureOpen;
    private track;
}
