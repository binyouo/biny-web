import { type CapabilityStore } from "../runtime/CapabilityStore.js";
import type { SensitiveValueRedactionOptions } from "../utils/secrets.js";
import type { SessionReplayOptions } from "./replay.js";
/** Carries host-verified response context only for the exact resolved object. */
export declare class CapabilityOutcomeResolver {
    private readonly getStore;
    private readonly recoveredMcpResults;
    constructor(getStore: () => CapabilityStore | undefined);
    readonly resolve: NonNullable<SessionReplayOptions["resolveToolOutcome"]>;
    redactionOptionsFor(result: unknown): SensitiveValueRedactionOptions;
}
