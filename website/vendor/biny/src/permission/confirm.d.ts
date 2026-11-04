import type { PermissionPrompt, PermissionResult } from "./PermissionManager.js";
export declare function confirmPermissionRequest(request: PermissionPrompt, signal?: AbortSignal): Promise<PermissionResult>;
