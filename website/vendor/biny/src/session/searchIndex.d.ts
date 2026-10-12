export interface SessionTranscriptHit {
    sessionId: string;
    messageId?: string;
    role: "user" | "assistant";
    time?: string;
    excerpt: string;
}
export interface SessionSearchIndexStatus {
    indexedSessions: number;
    indexedMessages: number;
}
export declare const sessionSearchRefreshMaxAgeMs = 1000;
export interface SessionSearchRefreshOptions {
    /** 跳过此窗口内已成功完成的全目录刷新；省略时始终检查文件系统。 */
    maxAgeMs?: number;
    signal?: AbortSignal;
}
export declare class SessionSearchIndex {
    private readonly agentDir;
    private database;
    private refreshFlight;
    private lastFullRefreshAt;
    constructor(agentDir?: string | (() => string));
    close(): void;
    status(): SessionSearchIndexStatus;
    /** 按需补齐旧会话；并发调用共享一次扫描，调用方可声明可接受的新鲜窗口。 */
    refreshAll(options?: SessionSearchRefreshOptions): Promise<void>;
    private joinRefresh;
    private scanAll;
    /** 按原文子串检索，不把正则元字符或中文单字交给 FTS 分词器。 */
    grep(query: string, limit?: number): SessionTranscriptHit[];
    /**
     * 增量索引一个会话 JSONL：只解析上次索引偏移之后的完整行。半行（正在写入）会留到
     * 下次再处理；文件被截断或轮转时回退为重建该会话的索引。
     */
    indexSessionFile(sessionId: string, filePath: string, signal?: AbortSignal): Promise<number>;
    /** 全文检索会话原文；query 为空或索引为空时返回空数组。 */
    search(query: string, options?: {
        limit?: number;
        sessionIds?: readonly string[];
        signal?: AbortSignal;
    }): SessionTranscriptHit[];
    /** 删除一个会话的全部索引行；会话清理时调用。 */
    forgetSession(sessionId: string): Promise<void>;
    private open;
}
