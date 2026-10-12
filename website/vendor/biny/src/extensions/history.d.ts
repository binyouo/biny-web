import { type SessionSearchIndex } from "../session/searchIndex.js";
import type { Tool } from "../tools/types.js";
export interface SearchHistoryDeps {
    getIndex: () => SessionSearchIndex | undefined;
    /** 检索前先增量刷新当前会话，保证本回合消息立即可搜。 */
    flushCurrentSession?: (signal?: AbortSignal) => Promise<void>;
}
export declare function createHistoryTools(deps: SearchHistoryDeps): Tool[];
