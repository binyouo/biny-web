import { type MaskJsonResult } from "./json.js";
export type PrivacyProtocol = "chat" | "anthropic" | "responses" | "gemini";
export interface PlaceholderNoteContext {
    protocol?: PrivacyProtocol;
    providerType?: string;
}
/** 只在出站副本加入说明；以首次占位符为落点，保留更早历史的缓存前缀。 */
export declare function withPlaceholderNote(source: string, result: MaskJsonResult, values: ReadonlyMap<string, string>, context: PlaceholderNoteContext): {
    source: string;
    result: MaskJsonResult;
};
