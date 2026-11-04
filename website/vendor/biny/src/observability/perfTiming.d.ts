export declare function perfTimingEnabled(): boolean;
/** 阶段起点。统一走 performance.now()，避免 Date 精度在短阶段上失真。 */
export declare function perfNow(): number;
export declare function recordPerfPhase(phase: string, startedAtMs: number, detail?: Record<string, string | number | boolean | undefined>, workspaceRoot?: string): void;
