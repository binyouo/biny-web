export declare const maxSkillMetadataBytes: number;
export interface SkillMetadata {
    name?: string;
    description?: string;
    license?: string;
    compatibility?: string;
    allowedTools?: string[];
    metadata?: Record<string, unknown>;
}
export declare function parseSkillDocument(content: string): {
    frontmatter: Record<string, unknown>;
    body: string;
    frontmatterEndByte?: number;
};
export declare function readSkillMetadataFields(record: Record<string, unknown>): SkillMetadata;
