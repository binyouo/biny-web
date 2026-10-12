interface DailyNoteWriteOptions {
    configDir?: string;
    checkpoint?: () => Promise<void>;
}
export declare function writeDailyMemoryNote(dateKey: string, content: string, options?: {
    configDir?: string;
}): Promise<string>;
export interface DailyMemoryNote {
    dateKey: string;
    content: string;
}
/** 读取今天和昨天的文件记忆；读取不创建目录，也不触碰 SQLite durable memory。 */
export declare function readDailyMemoryNotes(now?: Date, options?: {
    configDir?: string;
}): Promise<DailyMemoryNote[]>;
/** 读取任意一天的 Markdown；只读路径不会创建文件或目录。 */
export declare function readDailyMemoryNote(dateKey: string, options?: {
    configDir?: string;
}): Promise<string | undefined>;
/** 从一份日报中读取指定二级 section；用于汇总时隔离聊天与 Activity 来源。 */
export declare function readDailyMemorySection(content: string, sectionTitle: string): string | undefined;
/** 替换指定 section，供 Activity 这类可整体重建的派生来源使用。 */
export declare function upsertDailyMemorySection(dateKey: string, sectionTitle: string, content: string, options?: DailyNoteWriteOptions): Promise<string>;
/** 追加一个可幂等识别的聊天摘要条目；同一 turn 重试不会重复污染日报。 */
export declare function appendDailyMemoryEntry(dateKey: string, sectionTitle: string, entryKey: string, content: string, options?: {
    configDir?: string;
}): Promise<string>;
/** Activity 日报只更新「活动记录」section，不覆盖聊天摘要。 */
export declare function writeDailyActivityNote(dateKey: string, content: string, options?: DailyNoteWriteOptions): Promise<string>;
export {};
