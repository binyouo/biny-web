import { DOC_PAGES, type DocBlock, type DocPage } from "./content.ts";

function blockText(block: DocBlock): string {
  switch (block.type) {
    case "paragraph": return block.text;
    case "list": return block.items.join(" ");
    case "code": return block.lines.join(" ");
    case "note": return `${block.title} ${block.text}`;
    case "link": return block.title;
  }
}

function normalize(text: string): string {
  return text.normalize("NFKC").toLowerCase();
}

const searchIndex = DOC_PAGES.map((page) => ({
  page,
  title: normalize(page.title),
  keywords: normalize(page.keywords.join(" ")),
  text: normalize([
    page.title,
    page.description,
    ...page.keywords,
    ...page.sections.flatMap((section) => [section.title, ...section.blocks.map(blockText)])
  ].join(" "))
}));

export function searchDocs(query: string): readonly DocPage[] {
  const tokens = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return searchIndex
    .filter((entry) => tokens.every((token) => entry.text.includes(token)))
    .map((entry) => ({
      page: entry.page,
      score: tokens.reduce((score, token) => score + (entry.title.includes(token) ? 4 : entry.keywords.includes(token) ? 2 : 1), 0)
    }))
    .sort((first, second) => second.score - first.score)
    .map((entry) => entry.page);
}
