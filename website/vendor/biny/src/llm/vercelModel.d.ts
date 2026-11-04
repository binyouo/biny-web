import type { LanguageModelV4 } from "@ai-sdk/provider";
import type { ModelApiBackend, ModelCompatibility, ProviderConfig } from "../config/schema.js";
import { type PrivacyFetchContext } from "../privacy/privacyFetch.js";
export interface VercelModelInput {
    providerAlias: string;
    providerType: string;
    authMode: ProviderConfig["authMode"];
    api: ModelApiBackend;
    modelId: string;
    supportsReasoning: boolean;
    supportsVision?: boolean;
    compatibility?: ModelCompatibility;
    baseUrl: string;
    apiKey: string | undefined;
    headers: Record<string, string>;
    fetcher: typeof globalThis.fetch;
    /** 出站脱敏策略；设置里要求脱敏时，这个模型的推理请求会套上一层脱敏 fetch。 */
    privacy?: Omit<PrivacyFetchContext, "provider" | "model">;
}
export declare function createVercelLanguageModel(input: VercelModelInput): LanguageModelV4;
