export declare function nextCron(expression: string, after: Date, timezone?: string): Date;
/** A valid finite schedule may end; invalid expressions and failed advancement still throw. */
export declare function nextCronOccurrence(expression: string, after: Date, timezone?: string): Date | undefined;
