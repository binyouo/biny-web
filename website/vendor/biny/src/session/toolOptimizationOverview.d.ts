import { type ToolOptimizationEntry, type ToolOptimizationSummary } from "./toolOptimization.js";
export interface ToolOptimizationOverview {
    ptc: ToolOptimizationSummary;
    rtk: ToolOptimizationSummary;
    toolCalls: number;
    average: number;
    durationCount: number;
    totalDurationMs: number;
    daily: Array<ToolOptimizationSummary & {
        date: string;
    }>;
    commands: Array<ToolOptimizationSummary & {
        command: string;
    }>;
    recent: ToolOptimizationEntry[];
}
export declare function buildToolOptimizationOverview(records: readonly ToolOptimizationEntry[], now?: Date): ToolOptimizationOverview;
