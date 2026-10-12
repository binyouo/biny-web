export interface DateReferenceRange {
    startDate: string;
    endDate: string;
    timeZone: string;
}
export declare function validateDateReferenceRange(range: DateReferenceRange): DateReferenceRange;
/** 索引版本包含密钥指纹；密钥被删除或轮换后旧引用投影必须重算。 */
export declare function dateReferenceKeyFingerprint(root?: string): string;
/** endDate 为不包含的结束日，与 timeline 查询保持一致。 */
export declare function createDateReference(range: DateReferenceRange, label?: string, root?: string): string;
export declare function parseDateReference(reference: string, root?: string): {
    label: string;
    range: DateReferenceRange;
} | undefined;
