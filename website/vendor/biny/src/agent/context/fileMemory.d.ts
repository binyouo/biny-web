export interface FileMemoryOptions {
    configDir?: string;
    allowActivity?: boolean;
}
export declare class FileMemoryStorage {
    readonly configDir: string;
    readonly longTermPath: string;
    constructor(options?: FileMemoryOptions);
    readLongTerm(): Promise<string | undefined>;
    writeLongTerm(content: string): Promise<string>;
    append(content: string, options?: {
        section?: string;
        entryKey?: string;
    }): Promise<string>;
}
export declare function readFileMemoryPrompt(now?: Date, options?: FileMemoryOptions): Promise<string | undefined>;
