/**
 * 工具 JSON Schema 模块。
 *
 * 这里维护给模型看的 function parameters 结构，并提供 agent loop 执行前的最小校验。
 * 当前只实现项目内工具需要的 JSON Schema 子集，避免额外引入校验依赖。
 */
export type JsonSchema = JsonObjectSchema | JsonStringSchema | JsonNumberSchema | JsonBooleanSchema | JsonArraySchema | JsonAnyOfSchema;
/**
 * 「任一分支通过即可」。用于值类型由控件决定的参数——
 * 例如滑杆收数字、输入框收字符串，工具层无法提前判定是哪种。
 */
export interface JsonAnyOfSchema {
    anyOf: JsonSchema[];
    description?: string;
}
export interface JsonObjectSchema {
    type: "object";
    properties?: Record<string, JsonSchema>;
    required?: string[];
    additionalProperties?: boolean;
    description?: string;
}
export interface JsonStringSchema {
    type: "string";
    description?: string;
    minLength?: number;
    maxLength?: number;
    enum?: string[];
}
export interface JsonNumberSchema {
    type: "number" | "integer";
    description?: string;
    minimum?: number;
    maximum?: number;
}
export interface JsonBooleanSchema {
    type: "boolean";
    description?: string;
}
export interface JsonArraySchema {
    type: "array";
    description?: string;
    items?: JsonSchema;
    minItems?: number;
    maxItems?: number;
}
export interface JsonSchemaValidationResult {
    ok: boolean;
    errors: string[];
}
/**
 * Provider 只应看到结构稳定的工具 Schema。所有 object 节点都显式携带 string[] `required`；
 * 缺失时补空数组，畸形值在本地带工具名和节点路径失败，不能静默改写。
 */
export declare function normalizeToolParameters(toolName: string, parameters: JsonSchema): JsonObjectSchema;
/**
 * 自定义 OpenAI-compatible 网关对空 `required` 的实现并不一致。Schema 先按统一规则
 * 完成严格校验，再在该 wire 边界省略语义等价的空数组；非法值仍会在本地直接失败。
 */
export declare function openAiCompatibleToolParameters(toolName: string, parameters: JsonSchema): JsonObjectSchema;
export declare function validateJsonSchema(schema: JsonSchema, value: unknown, path?: string): JsonSchemaValidationResult;
