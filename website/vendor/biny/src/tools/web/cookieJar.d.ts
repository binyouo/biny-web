/** Cookie-Editor 导出条目。`expirationDate` 是秒级 epoch，会话 cookie 没有这个字段。 */
export interface StoredCookie {
    name: string;
    value: string;
    domain: string;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite?: "no_restriction" | "lax" | "strict" | "unspecified";
    expirationDate?: number;
    /** 为真表示只发给 `domain` 本身，不发给子域名。 */
    hostOnly?: boolean;
    session?: boolean;
    storeId?: string;
}
export interface CookieJarSummary {
    total: number;
    /** 按 cookie 数量降序的域名统计，用于设置页展示「登录了哪些站点」。 */
    domains: Array<{
        domain: string;
        count: number;
    }>;
    updatedAt?: string;
}
/**
 * jar 的默认位置，与桌面端 userData 下的工作区目录保持一致，这样 CLI/TUI 不需要任何配置
 * 就能读到桌面端导入的 cookie。桌面端自己会显式传入真实路径，不依赖这里的推算。
 */
export declare function defaultCookieJarPath(): string;
/** 读取 jar；文件不存在或内容损坏都返回空数组 —— cookie 是可再获取的缓存，不值得让工具调用失败。 */
export declare function readCookieJar(filePath: string): Promise<StoredCookie[]>;
/** 按 0600 写盘，并用临时文件 + 改名替换，避免读到写了一半的 jar。 */
export declare function writeCookieJar(filePath: string, cookies: StoredCookie[]): Promise<void>;
/**
 * 解析 Cookie-Editor 格式。除了平铺数组，也接受 `{ cookies: [...] }` 包装 —— 部分扩展
 * 和 Playwright 的 storageState 是这个形状，用户很容易直接拿来导入。
 */
export declare function parseCookieJar(raw: string): StoredCookie[];
export declare function serializeCookieJar(cookies: StoredCookie[]): string;
export declare function summarizeCookieJar(cookies: StoredCookie[], updatedAt?: string): CookieJarSummary;
/**
 * 生成发往 `url` 的 Cookie 头；没有匹配的 cookie 时返回 undefined。
 *
 * 匹配规则按 RFC 6265：domain（区分 hostOnly）、path 前缀、secure 只发给 https，并丢掉
 * 已过期的条目。`now` 可注入，方便测试过期逻辑。
 */
export declare function cookieHeaderFor(cookies: StoredCookie[], url: URL, now?: number): string | undefined;
