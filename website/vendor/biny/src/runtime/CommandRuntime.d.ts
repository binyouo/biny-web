import { type AgentConfigStore } from "../config/store.js";
import type { AgentConfig } from "../config/schema.js";
import { AgentSession } from "../agent/AgentSession.js";
import type { AgentTurnOutcome, AgentPermissionRequest, AgentPermissionResult } from "../agent/types.js";
import { type ToolCatalogDefinition } from "../tools/registry.js";
import { UserInputRequests } from "./userInput.js";
import { CheckpointStore } from "../session/checkpointStore.js";
import { type SkillDefinition } from "../extensions/skills.js";
import type { ToolRisk, ToolSource } from "../tools/types.js";
import type { McpToolHost } from "../extensions/mcp.js";
import { TaskCommunication } from "./TaskCommunication.js";
import { type SubagentDefinition } from "../extensions/agents.js";
import { type ExtensionSection, type ExtensionStatus } from "../extensions/report.js";
import { SubagentTaskManager, type SubagentTaskRunOptions, type SubmittedSubagentTask } from "./SubagentTaskManager.js";
import { ManagedProcessService, type ManagedProcessLifetime } from "./ManagedProcessService.js";
import { RuntimeEventAuthority } from "./RuntimeAuthority.js";
import { DurableTaskRunStore, type TaskRetrySafety, type TaskRunWithAttempts } from "./TaskRunStore.js";
import { type TaskClosureResult } from "./TaskClosure.js";
import { AutomationStore } from "./AutomationScheduler.js";
import { GoalGraphStore } from "./GoalGraphStore.js";
import { SessionGoalStore } from "./SessionGoalStore.js";
import { CapabilityStore } from "./CapabilityStore.js";
import { RuntimeHostResourceScope, type RuntimeHostResourceRegistry, type RuntimeResourceSnapshot, type RuntimeResourceReadiness } from "./host/resources.js";
import { HeartbeatScheduler } from "../agent/context/heartbeat.js";
import { type BrowserAutomationEndpoint } from "../tools/browser.js";
import { type TaskVerificationContract, type TaskCommandExecution, type TaskVerificationApproval } from "./taskVerification.js";
export interface CommandRuntime {
    workspaceRoot: string;
    /** Location that owns durable runtime/session state. Project work uses the workspace; desktop may pass a global root for non-project sessions. */
    persistenceRoot: string;
    config: AgentConfig;
    agent: AgentSession;
    managedProcesses: ManagedProcessService;
    checkpoints: CheckpointStore | undefined;
    mcp: McpToolHost;
    runtimeAuthority: RuntimeEventAuthority;
    taskRuns: DurableTaskRunStore;
    automationStore: AutomationStore;
    heartbeat: HeartbeatScheduler;
    graphs: GoalGraphStore;
    sessionGoals: SessionGoalStore;
    capabilities: CapabilityStore;
    subagents: SubagentTaskManager | undefined;
    taskCommunication?: TaskCommunication;
    userInput?: UserInputRequests;
    setUserInputRun?(run?: {
        sessionId: string;
        runId: string;
    }): void;
    extensionReport(section?: ExtensionSection): string;
    /** 扩展实时状态的快照；`/status` 等命令的卡片和文本报告共用。 */
    extensionStatus(): ExtensionStatus;
    /** 当前可用于 TUI 补全的 Skill 元数据；正文仍按需加载。 */
    listSkills(): SkillDefinition[];
    /** 供下一回合能力选择使用的实时工具目录，不修改活动回合的执行注册表。 */
    listTools(): RuntimeToolCatalogEntry[];
    /** 每个新根回合前重新扫描 Skill，使新增和元数据修改无需重启即可生效。 */
    refreshSkills(): Promise<void>;
    /** 刷新共享 MCP/Skill 代理；回合开始前调用，避免活动回合看到半套工具。 */
    refreshExtensionTools?(): void;
    /** Desktop 客户端能力可在 Host 生命周期内挂载或撤销。 */
    setBrowserAutomation?(endpoint?: BrowserAutomationEndpoint): void;
    /** 固定本轮 Skill 可见集；后续资源变化只影响下一回合。 */
    captureRunResourceSnapshot?(runId: string): void;
    runSkillPaths?(runId: string): string[];
    releaseRunResourceSnapshot?(runId: string): void;
    resourceSnapshot?(): RuntimeResourceReadiness;
    subscribeResourceChanges?(listener: (snapshot: RuntimeResourceSnapshot) => void): () => void;
    /** 实时重新扫描具名子代理定义（会话期间可编辑生效）。 */
    listSubagentAgents(): Promise<SubagentDefinition[]>;
    startSubagentTask(task: string, options?: SubagentTaskRunOptions): SubmittedSubagentTask;
    /** Host、Desktop fallback 与模型可见 Task 共用的唯一 TaskRun 派发入口。 */
    startTaskRun(taskRunId: string, options?: {
        retrySafety?: TaskRetrySafety;
    }): Promise<{
        task: TaskRunWithAttempts;
        completion: Promise<TaskClosureResult>;
    }>;
    /** Attach to a live TaskRun or continue only a persisted verification/retry boundary. */
    resumeTaskRun(taskRunId: string): Promise<{
        task: TaskRunWithAttempts;
        completion: Promise<TaskClosureResult>;
    }>;
    continueTaskRun(taskRunId: string, message: string, requestId?: string, signal?: AbortSignal): Promise<Record<string, unknown>>;
    canResumeWorkerTask?(taskRunId: string): Promise<boolean>;
    /** Read-only routing evidence; only explicit resume may persist a missing owner. */
    legacyWorkerOwner?(taskRunId: string): Promise<string>;
    /** Exact validated resume admission, before its durable owner can be reconciled. */
    pendingTaskResume?(taskRunId: string): {
        attemptId: string;
        sessionId: string;
    } | undefined;
    /** 一次性主任务通过同一份 TaskRun 验收闭环执行，不把回合完成当作产物已验证。 */
    runTaskWithVerification(input: {
        prompt: string;
        verification: TaskVerificationContract;
        signal?: AbortSignal;
        /** Stops model work before the full run deadline so verification can use the reserve. */
        attemptSignal?: AbortSignal;
        confirmPermission?: (request: AgentPermissionRequest) => Promise<AgentPermissionResult>;
    }): Promise<{
        taskRunId: string;
        closure: TaskClosureResult;
        turnOutcome?: AgentTurnOutcome;
    }>;
    cancelTaskRun(taskRunId: string, reason?: string): TaskRunWithAttempts;
    startPlanDraft(graphId: string, revision: number, signal?: AbortSignal): Promise<unknown>;
    /** Task 验收只允许通过与 Agent 相同的 Bash 权限、调度、审计和取消链执行。 */
    executeTaskCheck(input: {
        command: string;
        checkId: string;
        contractFingerprint: string;
        cwd?: string;
        timeoutMs?: number;
        taskRunId: string;
        attemptId: string;
        approval?: TaskVerificationApproval;
        signal?: AbortSignal;
    }): Promise<TaskCommandExecution>;
    refreshDailyDiary(dateKey: string, options?: {
        force?: boolean;
    }): Promise<unknown>;
    /** 不依赖前台 session 状态的进程内工作，防止空闲回收打断日报或子代理。 */
    hasBackgroundWork(): boolean;
    setSubagentParentRunId(parentRunId?: string): void;
    close(): Promise<void>;
}
export interface RuntimeToolCatalogEntry {
    name: string;
    description: string;
    source: ToolSource;
    risk?: ToolRisk;
    exposure?: ToolCatalogDefinition["exposure"];
    namespace?: ToolCatalogDefinition["namespace"];
    parameters?: ToolCatalogDefinition["parameters"];
    outputSchema?: ToolCatalogDefinition["outputSchema"];
}
export interface CommandRuntimeOptions {
    persistenceRoot?: string;
    /** Defaults to Runtime ownership; only a disposable enclosing environment may outlive it. */
    processLifetime?: ManagedProcessLifetime;
    configStore?: AgentConfigStore;
    /** 附件物理目录；未指定时从 persistenceRoot 解析。 */
    attachmentRoot?: string;
    /** Host 为新 session 预先分配的 id；历史 session 仍由 InteractiveAgentRuntime.resumeSession 载入。 */
    sessionId?: string;
    /** Runtime Host 注入的 workspace 级共享扩展资源。 */
    resourceScope?: RuntimeHostResourceScope;
    /** Host 后台启动扩展；私有 CLI/TUI runtime 默认阻塞到首个能力快照。 */
    resourceBoot?: "blocking" | "background";
    /** Runtime Host 内部传递的 scope 注册表。 */
    resourceRegistry?: RuntimeHostResourceRegistry;
    /** Desktop 可见浏览器的控制端点；其它入口不设置则不注册 browser_* 工具。 */
    browserAutomation?: BrowserAutomationEndpoint;
}
export declare function createCommandRuntime(workspaceRoot: string, options?: CommandRuntimeOptions): Promise<CommandRuntime>;
export declare function withCommandRuntime(workspaceRoot: string, fn: (runtime: CommandRuntime) => Promise<void>): Promise<void>;
