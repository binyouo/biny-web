import type { AgentMessage } from "../agent/core/types.js";
/** Retain at most two recent observation frames (2 MiB) in each actual model request. */
export declare function boundComputerFrames(messages: AgentMessage[]): AgentMessage[];
