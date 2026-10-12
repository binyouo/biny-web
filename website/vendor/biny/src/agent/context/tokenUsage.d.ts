/**
 * 实际模型输入的本地估算与分类。各模型的 tokenizer 和协议开销不同，UTF-8 估算
 * 只用于分类权重及未回报 usage 时的容量；provider 的完整 inputTokens 才是总量真值。
 * 只返回数字，不持久化提示词、工具参数、附件或凭据。
 */
import type { AgentMessage, ModelStreamContext } from "../core/types.js";
import type { ContextTokenBreakdown } from "../../session/metadata.js";
import type { ToolSource } from "../../tools/types.js";
export declare function estimateTokens(value: string): number;
export declare function messageTokenCost(message: AgentMessage): number;
export declare function estimateMessageTokens(messages: readonly AgentMessage[]): number;
export interface ContextTokenInput extends ModelStreamContext {
    toolSources: ReadonlyMap<string, ToolSource>;
    skillPrompt?: string;
}
export declare function estimateContextBreakdown(input: ContextTokenInput): ContextTokenBreakdown;
