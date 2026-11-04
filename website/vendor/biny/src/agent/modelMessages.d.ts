/**
 * AgentMessage 读取工具。
 *
 * 模型消息内容既可能是字符串也可能是分片数组，各处都要判一遍很啰嗦，这里统一提供
 * 取文本、取思考内容、取工具名和深拷贝的读法。
 */
import type { AgentMessage, AgentUserMessage } from "./core/types.js";
export declare function withMessageSentAt(message: AgentUserMessage, source: {
    time?: string;
    metadata?: Record<string, unknown>;
}): AgentUserMessage;
/** Resolve send-time only from the current canonical user message, never an audit record. */
export declare function withReferencedMessageSentAt(message: AgentUserMessage, events: readonly {
    type: string;
    messageId?: string;
    auditOnly?: boolean;
    time?: string;
    metadata?: Record<string, unknown>;
}[], messageId: string | undefined): AgentUserMessage;
/** 时间锚点只进入模型投影，不能改写用户正文或沿用当前机器时区解释旧消息。 */
export declare function projectMessageSentAt(message: AgentMessage): AgentMessage;
/** 拼出消息的纯文本形态；工具调用/结果按 JSON 展开，图片等无文本分片忽略。 */
export declare function messageText(message: AgentMessage): string;
export declare function messageReasoning(message: AgentMessage): string;
export declare function messageToolName(message: AgentMessage): string;
/** 浅拷贝到分片一层：压缩、重试等流程会改写消息数组，不能影响调用方持有的原始消息。 */
export declare function cloneAgentMessages(messages: AgentMessage[]): AgentMessage[];
