import { z } from "zod";
import type { AgentTool, AgentToolResult } from "./core/types.js";
/** Names are a VM surface bound; host registration provenance is checked separately. */
export declare const codeModeNestedToolNames: Set<string>;
export declare const codeModePolicy: Readonly<{
    /** Cumulative synchronous VM execution, excluding host/approval waits. */
    timeoutMs: 30000;
    /** One nested coordinator pipeline, including its normal approval wait. */
    hostCallTimeoutMs: 300000;
    /** Finite whole-cell deadline, including host waits and idle promises. */
    maxCellDurationMs: 600000;
    memoryLimitBytes: number;
    maxStackSizeBytes: number;
    maxResultBytes: number;
    maxConsoleOutputBytes: number;
    maxSourceBytes: number;
    maxToolInputBytes: number;
    maxToolOutputBytes: number;
    /** Zero disables the aggregate bridge count in the pinned runtime. */
    maxBridgeRequests: 0;
    maxInFlightBridgeRequests: 8;
}>;
export type CodeModeLimits = Readonly<{
    [Limit in keyof typeof codeModePolicy]: number;
}>;
export declare const codeModeInput: {
    schema: z.ZodType<{
        description: string;
        code: string;
        language?: "javascript" | "typescript" | undefined;
        timeout_ms?: number | undefined;
    }, unknown, z.core.$ZodTypeInternals<{
        description: string;
        code: string;
        language?: "javascript" | "typescript" | undefined;
        timeout_ms?: number | undefined;
    }, unknown>>;
    parameters: import("../tools/schema.js").JsonObjectSchema;
};
export declare const codeModeDescription: string;
export interface CodeModeResult {
    ok: boolean;
    value?: unknown;
    stdout?: string;
    error?: string;
    outcomeUnknown?: boolean;
    childCalls: Array<{
        tool: string;
        toolCallId: string;
    }>;
}
export interface CodeModeSearchOptions {
    limit: number;
    namespace?: string;
    signal: AbortSignal;
    toolCallId: string;
    tools: readonly AgentTool[];
}
export type CodeModeSearch = (query: string, options: CodeModeSearchOptions) => Promise<readonly {
    name: string;
}[]>;
/**
 * Only the QuickJS worker receives source. Host tools remain behind the caller's
 * coordinator; the worker has no Node filesystem, network or process globals.
 * A cell is never replayed on failure because some child calls may have run.
 */
export declare function executeCodeModeCell(input: {
    code: string;
    language?: "javascript" | "typescript";
    timeoutMs?: number;
    archiveStdout?: (stdout: string) => Promise<string>;
    parentToolCallId: string;
    /** Existing callers supply reviewed built-ins here. */
    tools: readonly AgentTool[];
    /** The caller admits additional tools through its own permission and exposure policy. */
    admittedTools?: readonly AgentTool[];
    /** Refreshes the complete caller-approved inventory only when discovery needs it. */
    prepareTools?: (query?: string, signal?: AbortSignal) => Promise<readonly AgentTool[]>;
    /** Ordinary tools may be described and activated for the next model step, never invoked in this cell. */
    getModelTools?: () => readonly AgentTool[];
    /** Semantic matching reuses the caller's tool discovery implementation. */
    searchTools?: CodeModeSearch;
    signal?: AbortSignal;
    onToolResult?: (result: AgentToolResult) => void;
    isCurrent: (name: string, tool: AgentTool) => boolean;
    onUnsettled?: (operations: readonly {
        toolCallId: string;
        settlement: Promise<unknown>;
    }[]) => void;
    /** Tests may tighten, but never widen, the complete production policy. */
    executionPolicy?: CodeModeLimits;
}): Promise<CodeModeResult>;
export declare function codeModeCatalog(tools: readonly AgentTool[]): string;
