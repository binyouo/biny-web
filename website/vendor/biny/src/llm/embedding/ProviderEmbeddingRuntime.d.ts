/**
 * 云端 Embedding 传输层。
 *
 * 只接受 ProviderDefinition 明确声明的 wire；鉴权、代理和重试继续沿用 provider 配置，
 * 不会把聊天模型名称当作 embedding 能力探针。
 */
import type { ProviderDefinition } from "../../ai/types.js";
import type { ProviderConfig } from "../../config/schema.js";
import type { EmbeddingModelDescriptor, EmbeddingModelRuntime, EmbeddingRequest, EmbeddingResult } from "./types.js";
export interface ProviderEmbeddingRuntimeOptions {
    fetcher?: typeof globalThis.fetch;
    env?: NodeJS.ProcessEnv;
}
export declare class ProviderEmbeddingRuntime implements EmbeddingModelRuntime {
    readonly providerAlias: string;
    private readonly config;
    private readonly definition;
    readonly modelId: string;
    readonly descriptor: EmbeddingModelDescriptor;
    readonly fingerprint: string;
    private readonly fetcher;
    private readonly endpoint;
    private readonly apiKey;
    constructor(providerAlias: string, config: ProviderConfig, definition: ProviderDefinition, modelId: string, options?: ProviderEmbeddingRuntimeOptions);
    embed(request: EmbeddingRequest): Promise<EmbeddingResult>;
    private embedOpenAi;
    private embedGoogle;
}
export declare function listProviderEmbeddingModels(providerAlias: string, config: ProviderConfig, definition: ProviderDefinition): EmbeddingModelDescriptor[];
