import type { AgentMessage } from "../agent/core/types.js";
import { type RetryCommit, type RetryWindow } from "./retryCommit.js";
import { type RetryOrigin } from "./retryOrigin.js";
import type { RuntimeHighWater } from "./runtimeEvent.js";
export interface InterruptedTurn {
    sessionId: string;
    /** 同一个用户任务及其所有 continuation 共用的身份。旧断点可能没有该字段。 */
    turnId?: string;
    /** 触发这个回合的用户输入，用于向用户描述要续跑的是什么。 */
    prompt: string;
    /** 最后一个完成的步结束时的完整 context。 */
    systemPrompt?: string;
    messages: AgentMessage[];
    completedSteps: number;
    /** 工具执行预算快照；仅用于在途回合恢复时继续计算工具额度。 */
    facts?: unknown;
    /** blocked / incomplete 终态的恢复边界；普通工具步断点没有该字段。 */
    terminal?: InterruptedTurnTerminal;
    /** 同一 Turn 续跑前已经发生的终态；新预算窗口不能覆盖原终态。 */
    previousTerminals?: InterruptedTurnTerminal[];
    /** 最后一个已写入 session JSONL 的 runtime event 高水位。 */
    runtimeHighWater?: RuntimeHighWater;
    /** Typed native retry intent; absent on old checkpoints. */
    retryOrigin?: RetryOrigin;
    retryWindow?: RetryWindow;
    retryCommit?: RetryCommit;
    updatedAt: string;
}
export interface InterruptedTurnTerminal {
    status: "blocked" | "incomplete";
    stopReason: string;
    summary: string;
    blockedReason?: string;
    requiredAction?: string;
}
export declare class TurnStore {
    private readonly persistenceRoot;
    private readonly sessionId;
    constructor(persistenceRoot: string, sessionId: string);
    save(prompt: string, systemPrompt: string | undefined, messages: readonly AgentMessage[], completedSteps: number, facts?: unknown, terminal?: InterruptedTurnTerminal, previousTerminals?: readonly InterruptedTurnTerminal[], runtimeHighWater?: RuntimeHighWater,
    /** The checkpoint owner can differ from the newest background event in the log. */
    turnId?: string | undefined, retryOrigin?: RetryOrigin, retryWindow?: RetryWindow, retryCommit?: RetryCommit): Promise<void>;
    load(): Promise<InterruptedTurn | undefined>;
    /** Opaque concurrency witness when an explicit new input abandons old intent. */
    readReplacementWitness(): Promise<Buffer | undefined>;
    clear(): Promise<void>;
    private filePath;
}
/** 删除会话对应的在途回合旁路状态，供统一 session 生命周期清理使用。 */
export declare function deleteInterruptedTurn(persistenceRoot: string, sessionId: string): Promise<void>;
