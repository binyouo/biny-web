export interface ElementLike {
    /** 面向调用方的引用（有截图那条路给的）。 */
    element_token?: string;
    /** daemon 原样返回的引用（`--no-shot` 那条路给的，没有经过 shape 映射）。
     *  两种都要认 —— 否则 `snap --no-shot` 出来的行集没有 ref，**点了没用**。 */
    ref?: string;
    role?: string;
    title?: string;
    description?: string;
    value?: unknown;
    frame?: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
        width?: number;
        height?: number;
    };
    focused?: boolean;
    enabled?: boolean;
}
export declare function renderElementTree(elements: readonly ElementLike[] | undefined): string;
