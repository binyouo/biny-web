/**
 * Provider 模型工厂。
 *
 * 配置模型统一由 ProviderRuntime 解析成 Vercel AI SDK model；这里仅保留
 * 需要独立配置快照时的装配入口，不实现任何 provider 协议。
 */
import type { AgentModel } from "../agent/core/types.js";
import type { AgentConfig } from "../config/schema.js";
import { type AgentConfigStore } from "../config/store.js";
import { type ModelSettings, type ProviderCredentialPersistence } from "./ProviderRuntime.js";
export type { ModelSettings } from "./ProviderRuntime.js";
export declare function createModelForConfig(config: AgentConfig, alias?: string, credentials?: ProviderCredentialPersistence): AgentModel;
export declare function createModelSettings(config: AgentConfig, alias?: string, fetcher?: typeof globalThis.fetch, credentials?: ProviderCredentialPersistence): ModelSettings;
export declare function createProviderCredentialPersistence(store: AgentConfigStore, workspaceRoot: string): ProviderCredentialPersistence;
export declare function validateModelConfiguration(config: AgentConfig, alias?: string): void;
