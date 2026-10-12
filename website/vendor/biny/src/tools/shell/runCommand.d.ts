import type { SandboxConfig } from "../../config/schema.js";
import type { ManagedProcessReadinessProbe, ManagedProcessService, ManagedProcessSnapshot } from "../../runtime/ManagedProcessService.js";
import type { Tool, ToolContext, ToolUpdate } from "../types.js";
export interface RunCommandArgs {
    command: string;
    description?: string;
    cwd?: string;
    timeoutMs?: number;
    background?: boolean;
    url?: string;
    readiness?: ManagedProcessReadinessProbe;
}
export type RunCommandToolResult = (RunCommandResult & {
    background: false;
}) | {
    background: true;
    sandbox: string;
    process: ManagedProcessSnapshot;
};
export interface RunCommandResult {
    status: "completed" | "failed" | "timed_out";
    /** 这次执行实际生效的沙箱边界；未生效时说明原因。 */
    sandbox?: string;
    stdout: string;
    stderr: string;
    /** stdout 的原始输入字节数；stdout 可能只保留了末尾。 */
    stdoutBytes: number;
    stdoutRetainedBytes: number;
    /** Discarded decoded-text UTF-8 bytes, not raw input bytes; absent in older results. */
    stdoutCaptureOmittedBytes?: number;
    stdoutTruncated: boolean;
    stdoutTruncationDirection?: "tail";
    /** stderr 的原始输入字节数，加上附加诊断的 UTF-8 字节数；stderr 可能只保留了末尾。 */
    stderrBytes: number;
    stderrRetainedBytes: number;
    /** Discarded decoded-text UTF-8 bytes, including diagnostics; absent in older results. */
    stderrCaptureOmittedBytes?: number;
    stderrTruncated: boolean;
    stderrTruncationDirection?: "tail";
    exitCode: number;
    error?: string;
}
export interface RunShellCommandOptions {
    signal?: AbortSignal;
    /** Internal observation only; this evidence never changes the public result. */
    onCompletionEvidence?: (evidence: ShellCompletionEvidence) => void;
    /** 追加到子进程环境的变量；不提供时继承当前进程环境。 */
    env?: Record<string, string>;
    onUpdate?: (update: ToolUpdate) => void;
    timeoutMs?: number;
    terminationGraceMs?: number;
    killSettleMs?: number;
    /** 工具调用尽量保留较大的完整输出，避免在回合归档之前丢掉前半段。 */
    captureFullOutput?: boolean;
    /** 完整输出捕获的硬上限，超过后仍保留尾部并明确标记。 */
    maxCapturedOutputBytes?: number;
}
/** A normal shell exit is evidence of completion, not proof that it had no effects. */
export type ShellCompletionEvidence = "normal_exit" | "unconfirmed";
export interface RunCommandToolOptions {
    /** 内部调用方可收紧单次命令超时；普通模型工具继续使用 runShellCommand 的默认值。 */
    timeoutMs?: number;
    controlledComputerUse?: boolean;
}
export declare function createRunCommandTool(context: ToolContext, sandbox?: SandboxConfig, options?: RunCommandToolOptions, managedProcesses?: ManagedProcessService): Tool<RunCommandArgs, RunCommandToolResult>;
export declare function runShellCommand(cwd: string, command: string, options?: RunShellCommandOptions): Promise<RunCommandResult>;
export declare function appendCapped(current: string, chunk: string): string;
