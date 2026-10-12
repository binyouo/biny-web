import { useEffect, useState } from "react";
import { acpConfigSchema } from "../../../../../acp/config.js";
import type { DesktopModelConfigurationInput, DesktopModelConnection, DesktopModelConnectionTestResult } from "../../../../protocol.js";
import type { ProviderCatalogItem } from "../../providerCatalog.js";
import { modelAliasFor } from "../../providerCatalog.js";
import { SettingsSwitch } from "./SettingsSwitch.js";
import { NativeSelect } from "../NativeSelect.js";

export function AcpProviderPanel({ catalog, connection, currentModel, onSave, onTest, onDelete }: {
  catalog: ProviderCatalogItem;
  connection?: DesktopModelConnection;
  currentModel?: string;
  onSave(input: DesktopModelConfigurationInput): Promise<boolean>;
  onTest(input: DesktopModelConfigurationInput): Promise<DesktopModelConnectionTestResult>;
  onDelete?: () => void;
}): React.JSX.Element {
  const [alias, setAlias] = useState(connection?.providerAlias ?? catalog.id);
  const [command, setCommand] = useState(connection?.acp?.command ?? catalog.acpCommand ?? "");
  const [args, setArgs] = useState(JSON.stringify(connection?.acp?.args ?? []));
  const [env, setEnv] = useState(JSON.stringify(connection?.acp?.env ?? {}));
  const [mcp, setMcp] = useState(connection?.acp?.mcpServers.join("\n") ?? "");
  const [allowMemory, setAllowMemory] = useState(connection?.acp?.allowMemory ?? false);
  const [auth, setAuth] = useState(connection?.acp?.authMethodId ?? "");
  const [mode, setMode] = useState(connection?.acp?.modeId ?? "");
  const [model, setModel] = useState(currentModel ?? "default");
  const [result, setResult] = useState<DesktopModelConnectionTestResult>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { setResult(undefined); }, [command, args, env, mcp, auth]);
  const input = (): DesktopModelConfigurationInput => ({
    alias: modelAliasFor(alias, model), displayName: model === "default" ? `${alias} · 默认` : model,
    providerAlias: alias.trim(), providerType: "acp", model, requiresApiKey: false, supportsTools: true,
    acp: acpConfigSchema.parse({ command, args: JSON.parse(args), env: JSON.parse(env), mcpServers: mcp.split("\n").map((name) => name.trim()).filter(Boolean),
      allowMemory, promptTimeoutMs: connection?.acp?.promptTimeoutMs, maxOutputBytes: connection?.acp?.maxOutputBytes,
      authMethodId: auth.trim() || undefined, modeId: mode || undefined })
  });
  const execute = async (test: boolean): Promise<void> => {
    setBusy(true); setMessage("");
    try {
      const configuration = input();
      if (!configuration.providerAlias) throw new Error("请填写连接名称。");
      if (test) { const response = await onTest(configuration); setResult(response); setMessage(response.message); }
      else setMessage(await onSave(configuration) ? "已保存" : "保存失败，请重试。");
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(false); }
  };
  return <div className="provider-panel">
    <h3>{catalog.label}</h3>
    <fieldset disabled={busy} className="acp-provider-fields">
      <label>连接名称<input value={alias} disabled={Boolean(connection)} onChange={(event) => setAlias(event.target.value)} /></label>
      <label>启动命令<input value={command} onChange={(event) => setCommand(event.target.value)} placeholder="可执行文件或绝对路径" spellCheck={false} /></label>
      <label>参数（JSON 数组）<input value={args} onChange={(event) => setArgs(event.target.value)} spellCheck={false} /></label>
      <label>环境变量引用（变量名 → 本机变量名）<input value={env} onChange={(event) => setEnv(event.target.value)} placeholder={'{"API_KEY":"MY_AGENT_KEY"}'} spellCheck={false} /></label>
      <label>认证方式 ID（可选）<input value={auth} onChange={(event) => setAuth(event.target.value)} spellCheck={false} /></label>
      <SettingsSwitch label="允许此 Agent 接收 Biny 记忆" checked={allowMemory} onChange={setAllowMemory} disabled={busy} detail="还需开启聊天记忆。关闭后停止新注入，已发送的内容仍可能保留在外部历史中。" />
      <label>MCP 服务名（每行一个，完全访问模式下授权整个服务）<textarea value={mcp} onChange={(event) => setMcp(event.target.value)} rows={3} spellCheck={false} /></label>
      <label>模型<NativeSelect value={model} onChange={(event) => setModel(event.target.value)}>
        <option value="default">Agent 默认模型</option>
        {model !== "default" && !result?.acp?.models.some((item) => item.id === model) ? <option value={model}>{model}</option> : null}
        {result?.acp?.models.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </NativeSelect></label>
      <label>运行模式<NativeSelect value={mode} onChange={(event) => setMode(event.target.value)}>
        <option value="">Agent 默认模式</option>
        {mode && !result?.acp?.modes.some((item) => item.id === mode) ? <option value={mode}>{mode}</option> : null}
        {result?.acp?.modes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </NativeSelect></label>
      <p>连接会启动本机程序，使用它的登录状态并可访问当前用户的文件。Biny 只能处理 Agent 主动发出的审批；请仅连接可信程序。</p>
      <div className="settings-row-actions">
        <button type="button" className="settings-secondary-button" disabled={!command.trim()} onClick={() => void execute(true)}>连接并读取模型</button>
        <button type="button" className="settings-primary-button" disabled={!command.trim()} onClick={() => void execute(false)}>保存</button>
        {onDelete ? <button type="button" className="settings-secondary-button" onClick={onDelete}>删除连接</button> : null}
      </div>
    </fieldset>
    {message ? <p role="status">{message}</p> : null}
  </div>;
}
