export interface Checkpoint {
    id: string;
    label: string;
    commit: string;
    createdAt: string;
}
export interface RestoreSummary {
    checkpoint: Checkpoint;
    restoredFiles: number;
    /** 快照之后新建、这次被移走的文件（工作区相对路径）。 */
    movedAside: string[];
    /** 移走的文件放在哪里；没有移动时为 undefined。 */
    trashDirectory?: string;
}
export declare class CheckpointStore {
    private readonly workspaceRoot;
    private readonly gitDir;
    private constructor();
    /** 不是 git 仓库时返回 undefined —— 快照能力就是不可用，不去伪造一个。 */
    static open(workspaceRoot: string): Promise<CheckpointStore | undefined>;
    create(label: string): Promise<Checkpoint>;
    list(): Promise<Checkpoint[]>;
    restore(id: string): Promise<RestoreSummary>;
    private filesInCommit;
    private trackedFilesNow;
    private excludedStatePaths;
    private caseInsensitiveRoot;
    private gitPaths;
    private indexPath;
    private appendIndexEntry;
    private readIndex;
    private git;
}
