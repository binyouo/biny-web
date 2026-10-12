import { type OAuthClientProvider, type OAuthDiscoveryState } from "@modelcontextprotocol/sdk/client/auth.js";
import { type OAuthTokens, type OAuthClientInformationMixed, type OAuthClientMetadata } from "@modelcontextprotocol/sdk/shared/auth.js";
import { type CredentialStore } from "../config/credentials.js";
import type { McpServerConfig } from "../config/schema.js";
export declare class McpAuthRequiredError extends Error {
    readonly code = "mcp_auth_required";
    constructor();
}
export declare class McpOAuthProvider implements OAuthClientProvider {
    readonly config: McpServerConfig;
    private readonly store;
    private readonly interactive?;
    private record;
    private verifier;
    private discovery;
    private invalidated;
    readonly account: string;
    constructor(config: McpServerConfig, store?: CredentialStore, interactive?: {
        redirectUrl: string;
        state: string;
        onAuthorization(url: URL): void;
    } | undefined);
    get redirectUrl(): string;
    get clientMetadata(): OAuthClientMetadata;
    state(): string;
    clientInformation(): Promise<OAuthClientInformationMixed | undefined>;
    saveClientInformation(client: OAuthClientInformationMixed): Promise<void>;
    tokens(): Promise<OAuthTokens | undefined>;
    credentialValues(): Promise<string[]>;
    saveTokens(tokens: OAuthTokens): Promise<void>;
    commit(): Promise<void>;
    redirectToAuthorization(url: URL): void;
    saveCodeVerifier(verifier: string): void;
    codeVerifier(): string;
    saveDiscoveryState(state: OAuthDiscoveryState): void;
    discoveryState(): OAuthDiscoveryState | undefined;
    invalidateCredentials(scope: "all" | "client" | "tokens" | "verifier" | "discovery"): Promise<void>;
    cancel(): void;
    logout(): Promise<void>;
    private read;
}
export interface McpOAuthLogin {
    id: string;
    url: string;
    expiresAt: string;
}
export declare class McpOAuthLogins {
    private readonly store;
    private readonly fetcher;
    private readonly pending;
    private disposed;
    constructor(store?: CredentialStore, fetcher?: typeof fetch);
    start(config: McpServerConfig): Promise<McpOAuthLogin>;
    finish(id: string, validate?: () => Promise<void>): Promise<void>;
    cancel(id: string, reason?: Error): Promise<void>;
    dispose(): Promise<void>;
}
