import { type PathEnvironment } from "./paths.js";
export interface GlobalStateMigrationResult {
    sourceRoot: string;
    targetRoot: string;
    moved: string[];
    conflicts: string[];
    skipped: string[];
}
/**
 * 迁移默认路径上的旧全局状态；显式 BINY_AGENT_DIR 用于测试/便携部署时不触碰用户默认目录。
 */
export declare function migrateLegacyGlobalState(options?: PathEnvironment): Promise<GlobalStateMigrationResult>;
