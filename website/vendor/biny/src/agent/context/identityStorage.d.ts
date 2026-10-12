import { type IdentityDocument, type IdentityDocumentKind } from "./identityTypes.js";
interface IdentityStorageOptions {
    configDir?: string;
    now?: () => Date;
}
export interface IdentityOverview {
    revision: number;
    documents: Partial<Record<IdentityDocumentKind, IdentityDocument>>;
}
export declare class IdentityRevisionConflictError extends Error {
    readonly expectedRevision: number;
    readonly actualRevision: number;
    readonly name = "IdentityRevisionConflictError";
    constructor(expectedRevision: number, actualRevision: number);
}
export declare class IdentityStorage {
    private readonly root;
    private readonly now;
    constructor(options?: IdentityStorageOptions);
    get directory(): string;
    initialize(): Promise<void>;
    overview(): Promise<IdentityOverview>;
    promptText(includeUser?: boolean): Promise<string | undefined>;
    /** 直接写入文档正文；expectedRevision 是乐观锁，不匹配时抛冲突让调用方重读。 */
    saveDocument(document: IdentityDocumentKind, content: string, expectedRevision: number, _reason?: string): Promise<IdentityOverview>;
    appendUserFact(fact: string, section?: string): Promise<IdentityOverview>;
    private overviewFromState;
    private readDocument;
    private writeDocument;
    private writeHistory;
    private readState;
    private writeState;
    private writeFile;
    private hasRoot;
    private ensureRoot;
    private withLock;
}
export {};
