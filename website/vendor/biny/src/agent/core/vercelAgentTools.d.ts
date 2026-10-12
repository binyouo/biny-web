/** 把 Biny 工具协议接到 Vercel AI SDK，并保留工具审计与进度事件。 */
import { type ToolSet } from "ai";
import { type VercelLoopState } from "./vercelAgentLoop.js";
export declare function createVercelTools(state: VercelLoopState): ToolSet;
