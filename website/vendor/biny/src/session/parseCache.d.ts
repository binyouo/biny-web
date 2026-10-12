/**
 * Session 解析缓存。
 *
 * 按真实路径及文件身份、大小、修改时间、状态变更时间缓存解析结果。
 * 指纹变化即失效；路径和文件描述符的安全校验仍由读取入口执行。
 * 列表摘要使用独立缓存，避免扫描历史淘汰活动会话的完整事件。
 *
 * 进程内单机缓存：桌面主进程、RuntimeHost 等各自进程各持一份，不跨进程共享。
 */
import type { SessionEvent } from "./recorder.js";
/** 命中判断用的文件指纹；append-only 下 (dev, ino, size, mtimeMs, ctimeMs) 不变即内容不变。 */
export interface SessionFileFingerprint {
    size: number;
    mtimeMs: number;
    ctimeMs?: number;
    dev?: number;
    ino?: number;
}
interface SessionParseCacheEntry {
    fingerprint: SessionFileFingerprint;
    events: SessionEvent[];
    source?: SessionParseSource;
    /** 以源字节数计的权重，用于按内存上限淘汰。 */
    weight: number;
}
/** Only complete, validated byte snapshots may establish an append prefix. */
export interface SessionParseSource {
    bytes: Buffer;
    newlineCount: number;
}
/** A stale entry is only a candidate: the reader must verify its entire prefix. */
export declare function previousSessionParse(filePath: string): Readonly<SessionParseCacheEntry> | undefined;
export declare function sessionFileFingerprint(stat: SessionFileFingerprint): SessionFileFingerprint;
export declare function lookupSessionEvents(filePath: string, fingerprint: SessionFileFingerprint): SessionEvent[] | undefined;
/**
 * 命中即返回缓存的事件数组；未命中调用 `load()` 解析并按需缓存。
 *
 * `load` 返回 `complete: false` 表示这次解析没有看全文件（例如超限只读了尾部），结果只供本次
 * 使用、不进缓存——否则"被截断的视角"会被误发给需要完整事件的读取方（如 resume 的严格校验）。
 *
 * 返回的事件数组在多个调用方之间共享，调用方不得修改它（replay/摘要都只读它）。
 */
export declare function cachedSessionEvents(filePath: string, fingerprint: SessionFileFingerprint, load: () => {
    events: SessionEvent[];
    complete: boolean;
    source?: SessionParseSource;
}): SessionEvent[];
/** 测试与手动失效用：清空整个缓存。 */
export declare function clearSessionParseCache(): void;
export declare function sameSessionFingerprint(left: SessionFileFingerprint, right: SessionFileFingerprint): boolean;
export {};
