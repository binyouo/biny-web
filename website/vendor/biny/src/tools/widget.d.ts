import { type WidgetInput } from "../widgets/widget.js";
import type { Tool } from "./types.js";
export declare function createWidgetRendererTool(): Tool<WidgetInput, WidgetInput & {
    kind: "widget";
}>;
export declare function createWidgetReadmeTool(): Tool<Record<string, never>, {
    guide: string;
}>;
