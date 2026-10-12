/**
 * /memory 单库命令。
 *
 * 记忆是扁平事实文本；命令只按 id 或正文片段定位条目。
 */
import type { MemorySearchOptions, MemorySearchResult } from "./memoryTypes.js";
import type { LocalMemory } from "./LocalMemory.js";
export declare const memoryCommandUsage: string;
export declare function runMemoryCommand(memory: LocalMemory | undefined, args: string[], searchMemory?: (query: string, paths: string[], options: MemorySearchOptions) => Promise<MemorySearchResult>): Promise<string>;
