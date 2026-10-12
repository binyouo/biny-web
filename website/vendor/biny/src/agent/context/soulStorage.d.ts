import { type SoulPromptSource } from "../builtinSoul.js";
export declare const maxSoulChars = 32000;
export declare const maxSoulTraitChars = 500;
export declare const maxSoulTraits = 15;
export interface SoulStorageOptions {
    configDir?: string;
    now?: () => Date;
}
export interface SoulSnapshot {
    content: string;
    source: SoulPromptSource;
    revision: string;
    path: string;
}
export declare class SoulStorage {
    private readonly now;
    private readonly root;
    private readonly filePath;
    private readonly migrateDefaultState;
    constructor(options?: SoulStorageOptions);
    get directory(): string;
    get path(): string;
    initialize(): Promise<void>;
    read(): Promise<SoulSnapshot>;
    promptText(): Promise<string | undefined>;
    set(content: string): Promise<SoulSnapshot>;
    /** 为外部编辑器准备用户覆盖文件；默认人格不复制进用户文件。 */
    ensureEditable(): Promise<SoulSnapshot>;
    reset(): Promise<SoulSnapshot>;
    appendTrait(description: string): Promise<SoulSnapshot>;
    /** 只修改成长区；生成时的 revision 与每日额度都在同一把写锁内检查。 */
    applyEvolution(change: SoulEvolution, expectedRevision: string): Promise<SoulEvolutionResult>;
    private ensureRoot;
    private migrateIfDefault;
    private withLock;
    private writeFile;
}
export interface SoulEvolution {
    add?: string;
    revise?: Array<{
        from: string;
        to: string;
    }>;
    remove?: string[];
    evidence: string;
}
export type SoulEvolutionResult = "applied" | "unchanged" | "missing" | "conflict" | "daily_limit" | "capacity";
