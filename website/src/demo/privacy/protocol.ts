/** The display-only subset of Desktop's masking protocol. No runtime bridge is installed. */
export interface DesktopMaskSegment { kind: string; original: string; masked: string; start: number; end: number }
export interface DesktopMaskRecordSummary {
  id: string; time: string; provider: string; model: string; sessionId?: string; operation: string;
  count: number; uniqueValues: number; requestBytes?: number; kinds: Record<string, number>;
}
export interface DesktopMaskRecord extends DesktopMaskRecordSummary {
  preview: Array<{ path: string; original: string; masked: string; segments: DesktopMaskSegment[]; role?: string; truncated?: boolean }>;
  truncated: boolean;
}
export interface DesktopMaskingOverview {
  records: DesktopMaskRecordSummary[];
  summary: { total: number; requests: number; byKind: Record<string, number>; byProvider: Record<string, number> };
}
export interface DesktopApi {
  maskingOverview(projectId: string): Promise<DesktopMaskingOverview>;
  maskingDetail(projectId: string, id: string): Promise<DesktopMaskRecord | undefined>;
  maskingClear(projectId: string): Promise<void>;
  onAgentEvent(listener: (event: { projectId: string; event?: { type: string } }) => void): () => void;
}
