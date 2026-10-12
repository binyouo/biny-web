export interface ManagedSkillSource {
    id: string;
    name: string;
    description: string;
    sourcePath: string;
    installed: boolean;
}
export interface ManagedSkillSourceSnapshot {
    sources: ManagedSkillSource[];
    warnings: string[];
}
export declare function defaultManagedSkillSourcesRoot(homeDir?: string): string;
export declare function defaultManagedSkillRoot(homeDir?: string): string;
export declare function listManagedSkillSources(options?: {
    root?: string;
    installedRoot?: string;
    homeDir?: string;
}): Promise<ManagedSkillSourceSnapshot>;
export declare function importManagedSkillSource(options: {
    sourceFile: string;
    root?: string;
    installedRoot?: string;
    homeDir?: string;
}): Promise<ManagedSkillSource>;
export declare function installManagedSkillSource(options: {
    sourceId: string;
    root?: string;
    skillRoot?: string;
    homeDir?: string;
}): Promise<ManagedSkillSource>;
export declare function parseManagedSkillMetadata(content: string, expectedId: string): {
    id: string;
    name: string;
    description: string;
};
