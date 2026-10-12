export declare function resolveWorkspacePath(workspaceRoot: string, requestedPath: string, ignore: string[]): string;
/** Directory browsers may address the workspace root itself while retaining all other path protections. */
export declare function resolveWorkspaceDirectory(workspaceRoot: string, requestedPath: string, ignore: string[]): string;
export declare function toWorkspaceRelative(workspaceRoot: string, absolutePath: string): string;
