import { type SensitiveValueRedactionOptions } from "../utils/secrets.js";
export interface ArchivedToolResult {
    archivePath: string;
    resultBytes: number;
}
export interface ArchiveToolResultOptions {
    workspaceRoot: string;
    sessionId: string;
    toolCallId: string;
    sequence: number;
    tool: string;
    result: unknown;
    /** Reuse of an already-computed serialization; recomputed when omitted. */
    output?: string;
}
export interface ToolResultArchiveEnvelope {
    version: number;
    archivedAt: string;
    sessionId: string;
    toolCallId: string;
    sequence: number;
    tool: string;
    output: string;
}
/** Returns a redacted, UTF-8 representation suitable for budget accounting. */
export declare function serializeToolResult(result: unknown, options?: SensitiveValueRedactionOptions): string;
/**
 * Preserve an oversized result outside the conversation and session JSONL.
 * The filename is derived only from opaque runtime identifiers, never a
 * model-provided path or tool argument.
 */
export declare function archiveToolResult(options: ArchiveToolResultOptions): Promise<ArchivedToolResult>;
/**
 * Bounded head/tail excerpt. `maxCharacters` lets the caller shrink the excerpt
 * as the remaining turn budget runs out.
 */
export declare function toolResultPreview(value: string, maxCharacters?: number): string;
/**
 * Resolve a model-supplied archive reference. The accepted shape is fully
 * constrained, so a tool argument can never address anything outside the
 * archive directory.
 */
export declare function resolveToolResultArchivePath(workspaceRoot: string, archivePath: string): string;
export declare function readToolResultArchive(workspaceRoot: string, archivePath: string, signal?: AbortSignal): Promise<ToolResultArchiveEnvelope>;
/** Keeps the archive directory bounded; the oldest references expire first. */
export declare function pruneToolResultArchives(workspaceRoot: string, retain?: number, protectedArchiveName?: string): Promise<void>;
