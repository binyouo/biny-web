import type { McpToolHost } from "../extensions/mcp.js";
import type { BrowserAutomationEndpoint } from "../tools/browser.js";
export declare const desktopComputerMcpName = "computer-use";
export declare function attachDesktopComputerMcp(host: McpToolHost, endpoint: BrowserAutomationEndpoint): Promise<void>;
