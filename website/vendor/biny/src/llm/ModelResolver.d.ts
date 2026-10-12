/**
 * 模型引用解析：支持配置 alias，也支持 `provider/model-id` 形式的实时目录引用。
 */
import type { ModelRegistry, RegisteredModel } from "./ModelRegistry.js";
export declare class ModelResolver {
    private readonly registry;
    constructor(registry: ModelRegistry);
    resolve(reference: string, options?: {
        requireAvailable?: boolean;
    }): RegisteredModel;
}
