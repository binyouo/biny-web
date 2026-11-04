export interface RuleHit {
    start: number;
    end: number;
    kind: string;
}
/** 遍历所有规则，收集命中；bound、ok、at 在同一处判定。 */
export declare function findRuleHits(text: string, field?: string): RuleHit[];
