import type { ModelRequestMetrics } from "../agent/core/types.js";
import type { SessionGoalStore } from "./SessionGoalStore.js";
/** 请求开始时绑定的目标身份不会随清除、编辑或后续回合漂移。 */
export declare function recordSessionGoalRequestUsage(store: SessionGoalStore | undefined, metrics: ModelRequestMetrics): void;
