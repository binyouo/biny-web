export type TodoStatus = "pending" | "in_progress" | "completed";
export interface TodoItem {
    content: string;
    status: TodoStatus;
}
export declare const maxTodoItems = 50;
export declare const maxTodoContentLength = 500;
export declare class TodoStore {
    private readonly workspaceRoot;
    private sessionId;
    private items;
    private loaded;
    private commitQueue;
    constructor(workspaceRoot: string, sessionId: string);
    initialize(): Promise<void>;
    /** Session resume 后切换真值源，避免继续读写创建 runtime 时的旧 session 清单。 */
    useSession(sessionId: string): Promise<void>;
    private loadCurrentSession;
    list(): TodoItem[];
    /**
     * 整份替换而不是增量改。模型每次给出完整清单，就不会出现"改第 3 条"却数错序号的
     * 情况，也省掉一套 id 分配和对账逻辑。
     */
    replace(items: readonly unknown[]): Promise<TodoItem[]>;
    /** 注入 system prompt 的段落；清单为空时不占位。 */
    promptSection(): string | undefined;
    private filePath;
    private persist;
}
