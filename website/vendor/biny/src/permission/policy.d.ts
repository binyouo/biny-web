/**
 * 权限风险识别模块。
 *
 * 这里只负责把工具调用归类为 actionType/riskLevel，并给出人可读 reason。是否允许执行由
 * PermissionManager 统一决定。
 */
import type { PermissionRequestContext } from "./PermissionManager.js";
import type { ToolRisk } from "../tools/types.js";
import { type PreparedFileChange } from "../tools/file/fileChange.js";
export type ToolName = "Read" | "read_tool_result" | "Write" | "Edit" | "Glob" | "Grep" | "Bash" | "BashOutput" | "KillShell" | "WebSearch" | "WebFetch" | "TodoWrite";
export interface AnalyzePermissionInput {
    toolName: string;
    args: unknown;
    sessionId: string;
    projectRoot: string;
    toolRisk?: ToolRisk;
    fileChange?: PreparedFileChange;
}
export declare function analyzePermissionRequest(input: AnalyzePermissionInput): PermissionRequestContext;
export declare function commandSafetyWarnings(command: string): string[];
export declare function permissionApprovalFingerprint(approvalRule: string, args: unknown): string;
