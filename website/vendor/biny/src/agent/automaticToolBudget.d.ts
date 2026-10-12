/** Budgets bound newly selected schemas without evicting accumulated or required tools. */
import type { Tool } from "../tools/types.js";
export interface AutomaticToolBudget {
    maxTools: number;
    /** Serialized JSON characters, not a tokenizer-dependent token estimate. */
    maxSchemaCharacters: number;
}
/** Conservative starting policy; callers may tune it without changing explicit selection semantics. */
export declare const defaultAutomaticToolBudget: Readonly<AutomaticToolBudget>;
export type PreselectionTool = Pick<Tool, "name" | "description" | "source" | "capability"> & Partial<Pick<Tool, "parameters" | "exposure">>;
export declare function boundAutomaticTools(options: {
    tools: readonly PreselectionTool[];
    required: ReadonlySet<string>;
    current: readonly string[];
    previous: readonly string[];
    budget?: Partial<AutomaticToolBudget>;
}): string[];
