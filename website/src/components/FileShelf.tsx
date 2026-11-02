import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * 「住在哪」的 Finder 窗：左边是 Biny 在自己电脑上真实会写出来的目录，
 * 右边点选后看内容节选。目录可折叠，红绿灯、毛玻璃、蓝高亮都按 macOS 画。
 */

type ShelfNode = {
  path: string;
  kind: "dir" | "md" | "json" | "db" | "jsonl" | "img";
  depth: number;
  note?: string;
  preview?: ReactNode;
};

function Field({ k, v }: { k: string; v: string }) {
  return <p className="shelf-field"><span>{k}</span>{v}</p>;
}

const soul = (
  <>
    <Field k="性格" v="不是助手，只是 Biny。像一个会顺手帮你做事的朋友。" />
    <Field k="语气" v="说人话，先给结论，不端着。" />
    <Field k="会长出" v="你们一起处久了，这里会多出几行新习惯。" />
  </>
);

const user = (
  <>
    <Field k="称呼" v="叫你名字，不叫「用户」。" />
    <Field k="语言" v="中文优先。" />
    <Field k="工作方式" v="先写结论，五条以内。" />
    <p className="shelf-hint">这里写的每一条，它都当真的。</p>
  </>
);

const memoryIndex = (
  <>
    <Field k="周报" v="中文、先写结论、五条以内，存到 docs/weekly/。" />
    <Field k="住处" v="旅行喜欢安静的小旅馆。" />
    <Field k="测试" v="改动前先跑 pnpm test，别动 fixture。" />
    <p className="shelf-hint">每晚 Sleep 整理一次：合并重复，放下过期的。</p>
  </>
);

const memoryDaily = (
  <pre className="shelf-code">{`# 2026-10-28 每日摘要

## 聊天摘要

<!-- biny-daily-entry:4f2a9c1e7b3d... -->
### 22:41 · biny-web
- 请求：把首页记忆区块的示例换成真实格式
- 结果：改完 HomePage 和 FileShelf，顺带提了
  Sleep 凌晨三点跑维护的事

<!-- biny-daily-entry:9d0e5b82f6a1... -->
### 16:12 · biny
- 请求：memory sleep 默认几点跑？
- 结果：03:00，每天一次；失败当天最多重试三回

## 活动记录
下午主要在调 FileShelf 预览和首页排版。`}</pre>
);

const diary = (
  <>
    <p className="shelf-line">今天他让我整理周报，只说了句「按老规矩」。</p>
    <p className="shelf-line">还好我记得。写到一半有点困了，</p>
    <p className="shelf-line">等他回来再继续吧。</p>
  </>
);

const emotion = (
  <pre className="shelf-code">{`---
mood: 疲惫但坚持
valence: 6
updated: 2026-10-17T16:29:18.047Z
---

连续遇到工具结果被归档的问题，
反复读取档案，过程繁琐但逐渐获得
有效信息，最终接近完成审阅任务。`}</pre>
);

const session = (
  <pre className="shelf-code">{`{"role":"user","text":"按老规矩整理这周进展"}
{"role":"tool","name":"召回记忆","result":"…"}
{"role":"assistant","text":"记得。中文、先结论…"}`}</pre>
);

const database = (
  <>
    <Field k="装着" v="长期记忆 + 活动索引（Computer History）。" />
    <Field k="检索" v="向量在本机用 e5-small 算，不往外发。" />
    <Field k="格式" v="普通 SQLite，想翻可以直接打开。" />
  </>
);

const snapshots = (
  <>
    <Field k="记什么" v="屏幕截图 + 本地 OCR + 浏览器标题。" />
    <Field k="边界" v="可按应用整个排除，大约留 10GB。" />
    <Field k="前提" v="要在 macOS 里授权屏幕录制才开始记。" />
  </>
);

const fatigue = (
  <pre className="shelf-code">{`{
  "level": 52,
  "note": "有点困了，说话会慢下来"
}`}</pre>
);

const nodes: ShelfNode[] = [
  { path: "~/.config/biny/", kind: "dir", depth: 0 },
  { path: "config.json", kind: "json", depth: 1, note: "模型、权限、外观", preview: <Field k="写着" v="你接的模型、权限模式、外观。改这里等于改设置。" /> },
  { path: "SOUL.md", kind: "md", depth: 1, note: "它是谁", preview: soul },
  { path: "USER.md", kind: "md", depth: 1, note: "你是谁", preview: user },
  { path: "MEMORY.md", kind: "md", depth: 1, note: "它挑出来留着的", preview: memoryIndex },
  { path: "emotions/", kind: "dir", depth: 1 },
  { path: "context/2026-10-17.md", kind: "md", depth: 2, note: "此刻的心情", preview: emotion },
  { path: "memory/", kind: "dir", depth: 1 },
  { path: "2026-10-28.md", kind: "md", depth: 2, note: "当天的记忆草稿", preview: memoryDaily },
  { path: "diary/", kind: "dir", depth: 1 },
  { path: "2026-10-29.md", kind: "md", depth: 2, note: "写给自己的日记", preview: diary },
  { path: "selfies/", kind: "dir", depth: 1, note: "自拍" },
  { path: "travels/", kind: "dir", depth: 1, note: "虚拟旅行相册" },
  { path: "~/.biny/agent/", kind: "dir", depth: 0 },
  { path: "agent.sqlite", kind: "db", depth: 1, note: "记忆 + 活动索引", preview: database },
  { path: "sessions/", kind: "dir", depth: 1 },
  { path: "my-site-a1b2c3d4/2026-10-29.jsonl", kind: "jsonl", depth: 2, note: "每个项目目录一份会话", preview: session },
  { path: "workspaces/", kind: "dir", depth: 1, note: "它干活的地方" },
  { path: "activity-records/snapshots/", kind: "dir", depth: 1, note: "看过的屏幕", preview: snapshots },
  { path: "fatigue.json", kind: "json", depth: 1, note: "作息：它也会困", preview: fatigue },
];

/* macOS 彩色文件图标：文件夹蓝、markdown/doc 白、json/db 紫、jsonl 灰 */
function FileIcon({ kind }: { kind: ShelfNode["kind"] }) {
  if (kind === "dir") {
    return (
      <svg className="shelf-ico shelf-ico-dir" height="16" viewBox="0 0 16 16" width="16" aria-hidden="true">
        <path d="M1.5 3.5A1.5 1.5 0 0 1 3 2h3.2l1.3 1.5H13a1.5 1.5 0 0 1 1.5 1.5V11a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 11V3.5Z" fill="#58b0f6" />
        <path d="M1.5 5.5h13V11a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 11V5.5Z" fill="#8ec9f8" />
      </svg>
    );
  }
  const color = { md: "#e6e6e6", json: "#b49ef0", db: "#8a7ff0", jsonl: "#9aa4b0", img: "#f0c05e" }[kind];
  return (
    <svg className="shelf-ico" height="16" viewBox="0 0 16 16" width="16" aria-hidden="true">
      <path d="M3.5 1.5h5.5l3.5 3.5v9.5a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z" fill={color} />
      <path d="M9 1.5v3.5h3.5" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth=".8" />
      {kind === "md" ? <path d="M4.8 9h6.4M4.8 11h4" stroke="#8a8a8a" strokeLinecap="round" strokeWidth=".9" /> : null}
      {kind === "db" ? <ellipse cx="8" cy="9" rx="3" ry="1.6" fill="none" stroke="#4d44a8" strokeWidth=".9" /> : null}
    </svg>
  );
}

function fullPath(node: ShelfNode) {
  const idx = nodes.indexOf(node);
  const chain: string[] = [node.path];
  for (let i = idx - 1, depth = node.depth; i >= 0 && depth > 0; i--) {
    if (nodes[i].kind === "dir" && nodes[i].depth === depth - 1) { chain.unshift(nodes[i].path); depth--; }
  }
  return chain.join("");
}

const DEFAULT_OPEN = new Set(["~/.config/biny/", "~/.biny/agent/"]);

export function FileShelf() {
  const [selectedPath, setSelectedPath] = useState("SOUL.md");
  const [open, setOpen] = useState<Set<string>>(DEFAULT_OPEN);
  const selected = nodes.find(n => n.path === selectedPath && n.preview) ?? nodes.find(n => n.path === "SOUL.md")!;

  const visible = useMemo(() => {
    const out: ShelfNode[] = [];
    let hideBelowDepth = -1;
    for (const node of nodes) {
      if (hideBelowDepth >= 0 && node.depth > hideBelowDepth) continue;
      if (hideBelowDepth >= 0 && node.depth === hideBelowDepth) hideBelowDepth = -1;
      out.push(node);
      if (node.kind === "dir" && !open.has(node.path)) hideBelowDepth = node.depth;
    }
    return out;
  }, [open]);

  const toggle = (node: ShelfNode) => {
    setOpen(current => {
      const next = new Set(current);
      if (next.has(node.path)) next.delete(node.path);
      else next.add(node.path);
      return next;
    });
  };

  const select = (node: ShelfNode) => {
    if (node.kind === "dir") { toggle(node); return; }
    if (node.preview) setSelectedPath(node.path);
  };

  return (
    <div className="shelf" role="group" aria-label="Biny 在本机保存的文件">
      <div className="shelf-bar" aria-hidden="true">
        <span className="shelf-traffic"><i /><i /><i /></span>
        <span className="shelf-bar-title">Finder — Biny 的家</span>
        <span className="shelf-bar-tools"><svg height="11" viewBox="0 0 12 12" width="11" aria-hidden="true"><path d="M1.5 4.5h9M1.5 7.5h9" stroke="currentColor" strokeWidth="1.2" /></svg></span>
      </div>
      <div className="shelf-body">
        <ul className="shelf-tree scroll-thin" aria-label="文件列表">
          {visible.map((node) => {
            const isDir = node.kind === "dir";
            const isOpen = isDir && open.has(node.path);
            const selectable = Boolean(node.preview);
            const active = selectable && node === selected;
            const displayName = node.path.endsWith("/") ? node.path.slice(0, -1) : node.path;
            const childCount = isDir ? nodes.filter(n => n.depth === node.depth + 1 && fullPath(n).startsWith(node.path)).length : 0;
            return (
              <li key={`${node.depth}-${node.path}`} style={{ paddingLeft: `${node.depth * 14 + 4}px` }}>
                <div className={cn("shelf-item", active && "is-active")} title={node.note ?? undefined}>
                  <button
                    aria-expanded={isDir ? isOpen : undefined}
                    aria-label={isDir ? `${isOpen ? "收起" : "展开"} ${displayName}` : displayName}
                    className="shelf-toggle"
                    onClick={() => select(node)}
                    type="button"
                  >
                    {isDir ? <svg className="shelf-caret" height="9" viewBox="0 0 8 10" width="8" aria-hidden="true" style={{ transform: isOpen ? "rotate(90deg)" : undefined }}><path d="M1 1l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg> : null}
                  </button>
                  <button
                    aria-current={active}
                    className="shelf-name-button"
                    onClick={() => select(node)}
                    type="button"
                  >
                    <FileIcon kind={node.kind} />
                    <span className="shelf-name">{displayName}</span>
                    {isDir && childCount > 0 ? <span className="shelf-count">{childCount}</span> : null}
                    {!isDir && node.note ? <span className="shelf-note">{node.note}</span> : null}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="shelf-view">
          <nav aria-label="路径" className="shelf-path">
            {fullPath(selected).split("/").filter(Boolean).map((seg, i, arr) => (
              <span key={i}><code>{seg}</code>{i < arr.length - 1 ? <em>›</em> : null}</span>
            ))}
          </nav>
          <div className="shelf-preview" key={selected.path}>
            {selected.note && <p className="shelf-preview-note">{selected.note}</p>}
            {selected.preview}
          </div>
          <p className="shelf-disclaimer">示例内容 · 真实文件只存在你的电脑上</p>
        </div>
      </div>
    </div>
  );
}
