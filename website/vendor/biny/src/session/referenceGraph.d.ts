import { type LocalReferenceResult, type LocalReferenceService } from "./localReferences.js";
export interface LocalReferenceLink {
    sourceUri: string;
    targetUri: string;
    kind: "explicit" | "automatic";
}
export declare class LocalReferenceGraph {
    private readonly root;
    private readonly service;
    private database?;
    constructor(root: string, service: LocalReferenceService);
    close(): void;
    private open;
    /** 自动关系每次从当前活动消息重建，保证编辑、删除和版本切换后没有旧反链。 */
    private refreshAutomatic;
    link(sourceUri: string, targetUri: string, projectId: string): Promise<boolean>;
    unlink(sourceUri: string, targetUri: string, projectId: string): Promise<boolean>;
    private links;
    backlinks(uri: string, projectId: string, limit?: number): Promise<LocalReferenceLink[]>;
    outlinks(uri: string, projectId: string, limit?: number): Promise<LocalReferenceLink[]>;
    related(uri: string, projectId: string, limit?: number): Promise<string[]>;
    graph(uri: string, projectId: string, limit?: number): Promise<{
        nodes: string[];
        links: LocalReferenceLink[];
    }>;
    captureSnippet(sourceUri: string, start: number, end: number, projectId: string): Promise<LocalReferenceResult>;
    captureQuote(sourceUri: string, quote: string, projectId: string): Promise<LocalReferenceResult>;
    /** Markdown 视图选区是展示文本快照；来源消息仍需在当前项目和活动路径中可解析。 */
    captureSelectionQuote(sourceUri: string, quote: string, projectId: string): Promise<LocalReferenceResult>;
    createScratch(content: string, projectId: string, now?: Date, ttlMs?: number): Promise<LocalReferenceResult>;
    promoteScratch(uri: string, projectId: string): Promise<boolean>;
    resolve(uri: string, projectId: string, now?: Date): Promise<LocalReferenceResult>;
    pin(uri: string, projectId: string): Promise<boolean>;
    unpin(uri: string, projectId: string): boolean;
    pins(projectId: string, limit?: number): Promise<LocalReferenceResult[]>;
    searchStored(query: string, projectId: string, kind: "snippet" | "scratch", limit?: number, now?: Date): Promise<LocalReferenceResult[]>;
}
