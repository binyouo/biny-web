/**
 * 工具钩子模块。
 *
 * 用户要表达"每次改完文件跑一下 X""提交前先跑测试"这类规则时，之前只能寄希望于在
 * `AGENTS.md` 里写一句然后指望模型记得。指望模型自觉不是机制 —— 钩子由 runtime 执行，
 * 不经过模型判断。
 *
 * 两个执行位点：
 * - `beforeTool`：工具执行前。非零退出会**阻止**这次调用，stderr 作为拒绝理由回给模型。
 *   这是用户能对 agent 行为下硬约束的地方。
 * - `afterTool`：工具执行后。输出附在工具结果上供模型参考，退出码不影响调用结果。
 *
 * 钩子命令来自用户的配置文件，按用户自己的权限执行，不经过权限确认 —— 它们代表的就是用户
 * 的意志。这一点在 README 里明确写出，配置钩子等同于信任那条命令。
 */
import type { HooksConfig } from "../config/schema.js";
import { type ShellCompletionEvidence } from "./shell/runCommand.js";
export interface HookContext {
    tool: string;
    /** 触发钩子的工作区相对路径；取不到时为空串。 */
    path: string;
}
export interface HookOutcome {
    command: string;
    exitCode: number;
    output: string;
}
export declare function readHookCompletionEvidence(outcome: HookOutcome): ShellCompletionEvidence;
export declare class HookRunner {
    private readonly workspaceRoot;
    private readonly config;
    constructor(workspaceRoot: string, config: HooksConfig);
    hasHooks(event: "beforeTool" | "afterTool"): boolean;
    /**
     * 返回第一个失败的钩子。调用方据此阻止（before）或附加说明（after）。
     * 钩子自身跑不起来（命令不存在等）按失败处理：配置了却没生效，比明确报错更危险。
     */
    run(event: "beforeTool" | "afterTool", context: HookContext, signal?: AbortSignal): Promise<HookOutcome[]>;
    private execute;
}
