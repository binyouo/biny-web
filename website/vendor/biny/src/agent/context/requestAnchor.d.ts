import type { AgentModel, ModelStreamContext } from "../core/types.js";
import type { SessionUsageAnchor } from "../../session/metadata.js";
export declare function requestFingerprints(model: AgentModel, context: ModelStreamContext, configurationIdentity?: string): {
    fixedFingerprint: string;
    messageFingerprints: string[];
};
export declare function anchoredRequestTokens(anchor: SessionUsageAnchor | undefined, model: AgentModel, context: ModelStreamContext, configurationIdentity?: string): number | undefined;
