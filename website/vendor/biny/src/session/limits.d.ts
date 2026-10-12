/**
 * Session 文件的大小上限与有界读取。
 *
 * session 是本地 JSONL，可能被外部程序写坏或写到极大，直接整体读入会打爆内存，所以
 * 完整读取统一预算；大文件逐行解析，不能按字节裁断消息父链。
 */
import type { FileHandle } from "node:fs/promises";
export declare const maxSessionFileBytes: number;
export declare const maxSessionEventLineBytes: number;
export declare const maxSessionEvents = 50000;
/** 接近上限的比例；越过就该提醒用户分叉，而不是等撞上再说。 */
export declare const sessionSizeWarningRatio = 0.8;
export declare function isSessionNearLimit(sizeBytes: number, events: number): boolean;
export declare function assertSessionFileSize(size: number, label: string): void;
/**
 * 分块读完整个 session 文件，并在读前、读中、读后各校验一次大小。
 * 只信任读取前的 stat 是不够的：读的过程中文件仍可能被追加，所以多读一个字节即判超限，
 * 读完后再 stat 一次确认文件没有在期间涨过上限。
 */
export declare function readBoundedSessionHandle(handle: FileHandle, label: string): Promise<Buffer>;
/** 固定读取开始时的文件长度，按 JSONL 的 LF 分行；内存只保留一行与一个读取块。 */
export declare function readSessionEventLines(handle: FileHandle, size: number): AsyncGenerator<string>;
