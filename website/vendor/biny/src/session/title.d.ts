/** 从会话开头生成标题；目录的乐观锁保证慢请求不会覆盖用户重命名或已删除的会话。 */
import type { AgentModel } from "../agent/core/types.js";
export declare function generateSessionTitle(workspaceRoot: string, sessionId: string, model: AgentModel, signal?: AbortSignal): Promise<string | undefined>;
