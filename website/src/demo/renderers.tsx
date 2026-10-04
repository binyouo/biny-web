import { useId, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isFullYesConfirmation } from "../../../src/permission/confirmation";
import { permissionPresentation } from "../../../src/permission/presentation";
import { Collapse } from "../../../src/desktop/renderer/src/components/Collapse";
import { CopyButton } from "../../../src/desktop/renderer/src/components/CopyButton";
import { Icon, type IconName } from "../../../src/desktop/renderer/src/components/Icon";
import { CodeView } from "../../../src/desktop/renderer/src/components/chat/CodeView";
import { IoCard } from "../../../src/desktop/renderer/src/components/chat/IoCard";
import { ChangesSummary } from "../../../src/desktop/renderer/src/components/chat/ChangesSummary";
import type { TimelineChangedFile } from "../../../src/desktop/renderer/src/sessionTimeline";
import type { DemoPermission, DemoStep, DemoToolStep } from "./types";
import type { Decision } from "./usePlayer";

const markdownPlugins = [remarkGfm];

function DemoMarkdown({ text, thinking = false }: { text: string; thinking?: boolean }) {
  return (
    <div className={`markdown-body${thinking ? " is-thinking" : ""}`}>
      <Markdown remarkPlugins={markdownPlugins}>{text}</Markdown>
    </div>
  );
}

export function UserMessage({ text, streaming }: { text: string; streaming: boolean }) {
  return (
    <article
      aria-busy={streaming || undefined}
      className={`chat-message user-message${streaming ? " is-pending-entry" : ""}`}
      data-sender="user"
      tabIndex={-1}
    >
      <div className="user-bubble"><DemoMarkdown text={text} /></div>
      <div className="user-message-actions" data-time-hover-root="">
        <CopyButton className="user-message-action" label="复制消息" size={16} value={text} />
      </div>
    </article>
  );
}

export function AssistantMessage({ text, streaming }: { text: string; streaming: boolean }) {
  return (
    <div className={streaming ? "with-streaming-cursor" : undefined}>
      <DemoMarkdown text={text} />
    </div>
  );
}

export function DemoAssistantActions({ text, timeLabel = "9/28 17:27", durationLabel = "8.2s" }: { text: string; timeLabel?: string; durationLabel?: string }) {
  return (
    <div className="assistant-actions">
      <div className="assistant-actions-duration"><Icon name="activity" size={14} /><span>{timeLabel} · Worked for {durationLabel}</span></div>
      <div className="assistant-actions-buttons">
        {text.trim() ? <CopyButton className="assistant-action" label="复制回复" size={16} value={text} /> : null}
        {text.trim() ? <button aria-label="朗读回复" className="assistant-action" title="朗读回复（预置演示）" type="button"><Icon name="volume" size={16} /></button> : null}
        <button aria-label="重新生成" className="assistant-action" title="重新生成（预置演示）" type="button"><Icon name="refresh" size={16} /></button>
        <button aria-expanded={false} aria-haspopup="menu" aria-label="更多回复操作" className="assistant-action" title="更多（预置演示）" type="button"><Icon name="more" size={16} /></button>
      </div>
    </div>
  );
}

export function DemoChangesSummary({ steps, decisions, onPreviewFile }: {
  steps: Array<{ step: DemoStep; index: number }>;
  decisions: Record<number, Decision>;
  onPreviewFile?(path: string): void;
}) {
  const files = new Map<string, TimelineChangedFile>();
  for (const { step, index } of steps) {
    if (step.kind !== "tool" || step.status === "running" || step.status === "error") continue;
    if (step.permission && decisions[index] !== "approved") continue;
    const path = step.diff?.path ?? (step.name === "写入文件" ? step.filePath : undefined);
    if (!path) continue;
    files.set(path, { path, operation: step.name === "写入文件" ? "write" : "edit", status: "completed" });
  }
  return files.size ? <ChangesSummary files={[...files.values()]} onPreviewFile={onPreviewFile ?? (() => undefined)} /> : null;
}

type ActivityStep = Extract<DemoStep, { kind: "reasoning" | "tool" }>;
type PhaseKind = "thinking" | "exploring" | "making" | "running" | "generic";

interface ActivityItem {
  step: ActivityStep;
  index: number;
}

interface ActivityPhase {
  kind: PhaseKind;
  items: ActivityItem[];
}

const phaseIcons: Record<PhaseKind, IconName> = {
  thinking: "brain",
  exploring: "search",
  making: "edit",
  running: "terminal",
  generic: "wrench",
};

const toolVerbs: Record<string, string> = {
  "读取文件": "读取",
  "搜索内容": "搜索",
  "列出文件": "匹配",
  "修改文件": "编辑",
  "写入文件": "写入",
  "召回记忆": "检索记忆",
  "保存记忆": "保存记忆",
  "加载技能": "使用技能",
  Bash: "执行",
};

const toolNames: Record<string, string> = {
  "读取文件": "Read",
  "搜索内容": "Grep",
  "列出文件": "Glob",
  "修改文件": "Edit",
  "写入文件": "Write",
  "召回记忆": "recall_memory",
  "保存记忆": "save_memory",
  "加载技能": "Skill",
};

function phaseKind(step: ActivityStep): PhaseKind {
  if (step.kind === "reasoning") return "thinking";
  if (step.command || step.name === "Bash") return "running";
  if (step.diff || ["修改文件", "写入文件", "保存记忆"].includes(step.name)) return "making";
  if (["读取文件", "搜索内容", "列出文件", "召回记忆"].includes(step.name)) return "exploring";
  return "generic";
}

function phaseLabel(phase: ActivityPhase, live: boolean): { verb: string; rest: string } {
  const count = phase.items.length;
  switch (phase.kind) {
    case "thinking": {
      const seconds = phase.items.reduce((total, { step }) => {
        const match = step.kind === "reasoning" ? /([\d.]+)\s*秒/u.exec(step.label) : null;
        return total + Number(match?.[1] ?? 0);
      }, 0);
      return { verb: live ? "思考中" : "已思考", rest: !live && seconds > 0 ? `${seconds} 秒` : "" };
    }
    case "exploring":
      return { verb: live ? "探索中" : "已探索", rest: `${count} ${phase.items.every(({ step }) => step.kind === "tool" && step.name === "读取文件") ? "个文件" : "处"}` };
    case "making": {
      const creates = phase.items.filter(({ step }) => step.kind === "tool" && step.name === "写入文件").length;
      return { verb: live ? "修改中" : "已修改", rest: [creates ? `新建 ${creates}` : "", count > creates ? `编辑 ${count - creates}` : ""].filter(Boolean).join(", ") };
    }
    case "running":
      return { verb: live ? "执行中" : "已执行", rest: `${count} 条命令` };
    default: {
      const names = new Set(phase.items.flatMap(({ step }) => step.kind === "tool" ? [toolNames[step.name] ?? step.name] : []));
      return names.size === 1
        ? { verb: live ? "使用中" : "已使用", rest: `${[...names][0]}${count > 1 ? ` ×${count}` : ""}` }
        : { verb: live ? "进行中" : "已完成", rest: `${count} 步` };
    }
  }
}

/** 预置步骤采用客户端活动段结构，权限决定仍交给演示播放器。 */
export function DemoActivitySegment({
  steps,
  decisions,
  running,
  onDecide,
  onPreviewFile,
}: {
  steps: ActivityItem[];
  decisions: Record<number, Decision>;
  running: boolean;
  onDecide(value: Decision): void;
  onPreviewFile?(path: string): void;
}) {
  const phases = useMemo(() => {
    const grouped: ActivityPhase[] = [];
    for (const item of steps) {
      const kind = phaseKind(item.step);
      const last = grouped.at(-1);
      if (last?.kind === kind) last.items.push(item);
      else grouped.push({ kind, items: [item] });
    }
    return grouped;
  }, [steps]);
  const [selection, setSelection] = useState<number | "timeline" | null>(null);
  const pendingPhase = phases.findIndex((phase) => phase.items.some(({ step, index }) => step.kind === "tool" && step.permission && !decisions[index]));
  const selectedPhase = pendingPhase >= 0 ? pendingPhase : running ? phases.length - 1 : typeof selection === "number" ? selection : null;
  const timelineMode = running || selection === "timeline";
  const railOpen = timelineMode || selectedPhase !== null;
  const allThinking = phases.every((phase) => phase.kind === "thinking");
  const toolCount = steps.filter(({ step }) => step.kind === "tool").length;
  const latestIndex = steps.at(-1)?.index;
  const headerPhase = selectedPhase !== null ? phases[selectedPhase] : allThinking ? phases[0] : undefined;
  const headerLabel = pendingPhase >= 0
    ? { verb: "等待确认", rest: "" }
    : headerPhase ? phaseLabel(headerPhase, running) : { verb: "工具调用", rest: `${toolCount} 次` };

  if (!phases.length) return null;

  return (
    <section className={`chat-activity${railOpen ? " is-open" : ""}`} data-activity-anchor="" data-running={running || undefined}>
      <div className="chat-activity-header">
        <div className={`chat-activity-avatars${phases.length > 1 ? " is-stacked" : ""}`}>
          {phases.map((phase, index) => (
            <button
              aria-label={phaseLabel(phase, false).verb}
              className={`chat-phase-avatar${selectedPhase === index ? " is-active" : ""}${running && index === phases.length - 1 ? " is-alive" : ""}`}
              data-activity-toggle=""
              disabled={running}
              key={phase.items[0].index}
              onClick={() => setSelection(selection === index ? null : index)}
              style={phases.length > 1 ? { marginLeft: index === 0 ? 0 : -7, zIndex: selectedPhase === index ? 50 : index + 1 } : undefined}
              type="button"
            ><Icon name={phaseIcons[phase.kind]} size={12} /></button>
          ))}
        </div>
        {running ? (
          <span className={`chat-activity-label${pendingPhase < 0 ? " chat-shimmer-text" : ""}`} role="status">
            {headerLabel.verb}{headerLabel.rest ? ` ${headerLabel.rest}` : ""}
          </span>
        ) : (
          <>
            <button aria-expanded={railOpen} className="chat-activity-summary" data-activity-toggle="" onClick={() => setSelection(railOpen ? null : "timeline")} type="button">
              {!headerPhase && pendingPhase < 0 ? (
                <span className="chat-activity-verb">工具调用 {toolCount} 次</span>
              ) : (
                <><span className="chat-activity-verb">{headerLabel.verb}</span>{headerLabel.rest ? <span className="chat-activity-rest"> {headerLabel.rest}</span> : null}</>
              )}
            </button>
            {!allThinking && phases.length > 1 ? (
              <button
                aria-label="时间线视图"
                aria-expanded={timelineMode}
                aria-pressed={timelineMode}
                className={`chat-activity-mode${timelineMode ? " is-active" : ""}`}
                data-activity-toggle=""
                onClick={() => setSelection(timelineMode ? phases.length - 1 : "timeline")}
                title="时间线视图"
                type="button"
              ><Icon name="list-tree" size={14} /></button>
            ) : null}
            <button aria-expanded={railOpen} aria-label={railOpen ? "收起活动" : "展开活动"} className="chat-activity-chevron" data-activity-toggle="" onClick={() => setSelection(railOpen ? null : "timeline")} type="button">
              <Icon name="chevron" size={14} />
            </button>
          </>
        )}
      </div>
      <Collapse className="chat-activity-collapse" open={railOpen}>
        <div className="chat-activity-rail">
          {phases.map((phase, phaseIndex) => {
            if (!timelineMode && selectedPhase !== phaseIndex) return null;
            const label = phaseLabel(phase, false);
            return (
              <div className="chat-activity-phase" key={phase.items[0].index}>
                {phase.kind === "thinking" ? (
                  <>
                    {timelineMode ? <div className="chat-activity-phase-label"><span className="chat-activity-verb">{label.verb}</span>{label.rest ? <span className="chat-activity-rest"> {label.rest}</span> : null}</div> : null}
                    <div className="chat-activity-thinking">
                      <DemoMarkdown thinking text={phase.items.flatMap(({ step }) => step.kind === "reasoning" ? [step.text] : []).join("\n\n")} />
                    </div>
                  </>
                ) : phase.items.map(({ step, index }) => step.kind === "tool" ? (
                  <DemoToolRow
                    decision={decisions[index] ?? null}
                    key={index}
                    onDecide={onDecide}
                    onPreviewFile={onPreviewFile}
                    running={running && index === latestIndex && decisions[index] !== "denied"}
                    step={step}
                  />
                ) : null)}
              </div>
            );
          })}
        </div>
      </Collapse>
    </section>
  );
}

function DemoToolRow({ step, decision, running, onDecide, onPreviewFile }: {
  step: DemoToolStep;
  decision: Decision | null;
  running: boolean;
  onDecide(value: Decision): void;
  onPreviewFile?(path: string): void;
}) {
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const error = step.status === "error" || decision === "denied";
  const pending = Boolean(step.permission && !decision);
  const statusRunning = running || step.status === "running" || pending;
  const object = step.command?.text ?? step.summary;

  return (
    <div data-activity-anchor="" className={`chat-tool-row-wrap${step.permission ? " has-permission" : ""}`} onKeyDown={(event) => {
      if (event.key === "Escape" && open) { event.stopPropagation(); setOpen(false); buttonRef.current?.focus(); }
    }}>
      <button aria-expanded={open} aria-controls={detailId} ref={buttonRef} className={`chat-tool-row${open ? " is-open" : ""}`} data-activity-toggle="" onClick={() => setOpen((value) => !value)} type="button">
        {statusRunning ? <span aria-hidden="true" className="chat-tool-run-dot" /> : null}
        {error ? <span aria-hidden="true" className="chat-tool-row-error"><Icon name="circle-close" size={12} /></span> : null}
        <span className={`chat-tool-row-verb${error ? " is-error" : ""}`}>{toolVerbs[step.name] ?? step.name}</span>
        <span className="chat-tool-row-object" title={object}>{object}</span>
        {step.diff && step.diff.added > 0 ? <span className="chat-tool-row-diff is-add">+{step.diff.added}</span> : null}
        {step.diff && step.diff.removed > 0 ? <span className="chat-tool-row-diff is-del">-{step.diff.removed}</span> : null}
        {step.durationLabel ? <span className="chat-tool-row-duration" title="耗时"><Icon name="timer" size={12} />{step.durationLabel.replace(/\s*秒/u, "s")}</span> : null}
        <span className="chat-tool-row-chevron"><Icon name="chevron" size={14} /></span>
      </button>
      <Collapse className="chat-tool-row-collapse" open={open}>
        <div className="chat-tool-row-detail" id={detailId}>
          <ToolDetails decision={decision} onPreviewFile={onPreviewFile} running={statusRunning} step={step} />
        </div>
      </Collapse>
      {step.permission ? <PermissionCard decision={decision} onDecide={onDecide} permission={step.permission} step={step} /> : null}
    </div>
  );
}

function ToolDetails({ step, decision, running, onPreviewFile }: {
  step: DemoToolStep;
  decision: Decision | null;
  running: boolean;
  onPreviewFile?(path: string): void;
}) {
  const showResult = !step.permission || decision === "approved";
  const output = showResult ? step.command?.output.join("\n") ?? "" : "";
  const error = step.status === "error" || decision === "denied";
  const diff = step.diff;
  const diffText = diff ? [
    `diff --git a/${diff.path} b/${diff.path}`,
    `--- a/${diff.path}`,
    `+++ b/${diff.path}`,
    `@@ -${diff.lines[0]?.line ?? 1},${diff.lines.filter((line) => line.sign !== "+").length} +${diff.lines[0]?.line ?? 1},${diff.lines.filter((line) => line.sign !== "-").length} @@`,
    ...diff.lines.map((line) => `${line.sign}${line.text}`),
  ].join("\n") : "";

  return (
    <div className="tool-details">
      {step.command ? (
        <div className="chat-command">
          <div className="chat-command-input"><pre><span aria-hidden="true">$ </span>{step.command.text}</pre><CopyButton label="复制命令" value={step.command.text} /></div>
          {output ? <div className="chat-command-result"><pre aria-label="命令输出" tabIndex={0}>{output}</pre><CopyButton label="复制输出" value={output} /></div> : null}
          <div className={`chat-command-status${error ? " is-error" : ""}`}>
            {step.permission && !decision ? "等待确认" : error ? "执行失败" : running ? <><span aria-hidden="true" className="chat-tool-run-dot" />{output ? "运行中" : "等待输出…"}</> : output ? "已完成" : "已完成，无输出"}
          </div>
        </div>
      ) : null}
      {showResult && diff ? (
        <>
          <section className="tool-section"><h4 className="tool-section-label">已提交变更</h4><pre><code>edit {diff.path}</code></pre></section>
          <section className="tool-output-surface diff-surface">
            <header className="tool-output-header diff-header">
              <div className="diff-paths" title={diff.path}><span className="diff-path">{onPreviewFile ? <button onClick={() => onPreviewFile(diff.path)} title="在右侧预览" type="button">{diff.path}</button> : diff.path}</span></div>
              <span className="diff-stats"><span className="diff-add">+{diff.added}</span><span className="diff-delete">-{diff.removed}</span></span>
              <CopyButton label="复制 Diff" value={diffText} />
            </header>
            <pre aria-label="文件变更" tabIndex={0} className="diff-code"><code>{diffText.split("\n").map((line, index) => <span className="diff-line" data-line={index < 3 ? "meta" : index === 3 ? "hunk" : line.startsWith("+") ? "add" : line.startsWith("-") ? "del" : "ctx"} key={index}>{line}{"\n"}</span>)}</code></pre>
          </section>
        </>
      ) : null}
      {showResult && step.payload ? step.name === "读取文件" ? (
        <section className="tool-section"><CodeView code={step.payload.join("\n")} filePath={step.filePath ?? step.summary} onPreviewFile={onPreviewFile} /></section>
      ) : (
        <IoCard input={step.summary} output={step.payload.join("\n")} outputError={error} />
      ) : null}
      {showResult && step.filePath && !step.payload ? <section className="tool-section"><pre><code>{step.filePath}</code></pre></section> : null}
    </div>
  );
}

function PermissionShield({ approved = false }: { approved?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={approved ? "M20 6 9 17 4 12" : "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11"} />{!approved ? <path d="M12 8v4m0 4h.01" /> : null}</svg>;
}

function PermissionCard({ permission, decision, step, onDecide }: {
  permission: DemoPermission;
  decision: Decision | null;
  step: DemoToolStep;
  onDecide(value: Decision): void;
}) {
  const [confirmation, setConfirmation] = useState("");
  const [denialReason, setDenialReason] = useState("");
  const [showDenialReason, setShowDenialReason] = useState(false);
  const [resolvedLabel, setResolvedLabel] = useState("");
  const canApprove = !permission.requireFullYes || isFullYesConfirmation(confirmation);
  const command = step.command?.text;
  const { title, details } = permissionPresentation({
    tool: step.command ? "Bash" : step.diff ? "Edit" : step.name,
    actionType: step.command ? "shell" : step.diff ? "write" : "unknown",
    details: permission.details,
    command,
    targetPath: permission.target,
  });
  const resolve = (value: Decision, label: string) => { setResolvedLabel(label); onDecide(value); };

  if (decision) return (
    <div className={`permission-card is-resolved${decision === "approved" ? " is-approved" : " is-denied"}`}>
      <PermissionShield approved={decision === "approved"} />
      <span>{resolvedLabel || (decision === "approved" ? "已允许一次" : "已拒绝")}</span>
      {decision === "denied" && denialReason ? <span className="permission-resolved-reason">· {denialReason}</span> : null}
    </div>
  );

  return (
    <section className={`permission-card${permission.risk === "high" ? " is-critical" : ""}`} aria-label="工具授权" aria-busy={false}>
      <span className="permission-icon" aria-hidden="true"><PermissionShield /></span>
      <div className="permission-body">
        <span className="permission-strip-title">需要你的确认</span>
        <h4 className="permission-headline">{title}</h4>
        <pre className="permission-preview">{[command, permission.target, details, !command ? permission.preview : undefined].filter(Boolean).join("\n")}</pre>
        {showDenialReason ? (
          <label className="permission-confirmation"><input autoCapitalize="none" autoComplete="off" onChange={(event) => setDenialReason(event.target.value.slice(0, 240))} aria-label="拒绝理由" placeholder="说明拒绝原因…" spellCheck={false} type="text" value={denialReason} /></label>
        ) : permission.requireFullYes ? (
          <label className="permission-confirmation"><span>输入 <strong>yes</strong> 确认此操作</span><input autoCapitalize="none" autoComplete="off" onChange={(event) => setConfirmation(event.target.value.slice(0, 16))} spellCheck={false} type="text" placeholder="yes" value={confirmation} /></label>
        ) : null}
        <div className="permission-actions">
          <button className="is-danger" onClick={() => resolve("denied", "已拒绝")} type="button">拒绝</button>
          <button className={showDenialReason ? "is-reason-active" : undefined} disabled={showDenialReason && !denialReason.trim()} onClick={() => {
            if (!showDenialReason) { setShowDenialReason(true); return; }
            resolve("denied", "已拒绝并说明理由");
          }} type="button">{showDenialReason ? "提交拒绝理由" : "拒绝并说明理由"}</button>
          <button className="is-primary" disabled={!canApprove} onClick={() => resolve("approved", "已允许一次")} type="button">允许一次</button>
          <button className="is-session" disabled={!canApprove} onClick={() => resolve("approved", "已在本会话允许")} type="button" title="仅记住当前会话中相同命令、路径或工具的授权">本会话允许</button>
        </div>
      </div>
    </section>
  );
}
