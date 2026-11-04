import type { MaskJsonSegment } from "./json.js";
export interface MaskRecordSummary {
    id: string;
    time: string;
    provider: string;
    model: string;
    sessionId?: string;
    operation: string;
    count: number;
    uniqueValues: number;
    requestBytes?: number;
    kinds: Record<string, number>;
}
export interface MaskRecord extends MaskRecordSummary {
    preview: MaskJsonSegment[];
    truncated: boolean;
}
export interface MaskingOverview {
    records: MaskRecordSummary[];
    summary: {
        total: number;
        requests: number;
        byKind: Record<string, number>;
        byProvider: Record<string, number>;
    };
}
export declare function recordMask(input: {
    provider: string;
    model: string;
    sessionId?: string;
    operation?: string;
    segments: readonly MaskJsonSegment[];
    preview?: readonly MaskJsonSegment[];
    requestBytes?: number;
}): MaskRecord | undefined;
export declare function maskingOverview(sessionIds?: readonly string[]): MaskingOverview;
export declare function maskingDetail(id: string, sessionIds?: readonly string[]): MaskRecord | undefined;
export declare function clearMaskRecords(sessionIds?: readonly string[]): void;
export declare function resetMaskRecordsForTest(): void;
