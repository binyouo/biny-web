import type { AgentMessage } from "../core/types.js";
import type { RecentWorkspaceActivity, RepoMapEntry, WorkspaceTurnData } from "./types.js";
export interface WorkspaceContextStatus {
    loadedInstructions: string[];
    instructionBytes: number;
    snapshotRefreshedAt?: string;
    snapshotDirty: boolean;
    repoMapRefreshedAt?: string;
    repoMapDirty: boolean;
    repoMapEntries: number;
    activePaths: string[];
    recentActivity: RecentWorkspaceActivity;
}
export declare class WorkspaceContext {
    private readonly workspaceRoot;
    private readonly ignore;
    private readonly instructionMaxBytes;
    /** 全局指令文件；传 undefined 关闭，默认 ~/.config/biny/AGENTS.md。 */
    private readonly globalInstructionFile;
    private readonly canonicalWorkspaceRoot;
    private readonly loadedInstructions;
    private readonly visitedInstructionDirectories;
    private readonly activePaths;
    private readonly recentSummaries;
    private instructionBytes;
    private snapshot;
    private snapshotDirty;
    private repoEntries;
    private repoEntryCache;
    private repoMapRefreshedAt;
    private repoMapDirty;
    private initialized;
    constructor(workspaceRoot: string, ignore: string[], instructionMaxBytes: number,
    /** 全局指令文件；传 undefined 关闭，默认 ~/.config/biny/AGENTS.md。 */
    globalInstructionFile?: string | undefined);
    initialize(signal?: AbortSignal): Promise<void>;
    prepareTurn(input: string, signal?: AbortSignal): Promise<WorkspaceTurnData>;
    observeToolResult(tool: string, args: unknown, result: unknown): void;
    restoreFromHistory(messages: AgentMessage[]): void;
    /** 标记项目快照与 repo map 为脏；工作区在会话外被改动（如切分支）时让下一回合重新扫描。 */
    invalidateSnapshot(): void;
    status(): WorkspaceContextStatus;
    private refreshSnapshot;
    private refreshRepoMap;
    private findRepoMapCandidates;
    private loadInstructionsForPaths;
    private loadGlobalInstructions;
    private loadInstructionDirectory;
    private toWorkspacePath;
    private toWorkspaceDirectory;
    private recentActivity;
}
export declare function formatRepoMapCandidates(entries: RepoMapEntry[]): string;
export declare function extractPathReferences(value: string): string[];
