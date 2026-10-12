export declare const securityPolicyFileName = "SECURITY.md";
export declare const maxSecurityPolicyChars = 32000;
export interface SecurityPolicyOptions {
    configDir?: string;
}
export declare function securityPolicyPath(options?: SecurityPolicyOptions): string;
export declare function readSecurityPolicy(options?: SecurityPolicyOptions): Promise<string | undefined>;
export declare function renderSecurityPolicyPrompt(content: string): string;
