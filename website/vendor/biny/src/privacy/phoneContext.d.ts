/** 同形数字先按字段或邻近标签判断；较长标识中的片段不能作为手机号。 */
export declare function phoneContextAllows(text: string, start: number, end: number, field?: string, known?: boolean): boolean;
