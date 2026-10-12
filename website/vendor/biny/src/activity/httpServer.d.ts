/**
 * Activity 的本地 REST 投影。
 *
 * Desktop 主流程继续使用 Electron IPC；本机集成使用loopback API。
 * 服务只绑定 127.0.0.1，所有文本仍从 ActivityStore 的脱敏查询层读取。
 */
import { type Server } from "node:http";
import type { AgentModel } from "../agent/core/types.js";
import { type ActivitySettings, type ActivitySettingsPatch } from "./settings.js";
import { type ActivityAnalyzerDeps } from "./analyzer.js";
import type { ActivityRuntimeSnapshot } from "./types.js";
import { type CrystalHttpDependencies } from "../agent/context/crystalHttp.js";
import type { EmbeddingModelRuntime } from "../llm/embedding/types.js";
export interface ActivityHttpApiDependencies {
    /** 隔离运行时的 Agent 数据根；默认使用全局根。 */
    agentDir?: string;
    loadSettings(): Promise<ActivitySettings>;
    setConfig?(patch: ActivitySettingsPatch): Promise<ActivitySettings>;
    getModel?(): AgentModel | undefined | Promise<AgentModel | undefined>;
    getEmbeddingRuntime?(): Promise<EmbeddingModelRuntime | undefined>;
    writeMemories?: ActivityAnalyzerDeps["writeMemories"];
    onAnalyzed?: ActivityAnalyzerDeps["onAnalyzed"];
    /** 服务持有显式分析后的投影及 ActivityStore 清理，关闭时收齐。 */
    scheduleProjection?: (task: Promise<void>) => void;
    crystal?: CrystalHttpDependencies;
    getRuntimeSnapshot?(): ActivityRuntimeSnapshot | Promise<ActivityRuntimeSnapshot>;
    /** REST 专属前台状态；IPC 快照继续使用自身的展示模型。 */
    getFrontmost?(): {
        bundleId: string | null;
        appName: string | null;
    };
    isCaptureRunning?(): boolean;
    getPermissions?(): ActivityPermissionStatus | Promise<ActivityPermissionStatus>;
    /** 使用采集宿主现有的一代任务信号，stop/clear/配置变更时共同失效。 */
    getOperationSignal?(): AbortSignal;
    start?(): Promise<unknown>;
    stop?(): Promise<unknown>;
    clear?(): Promise<unknown>;
    openPermissions?(pane: "screen-recording" | "accessibility"): Promise<void>;
}
export interface ActivityPermissionStatus {
    platform: string;
    screenRecording: string;
    accessibility: boolean;
    openSettingsCapable: boolean;
}
export interface ActivityHttpRequest {
    method: string;
    pathname: string;
    searchParams?: URLSearchParams;
    body?: unknown;
    signal?: AbortSignal;
}
export interface ActivityHttpResponse {
    status: number;
    body: unknown;
    contentType?: string;
}
export interface ActivityHttpServer {
    server: Server;
    host: string;
    port: number;
    token: string;
    close(): Promise<void>;
}
export declare function handleActivityHttpRequest(request: ActivityHttpRequest, deps: ActivityHttpApiDependencies): Promise<ActivityHttpResponse>;
export declare function startActivityHttpServer(deps: ActivityHttpApiDependencies, options?: {
    port?: number;
    token?: string;
}): Promise<ActivityHttpServer>;
