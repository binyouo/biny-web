/** 侧栏问答携带有限的历史，审阅限定为只读检查；正文保持换行，不经过 slash 参数拆词。 */
export interface InspectorMessage {
    role: "user" | "assistant";
    content: string;
}
export declare function buildInspectorTask(kind: "review" | "side-chat", input: string, history: InspectorMessage[], limit: number): string;
