import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Collapse } from "../../../src/desktop/renderer/src/components/Collapse";
import { Icon, type IconName } from "../../../src/desktop/renderer/src/components/Icon";
import { FluidHoverHighlight } from "../../../src/desktop/renderer/src/components/FluidHoverHighlight";
import { useFluidHover, useRegisterFluidHoverItem, type UseFluidHoverReturn } from "../../../src/desktop/renderer/src/useFluidHover";
import { useI18n } from "../i18n";
import { hasTrustedSender, isDemoCommand, type DemoState } from "./bridge";
import { ClientComposer } from "./ClientComposer";
import { AssistantMessage, DemoActivitySegment, DemoAssistantActions, DemoChangesSummary, UserMessage } from "./renderers";
import { usePlayer } from "./usePlayer";
import type { DemoScenario, DemoStep, DemoUserStep } from "./types";

type IndexedStep = { step: DemoStep; index: number };
type ActivityStep = { step: Extract<DemoStep, { kind: "reasoning" | "tool" }>; index: number };
const rail: { name: IconName; label: string }[] = [
  { name: "list-tree", label: "文件" }, { name: "file-diff", label: "变更" }, { name: "commit", label: "提交" },
  { name: "terminal", label: "终端" }, { name: "globe", label: "浏览器" }, { name: "wrench", label: "工具" }, { name: "search", label: "引用" }
];

export function ClientDemoApp() {
  const { t } = useI18n();
  const scenarios = t.demoScenarios;
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const [started, setStarted] = useState(() => window.parent === window);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const player = usePlayer(scenario, started);
  const actionsRef = useRef(player);
  actionsRef.current = player;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (!hasTrustedSender(event, window.parent, window.location.origin) || !isDemoCommand(event.data)) return;
      if (event.data.command === "state") window.parent.postMessage({ source: "biny-client-demo", status: actionsRef.current.status } satisfies DemoState, window.location.origin);
      else if (event.data.command === "start") setStarted(true);
      else if (event.data.command === "replay") actionsRef.current.replay();
      else actionsRef.current.skip();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  useEffect(() => {
    window.parent.postMessage({ source: "biny-client-demo", status: player.status } satisfies DemoState, window.location.origin);
  }, [player.status]);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [player.index, player.chars, player.status, scenarioId]);

  const visible = player.status === "idle" ? [] : player.steps.slice(0, Math.min(player.index + 1, player.steps.length));
  const turns: { user: DemoUserStep; index: number; steps: IndexedStep[] }[] = [];
  visible.forEach((step, index) => {
    if (step.kind === "user") turns.push({ user: step, index, steps: [] });
    else turns.at(-1)?.steps.push({ step, index });
  });
  const current = player.steps[player.index];
  const composerText = player.status === "playing" && current?.kind === "user" && current.viaComposer ? current.text.slice(0, player.chars) : null;
  const model = visible.findLast((step) => step.kind === "model")?.model ?? "Deepseek-V4...";
  const running = player.status === "playing" || player.status === "waiting";
  const sidebarWidth = sidebarOpen ? 254 : 0;
  const style = {
    "--biny-sidebar-content-width": "254px", "--biny-sidebar-visual-width": `${sidebarWidth}px`,
    "--biny-sidebar-flow-width": `${sidebarWidth}px`, "--biny-inspector-flow-width": "0px"
  } as CSSProperties;

  function renderSteps(steps: IndexedStep[]): ReactNode[] {
    const result: ReactNode[] = [];
    let activity: ActivityStep[] = [];
    function flush() {
      if (!activity.length) return;
      const group = activity;
      result.push(<DemoActivitySegment decisions={player.decisions} key={`activity-${group[0].index}`} onDecide={player.decide} running={running && group.some((item) => item.index === player.index)} steps={group} />);
      activity = [];
    }
    for (const { step, index } of steps) {
      if (step.kind === "reasoning" || step.kind === "tool") activity.push({ step, index });
      else {
        flush();
        if (step.kind === "assistant") {
          const text = step.text.slice(0, player.charsFor(index));
          result.push(<div className="execution-assistant-step" key={index}><AssistantMessage streaming={index === player.index && text.length < step.text.length} text={text} /></div>);
        }
      }
    }
    flush();
    return result;
  }

  return (
    <div className="desktop-root biny-root" data-sidebar-mode={sidebarOpen ? "expanded" : "collapsed"} style={style}>
      <div aria-hidden="true" className="demo-window-traffic"><i /><i /><i /></div>
      <div className="biny-app-shell">
        <main className="biny-content-shell">
          <div className="workspace biny-workspace biny-workspace-chat">
            <div className="biny-workspace-main">
              <div aria-label="工作区工具（预置演示）" className="biny-inspector-rail is-visible" role="toolbar">
                {rail.map((item) => <button aria-label={`${item.label}（预置演示）`} className="biny-inspector-rail-btn" key={item.name} title={item.label} type="button"><Icon name={item.name} size={16} />{item.name === "file-diff" ? <span className="biny-inspector-badge is-corner">1</span> : null}</button>)}
              </div>
              <header className="biny-chat-toolbar">
                <div className="biny-chat-drag-region">
                  <div className="biny-chat-title"><span className="biny-thread-title"><span className="biny-thread-title-text">{scenario.title}</span></span></div>
                  <div className="biny-workspace-context-bar"><div className="biny-workspace-context-selectors"><div className="biny-workspace-context-anchor"><button aria-label="当前示例项目" className="biny-workspace-context-trigger" type="button"><Icon name="folder" size={14} /><span>{t.demo.window.projectName}</span></button></div></div></div>
                </div>
              </header>
              <div className="biny-chat-body">
                <div className="biny-chat-scroll" ref={scrollRef}>
                  <div className="biny-chat-scroll-content"><div className="message-timeline">
                    {turns.map((turn) => {
                      const turnRunning = running && turn === turns.at(-1);
                      const assistantText = turn.steps.flatMap(({ step }) => step.kind === "assistant" ? [step.text] : []).join("\n\n");
                      return <section className={`timeline-turn is-${turnRunning ? "running" : "completed"}`} key={turn.index}>
                        {turn.index === player.index && turn.user.viaComposer ? null : <UserMessage streaming={turn.index === player.index && !turn.user.viaComposer} text={turn.user.text.slice(0, player.charsFor(turn.index))} />}
                        {turn.steps.length ? <article className="chat-message desktop-assistant-message" data-sender="assistant" tabIndex={-1}><div className="agent-response"><div className="execution-timeline">{renderSteps(turn.steps)}</div>{!turnRunning ? <><DemoChangesSummary decisions={player.decisions} steps={turn.steps} /><DemoAssistantActions text={assistantText} /></> : null}</div></article> : null}
                      </section>;
                    })}
                  </div></div>
                </div>
              </div>
              <div className="biny-chat-composer"><ClientComposer model={model} running={running} text={composerText} /></div>
            </div>
          </div>
        </main>
        <div className="biny-sidebar-block"><ClientSidebar open={sidebarOpen} scenarios={scenarios} selectedId={scenarioId} onSelect={setScenarioId} /></div>
      </div>
      <div className="biny-sidebar-topbar biny-sidebar-topbar-floating"><div className="biny-sidebar-topbar-hit-layer">
        <button aria-expanded={sidebarOpen} aria-label={sidebarOpen ? "收起侧栏" : "展开侧栏"} className="biny-chrome-button" onClick={() => setSidebarOpen((value) => !value)} title="切换侧栏" type="button"><Icon name="sidebar" size={15} /></button>
        <button aria-label="搜索（预置演示）" className="biny-chrome-button" title="搜索" type="button"><Icon name="search" size={15} /></button>
        <button aria-label="新建任务（预置演示）" className="biny-chrome-button" title="新建任务" type="button"><Icon name="compose" size={15} /></button>
      </div></div>
    </div>
  );
}

function ClientSidebar({ open, scenarios, selectedId, onSelect }: { open: boolean; scenarios: DemoScenario[]; selectedId: string; onSelect(id: string): void }) {
  const { t } = useI18n();
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [projectOpen, setProjectOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  return (
    <aside aria-hidden={!open} aria-label="主导航" className={`biny-sidebar${open ? "" : " is-hidden"}`} inert={!open}>
      <div className="biny-sidebar-card"><div aria-hidden="true" className="biny-sidebar-topbar-spacer" />
        <div className="biny-sidebar-body"><div className="biny-sidebar-scroll">
          <section className={`biny-sidebar-section${pinnedOpen ? " is-expanded" : ""}`}><div className="biny-sidebar-section-header"><button aria-expanded={pinnedOpen} className="biny-sidebar-section-trigger" onClick={() => setPinnedOpen((value) => !value)} type="button"><span className="biny-sidebar-section-label">置顶</span><span className="biny-sidebar-section-chevron"><Icon name="chevron" size={13} /></span></button></div><div className="biny-sidebar-section-content"><div><ProjectRow name="biny" open={false} /></div></div></section>
          <section className={`biny-sidebar-section has-compact-icon${projectsOpen ? " is-expanded" : ""}`}>
            <div className="biny-sidebar-section-header"><button aria-expanded={projectsOpen} className="biny-sidebar-section-trigger" onClick={() => setProjectsOpen((value) => !value)} type="button"><span aria-hidden="true" className="biny-sidebar-section-icon"><Icon name="folder" size={16} /></span><span className="biny-sidebar-section-label">项目</span><span className="biny-sidebar-section-chevron"><Icon name="chevron" size={13} /></span></button><div className="biny-sidebar-section-actions"><button aria-label="项目排序（预置演示）" className="biny-sidebar-section-action" type="button"><Icon name="more" size={14} /></button><button aria-label="添加项目（预置演示）" className="biny-sidebar-section-action" type="button"><Icon name="add" size={14} /></button></div></div>
            <div className="biny-sidebar-section-content"><div><div className="biny-project-group">
              <ProjectRow name={t.demo.window.projectName} onToggle={() => setProjectOpen((value) => !value)} open={projectOpen} />
              <Collapse open={projectOpen}><ClientSessionList onSelect={onSelect} scenarios={scenarios} selectedId={selectedId} /></Collapse>
            </div><ProjectRow name="test" open={false} /><ProjectRow name="测试消息" open={false} /></div></div>
          </section>
        </div></div>
        <div className="biny-sidebar-footer"><button aria-label="设置（预置演示）" className="biny-sidebar-settings-item" type="button"><Icon name="settings" size={16} /><span>设置</span></button><button aria-label="时间线索（预置演示）" className="biny-chrome-button biny-sidebar-time-clues-button" type="button"><Icon name="calendar" size={16} /></button><button aria-label="结晶（预置演示）" className="biny-chrome-button biny-sidebar-crystal-button" type="button"><Icon name="cube" size={16} /></button></div>
      </div>
    </aside>
  );
}

function ClientSessionList({ scenarios, selectedId, onSelect }: { scenarios: DemoScenario[]; selectedId: string; onSelect(id: string): void }) {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(ref, { isItemDisabled: (element) => element.closest("[inert]") !== null });
  return <div className="biny-sidebar-session-list is-indented" ref={ref} {...hover.handlers}>
    <FluidHoverHighlight className="has-row-radius" hover={hover} />
    {scenarios.map((item, index) => <ClientSessionRow index={index} key={item.id} onSelect={onSelect} registerItem={hover.registerItem} scenario={item} selected={item.id === selectedId} />)}
  </div>;
}

function ClientSessionRow({ index, scenario, selected, onSelect, registerItem }: { index: number; scenario: DemoScenario; selected: boolean; onSelect(id: string): void; registerItem: UseFluidHoverReturn["registerItem"] }) {
  const ref = useRef<HTMLDivElement>(null);
  useRegisterFluidHoverItem(registerItem, index, ref);
  return <div className={`biny-sidebar-session-tree-row${selected ? " is-selected" : ""}`} ref={ref}>
    <button aria-hidden className="biny-sidebar-session-toggle is-empty" disabled tabIndex={-1} type="button" />
    <div className={`biny-sidebar-session-entry${selected ? " is-selected" : ""}`}><button aria-current={selected ? "page" : undefined} className="biny-sidebar-session-item" onClick={() => onSelect(scenario.id)} title={scenario.title} type="button"><span className="biny-sidebar-session-line"><span className="biny-sidebar-session-title">{scenario.title}</span><span className="biny-sidebar-session-meta">4 天</span></span></button></div>
  </div>;
}

function ProjectRow({ name, open, onToggle }: { name: string; open: boolean; onToggle?(): void }) {
  return <div className={`biny-project-row-wrap${open ? " is-expanded" : ""}`}><div aria-expanded={open} className="biny-project-row" onClick={onToggle} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onToggle?.(); } }} role="button" tabIndex={0}><Icon name={open ? "folder-open" : "folder"} size={16} /><span className="biny-project-row-label">{name}</span></div><div className="biny-project-row-actions"><button aria-label="新建任务（预置演示）" className="biny-project-row-action" type="button"><Icon name="compose" size={14} /></button><button aria-label="项目操作（预置演示）" className="biny-project-row-action" type="button"><Icon name="more" size={14} /></button></div></div>;
}
