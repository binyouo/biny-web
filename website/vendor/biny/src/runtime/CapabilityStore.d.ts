import { type ToolOutcomeUnknownReason } from "../tools/types.js";
import type { RuntimeEventAuthority } from "./RuntimeAuthority.js";
export type CapabilityOwnerType = "host" | "client";
export type CapabilityRegistrationStatus = "registered" | "replaced" | "admitted" | "rejected" | "released";
export type CapabilityInvocationStatus = "admitted" | "accepted" | "running" | "result" | "failed" | "cancelled" | "unknown";
export type CapabilityDispatchState = "not_dispatched" | "dispatched";
export declare class CapabilityIdempotencyConflictError extends Error {
    readonly operationId: string;
    readonly code = "idempotency_conflict";
    readonly retrySafe = false;
    constructor(operationId: string, detail?: string);
}
export declare class CapabilityOutcomeUnknownError extends Error {
    readonly operationId: string;
    readonly reason: ToolOutcomeUnknownReason;
    readonly code = "outcome_unknown";
    readonly retrySafe = false;
    constructor(operationId: string, reason: ToolOutcomeUnknownReason, detail?: string);
}
export declare class CapabilityInvocationCancelledError extends Error {
    readonly operationId: string;
    readonly reason: ToolOutcomeUnknownReason;
    readonly code = "operation_cancelled_before_dispatch";
    readonly retrySafe = false;
    constructor(operationId: string, reason: ToolOutcomeUnknownReason);
}
export declare class CapabilityInvocationAlreadySettledError extends Error {
    readonly operationId: string;
    readonly status: "failed" | "cancelled";
    readonly code = "operation_already_settled";
    readonly retrySafe = false;
    constructor(operationId: string, status: "failed" | "cancelled");
}
export interface CapabilityRegistrationInput {
    registrationId?: string;
    ownerType: CapabilityOwnerType;
    ownerId: string;
    capabilityName: string;
    schema: unknown;
    expiresAt?: string;
}
export interface CapabilityRegistration {
    registrationId: string;
    workspaceId: string;
    ownerType: CapabilityOwnerType;
    ownerId: string;
    capabilityName: string;
    revision: number;
    schema: unknown;
    status: CapabilityRegistrationStatus;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CapabilityInvocationInput {
    registrationId: string;
    offerId?: string;
    sessionId?: string;
    turnId?: string;
    toolCallId?: string;
    request: unknown;
}
export interface HostCapabilityExecutionInput {
    capabilityName: string;
    schema: unknown;
    sessionId?: string;
    runId?: string;
    turnId?: string;
    toolCallId?: string;
    offerId?: string;
    request: unknown;
    dispatchBoundary?: "immediate" | "reported";
    timeoutMs?: number;
}
export interface CapabilityInvocation {
    invocationId: string;
    registrationId: string;
    offerId?: string;
    sessionId?: string;
    turnId?: string;
    toolCallId?: string;
    status: CapabilityInvocationStatus;
    dispatchState: CapabilityDispatchState;
    request: unknown;
    result?: unknown;
    error?: string;
    outcomeUnknownReason?: ToolOutcomeUnknownReason;
    chunks: CapabilityResultChunk[];
    createdAt: string;
    updatedAt: string;
}
export interface CapabilityResultChunk {
    invocationId: string;
    chunkIndex: number;
    data: unknown;
    final: boolean;
    createdAt: string;
}
export declare class CapabilityStore {
    private readonly database;
    private readonly authority;
    private closed;
    private constructor();
    static open(persistenceRoot: string, authority: RuntimeEventAuthority): Promise<CapabilityStore>;
    register(input: CapabilityRegistrationInput): CapabilityRegistration;
    /** 确保 Host-owned MCP/Plugin 工具在第一次执行前已经有 durable registration。 */
    ensureHostCapability(capabilityName: string, schema: unknown): CapabilityRegistration;
    /**
     * Host-owned 工具仍在 Host 内执行，但它们的 invocation/result/failure 会与 client-owned
     * capability 使用完全相同的 authority envelope。超时或取消后 fail-closed 为 unknown，
     * 不把可能已经发生的副作用误报成普通失败。
     */
    executeHostCapability<TResult>(input: HostCapabilityExecutionInput, execute: (signal?: AbortSignal, onDispatched?: () => void) => Promise<TResult>, signal?: AbortSignal): Promise<TResult>;
    private executeHostCapabilityOnce;
    replace(registrationId: string, schema: unknown, expiresAt?: string): CapabilityRegistration;
    admit(registrationId: string): CapabilityRegistration;
    reject(registrationId: string, reason: string): CapabilityRegistration;
    release(registrationId: string, reason?: string): CapabilityRegistration;
    releaseOwner(ownerId: string, reason?: string): void;
    list(ownerId?: string): CapabilityRegistration[];
    get(registrationId: string): CapabilityRegistration | undefined;
    invoke(input: CapabilityInvocationInput, invocationId?: string): CapabilityInvocation;
    /** Owner startup calls this after acquiring the workspace lock and before accepting work. */
    recoverUnsettledInvocations(reason?: ToolOutcomeUnknownReason): number;
    accept(invocationId: string): CapabilityInvocation;
    start(invocationId: string): CapabilityInvocation;
    result(invocationId: string, result: unknown): CapabilityInvocation;
    chunk(invocationId: string, chunkIndex: number, data: unknown, final?: boolean): CapabilityInvocation;
    fail(invocationId: string, error: string): CapabilityInvocation;
    cancel(invocationId: string, reason?: string): CapabilityInvocation;
    unknown(invocationId: string, reason?: ToolOutcomeUnknownReason, detail?: string): CapabilityInvocation;
    private markUnknownForCaller;
    getInvocation(invocationId: string): CapabilityInvocation | undefined;
    findHostToolInvocation(input: {
        tool: string;
        sessionId: string;
        turnId: string;
        toolCallId: string;
        operationId: string;
        request: unknown;
    }): CapabilityInvocation | undefined;
    close(): void;
    private createOrGetInvocation;
    private findInvocationsByOffer;
    private assertSameOperationIdentity;
    private readExistingHostInvocation;
    private markDispatched;
    private updateRegistrationStatus;
    private updateInvocationStatus;
    private withEvent;
    private requireRegistration;
    private requireInvocation;
    private toInvocation;
    private toInvocationRecord;
    private assertOpen;
}
