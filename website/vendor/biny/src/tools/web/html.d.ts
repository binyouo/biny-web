export declare function htmlToText(html: string): string;
export interface ReadableHtmlDocument {
    title?: string;
    text: string;
}
/** 在无脚本、无子资源加载的 DOM 中提取正文，解析失败时保留原来的纯文本回退。 */
export declare function extractReadableHtml(html: string, url: string): Promise<ReadableHtmlDocument>;
export declare function htmlTitle(html: string): string | undefined;
export declare function decodeHtmlEntities(value: string): string;
