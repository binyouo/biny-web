import type { FileHandle } from "node:fs/promises";
import type { ManagedProcessOutput, ReadManagedProcessOutputOptions } from "./ManagedProcessService.js";
export interface ManagedProcessLogBinding {
    readonly path: string;
    readonly device: bigint;
    readonly inode: bigint;
}
/** A stable logical byte range; segmented storage supplies its own bound reads. */
export interface ManagedProcessLogSource {
    path: string;
    totalBytes: number;
    read(buffer: Buffer, offset: number, length: number, position: number): Promise<{
        bytesRead: number;
    }>;
}
/** Bind a creation-time descriptor before another operation can replace its path. */
export declare function bindManagedProcessLog(logPath: string, handle: FileHandle): Promise<ManagedProcessLogBinding>;
export declare function assertManagedLogBinding(binding: ManagedProcessLogBinding, file: FileHandle): Promise<void>;
export declare function readBoundManagedLogBytes(binding: ManagedProcessLogBinding, position: number, length: number, signal?: AbortSignal): Promise<Buffer>;
export declare function removeBoundManagedLog(binding: ManagedProcessLogBinding): Promise<void>;
export declare function readManagedProcessLog(binding: ManagedProcessLogBinding | ManagedProcessLogSource, options?: ReadManagedProcessOutputOptions, signal?: AbortSignal, context?: {
    final: boolean;
    maximumBytes?: number;
}): Promise<Omit<ManagedProcessOutput, "processId">>;
