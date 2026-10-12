import type { Tool, ToolExposure } from "./types.js";
export declare function getToolExposure(tool: Pick<Tool, "exposure">): ToolExposure;
/** 仅判断已选工具能否声明给模型；未选工具仍由能力预选和发现流程控制。 */
export declare function isToolModelVisible(tool: Pick<Tool, "exposure">): boolean;
/** 暴露资格与执行准入独立，返回 true 后仍须校验工具来源、风险、权限与预算。 */
export declare function isToolScriptCallable(tool: Pick<Tool, "exposure">, selected: boolean): boolean;
