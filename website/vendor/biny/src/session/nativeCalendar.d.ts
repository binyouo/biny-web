import { type DateReferenceRange } from "./dateReference.js";
export interface NativeCalendarEvent {
    title: string;
    startDate: string;
    endDate: string;
    calendar?: string;
    isAllDay: boolean;
    identifier?: string;
}
export interface NativeCalendarResult {
    events: NativeCalendarEvent[];
    hasMore: boolean;
    coverage: "host-eventkit-calendars";
}
type CalendarRun = (command: string, args: string[], options: {
    env: NodeJS.ProcessEnv;
    timeout: number;
    maxBuffer: number;
}) => Promise<{
    stdout: string;
    stderr: string;
}>;
export declare function readNativeCalendar(range: DateReferenceRange, options: {
    authorized: boolean;
    platform?: NodeJS.Platform;
    run?: CalendarRun;
}): Promise<NativeCalendarResult>;
export {};
