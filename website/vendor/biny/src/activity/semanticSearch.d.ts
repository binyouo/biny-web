import type { ActivityStore } from "./store.js";
import type { EmbeddingModelRuntime } from "../llm/embedding/types.js";
export interface ActivitySemanticSearchDeps {
    store: ActivityStore;
    /** 本地嵌入运行时；未安装/不可用时返回 undefined。 */
    getEmbeddingRuntime: () => Promise<EmbeddingModelRuntime | undefined>;
    query: string;
    limit?: number;
    signal?: AbortSignal;
    checkpoint?: () => Promise<void>;
}
export interface ActivityEmbeddingPrecomputeDeps {
    store: ActivityStore;
    getEmbeddingRuntime: () => Promise<EmbeddingModelRuntime | undefined>;
    signal?: AbortSignal;
    checkpoint?: () => Promise<void>;
    now?: () => Date;
}
export type ActivityEmbeddingPrecomputeResult = {
    ok: true;
    embedded: number;
    model: string;
    dimensions: number;
} | {
    ok: false;
    reason: "no_runtime" | "no_vectors";
    message: string;
};
export interface ActivitySemanticHit {
    createdAt: number;
    id: string;
    snapshotId: string;
    text: string;
    score: number;
    sessionId: string;
    startedAt: string;
    similarity: number;
    project?: string;
    summary: string;
    topics: string[];
    highlights: string[];
    source?: "ocr";
    excerpt?: string;
    occurredAt?: string;
}
export type ActivitySemanticSearchResult = {
    ok: true;
    hits: ActivitySemanticHit[];
    model: string;
    dimensions: number;
} | {
    ok: false;
    reason: "no_runtime" | "no_vectors";
    message: string;
};
/**
 * 后台补齐当前本地模型指纹下的 OCR 帧向量。
 * 只接受约定的本地 multilingual-e5-small；模型不可用时不改变数据库。
 */
export declare function precomputeActivityEmbeddings(deps: ActivityEmbeddingPrecomputeDeps): Promise<ActivityEmbeddingPrecomputeResult>;
export declare function searchActivitySemantic(deps: ActivitySemanticSearchDeps): Promise<ActivitySemanticSearchResult>;
