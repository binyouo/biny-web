export interface DatedWorkFact {
    title: string;
    quote: string;
    state: "completed" | "in-progress" | "planned" | "unconfirmed";
    eventDate: string | null;
    dueDate: string | null;
    completedDate: string | null;
}
export interface TemporalSource {
    sessionId: string;
    messageId: string;
    text: string;
    sentAt?: string;
    timeZone?: string;
}
export interface TemporalExtractor {
    extractFacts?(source: TemporalSource, chunk: string, chunkOffset: number, signal?: AbortSignal): Promise<unknown>;
}
export interface TemporalQuery {
    startDate: string;
    endDate: string;
    sessionId?: string;
    sessionIds?: string[];
    sourcePaths?: string[];
    limit?: number;
    offset?: number;
}
export interface TemporalFactHit extends DatedWorkFact {
    id: string;
    sessionId: string;
    messageId: string;
    sourceUri: string;
    sourcePath?: string;
    sentAt?: string;
    timeZone?: string;
}
export declare class TemporalMemoryIndex {
    private readonly root;
    private readonly extractor;
    private database;
    private refreshFlight?;
    private readonly scannedFiles;
    private scanVersion?;
    constructor(root?: string, extractor?: TemporalExtractor);
    close(): void;
    refreshAll(signal?: AbortSignal): Promise<void>;
    private scanAll;
    /** 完整扫描单个文件，按原文 hash 只重算变化的消息；半行留待下一轮。 */
    indexSessionFile(sessionId: string, filePath: string, signal?: AbortSignal): Promise<string[]>;
    private migrateLegacySource;
    private removeSession;
    queryFacts(query: TemporalQuery): {
        facts: TemporalFactHit[];
        hasMore: boolean;
        nextOffset: number | null;
        coverage: string;
    };
    private evictUnavailableSources;
    private sourceStillCurrent;
    private open;
}
