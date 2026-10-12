/** 一次请求只选择一种编辑输入；实验开关高于已声明的原生协议。 */
import type { RegisteredTool } from "../registry.js";
import type { ToolContext } from "../types.js";
export type EditingMode = "replace" | "hashline" | "patch";
/** 先由调用方限制可用工具，再替换输入协议；patch 不能扩大原有 Write/Edit 权限集合。 */
export declare function routeEditingTools(entries: RegisteredTool[], context: ToolContext, mode: EditingMode): RegisteredTool[];
export declare function resolveEditingMode(hashline: boolean | undefined, protocol: "openai-structured" | undefined): EditingMode;
export declare function resolveNativePatchProtocol(api: string, baseUrl: string, model: string, declared: "openai-structured" | "off" | undefined): "openai-structured" | undefined;
