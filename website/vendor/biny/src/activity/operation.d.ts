/** 显式 Activity 操作的检查点：跨进程清空或收紧配置后，不再消费、外发或提交旧结果。 */
import type { ActivitySettings } from "./settings.js";
import type { ActivityStore } from "./store.js";
export interface ActivityOperation {
    signal: AbortSignal;
    checkpoint(): Promise<void>;
}
export declare function createActivityOperation(store: ActivityStore, settings: ActivitySettings, loadSettings: () => Promise<ActivitySettings>, parentSignal?: AbortSignal): ActivityOperation;
