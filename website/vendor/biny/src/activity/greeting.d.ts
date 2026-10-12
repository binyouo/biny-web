import type { ActivityStore } from "./store.js";
export declare function isBareGreeting(input: string): boolean;
export declare function recentActivityForGreeting(store: ActivityStore, input: string, now?: Date): string | undefined;
