export interface ProjectContext {
    cwd: string;
    packageManager: string;
    packageJson?: PackageJsonSummary;
    tsconfig?: TsconfigSummary;
    readme?: string;
    srcTree: string[];
    gitStatus: string;
}
export interface PackageJsonSummary {
    name?: string;
    version?: string;
    type?: string;
    scripts: string[];
    dependencies: string[];
    devDependencies: string[];
}
export interface TsconfigSummary {
    compilerOptions: Record<string, unknown>;
    include?: unknown;
    exclude?: unknown;
}
export declare function collectProjectContext(workspaceRoot: string, ignore: string[], signal?: AbortSignal): Promise<ProjectContext>;
export declare function formatProjectContext(context: ProjectContext): string;
