import { type RedactionSettings } from "./settings.js";
import { type PlaceholderNoteContext } from "./placeholderNote.js";
export interface PrivacyFetchContext extends PlaceholderNoteContext {
    settings: RedactionSettings;
    provider: string;
    model: string;
}
/** 未能处理的请求直接报错，调用下层 fetch 前完成全部脱敏。 */
export declare function createPrivacyFetch(baseFetch: typeof globalThis.fetch, context: PrivacyFetchContext): typeof globalThis.fetch;
