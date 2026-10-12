/**
 * 轻量 diff 生成模块。
 *
 * 这里生成的 unified diff 主要用于写入或编辑前的权限确认展示。它不追求完整 git diff hunk
 * 元数据，只需要让用户清楚看到旧内容和新内容的逐行差异。
 */
export declare function createUnifiedDiff(filePath: string, oldContent: string, newContent: string): string;
