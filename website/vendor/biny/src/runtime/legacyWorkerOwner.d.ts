import type { RuntimeEventAuthority } from "./RuntimeAuthority.js";
import { type LegacyWorkerOwnerProof, type TaskRunWithAttempts } from "./TaskRunStore.js";
/** Read-only proof for the old slash-child projection that omitted its owner. */
export declare function readLegacyWorkerOwner(persistenceRoot: string, task: TaskRunWithAttempts, authority: RuntimeEventAuthority, workspaceRoot?: string): Promise<LegacyWorkerOwnerProof>;
