export declare class BlockedAddressError extends Error {
    constructor(message: string);
}
export type HostnameResolver = (hostname: string) => Promise<string[]>;
export interface AddressPolicy {
    /** 放开私网/环回校验。只应在用户明确为本地服务开启时使用。 */
    allowPrivateNetwork?: boolean;
    /** 测试可注入确定性解析结果；生产默认使用系统 DNS。 */
    resolveHostname?: HostnameResolver;
}
export declare function assertFetchableUrl(url: URL, policy?: AddressPolicy): Promise<void>;
export declare function blockedAddressReason(address: string): string | undefined;
