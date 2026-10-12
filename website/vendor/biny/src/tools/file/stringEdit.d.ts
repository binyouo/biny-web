/** 搜索替换输入：先精确匹配，再容忍换行和行内空白差异；歧义不静默选第一个位置。 */
export declare function applyStringEdit(content: string, oldString: string, newString: string, replaceAll?: boolean): {
    content: string;
    firstChangedLine: number;
    replacements: number;
};
