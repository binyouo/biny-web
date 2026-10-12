/**
 * 权限命令模块。
 *
 * 这里实现 /permissions 的纯逻辑：查看状态、切换当前会话模式、重置 session
 * allowlist。TUI/CLI 只负责把返回文本展示出来。
 */
import type { PermissionManager, PermissionStatus } from "./PermissionManager.js";
export declare function runPermissionCommand(manager: PermissionManager, args: string[]): string;
export declare function formatPermissionModeChanged(mode: PermissionStatus["mode"]): string;
export declare function formatPermissionStatus(status: PermissionStatus): string;
