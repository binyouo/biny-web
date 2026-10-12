export declare class EventQueue<T> {
    private readonly events;
    private wake;
    constructor();
    push(...events: T[]): void;
    drain(): T[];
    waitForEventOr<U>(pending: Promise<U>): Promise<U | undefined>;
    private nextWake;
}
