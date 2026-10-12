import type { SessionEvent } from "./recorder.js";
export declare const recipeIds: readonly ["repeatable-doc-task", "mcp-pipeline", "thread-to-workflow"];
export type RecipeId = (typeof recipeIds)[number];
export type RecipeState = "notified" | "dismissed" | "extracted";
export type RecipeStateMap = Partial<Record<RecipeId, RecipeState>>;
export interface RecipeSlot {
    key: string;
    label: string;
    filled: boolean;
}
export interface RecipeSuggestion {
    id: RecipeId;
    title: string;
    description: string;
    slots: RecipeSlot[];
    extractPrompt: string;
}
interface RecipeFacts {
    userTurns: number;
    toolNames: Set<string>;
    mcpToolNames: Set<string>;
    filesWritten: string[];
    attachments: string[];
    hasFileReference: boolean;
    corrections: number;
    userAnchors: Array<{
        messageId?: string;
        text: string;
    }>;
}
export declare class RecipeStateStore {
    private readonly root;
    constructor(persistenceRoot: string);
    read(sessionId: string): Promise<RecipeStateMap>;
    set(sessionId: string, recipeId: RecipeId, state: RecipeState): Promise<void>;
    clear(sessionId: string): Promise<void>;
    private sessionDirectory;
}
export declare function freshRecipeSuggestions(events: readonly SessionEvent[], sessionId: string, states?: RecipeStateMap): RecipeSuggestion[];
export declare function openRecipeSuggestions(events: readonly SessionEvent[], sessionId: string, states?: RecipeStateMap): RecipeSuggestion[];
export declare function collectRecipeFacts(events: readonly SessionEvent[]): RecipeFacts;
export {};
