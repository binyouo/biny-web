import type { FileHandle } from "node:fs/promises";
import type { ManagedProcessOutput, ReadManagedProcessOutputOptions } from "./ManagedProcessService.js";
export interface ManagedProcessLogBinding {
    readonly path: string;
    readonly device: bigint;
    readonly inode: bigint;
}
/** Bind the descriptor used for creation, before it is handed to the child process. */
export declare function bindManagedProcessLog(logPath: string, handle: FileHandle): Promise<ManagedProcessLogBinding>;
export declare function readManagedProcessLog(binding: ManagedProcessLogBinding, options?: ReadManagedProcessOutputOptions, signal?: AbortSignal, context?: {
    final: boolean;
}): Promise<Omit<ManagedProcessOutput, "processId">>;
