/**
 * Soul 的共享命令语义。
 *
 * CLI 和交互端共用这里的读写动作，避免 Desktop/TUI 与 biny soul 的持久化边界逐渐分叉。
 * 外部编辑器只属于 CLI；交互端的 edit 动作返回同一个 canonical 文件路径。
 */
import type { SoulStorage } from "./soulStorage.js";
export declare const soulCommandUsage: string;
export declare function runSoulCommand(storage: SoulStorage, args: string[]): Promise<string>;
