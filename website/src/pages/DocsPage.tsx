import { useEffect, useId, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { DocsPreview } from "../components/DocsPreview";
import { Icon } from "../components/Icon";
import { DOC_GROUPS, DOC_PAGES, getDocPage, type DocBlock, type DocPage } from "../docs/content.ts";
import { searchDocs } from "../docs/search.ts";
import "../docs/docs.css";

function DocsNavigation({ slug }: { slug: string }) {
  return (
    <nav aria-label="文档导航" className="docs-navigation">
      <Link aria-current={slug === "" ? "page" : undefined} className="docs-overview-link" to="/zh/docs">
        文档概览
      </Link>
      {DOC_GROUPS.map((group) => (
        <div className="docs-nav-group" key={group}>
          <p>{group}</p>
          <ul>
            {DOC_PAGES.filter((page) => page.group === group).map((page) => (
              <li key={page.slug}>
                <Link aria-current={slug.replace(/\/+$/, "") === page.slug ? "page" : undefined} to={`/zh/docs/${page.slug}`}>
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function ArticleBlock({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return <List>{block.items.map((item) => <li key={item}>{item}</li>)}</List>;
    }
    case "code":
      return <div className="docs-code"><CodeBlock lines={block.lines} /></div>;
    case "note":
      return <aside className="docs-note"><p className="docs-note-title">{block.title}</p><p>{block.text}</p></aside>;
    case "table":
      return (
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead><tr>{block.head.map((cell) => <th key={cell}>{cell}</th>)}</tr></thead>
            <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    case "preview":
      return <DocsPreview mode={block.mode} />;
    case "link":
      return <p className="docs-article-link"><Link to={block.href}>{block.title}<Icon name="arrowRight" size={14} /></Link></p>;
  }
}

function DocsOverview() {
  return (
    <article className="docs-article docs-overview">
      <header>
        <h1>从这里开始</h1>
        <p className="docs-lead">从安装、配模型到日常使用，按你正在做的事找对应章节。遇到具体问题时，也可以直接搜。</p>
      </header>
      <Link className="docs-start-link" to="/zh/docs/quick-start">
        <span><strong>完成第一次对话</strong><span>配好模型 → 打开项目 → 交一件事</span></span>
        <Icon name="arrowRight" size={20} />
      </Link>
      {DOC_GROUPS.map((group, index) => (
        <section className="docs-overview-group" id={`group-${index}`} key={group}>
          <h2>{group}</h2>
          <div className="docs-link-grid">
            {DOC_PAGES.filter((page) => page.group === group).map((page) => (
              <Link className="docs-guide-link" key={page.slug} to={`/zh/docs/${page.slug}`}>
                <span className="docs-guide-title">{page.title}<Icon name="arrowRight" size={14} /></span>
                <span>{page.description}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}

function DocsArticle({ page }: { page: DocPage }) {
  const index = DOC_PAGES.indexOf(page);
  const previous = DOC_PAGES[index - 1];
  const next = DOC_PAGES[index + 1];

  return (
    <article className="docs-article">
      <header>
        <h1>{page.title}</h1>
        <p className="docs-lead">{page.description}</p>
      </header>
      {page.sections.map((section) => (
        <section className="docs-section" id={section.id} key={section.id}>
          <h2><a href={`#${section.id}`}>{section.title}<span aria-hidden="true">#</span></a></h2>
          {section.blocks.map((block, blockIndex) => <ArticleBlock block={block} key={blockIndex} />)}
        </section>
      ))}
      <nav aria-label="文档上下篇" className="docs-pagination">
        {previous ? (
          <Link to={`/zh/docs/${previous.slug}`}><span>上一篇</span><strong>{previous.title}</strong></Link>
        ) : <Link to="/zh/docs"><span>返回</span><strong>文档概览</strong></Link>}
        {next ? (
          <Link className="docs-next" to={`/zh/docs/${next.slug}`}><span>下一篇</span><strong>{next.title}</strong></Link>
        ) : <Link className="docs-next" to="/zh/docs"><span>返回</span><strong>文档概览</strong></Link>}
      </nav>
    </article>
  );
}

function DocsLayout({ slug, page }: { slug: string; page: DocPage | undefined }) {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const navigate = useNavigate();
  const hasQuery = query.trim().length > 0;
  const results = searchDocs(query);
  const isOverview = slug === "";
  const toc = page?.sections ?? (isOverview ? DOC_GROUPS.map((group, index) => ({ id: `group-${index}`, title: group })) : []);

  return (
    <main className="docs-page" id="main-content" tabIndex={-1}>
      <div className="docs-shell">
        <div className="docs-toolbar">
          <nav aria-label="面包屑" className="docs-breadcrumbs">
            <Link to="/zh">首页</Link><Icon name="chevronRight" size={12} />
            {isOverview ? <span aria-current="page">文档</span> : <><Link to="/zh/docs">文档</Link><Icon name="chevronRight" size={12} /><span aria-current="page">{page?.title ?? "页面不存在"}</span></>}
          </nav>
          <form className="docs-search" onSubmit={(event) => {
            event.preventDefault();
            if (results[0]) {
              setQuery("");
              navigate(`/zh/docs/${results[0].slug}`);
            }
          }} role="search">
            <label className="docs-sr-only" htmlFor={searchId}>搜索文档标题、关键词和内容</label>
            <Icon name="search" size={16} />
            <input
              autoComplete="off"
              id={searchId}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }}
              placeholder="搜索文档…"
              type="search"
              value={query}
            />
            {hasQuery ? <button aria-label="清空文档搜索" onClick={() => setQuery("")} type="button"><Icon name="close" size={14} /></button> : null}
          </form>
        </div>
        <details className="docs-mobile-nav" key={`mobile-${slug}`}>
          <summary><Icon name="menu" size={16} />浏览文档<Icon name="chevronDown" size={14} /></summary>
          <DocsNavigation slug={slug} />
        </details>
        <div className="docs-columns">
          <aside className="docs-sidebar"><DocsNavigation slug={slug} /></aside>
          <div className="docs-content">
            {hasQuery ? (
              <section className="docs-search-results" aria-label="文档搜索结果">
                <h1>搜索“{query.trim()}”</h1>
                <p className="docs-results-count" role="status">找到 {results.length} 篇文档{results.length > 0 ? "，按 Enter 打开第一篇。" : "。试试更简短的关键词，或浏览左侧目录。"}</p>
                {results.length > 0 ? <ul>{results.map((result) => (
                  <li key={result.slug}><Link onClick={() => setQuery("")} to={`/zh/docs/${result.slug}`}><span>{result.group}</span><strong>{result.title}<Icon name="arrowRight" size={16} /></strong><p>{result.description}</p></Link></li>
                ))}</ul> : <button className="docs-clear-search" onClick={() => setQuery("")} type="button">清空搜索，继续阅读<Icon name="arrowRight" size={14} /></button>}
              </section>
            ) : isOverview ? <DocsOverview /> : page ? <DocsArticle page={page} /> : (
              <section className="docs-not-found">
                <h1>找不到这篇文档</h1>
                <p>这个地址还没有对应的文章。你可以搜索文档，或从文档概览继续浏览。</p>
                <Link className="docs-clear-search" to="/zh/docs">返回文档概览<Icon name="arrowRight" size={14} /></Link>
              </section>
            )}
          </div>
          {!hasQuery && toc.length > 0 ? (
            <aside className="docs-toc">
              <nav aria-label="本页目录"><p>本页目录</p><ul>{toc.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ul></nav>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export function DocsPage() {
  const params = useParams();
  const slug = (params["*"] ?? "").replace(/\/+$/, "");
  const page = getDocPage(slug);
  const title = slug === "" ? "使用文档" : page?.title ?? "文档不存在";
  const description = page?.description ?? "Biny 使用文档：安装、配置模型、会话、记忆、工具与扩展。";

  useEffect(() => {
    document.title = `${title} · Biny`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description;
  }, [title, description]);

  return <DocsLayout key={slug} page={page} slug={slug} />;
}
