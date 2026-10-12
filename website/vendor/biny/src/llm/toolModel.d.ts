/** 后台文本任务共用的工具模型：显式选择优先，否则从已配置且可用的模型中自动选择。 */
import type { AgentModel } from "../agent/core/types.js";
import type { AgentConfig } from "../config/schema.js";
import { type ProviderCredentialPersistence } from "./ProviderRuntime.js";
export type MemoryModelField = "memoryModel" | "rewriteModel" | "extractModel";
export interface ToolModelCandidate {
    model: AgentModel;
    failureDomain: string;
}
export declare function resolveToolModelCandidates(config: AgentConfig, credentials?: ProviderCredentialPersistence): readonly ToolModelCandidate[];
/** 记忆可覆盖全局辅助模型；清空覆盖后回到全局选择，不随聊天模型切换。 */
export declare function resolveMemoryModelAlias(config: AgentConfig, field?: MemoryModelField): string | undefined;
export declare function resolveToolModelAlias(config: AgentConfig): string | undefined;
export declare function resolveToolModel(config: AgentConfig, credentials?: ProviderCredentialPersistence): AgentModel | undefined;
