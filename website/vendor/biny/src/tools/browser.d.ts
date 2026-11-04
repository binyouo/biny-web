import { type Tool, type ToolContext } from "./types.js";
export interface BrowserAutomationEndpoint {
    projectId?: string;
    endpoint: string;
    token: string;
}
export interface BrowserDomSnapshot {
    url: string;
    title: string;
    text: string;
    interactive: Array<{
        tag: string;
        role?: string;
        name?: string;
        selector: string;
    }>;
}
export declare function createBrowserTools(endpoint: BrowserAutomationEndpoint, workspace?: Pick<ToolContext, "workspaceRoot" | "ignore">): Tool[];
export declare function requestBrowser(endpoint: BrowserAutomationEndpoint, method: string, args: Record<string, unknown>, signal?: AbortSignal): Promise<unknown>;
