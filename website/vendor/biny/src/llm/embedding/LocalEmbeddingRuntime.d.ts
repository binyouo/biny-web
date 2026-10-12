import type { ProgressInfo } from "@huggingface/transformers";
import type { EmbeddingModelDescriptor, EmbeddingModelRuntime, EmbeddingRequest, EmbeddingResult, LocalEmbeddingDownloadProgress, LocalEmbeddingModelId, LocalEmbeddingModelStatus } from "./types.js";
interface LocalModelDefinition {
    id: LocalEmbeddingModelId;
    repository: string;
    revision: string;
    dtype: "q8";
    displayName: string;
    description: string;
    dimensions: number;
    modelSizeBytes: number;
    recommendedThreshold: number;
}
interface FeatureExtractor {
    (texts: string[], options: {
        pooling: "mean";
        normalize: true;
    }): Promise<{
        data: ArrayLike<number>;
        dims: number[];
    }>;
    dispose(): Promise<void>;
}
interface TransformersModule {
    pipeline(task: "feature-extraction", model: string, options: {
        cache_dir: string;
        revision: string;
        dtype: "q8";
        local_files_only: boolean;
        progress_callback?: (progress: ProgressInfo) => void;
    }): Promise<FeatureExtractor>;
    ModelRegistry: {
        is_pipeline_cached(task: "feature-extraction", model: string, options: {
            cache_dir: string;
            revision: string;
            dtype: "q8";
        }): Promise<boolean>;
        clear_pipeline_cache(task: "feature-extraction", model: string, options: {
            cache_dir: string;
            revision: string;
            dtype: "q8";
        }): Promise<{
            filesDeleted: number;
        }>;
    };
}
export interface LocalEmbeddingManagerOptions {
    moduleLoader?: () => Promise<TransformersModule>;
}
export declare const localEmbeddingModels: readonly LocalModelDefinition[];
export declare class LocalEmbeddingManager {
    readonly cacheDirectory: string;
    private readonly extractors;
    private readonly readyModels;
    private readonly moduleLoader;
    constructor(cacheDirectory: string, options?: LocalEmbeddingManagerOptions);
    descriptors(): EmbeddingModelDescriptor[];
    isReady(): boolean;
    list(): Promise<LocalEmbeddingModelStatus[]>;
    isInstalled(modelId: LocalEmbeddingModelId): Promise<boolean>;
    download(modelId: LocalEmbeddingModelId, options?: {
        signal?: AbortSignal;
        onProgress?: (progress: LocalEmbeddingDownloadProgress) => void;
    }): Promise<LocalEmbeddingModelStatus>;
    remove(modelId: LocalEmbeddingModelId, options?: {
        activeModel?: LocalEmbeddingModelId;
    }): Promise<{
        filesDeleted: number;
        bytesFreed: number;
    }>;
    createRuntime(modelId: LocalEmbeddingModelId): Promise<EmbeddingModelRuntime>;
    close(): Promise<void>;
    embed(model: LocalModelDefinition, request: EmbeddingRequest): Promise<EmbeddingResult>;
    private embedWithExtractor;
    private extractor;
    private load;
}
export declare function listLocalEmbeddingModels(): EmbeddingModelDescriptor[];
export {};
