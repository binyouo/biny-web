import type { BrowserAutomationEndpoint } from "./browser.js";
import { type Tool, type ToolExecutionContext } from "./types.js";
import type { DriverReply } from "../computer/controller.js";
export type ComputerToolCaller = (method: string, args: Record<string, unknown>, context: ToolExecutionContext, mutation: boolean) => Promise<DriverReply>;
export declare function createComputerUseTools(call: ComputerToolCaller): Tool[];
export declare function requestComputer(endpoint: BrowserAutomationEndpoint, method: string, args: Record<string, unknown>, signal?: AbortSignal, mutation?: boolean, onDispatched?: () => void): Promise<DriverReply>;
