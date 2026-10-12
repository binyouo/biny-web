/** History contributes automatic choices only, never pins explicit user tool lists. */
import type { SessionEvent } from "../session/recorder.js";
export declare function accumulatedAutomaticToolNames(events: readonly SessionEvent[], active: ReadonlySet<string>, messageId?: string): string[];
