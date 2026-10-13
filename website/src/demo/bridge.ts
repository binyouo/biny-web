export const CLIENT_WIDTH = 1353;
export const CLIENT_HEIGHT = 828;
export type DemoCommand = { source: "biny-website"; command: "start" | "replay" | "skip" | "state" | "pause" | "resume" };
export type DemoState = { source: "biny-client-demo"; status: "idle" | "playing" | "paused" | "waiting" | "done" };

export function isDemoCommand(value: unknown): value is DemoCommand {
  return typeof value === "object" && value !== null && "source" in value && value.source === "biny-website"
    && "command" in value && typeof value.command === "string" && ["start", "replay", "skip", "state", "pause", "resume"].includes(value.command);
}

export function isDemoState(value: unknown): value is DemoState {
  return typeof value === "object" && value !== null && "source" in value && value.source === "biny-client-demo"
    && "status" in value && typeof value.status === "string" && ["idle", "playing", "paused", "waiting", "done"].includes(value.status);
}

export function hasTrustedSender(event: { source: unknown; origin: string }, sender: unknown, origin: string): boolean {
  return sender !== null && sender !== undefined && event.source === sender && event.origin === origin;
}

export function clientScale(width: number): number {
  return Number.isFinite(width) && width > 0 ? Math.min(1, width / CLIENT_WIDTH) : 0;
}
