export declare function resolveWorkspacePath(workspaceRoot: string, requestedPath: string, ignore: string[]): string;
/** Delete/move operate on a named file entry, never on a final symbolic link's referent. */
export declare function resolveWorkspaceFileEntry(workspaceRoot: string, requestedPath: string, ignore: string[]): string;
/** Directory browsers may address the workspace root itself while retaining all other path protections. */
export declare function resolveWorkspaceDirectory(workspaceRoot: string, requestedPath: string, ignore: string[]): string;
export declare function toWorkspaceRelative(workspaceRoot: string, absolutePath: string): string;
