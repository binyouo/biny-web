import type { LocalMemory } from "../agent/context/LocalMemory.js";
import type { MemorySearchOptions, MemorySearchResult } from "../agent/context/memoryTypes.js";
import type { Tool } from "../tools/types.js";
export declare function createMemoryTools(getMemory: () => LocalMemory | undefined, searchMemory?: (query: string, paths: string[], options: MemorySearchOptions) => Promise<MemorySearchResult>): Tool[];
