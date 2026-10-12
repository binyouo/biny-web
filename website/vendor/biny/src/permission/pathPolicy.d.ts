export declare function compileDeniedPaths(rules: readonly string[], workspaceRoot: string): {
    patterns: string[];
    ancestors: string[];
};
export declare function matchingDeniedPath(target: string, rules: readonly string[], workspaceRoot: string, changingPath: boolean): string | undefined;
export declare function canonicalPath(value: string): string;
