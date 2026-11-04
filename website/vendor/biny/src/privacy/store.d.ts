export interface KnownHit {
    start: number;
    end: number;
    kind: string;
    placeholder: string;
}
type SentSpan = Pick<KnownHit, "start" | "end" | "kind">;
interface StoreLimits {
    values: number;
    characters: number;
    sentEntries: number;
    sentSpans: number;
}
/** 会话内有界保留原值与已发送文本的替换位置；请求自行捕获还原快照。 */
export declare class RedactionStore {
    private readonly scope;
    private readonly limits;
    private readonly values;
    private readonly known;
    private size;
    private readonly sent;
    private sentSize;
    private retained?;
    constructor(scope?: string, limits?: StoreLimits);
    register(kind: string, value: string): string;
    /** 两次扫描结束前不能淘汰本次使用的值，避免发现后又遗忘造成漏遮。 */
    withRequest<T>(run: () => T): T;
    find(text: string, field?: string): KnownHit[];
    snapshot(): Map<string, string>;
    restore(text: string): string;
    sentSpans(text: string, context: string): SentSpan[] | undefined;
    rememberSent(text: string, context: string, spans: SentSpan[]): void;
    private sentKey;
    get count(): number;
    clear(): void;
}
export declare const defaultStore: RedactionStore;
export declare function resetStoreForTest(): void;
export declare function registeredCount(): number;
export {};
