import type { AgentMessage, AgentToolResultMessage } from "./core/types.js";
export interface ToolResultProjectionArchiveRequest {
    message: AgentToolResultMessage;
    result: unknown;
    output: string;
    /** 消息位置是稳定且不依赖模型输入的归档 nonce；文件名仍由归档模块哈希。 */
    sequence: number;
}
export interface ToolResultProjectionArchiveReference {
    archivePath: string;
    resultBytes: number;
}
export interface ToolResultProjectionOptions {
    /** 单结果超过该字节数才进入正文投影；专用的轻量字段清理不受此阈值限制。 */
    thresholdBytes?: number;
    /** 最近结果保留正文；shell 结果始终遵守独立的模型输出字节上限。 */
    keepRecentResults?: number;
    archiveResult?: (request: ToolResultProjectionArchiveRequest) => Promise<ToolResultProjectionArchiveReference>;
    /** 单结果调用时用于生成稳定的归档信封；批量消息投影会直接读取消息上的这些值。 */
    toolCallId?: string;
    sequence?: number;
}
/**
 * 在工具结果预算之前生成单个结果的专用模型视图。
 *
 * 这里不做 working-set 语义替代，只处理工具自身可以确定的字段压缩；working-set 去重仍由
 * `projectToolResultsForModel` 在完整消息上下文上完成。
 */
export declare function projectSingleToolResultForModel(toolName: string, args: unknown, value: unknown, options?: ToolResultProjectionOptions): Promise<unknown>;
/**
 * 为下一次模型请求生成工具结果视图。
 *
 * 语义替代只在当前用户消息之后发生，并且不同 assistant step 之间才生效；同一 step 的
 * 并行工具结果不会相互覆盖。未知工具没有可证明的语义关系，只做完全重复去重。
 */
export declare function projectToolResultsForModel(messages: AgentMessage[], options?: ToolResultProjectionOptions): Promise<AgentMessage[]>;
