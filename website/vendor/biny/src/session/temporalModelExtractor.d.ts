/** 日期线索与工作事实的辅助模型适配；模型只提出候选，原文校验由索引层完成。 */
import type { AgentModel } from "../agent/core/types.js";
import { type TemporalExtractor } from "./temporalMemory.js";
export declare function createTemporalModelExtractor(model: AgentModel): TemporalExtractor;
