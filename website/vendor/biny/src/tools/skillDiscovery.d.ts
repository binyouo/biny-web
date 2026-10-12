/**
 * Agent 可调用的 Skill 发现与安装工具。
 *
 * 远程内容的解析、来源校验和原子安装由 extensions/skillDiscovery 负责；本模块只把
 * 这些能力接入统一 Tool 契约，并在安装完成后请求当前 Runtime 重新扫描 Skill。
 */
import { z } from "zod";
import { type SkillInstallResult, type SkillsShSearchResult } from "../extensions/skillDiscovery.js";
import type { Tool } from "./types.js";
declare const skillSearchArgsSchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    query: string;
    offset?: number | undefined;
    limit?: number | undefined;
}, {
    query: string;
    offset?: number | undefined;
    limit?: number | undefined;
}>;
declare const skillInstallArgsSchema: z.ZodObject<{
    name: z.ZodString;
    directory: z.ZodString;
    repoOwner: z.ZodString;
    repoName: z.ZodString;
    repoBranch: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    directory: string;
    repoOwner: string;
    repoName: string;
    repoBranch: string;
}, {
    name: string;
    directory: string;
    repoOwner: string;
    repoName: string;
    repoBranch: string;
}>;
export type SkillSearchArgs = z.infer<typeof skillSearchArgsSchema>;
export type SkillInstallArgs = z.infer<typeof skillInstallArgsSchema>;
export interface SkillInstallToolResult extends SkillInstallResult {
    refreshed: boolean;
    warning: string | undefined;
}
export interface SkillSearchToolOptions {
    /** 当前已激活 Skill 的名字和目录，用于给搜索结果加 installed 标记。 */
    getInstalledNames: () => ReadonlySet<string>;
    fetcher?: typeof globalThis.fetch;
}
export interface SkillInstallToolOptions {
    /** 安装成功后刷新当前 Runtime 的 Skill 元数据。 */
    refreshSkills: () => Promise<void>;
    /** 测试或嵌入宿主可注入隔离 home；正常运行时使用当前用户 home。 */
    homeDir?: string;
    fetcher?: typeof globalThis.fetch;
}
export declare function createSkillSearchTool(options: SkillSearchToolOptions): Tool<SkillSearchArgs, SkillsShSearchResult>;
export declare function createSkillInstallTool(options: SkillInstallToolOptions): Tool<SkillInstallArgs, SkillInstallToolResult>;
export {};
