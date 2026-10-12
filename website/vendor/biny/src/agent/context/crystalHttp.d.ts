/**
 * 主题沉淀层的本地 HTTP 投影。
 *
 * 路由只负责参数校验、错误映射和响应形状，实际状态转换全部交给 CrystalService
 * 与 CrystalStorage，保证命令行、对话运行时和 loopback API 共享同一套生命周期。
 */
import { CrystalService } from "./crystalService.js";
import { type CrystalConfig } from "./crystalTypes.js";
export interface CrystalHttpDependencies {
    service: CrystalService;
    getConfig(): CrystalConfig;
    setConfig?(config: CrystalConfig): Promise<void> | void;
}
export interface CrystalHttpRequest {
    method: string;
    pathname: string;
    searchParams?: URLSearchParams;
    body?: unknown;
}
export interface CrystalHttpResponse {
    status: number;
    body: unknown;
}
export declare function handleCrystalHttpRequest(request: CrystalHttpRequest, deps: CrystalHttpDependencies): Promise<CrystalHttpResponse | undefined>;
