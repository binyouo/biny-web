import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Icon } from "../../../src/desktop/renderer/src/components/Icon";
import { ProviderBrandGlyph } from "../../../src/desktop/renderer/src/components/ProviderBrandGlyph";

interface ClientComposerProps {
  model: string;
  text: string | null;
  running: boolean;
}

function DisplayActionButton({
  children,
  className,
  label,
  active,
  memoryEnabled
}: {
  children: ReactNode;
  className: string;
  label: string;
  active?: boolean;
  memoryEnabled?: boolean;
}) {
  return (
    <button
      aria-label={`${label}（预置演示）`}
      aria-pressed={memoryEnabled}
      className={`biny-composer-action ${className}`}
      data-active={active ? "true" : undefined}
      data-memory-enabled={memoryEnabled ? "true" : undefined}
      type="button"
    >
      <span className="biny-composer-action-content">{children}</span>
    </button>
  );
}

function providerTypeForModel(model: string): string {
  const name = model.toLowerCase();
  if (name.includes("claude")) return "anthropic";
  if (name.includes("deepseek")) return "deepseek";
  if (name.includes("gemini")) return "gemini";
  if (name.includes("kimi")) return "kimi";
  if (name.includes("qwen")) return "qwen";
  if (name.includes("ollama")) return "ollama";
  if (name.includes("gpt") || /^o[134](?:-|$)/.test(name)) return "openai";
  return "unknown";
}

export function ClientComposer({ model, text, running }: ClientComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const value = text ?? "";

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const resize = () => {
      input.style.height = "auto";
      input.style.height = `${Math.min(176, Math.max(64, input.scrollHeight))}px`;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(input.parentElement ?? input);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className={`composer-container biny-composer-frame${running ? " is-running" : ""}`}>
      <form
        aria-disabled="true"
        aria-label="预置场景输入区，不执行实际操作"
        className={`biny-composer${running ? " is-running" : ""}`}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="biny-prompt-editor">
          <div className="biny-prompt-surface">
            <textarea
              aria-label="任务输入（预置演示）"
              className="biny-prompt-textarea"
              placeholder={running ? "补充要求…" : "输入消息…"}
              readOnly
              ref={inputRef}
              rows={2}
              value={value}
            />
            <div aria-hidden="true" className="biny-breathing-caret-trails" />
            <div aria-hidden="true" className="biny-breathing-caret" />
          </div>
        </div>
        <div className="biny-prompt-toolbar">
          <div className="biny-composer-footer-start">
            <div className="composer-menu-anchor">
              <DisplayActionButton className="biny-composer-add" label="添加附件">
                <Icon name="add" size={15} />
              </DisplayActionButton>
            </div>
            <div className="composer-menu-anchor">
              <DisplayActionButton className="biny-capabilities-pill" label="工具与技能">
                <span className="capabilities-trigger-icon"><Icon name="sliders" size={15} /></span>
              </DisplayActionButton>
            </div>
            <div className="composer-menu-anchor">
              <DisplayActionButton className="biny-model-pill" label={`${model} · Max`}>
                <span className="model-trigger-brand"><ProviderBrandGlyph type={providerTypeForModel(model)} /></span>
                <span>{model}</span>
                <span className="model-trigger-thinking">Max</span>
                <Icon name="chevron" size={11} />
              </DisplayActionButton>
            </div>
          </div>
          <div className="biny-composer-footer-end">
            <div className="composer-menu-anchor">
              <DisplayActionButton className="biny-memory-toggle" label="关闭当前聊天记忆" memoryEnabled>
                <Icon name="brain-spark" size={20} />
              </DisplayActionButton>
            </div>
            <span aria-label="演示上下文已使用 11.3%" className="context-usage" role="status" tabIndex={0}>
              <svg aria-hidden="true" className="context-usage-ring" viewBox="0 0 20 20">
                <circle className="context-usage-ring-track" cx="10" cy="10" r="7.5" />
                <circle className="context-usage-ring-fill" cx="10" cy="10" r="7.5" pathLength="100" strokeDasharray="11.3 100" />
              </svg>
              <span>11.3%</span>
            </span>
            <span className="biny-send-button-group">
              <span className="biny-send-button-anchor">
                <DisplayActionButton active={running} className={`biny-send-button${running ? " is-stop" : ""}`} label={running ? "暂停生成" : "发送消息"}>
                  <Icon name={running ? "pause" : "arrow-up"} size={15} />
                </DisplayActionButton>
              </span>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
