export type ToolFileOperation = "read" | "write" | "readwrite" | "search";
export type ToolResourceAccess = {
    kind: "all";
} | {
    kind: "browser";
    contextId: string;
} | {
    kind: "file";
    operation: ToolFileOperation;
    path: string;
    recursive?: boolean;
};
export type ToolAccessList = readonly ToolResourceAccess[];
export declare const ToolAccesses: {
    none(): ToolAccessList;
    all(): ToolAccessList;
    browser(contextId: string): ToolAccessList;
    readFile(filePath: string): ToolAccessList;
    readTree(filePath: string): ToolAccessList;
    writeFile(filePath: string): ToolAccessList;
    writeTree(filePath: string): ToolAccessList;
    readWriteFile(filePath: string): ToolAccessList;
    readWriteTree(filePath: string): ToolAccessList;
    searchTree(filePath: string): ToolAccessList;
    conflict(left: ToolAccessList, right: ToolAccessList): boolean;
};
