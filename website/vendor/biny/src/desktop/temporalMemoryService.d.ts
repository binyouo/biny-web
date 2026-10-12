import { type TemporalClueHit, type TemporalQuery } from "../session/temporalMemory.js";
import type { AutomationRecord } from "../runtime/AutomationScheduler.js";
export interface DesktopTemporalClue extends TemporalClueHit {
    projectId?: string;
}
export interface ScheduledTemporalRow {
    id: string;
    automationId: string;
    projectId: string;
    name: string;
    dueAt: string;
    date: string;
    time: string;
    fired: boolean;
}
export interface DesktopTemporalPage {
    clues: DesktopTemporalClue[];
    scheduled: ScheduledTemporalRow[];
    scheduledWarnings?: Array<{
        projectId: string;
        projectName: string;
    }>;
    unread: number;
    hasMore: boolean;
    nextOffset: number | null;
    coverage: string;
}
export interface DesktopTemporalQuery extends TemporalQuery {
    timeZone?: string;
    includeScheduled?: boolean;
}
type ScheduledAutomation = Pick<AutomationRecord, "automationId" | "name" | "triggerType" | "schedule" | "status" | "fireCount">;
/** 单个项目不可读时保留其他项目结果；只返回项目身份，不把底层错误路径暴露给 UI。 */
export declare function readScheduledTemporalSources(query: Pick<DesktopTemporalQuery, "includeScheduled" | "offset">, projects: Array<{
    id: string;
    name: string;
}>, read: (projectId: string) => Promise<ScheduledAutomation[]>): Promise<{
    sources: Array<{
        projectId: string;
        automations: ScheduledAutomation[];
    }>;
    warnings: NonNullable<DesktopTemporalPage["scheduledWarnings"]>;
}>;
/** 一次性任务只从 Host 的自动化快照投影，删除与改期在下一次读取时自然消失。 */
export declare function scheduledTemporalRows(sources: Array<{
    projectId: string;
    automations: ScheduledAutomation[];
}>, range: Pick<TemporalQuery, "startDate" | "endDate">, timeZone: string, offset: number): ScheduledTemporalRow[];
export { parseTemporalSourceUri } from "../session/temporalSourceUri.js";
export declare class DesktopTemporalMemoryService {
    private readonly index;
    private readonly root;
    private readonly pendingQueries;
    private closed;
    constructor(root?: string);
    close(): Promise<void>;
    query(query: DesktopTemporalQuery, projects: Array<{
        id: string;
        path: string;
    }>, scheduledSources?: Array<{
        projectId: string;
        automations: ScheduledAutomation[];
    }>): Promise<DesktopTemporalPage>;
    private queryPage;
    ignore(id: string): boolean;
    markSeen(ids: string[], day: string, timeZone: string, now?: Date): number;
    markTodaySeen(day: string, timeZone: string, now?: Date): number;
}
