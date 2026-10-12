/** Model-only shell excerpts. The capture and Code Mode budgets are independent. */
export declare const shellOutputBudgetBytes: number;
export interface ShellOutputExcerpt {
    text: string;
    /** Source bytes retained, excluding the omission marker. */
    retainedContentBytes: number;
    omittedBytes: number;
}
/** Share one UTF-8 budget fairly; a short stream lends its unused half to the other. */
export declare function projectShellStreams(stdout: string, stderr: string): {
    stdout: ShellOutputExcerpt;
    stderr: ShellOutputExcerpt;
};
/** The marker counts towards maxBytes; cuts never split a UTF-8 code point. */
export declare function shellOutputExcerpt(value: string, maxBytes?: number): ShellOutputExcerpt;
