import type { AgentMessage, ModelRequestContext, ModelRequestObserver } from "./core/types.js";
import type { AgentConfig } from "../config/schema.js";
import type { SkillDefinition } from "../extensions/skills.js";
import type { ToolModelCandidate } from "../llm/toolModel.js";
import { type ToolModelSelectionState } from "../llm/toolModelRequest.js";
import type { AgentCapabilitySelection } from "./capabilitySelection.js";
import { type AutomaticToolBudget, type PreselectionTool } from "./automaticToolBudget.js";
export interface CapabilityPreselectionInput {
    input: string;
    history: readonly AgentMessage[];
    config: AgentConfig;
    selection?: AgentCapabilitySelection;
    previousTools: readonly string[];
    automaticToolBudget?: Partial<AutomaticToolBudget>;
    signal?: AbortSignal;
    requestContext?: ModelRequestContext;
    onRequestMetrics?: ModelRequestObserver;
}
export declare const stableCodingToolNames: Set<string>;
export declare function preselectCapabilities(options: CapabilityPreselectionInput & {
    models?: readonly ToolModelCandidate[];
    selectionState?: ToolModelSelectionState;
    tools: readonly PreselectionTool[];
    skills: readonly Pick<SkillDefinition, "id" | "name" | "description">[];
}): Promise<AgentCapabilitySelection>;
