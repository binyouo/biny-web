export interface SkillCheck {
    kind: "format" | "platform" | "binary" | "environment" | "config" | "compatibility" | "requirements" | "selection";
    subject: string;
    status: "passed" | "missing" | "unverified";
    message: string;
}
export interface SkillDiagnosticReport {
    name: string;
    checkedAt: string;
    status: "passed" | "blocked" | "unverified";
    checks: SkillCheck[];
}
export declare function diagnoseSkill(skill: {
    name: string;
    frontmatter: Record<string, unknown>;
    parseError?: string;
    shadowedBy?: string;
}, options?: {
    env?: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
    config?: unknown;
}): Promise<SkillDiagnosticReport>;
