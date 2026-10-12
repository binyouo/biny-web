import { type DateReferenceRange } from "./dateReference.js";
import { type TemporalClueHit, type TemporalFactHit } from "./temporalMemory.js";
export interface DateConversationHit {
    projectId: string;
    sessionId: string;
    messageId: string;
    time: string;
    quote: string;
}
export interface DateScheduledHit {
    automationId: string;
    name: string;
    dueAt: string;
    status: string;
    fired: boolean;
}
export interface DateRunHit {
    id: string;
    occurredAt: string;
    status: string;
    kind: "task" | "automation";
}
export interface DateReferenceDetail {
    range: DateReferenceRange;
    conversations: DateConversationHit[];
    clues: TemporalClueHit[];
    facts: TemporalFactHit[];
    scheduled: DateScheduledHit[];
    runs: DateRunHit[];
    coverage: {
        conversations: string;
        clues: string;
        facts: string;
        scheduled: string;
        runs: string;
    };
    hasMore: {
        conversations: boolean;
        clues: boolean;
        facts: boolean;
        scheduled: boolean;
        runs: boolean;
    };
}
export declare class DateReferenceDetailService {
    private readonly root;
    private readonly index;
    constructor(root: string);
    close(): void;
    query(range: DateReferenceRange, projects: Array<{
        id: string;
        path: string;
    }>, runtime?: {
        automations?: unknown;
        pendingFires?: unknown;
        tasks?: unknown;
    }, signal?: AbortSignal): Promise<DateReferenceDetail>;
}
