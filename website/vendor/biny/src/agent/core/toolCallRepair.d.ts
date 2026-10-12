/**
 * 工具调用自愈：在执行前修复可恢复的非法调用。
 *
 * 模型发出名字或参数不合法的工具调用时，AI SDK 会先经过这里的 repairToolCall 钩子：
 * 工具名按归一化匹配修正（仅大小写/分隔符变体，语义别名会复活已移除的历史工具名，
 * 与「已移除工具名不迁移」的既有语义冲突，因此不做）、参数名按别名表纠偏、
 * 标量按属性 schema 纠偏类型。修复成功则照常执行——模型不会看到本可避免的失败，
 * 也就不会进入「报错→原样重试」循环；返回 null 表示放弃修复，回落到原有错误路径。
 * 修复后的 input 以 JSON 字符串返回，SDK 会重新解析并校验，仍不合法则维持原错误，
 * 不会无限自愈。
 */
import { type ToolCallRepairFunction, type ToolSet } from "ai";
export declare const toolCallRepair: ToolCallRepairFunction<ToolSet>;
