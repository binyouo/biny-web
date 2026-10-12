import type { ComputerAuditEntry } from "./protocol.js";
/** 动作元数据独立存储，不保存输入、AX 引用或截图。 */
export declare class ComputerAuditStore {
    private readonly file;
    private database?;
    constructor(file?: string);
    private open;
    append(entry: ComputerAuditEntry): void;
    recent(limit?: number): ComputerAuditEntry[];
    close(): void;
}
