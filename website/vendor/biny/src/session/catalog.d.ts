import { type ChatPersonalizationOverride } from "../personalization/index.js";
import { type SessionSummary } from "./events.js";
declare const catalogVersion: 1;
export declare const SESSION_CATALOG_MISSING_REVISION: "missing";
export type SessionBranchPoint = {
    kind: "event";
    index: number;
} | {
    kind: "user_message";
    index: number;
    messageId?: string;
};
export type SessionIsolation = "shared" | "worktree";
export interface SessionCatalogRecord {
    version: typeof catalogVersion;
    sessionId: string;
    rootSessionId: string;
    parentSessionId?: string;
    branchPoint?: SessionBranchPoint;
    title?: string;
    pinned?: boolean;
    archived?: boolean;
    unread?: boolean;
    labels?: string[];
    personalization?: ChatPersonalizationOverride;
    isolation?: SessionIsolation;
    createdAt: string;
    updatedAt: string;
}
export interface SessionCatalogItem {
    id: string;
    fileName: string;
    summary: SessionSummary;
    rootSessionId: string;
    parentSessionId?: string;
    branchPoint?: SessionBranchPoint;
    title?: string;
    pinned?: boolean;
    archived?: boolean;
    unread?: boolean;
    labels?: string[];
    personalization?: ChatPersonalizationOverride;
    isolation?: SessionIsolation;
    metadataRevision?: string;
    hasChildren: boolean;
}
export interface RegisterSessionBranchOptions {
    sessionId: string;
    parentSessionId: string;
    branchPoint: SessionBranchPoint;
}
export interface SessionCatalogQuery {
    limit?: number;
    cursor?: string;
    parentSessionId?: string;
    includeArchived?: boolean;
}
export interface SessionCatalogPage {
    revision: string;
    items: SessionCatalogItem[];
    nextCursor?: string;
    revisionChanged?: boolean;
}
export interface SessionTreeNode {
    session: SessionCatalogItem;
    children: SessionTreeNode[];
}
export interface SessionCatalogMetadataPatch {
    title?: string;
    pinned?: boolean;
    archived?: boolean;
    unread?: boolean;
    labels?: string[];
    personalization?: ChatPersonalizationOverride;
    isolation?: SessionIsolation;
}
export declare class SessionCatalogConflictError extends Error {
    readonly sessionId: string;
    readonly expectedRevision: string;
    readonly actualRevision: string | undefined;
    constructor(sessionId: string, expectedRevision: string, actualRevision: string | undefined);
}
export declare function sessionCatalogDirectory(workspaceRoot: string): string;
/** 为 fork/clone 写入一条 lineage；父会话的 root 会沿树向上继承。 */
export declare function registerSessionBranch(workspaceRoot: string, options: RegisterSessionBranchOptions): Promise<SessionCatalogRecord>;
export declare function writeSessionCatalogRecord(workspaceRoot: string, record: SessionCatalogRecord, options?: {
    expectedRevision?: string;
}): Promise<SessionCatalogRecord>;
/** 读取、校验并更新一个会话的常用元数据；expectedRevision 用于挡住过期 Renderer 覆盖新值。 */
export declare function updateSessionCatalogMetadata(workspaceRoot: string, sessionId: string, patch: SessionCatalogMetadataPatch, expectedRevision?: string): Promise<SessionCatalogRecord>;
export declare function readSessionCatalogRecord(workspaceRoot: string, sessionId: string): Promise<SessionCatalogRecord | undefined>;
export declare function deleteSessionCatalogRecord(workspaceRoot: string, sessionId: string): Promise<void>;
/**
 * 把 JSONL 摘要和 catalog 控制面合并成 session 级 read model。
 * catalog 缺失或损坏时只丢 lineage，不影响历史列表和恢复。
 */
export declare function listSessionCatalog(workspaceRoot: string): Promise<SessionCatalogItem[]>;
export declare function getSessionCatalogItem(workspaceRoot: string, sessionId: string): Promise<SessionCatalogItem | undefined>;
export declare function readSessionTree(workspaceRoot: string): Promise<SessionTreeNode[]>;
/**
 * 分页使用 updatedAt + id 游标，避免 offset 在新消息追加后发生跳项。
 * revision 改变时返回空页并标记 revisionChanged，让调用方从第一页重新拉取。
 */
export declare function querySessionCatalog(workspaceRoot: string, options?: SessionCatalogQuery): Promise<SessionCatalogPage>;
/** 对已经加载的 catalog 做分页，供 workspace 首屏复用同一份 catalog 快照。 */
export declare function querySessionCatalogItems(all: readonly SessionCatalogItem[], options?: SessionCatalogQuery): SessionCatalogPage;
/** 从 session lineage 构建树；孤儿和异常环路会被提升到根，列表不会丢节点。 */
export declare function buildSessionTree(items: readonly SessionCatalogItem[]): SessionTreeNode[];
export declare function sessionCatalogRecordRevision(record: SessionCatalogRecord): string;
/** 同一工作区串行发布；刷新期间的新请求合并成下一轮，不能丢掉后到的写入。 */
export declare function refreshSessionIndex(workspaceRoot: string): Promise<void>;
export {};
