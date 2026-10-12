import type { PermissionPrompt, PermissionRequestContext } from "../../permission/PermissionManager.js";
export interface ToolCallInput {
    id: string;
    name: string;
    args: unknown;
}
export interface ToolDisplayContext {
    workspaceRoot: string;
    ignore: string[];
    sessionId?: string;
}
export interface ToolDisplayRule {
    title: string;
    summarize(args: unknown, context: ToolDisplayContext): Promise<ToolDisplaySummary>;
}
export interface ToolDisplaySummary {
    details: string;
    diff?: string;
    preview?: string;
    requireFullYes?: boolean;
    changeSummary?: string;
}
export declare function createToolPermissionRequest(call: ToolCallInput, context: ToolDisplayContext, permissionContext?: PermissionRequestContext): Promise<PermissionPrompt>;
export declare const toolDisplayRules: Record<string, ToolDisplayRule>;
