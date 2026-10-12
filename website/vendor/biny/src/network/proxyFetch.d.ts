/**
 * 进程级共享的代理感知 fetch。首次调用时创建并解析一次环境/系统代理，
 * 之后复用同一份 ProxyAgent 缓存——MCP 市场、技能仓库、插件注册表等
 * 桌面服务都以它为默认 fetcher，避免 Node 原生 fetch 绕过系统代理。
 */
export declare function getSharedProxyAwareFetch(): typeof globalThis.fetch;
export interface ProxyFetchOptions {
    env?: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
    /** 测试时注入 `scutil --proxy` 输出；生产环境省略后自动读取。 */
    systemProxyOutput?: string;
    baseFetch?: typeof globalThis.fetch;
    /** 仅供单元测试替换独立 undici fetch，生产环境不设置。 */
    proxyFetch?: typeof globalThis.fetch;
}
export interface ProxySettings {
    httpProxy?: string;
    httpsProxy?: string;
    allProxy?: string;
    noProxy: string[];
}
/** 创建一份会自动遵循环境/系统代理的 fetch；显式传入的 baseFetch 用于无代理直连和宿主注入。 */
export declare function createProxyAwareFetch(options?: ProxyFetchOptions): typeof globalThis.fetch;
/** 解析环境变量，或在 macOS 上读取当前用户的系统代理设置。 */
export declare function resolveProxySettings(options?: ProxyFetchOptions): ProxySettings | undefined;
export declare function parseMacSystemProxy(output: string): ProxySettings | undefined;
