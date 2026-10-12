import { z } from "zod";
declare const versionSchema: z.ZodObject<{
    format: z.ZodLiteral<1>;
    id: z.ZodString;
    name: z.ZodString;
    revision: z.ZodString;
    digest: z.ZodString;
    installedAt: z.ZodString;
    previous: z.ZodOptional<z.ZodString>;
    source: z.ZodObject<{
        owner: z.ZodString;
        repository: z.ZodString;
        branch: z.ZodString;
        directory: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        branch: string;
        directory: string;
        owner: string;
        repository: string;
    }, {
        branch: string;
        directory: string;
        owner: string;
        repository: string;
    }>;
}, "strict", z.ZodTypeAny, {
    name: string;
    id: string;
    format: 1;
    source: {
        branch: string;
        directory: string;
        owner: string;
        repository: string;
    };
    revision: string;
    digest: string;
    installedAt: string;
    previous?: string | undefined;
}, {
    name: string;
    id: string;
    format: 1;
    source: {
        branch: string;
        directory: string;
        owner: string;
        repository: string;
    };
    revision: string;
    digest: string;
    installedAt: string;
    previous?: string | undefined;
}>;
export type ManagedSkillVersion = z.infer<typeof versionSchema>;
export declare function isManagedSkillVersionPath(root: string, name: string, target: string): boolean;
export declare function readManagedSkillVersion(root: string, name: string): Promise<ManagedSkillVersion | undefined>;
export declare function publishSkillVersion(options: {
    root: string;
    name: string;
    preparedDirectory: string;
    revision: string;
    source: ManagedSkillVersion["source"];
    expectedVersion?: string;
    signal?: AbortSignal;
}): Promise<ManagedSkillVersion>;
export declare function rollbackSkillVersion(root: string, name: string, expectedVersion: string): Promise<ManagedSkillVersion>;
export {};
