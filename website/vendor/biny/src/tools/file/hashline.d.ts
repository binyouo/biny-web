export type HashlineEdit = {
    op: "replace";
    pos: string;
    end?: string;
    lines: string[];
} | {
    op: "append";
    pos?: string;
    lines: string[];
} | {
    op: "prepend";
    pos?: string;
    lines: string[];
};
export interface AppliedHashlineEdits {
    content: string;
    firstChangedLine: number;
}
export declare function formatHashlineContent(content: string): string;
export declare function formatHashlineLines(lines: readonly string[], startLine: number): string;
export declare function formatHashlineLine(line: string, lineNumber: number): string;
export declare function hashlineAnchor(line: string, lineNumber: number): string;
export declare function applyHashlineEdits(content: string, edits: readonly HashlineEdit[]): AppliedHashlineEdits;
