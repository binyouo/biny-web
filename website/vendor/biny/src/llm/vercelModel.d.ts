import type { LanguageModelV4 } from "@ai-sdk/provider";
import type { ModelApiBackend, ModelCompatibility, ProviderConfig } from "../config/schema.js";
export interface VercelModelInput {
    providerAlias: string;
    providerType: string;
    authMode: ProviderConfig["authMode"];
    api: ModelApiBackend;
    modelId: string;
    supportsReasoning: boolean;
    compatibility?: ModelCompatibility;
    baseUrl: string;
    apiKey: string | undefined;
    headers: Record<string, string>;
    fetcher: typeof globalThis.fetch;
}
export declare function createVercelLanguageModel(input: VercelModelInput): LanguageModelV4;
