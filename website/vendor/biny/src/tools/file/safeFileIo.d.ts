import type { FileHandle } from "node:fs/promises";
export declare const maxEditFileBytes: number;
export interface FileSnapshot {
    device: bigint;
    inode: bigint;
    size: bigint;
    mode: bigint;
    links: bigint;
    modifiedAt: bigint;
    changedAt: bigint;
}
export interface BoundedFileRead {
    content: string;
    truncated: boolean;
    snapshot: FileSnapshot;
}
export interface Utf8LineVisitResult {
    snapshot: FileSnapshot;
    completed: boolean;
    /** True when content remains after the last line delivered to the visitor. */
    hasRemaining: boolean;
    linesVisited: number;
}
/**
 * 按行流式读取普通文件；不会因为文件总体很大而把全文放进内存。
 * 回调返回 false 时安全停止，但仍会复核路径与已打开句柄是否指向同一版本。
 * 可选 drain 用于批量异步访问：在读取边界、后续行校验失败之前和最终版本复核之前清空缓冲。
 */
export declare function visitBoundUtf8Lines(filePath: string, visit: (line: string, lineNumber: number) => boolean | void | Promise<boolean | void>, signal?: AbortSignal, drain?: () => boolean | void | Promise<boolean | void>): Promise<Utf8LineVisitResult>;
export declare class FileReadLimitError extends Error {
    readonly actualBytes: bigint;
    readonly maxBytes: number;
    constructor(actualBytes: bigint, maxBytes: number);
}
export declare function readBoundedUtf8File(filePath: string, maxBytes: number, overflow: "reject" | "truncate", signal?: AbortSignal): Promise<BoundedFileRead>;
export declare function readBoundedBinaryFile(filePath: string, maxBytes: number, signal?: AbortSignal): Promise<Buffer>;
export declare function readUtf8FileForEdit(filePath: string, signal?: AbortSignal, requireValidUtf8?: boolean): Promise<{
    content: string;
    snapshot: FileSnapshot;
}>;
/**
 * 原子写入单个文件，返回写入字节数。
 *
 * `expectedSnapshot` 表示调用方认为写之前文件应有的状态：`null` 意为「文件应当不存在」，
 * 传具体快照意为「必须还是我读到的那一版」，`undefined` 则表示不做版本校验（以当前状态为准）。
 * 校验发现不一致就抛错；这是对已观察版本的尽力检查，不能保证不覆盖并发的外部原子保存。
 */
export declare function atomicWriteUtf8File(filePath: string, content: string, expectedSnapshot: FileSnapshot | null | undefined, signal?: AbortSignal, onCommit?: (evidence: string) => void | Promise<void>): Promise<number>;
/** 二进制产物只允许新建，不覆盖用户已有文件；复用同一 inode 与原子提交边界。 */
export declare function atomicWriteBinaryFile(filePath: string, content: Uint8Array, signal?: AbortSignal, onCommit?: (evidence: string) => void | Promise<void>): Promise<number>;
/**
 * 工作区内的原子写入：只在规范化后的工作区根之下创建缺失的真实目录层级。
 *
 * 写入失败或被取消时会回收本次创建的目录，但只删「仍然为空、且 inode 还是本次创建的那个」
 * 的目录，避免删掉别人同时建出来的同名目录。
 */
export declare function atomicWriteWorkspaceUtf8File(workspaceRoot: string, filePath: string, content: string, expectedSnapshot: FileSnapshot | null | undefined, signal?: AbortSignal, onCommit?: (evidence: string) => void | Promise<void>): Promise<number>;
export declare function snapshotRegularFile(filePath: string, signal?: AbortSignal): Promise<FileSnapshot>;
/**
 * 删除一个已绑定的普通文件：先把确认过的 inode 移到同目录下的私有隔离路径，再真正删除。
 *
 * 这样做是为了「删错了还能还原」——如果在这一步发现文件已被替换，会把隔离出来的版本移回去，
 * 而不是把别人的新文件默默删掉。
 */
export declare function deleteBoundRegularFile(filePath: string, expectedSnapshot: FileSnapshot, signal?: AbortSignal, onCommit?: (evidence: string) => void | Promise<void>): Promise<void>;
/**
 * 移动一个已准备好的普通文件，且不覆盖「授权之后才出现」的目标路径。
 *
 * 用 link + unlink 而不是 rename：在支持硬链接的文件系统上，link 遇到已存在的目标会失败，
 * 天然是「不覆盖」的提交方式。跨设备移动直接报错，不降级成未经校验的复制。
 */
export declare function moveBoundRegularFile(sourcePath: string, destinationPath: string, expectedSnapshot: FileSnapshot, signal?: AbortSignal, onCommit?: (evidence: string) => void | Promise<void>): Promise<void>;
/** Open a canonical regular file for reading; the caller owns closing the returned handle. */
export declare function openBoundRegularFile(filePath: string): Promise<FileHandle>;
export declare function sameOptionalFileSnapshot(left: FileSnapshot | null, right: FileSnapshot | null): boolean;
export declare function sameFileSnapshot(left: FileSnapshot, right: FileSnapshot): boolean;
