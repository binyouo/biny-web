import { type Tool, type ToolContext } from "./types.js";
export declare function createBrowserRelayTools(file?: string, workspace?: Pick<ToolContext, "workspaceRoot" | "ignore">): Tool[];
