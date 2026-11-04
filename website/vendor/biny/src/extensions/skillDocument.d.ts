export declare const maxSkillFileBytes: number;
export declare const maxSkillMetadataBytes: number;
export interface SkillMetadata {
    name?: string;
    description?: string;
    license?: string;
    compatibility?: string;
    allowedTools?: string[];
    metadata?: Record<string, unknown>;
    /** true 时名称和简介进入每轮可用技能列表，不依赖能力分析选中。 */
    alwaysInject?: boolean;
}
export declare function parseSkillDocument(content: string): {
    frontmatter: Record<string, unknown>;
    body: string;
};
export declare function readSkillMetadataFields(record: Record<string, unknown>): SkillMetadata;
