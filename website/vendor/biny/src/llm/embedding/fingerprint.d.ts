import type { EmbeddingModelRef } from "./types.js";
export declare function embeddingModelFingerprint(input: {
    ref: EmbeddingModelRef;
    wire: string;
    endpoint?: string;
    revision?: string;
    dtype?: string;
    dimensions?: number;
}): string;
/** 隐私确认只绑定 provider alias 与脱敏后的 endpoint，不随具体模型变化。 */
export declare function embeddingProviderEndpointHash(provider: string, endpoint: string): string;
