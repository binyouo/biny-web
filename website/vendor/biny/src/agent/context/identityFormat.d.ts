import type { IdentityDocument, IdentityDocumentKind } from "./identityTypes.js";
export declare const identityDocumentFileNames: Record<IdentityDocumentKind, string>;
export declare const maxIdentityDocumentChars: Record<IdentityDocumentKind, number>;
export declare const maxIdentityPromptChars = 32000;
export declare function normalizeIdentityContent(content: string, kind: IdentityDocumentKind): string;
export declare function identityContentHash(content: string): string;
/** 只用于阻止提案直接接受；不改变正文，也不把匹配内容写入状态。 */
export declare function detectIdentitySecretWarning(value: string): string | undefined;
export declare function identityDocument(kind: IdentityDocumentKind, content: string, revision: number, updatedAt: string): IdentityDocument;
export interface IdentityPromptInput {
    documents: Partial<Record<IdentityDocumentKind, IdentityDocument>>;
    includeUser: boolean;
    maxChars?: number;
}
/**
 * 按长期协作对象的资料区块注入 USER.md。
 * XML 转义是为了避免 Markdown 中的标签被误当成 runtime 控制结构。
 */
export declare function renderIdentityPrompt(input: IdentityPromptInput): string | undefined;
