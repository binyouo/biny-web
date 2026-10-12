/** 进程级默认 workspace：Runtime Host / AgentSession 装配时设置一次，之后的打点可省略 root。 */
export declare function setPerfTimingRoot(workspaceRoot: string): void;
export declare function perfTimingEnabled(): boolean;
/** 阶段起点。统一走 performance.now()，避免 Date 精度在短阶段上失真。 */
export declare function perfNow(): number;
export declare function recordPerfPhase(phase: string, startedAtMs: number, detail?: Record<string, string | number | boolean | undefined>, workspaceRoot?: string): void;
