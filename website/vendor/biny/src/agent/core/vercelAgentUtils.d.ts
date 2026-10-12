/** Vercel Agent 适配层共用的无状态值转换工具。 */
import { type SharedV4ProviderMetadata } from "@ai-sdk/provider";
export declare function isRecord(value: unknown): value is Record<string, unknown>;
export declare function stringify(value: unknown): string;
export declare function errorMessage(error: unknown): string;
export declare function providerMetadata(value: unknown): SharedV4ProviderMetadata | undefined;
