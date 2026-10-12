/** 将近期 Activity 变成本轮聊天的短引用；语义匹配只读已有本地 OCR 向量。 */
import type { EmbeddingModelRuntime } from "../llm/embedding/types.js";
import type { ActivityStore } from "./store.js";
export interface ActivityChatContext {
    kind: "greeting" | "relevant";
    text: string;
}
export declare function activityContextForTurn(options: {
    store: ActivityStore;
    input: string;
    now: Date;
    enabled: boolean;
    getEmbeddingRuntime: () => Promise<EmbeddingModelRuntime | undefined>;
    signal?: AbortSignal;
}): Promise<ActivityChatContext | undefined>;
