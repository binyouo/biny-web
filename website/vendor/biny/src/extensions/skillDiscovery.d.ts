import { type SkillDiagnosticReport } from "./skillDiagnostics.js";
import { type ManagedSkillVersion } from "./skillVersions.js";
export interface SkillRepository {
    owner: string;
    name: string;
    branch: string;
    enabled: boolean;
}
export interface DiscoverableSkill {
    key: string;
    name: string;
    description: string;
    directory: string;
    readmeUrl?: string;
    repoOwner: string;
    repoName: string;
    repoBranch: string;
    installed: boolean;
}
export interface SkillsShDiscoverableSkill {
    key: string;
    name: string;
    directory: string;
    repoOwner: string;
    repoName: string;
    repoBranch: string;
    installs: number;
    readmeUrl?: string;
    installed: boolean;
}
export interface SkillsShSearchResult {
    skills: SkillsShDiscoverableSkill[];
    totalCount: number;
    query: string;
}
export interface SkillDiscoverySnapshot {
    repositories: SkillRepository[];
    skills: DiscoverableSkill[];
    warnings: string[];
}
export interface SkillInstallResult {
    name: string;
    directory: string;
    installedPath: string;
    version: ManagedSkillVersion;
    diagnostic: SkillDiagnosticReport;
}
export declare function defaultSkillRepos(): SkillRepository[];
export declare function skillRepositoriesPath(homeDir?: string): string;
export declare function listSkillRepositories(homeDir?: string): Promise<{
    repositories: SkillRepository[];
    warnings: string[];
}>;
export declare function addSkillRepository(repository: SkillRepository, homeDir?: string): Promise<SkillRepository[]>;
export declare function removeSkillRepository(owner: string, name: string, homeDir?: string): Promise<SkillRepository[]>;
export declare function discoverSkillRepositories(options: {
    repositories: SkillRepository[];
    fetcher?: typeof globalThis.fetch;
    installedNames?: ReadonlySet<string>;
}): Promise<{
    skills: DiscoverableSkill[];
    warnings: string[];
}>;
export declare function searchSkillsSh(options: {
    query: string;
    limit?: number;
    offset?: number;
    fetcher?: typeof globalThis.fetch;
    installedNames?: ReadonlySet<string>;
}): Promise<SkillsShSearchResult>;
export declare function installDiscoveredSkill(options: {
    skill: Pick<DiscoverableSkill, "name" | "directory" | "repoOwner" | "repoName" | "repoBranch">;
    homeDir?: string;
    fetcher?: typeof globalThis.fetch;
    expectedVersion?: string;
    signal?: AbortSignal;
}): Promise<SkillInstallResult>;
export declare function updateDiscoveredSkill(options: {
    name: string;
    expectedVersion: string;
    homeDir?: string;
    fetcher?: typeof globalThis.fetch;
}): Promise<SkillInstallResult>;
