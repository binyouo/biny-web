export interface TemporalClue {
    expression: string;
    date: string | null;
    endDate: string | null;
    time: string | null;
    offset: number;
    quote: string;
}
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
    extractClues?(source: TemporalSource, signal?: AbortSignal): Promise<unknown>;
    extractFacts?(source: TemporalSource, chunk: string, chunkOffset: number, signal?: AbortSignal): Promise<unknown>;
}
export declare const temporalClueModelTextLimit = 6000;
export interface TemporalQuery {
    startDate: string;
    endDate: string;
    sessionId?: string;
    sessionIds?: string[];
    currentSessionId?: string;
    limit?: number;
    offset?: number;
    today?: string;
}
export interface TemporalClueHit extends TemporalClue {
    id: string;
    sessionId: string;
    messageId: string;
    sourceUri: string;
    sentAt?: string;
    timeZone?: string;
    seen: boolean;
}
export interface TemporalFactHit extends DatedWorkFact {
    id: string;
    sessionId: string;
    messageId: string;
    sourceUri: string;
    sentAt?: string;
    timeZone?: string;
}
/** 规则解析只以原始发送日期/时区锚定相对日期；无法证明的日期保留为空。 */
export declare function parseTemporalClues(text: string, sentAt?: string, timeZone?: string, root?: string): TemporalClue[];
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
    private removeSession;
    queryClues(query: TemporalQuery): {
        clues: TemporalClueHit[];
        unread: number;
        hasMore: boolean;
        nextOffset: number | null;
        coverage: string;
    };
    queryFacts(query: TemporalQuery): {
        facts: TemporalFactHit[];
        hasMore: boolean;
        nextOffset: number | null;
        coverage: string;
    };
    ignoreClue(id: string): boolean;
    markSeen(ids: string[], day: string, timeZone: string, now?: Date): number;
    markTodaySeen(day: string, timeZone: string, now?: Date): number;
    private evictUnavailableSources;
    private sourceStillCurrent;
    private open;
}
