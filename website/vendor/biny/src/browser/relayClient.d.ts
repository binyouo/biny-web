import { z } from "zod";
import { type RelayMethod } from "./relayProtocol.js";
export declare const relayCredentialsSchema: z.ZodObject<{
    port: z.ZodNumber;
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    port: number;
}, {
    token: string;
    port: number;
}>;
export declare function browserRelayFile(): string;
export declare function requestBrowserRelay(method: RelayMethod, args?: unknown, options?: {
    file?: string;
    signal?: AbortSignal;
    sessionId?: string;
}): Promise<unknown>;
