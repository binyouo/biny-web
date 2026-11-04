import type { AgentMessage, ModelRequestContext, ModelRequestObserver } from "./core/types.js";
import type { AgentConfig } from "../config/schema.js";
import type { SkillDefinition } from "../extensions/skills.js";
import type { ToolModelCandidate } from "../llm/toolModel.js";
import { type ToolModelSelectionState } from "../llm/toolModelRequest.js";
import { type AgentCapabilitySelection } from "./capabilitySelection.js";
import type { Tool } from "../tools/types.js";
export interface CapabilityPreselectionInput {
    input: string;
    history: readonly AgentMessage[];
    config: AgentConfig;
    selection?: AgentCapabilitySelection;
    previousTools: readonly string[];
    previousSkills?: readonly string[];
    signal?: AbortSignal;
    requestContext?: ModelRequestContext;
    onRequestMetrics?: ModelRequestObserver;
}
export declare const stableCodingToolNames: Set<string>;
export declare function preselectCapabilities(options: CapabilityPreselectionInput & {
    models?: readonly ToolModelCandidate[];
    selectionState?: ToolModelSelectionState;
    tools: readonly (Pick<Tool, "name" | "description" | "source" | "capability"> & Partial<Pick<Tool, "parameters" | "exposure">>)[];
    skills: readonly (Pick<SkillDefinition, "id" | "name" | "description" | "allowedTools"> & {
        alwaysInject?: boolean;
        ref?: SkillDefinition["ref"];
    })[];
}): Promise<AgentCapabilitySelection>;
