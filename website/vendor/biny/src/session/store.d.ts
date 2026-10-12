import { type Stats } from "node:fs";
import type { FileHandle } from "node:fs/promises";
export interface SessionFileSnapshot {
    filePath: string;
    fileName: string;
    bytes: Buffer;
    stat: Stats;
}
export interface SessionDeleteHooks {
    beforeTombstoneMove?(paths: {
        filePath: string;
        tombstonePath: string;
    }): Promise<void>;
    afterTombstoneVerified?(paths: {
        filePath: string;
        tombstonePath: string;
    }): Promise<void>;
}
export declare function agentDir(workspaceRoot: string): string;
export declare function ensureAgentDirs(workspaceRoot: string): Promise<void>;
export declare function sessionFilePath(workspaceRoot: string, sessionId: string): string;
export declare function sessionIdFromFile(filePath: string): string;
export declare function listSessionFiles(workspaceRoot: string): Promise<string[]>;
/** 返回经项目目录与文件绑定检查的会话路径，供批量修复避免逐项重新定位工作区。 */
export declare function listSessionFilePaths(workspaceRoot: string): Promise<string[]>;
/** 枚举全局 session 分区，供每日工作日志补写漏掉的聊天回合。 */
export declare function listAllSessionFiles(agentDir?: string, signal?: AbortSignal): Promise<string[]>;
export declare function resolveSessionFile(workspaceRoot: string, session: string | undefined): Promise<string>;
export declare function readSessionSnapshot(workspaceRoot: string, session: string | undefined): Promise<SessionFileSnapshot>;
/** 历史读取仍校验文件绑定；读取期间变化的文件不能发布成完整缓存。 */
export declare function readSessionFileOrCached<T>(workspaceRoot: string, session: string | undefined, lookup: (filePath: string, stat: Stats) => T | undefined, load: (handle: FileHandle, filePath: string, stat: Stats) => Promise<T>): Promise<{
    filePath: string;
    stat: Stats;
    value: T;
}>;
export declare function duplicateSessionFile(workspaceRoot: string, sourceSession: string, targetSessionId: string): Promise<string>;
export declare function createSessionFile(workspaceRoot: string, targetSessionId: string, bytes: Uint8Array): Promise<string>;
export declare function deleteSessionFile(workspaceRoot: string, session: string, hooks?: SessionDeleteHooks): Promise<void>;
