export { attachmentPathPrefix } from "./paths.js";
export interface AttachmentReference {
    name: string;
    mimeType: string;
    path: string;
    size?: number;
}
/** 仅在本次运行内保留的模型输入；`data` 绝不能写入 session 事件。 */
export interface AgentAttachment {
    name: string;
    mimeType: string;
    data: string;
    hiddenContext?: string;
    /** 新会话会带路径；兼容旧嵌入方传入的纯内存附件。 */
    path?: string;
    size?: number;
}
export declare function attachmentRoot(persistenceRoot: string): string;
export declare function ensureAttachmentRoot(persistenceRoot: string): Promise<string>;
export declare function saveAttachment(persistenceRoot: string, name: string, mimeType: string, bytes: Uint8Array): Promise<AttachmentReference>;
export declare class AttachmentImportCleanupError extends Error {
    readonly retainedAttachmentPaths: readonly string[];
    constructor(cause: unknown, retainedAttachmentPaths: readonly string[]);
}
export interface AttachmentImportBatch {
    save(name: string, mimeType: string, bytes: Uint8Array): Promise<AttachmentReference>;
    commit(): void;
    /** Returns files retained because their ownership or cleanup could not be confirmed. */
    rollback(): Promise<string[]>;
}
/** The private batch becomes persistent only when its owning session is created. */
export declare function createAttachmentImportBatch(persistenceRoot: string): Promise<AttachmentImportBatch>;
/** A caller-supplied byte budget was exceeded; unrelated read failures stay distinct. */
export declare class AttachmentReadLimitError extends Error {
    readonly actualBytes: number;
    readonly maxBytes: number;
    constructor(actualBytes: number, maxBytes: number);
}
/** Read through a bound no-follow handle; generated batch parents must remain real directories. */
export declare function readAttachmentBytes(persistenceRoot: string, virtualPath: string, maxBytes?: number): Promise<Buffer | undefined>;
export declare function readAttachment(persistenceRoot: string, reference: AttachmentReference): Promise<AgentAttachment | undefined>;
/** Runtime 已经解析出的附件目录；不得再次按项目根计算持久化分区。 */
export declare function readAttachmentFromRoot(root: string, reference: AttachmentReference): Promise<AgentAttachment | undefined>;
export declare function attachmentFilePath(root: string, virtualPath: string): string | undefined;
export declare function sanitizeAttachmentName(name: string): string;
/** 隐藏上下文仅由主进程写入；历史事件只保留附件引用，重放时从同一私有目录读取。 */
export declare function saveAttachmentContext(root: string, virtualPath: string, context: string): Promise<void>;
export declare function readAttachmentContext(root: string, virtualPath: string): Promise<string | undefined>;
export declare function attachmentMessageParts(attachments: AgentAttachment[]): ({
    type: "audio" | "image";
    data: string;
    mimeType: string;
} | {
    type: "text";
    text: string;
})[];
