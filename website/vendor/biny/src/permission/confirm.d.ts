import type { PermissionPrompt, PermissionResult } from "./PermissionManager.js";
export interface ConfirmOptions {
    requireFullYes?: boolean;
}
export declare function confirmAction(title: string, details: string, options?: ConfirmOptions): Promise<boolean>;
export declare function confirmPermissionRequest(request: PermissionPrompt, signal?: AbortSignal): Promise<PermissionResult>;
