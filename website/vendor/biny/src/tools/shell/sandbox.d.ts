export type SandboxMode = "off" | "workspace-write";
export interface SandboxOptions {
    mode: SandboxMode;
    allowNetwork: boolean;
    denyPaths?: readonly string[];
    allowDesktopControl?: boolean;
}
export interface SandboxedCommand {
    command: string;
    applied: boolean;
    /** 未生效的原因，用于如实告知而不是假装有沙箱。 */
    reason?: string;
}
export declare function buildSeatbeltProfile(workspaceRoot: string, options: SandboxOptions, environment: {
    home: string;
    temporaryDirectory: string;
}): string;
/**
 * 把命令包进沙箱。返回值里的 `applied` 表示这次是否真的有边界 —— 调用方据此如实告知用户，
 * 而不是让"沙箱模式"这个名字自己去暗示一个不存在的保护。
 */
export declare function sandboxCommand(command: string, workspaceRoot: string, options: SandboxOptions, environment: {
    platform: NodeJS.Platform;
    home: string;
    temporaryDirectory: string;
}): SandboxedCommand;
export declare function describeSandbox(options: SandboxOptions, platform: NodeJS.Platform): string;
