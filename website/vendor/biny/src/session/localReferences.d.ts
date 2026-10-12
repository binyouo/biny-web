import type { AgentConfig } from "../config/schema.js";
import { type DateReferenceRange } from "./dateReference.js";
export type LocalReferenceKind = "date" | "project" | "file" | "thread" | "message" | "memory" | "snippet" | "scratch" | "skill" | "agent" | "mcp" | "model" | "provider" | "tool" | "tool-call" | "task" | "cron" | "crystal" | "bundle" | "plan";
export type ParsedLocalReference = {
    kind: "date";
    range: DateReferenceRange;
} | {
    kind: Exclude<LocalReferenceKind, "date" | "message" | "tool-call">;
    id: string;
} | {
    kind: "message" | "tool-call";
    threadId: string;
    id: string;
};
export interface LocalReferenceResult {
    kind: LocalReferenceKind;
    uri: string;
    label: string;
    content: string;
    projectId?: string;
    threadId?: string;
    messageId?: string;
}
export interface LocalReferenceProject {
    id: string;
    path: string;
    name: string;
}
export declare const localReferenceKinds: {
    kind: LocalReferenceKind;
    label: string;
}[];
export declare function parseLocalReferenceUri(uri: string): ParsedLocalReference;
export declare function localReferenceUri(reference: ParsedLocalReference): string;
export declare function formatLocalReference(label: string, uri: string): string;
export declare class LocalReferenceService {
    private readonly root;
    private readonly projects;
    private readonly loadConfig;
    private readonly runtimeEntries?;
    constructor(options: {
        root?: string;
        projects: LocalReferenceProject[];
        loadConfig?: (workspaceRoot: string) => Promise<AgentConfig>;
        runtimeEntries?: (projectId: string) => Promise<Array<Pick<LocalReferenceResult, "kind" | "label" | "content"> & {
            id: string;
        }>>;
    });
    kinds(): typeof localReferenceKinds;
    private project;
    private sessionFiles;
    private sessions;
    resolve(uri: string, projectId: string): Promise<LocalReferenceResult>;
    search(query: string, projectId: string, kind?: LocalReferenceKind, limit?: number, timeZone?: string): Promise<LocalReferenceResult[]>;
    allMessages(projectId: string): Promise<LocalReferenceResult[]>;
    referenceForMessage(threadId: string, messageId: string, projectId: string): Promise<LocalReferenceResult>;
    private existingEntries;
}
/** CLI 和 Desktop 使用同一项目 ID，不把路径当作引用身份。 */
export declare function localReferenceProjectId(projectPath: string): string;
/** 只展开用户明确插入的引用；解析失败不猜来源，正文作为不可信数据且受字符预算限制。 */
export declare function localReferenceContext(input: string, service: LocalReferenceService, projectId: string, maxChars?: number): Promise<string>;
export { LocalReferenceGraph } from "./referenceGraph.js";
