import type { ShellOutputExcerpt } from "./shellOutputProjection.js";
export declare function commandStreamFields(stream: "stdout" | "stderr", record: Record<string, unknown>, excerpt: ShellOutputExcerpt): Record<string, unknown>;
