/** 模型可见的活动派生材料：保持来源标记并在策略撤回后排除派生内容。 */
import type { MemoryEntry } from "../agent/context/memoryTypes.js";
export declare const activityDerivedMarker = "<!-- biny-activity-derived -->";
export declare function isActivityMemory(entry: MemoryEntry): boolean;
export declare function dailyNoteForModel(content: string, allowActivity: boolean): string;
