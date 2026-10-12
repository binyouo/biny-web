/**
 * Prompt 缓存标记。
 *
 * Agent 每轮请求的前缀（system prompt + 历史）几乎不变，按协议给稳定段打缓存标记能
 * 命中服务商的 prompt cache：输入按约 1/10 计费、首字延迟更低。两种协议形态不同：
 * - anthropic_messages：内容块级 `cache_control` 断言点（经 providerOptions.anthropic）；
 *   system 走 streamText 的 instructions 选项，SDK 禁止 messages 携带 system 消息，
 *   所以这里把 instructions 包装成带标记的 SystemModelMessage 数组。
 * - openai-compatible：消息级 `cache_control` 字段（经 providerOptions.openaiCompatible，
 *   SDK 会把它展开进请求 JSON 的消息对象）；对尾部两条消息打标，与 。
 * responses / google_generative_ai 是隐式缓存，不下发标记。
 */
import type { ModelMessage, SystemModelMessage } from "ai";
import type { CacheMarkerPlan } from "./types.js";
/** 按 api 后端决定缓存标记计划；隐式缓存的协议返回 undefined。 */
export declare function cacheMarkerPlanFor(api: string): CacheMarkerPlan | undefined;
/**
 * 组装 streamText 的 instructions：anthropic 协议把 system 包装成带断言点的
 * SystemModelMessage 数组，其余协议维持字符串。
 */
export declare function markInstructions(systemPrompt: string | undefined, plan: CacheMarkerPlan | undefined): string | SystemModelMessage[] | undefined;
/** 给请求尾部消息打缓存标记；返回浅拷贝，不改 canonical 消息。 */
export declare function applyCacheMarkers(messages: ModelMessage[], plan: CacheMarkerPlan | undefined): ModelMessage[];
