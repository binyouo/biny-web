import { Icon } from "./Icon";
import { useCopy } from "../lib/utils";

export function CodeBlock({ lines }: { lines: readonly string[] }) {
  const [status, copy] = useCopy();
  return (
    <div className="code-block">
      <button aria-label="复制代码" className="code-copy" onClick={() => copy(lines.join("\n"))} type="button">
        <Icon name={status === "copied" ? "check" : "copy"} size={12} />
        <span role="status">{status === "copied" ? "已复制" : "复制"}</span>
      </button>
      <pre className="scroll-thin"><code>{lines.join("\n")}</code></pre>
      {status === "error" ? <p className="code-copy-feedback" role="status">复制失败，请手动选择代码。</p> : null}
    </div>
  );
}
