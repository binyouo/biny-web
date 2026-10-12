import type { DiagnosticsConfig } from "../config/schema.js";
export interface DiagnosticsOutcome {
    command: string;
    exitCode: number;
    /** 已按 maxOutputBytes 截断的合并输出。 */
    output: string;
    truncated: boolean;
    timedOut: boolean;
}
export declare class DiagnosticsRunner {
    private readonly workspaceRoot;
    private readonly config;
    private readonly running;
    constructor(workspaceRoot: string, config: DiagnosticsConfig);
    /** 该路径对应的检查命令；没有配置、没装好或扩展名不匹配时返回 undefined。 */
    resolveCommand(filePath: string): {
        command: string;
        timeoutMs: number;
    } | undefined;
    run(filePath: string, signal?: AbortSignal): Promise<DiagnosticsOutcome | undefined>;
    private singleFlight;
    private execute;
    /**
     * 只认项目本地已安装的 TypeScript。用 `node_modules/.bin/tsc` 而不是 `npx tsc`：后者在
     * 没装的时候会去下载，那不是一个自动触发的行为该做的事。
     */
    private autoDetected;
}
/** 挂在工具结果上的诊断信息；无错误时也回报，让模型确认改动是干净的。 */
export declare function formatDiagnostics(outcome: DiagnosticsOutcome): Record<string, unknown>;
