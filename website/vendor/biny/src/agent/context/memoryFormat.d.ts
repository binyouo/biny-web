/**
 * SQLite 记忆的有界校验、规范化和确定性检索。
 *
 * 事实序列化由 memoryStorage 交给 SQLite；向量索引属于可重建派生数据，不进入本模块。
 */
import type { MemoryDurability, MemoryEntry, MemoryEntryInput, MemoryOriginAnchor, MemorySearchScope } from "./memoryTypes.js";
export declare const maxMemoryContentChars = 2000;
export interface StoredEntryFields {
    id: string;
    originalId?: string;
    revision: number;
    createdAt: string;
    updatedAt: string;
    durability?: MemoryDurability;
    expiresAt?: string;
    archivedAt?: string;
    archivedReason?: MemoryEntry["archivedReason"];
    mergedInto?: string;
    archivedBy?: string;
}
export declare function sanitizeMemoryEntryInput(input: MemoryEntryInput): MemoryEntryInput;
/** 写入 SQLite 前再次做边界校验；模型输出也不能绕过格式和长度约束。 */
export declare function createStoredMemoryEntry(input: MemoryEntryInput, fields: StoredEntryFields): MemoryEntry;
/** 批量读取只复用本批已验证的来源时区；调用方不能预填校验结果。 */
export declare function createStoredMemoryEntryReader(): typeof createStoredMemoryEntry;
export declare function normalizeMemoryOriginAnchors(value: MemoryOriginAnchor[] | undefined): MemoryOriginAnchor[] | undefined;
/** 向量 top-K 之后的事实范围过滤。 */
export declare function entryMatchesMemorySearchScope(entry: MemoryEntry, scope: MemorySearchScope): boolean;
export declare function normalizeImportance(value: number | undefined): number;
export declare function memoryEntryExactKey(entry: Pick<MemoryEntry, "content" | "userId"> | Pick<MemoryEntryInput, "content" | "userId">): string;
/** Explicit expiry wins; the age-based TTL applies only to never-recalled temporary facts. */
export declare function isExpiredTemporaryMemory(entry: MemoryEntry, now: Date, ttlDays: number): boolean;
/** 记忆默认只保留 64 个词；有界的全文索引可显式提供更大的词数预算。 */
export declare function tokenizeMemoryText(value: string, maxTokens?: number): string[];
export declare function normalizeMemoryContent(value: string): string;
