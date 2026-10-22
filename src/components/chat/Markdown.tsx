import { Fragment, type ReactNode } from "react";

// A deliberately small Markdown renderer for chat replies: paragraphs, bullet/numbered lists,
// fenced code, inline code, bold, italic, and links. Builds React nodes (never raw HTML),
// and only allows http(s)/mailto links.

const safeHref = (href: string) => (/^(https?:|mailto:)/i.test(href) ? href : null);

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*|_[^_\s][^_]*_)|(\[[^\]]+\]\([^)\s]+\))|(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g;

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const index = m.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const key = `${keyPrefix}-${i++}`;
    const [token, code, bold, italic, link, url] = m;
    if (code) {
      nodes.push(
        <code key={key} className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
          {code.slice(1, -1)}
        </code>,
      );
    } else if (bold) {
      nodes.push(<strong key={key} className="font-semibold text-foreground">{inline(bold.slice(2, -2), key)}</strong>);
    } else if (italic) {
      nodes.push(<em key={key}>{inline(italic.slice(1, -1), key)}</em>);
    } else if (link || url) {
      const [label, href] = link ? [link.slice(1, link.indexOf("](")), link.slice(link.indexOf("](") + 2, -1)] : [url, url];
      const safe = safeHref(href);
      nodes.push(
        safe ? (
          <a key={key} href={safe} target="_blank" rel="noopener noreferrer" className="ink-link text-primary">
            {label}
          </a>
        ) : (
          label
        ),
      );
    } else {
      nodes.push(token);
    }
    last = index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "code"; text: string };

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r/g, "").split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push({ type: "code", text: body.join("\n") });
      continue;
    }
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const type = bullet ? "ul" : "ol";
      const prev = blocks[blocks.length - 1];
      const item = (bullet ?? numbered)![1];
      if (prev && prev.type === type) prev.items.push(item);
      else blocks.push({ type, items: [item] });
      i++;
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    // Headings are rendered as bold lines; the panel keeps a single type scale.
    const heading = /^#{1,6}\s+/.test(line);
    const text = line.replace(/^#{1,6}\s+/, "");
    const prev = blocks[blocks.length - 1];
    if (!heading && prev?.type === "p" && lines[i - 1]?.trim()) prev.lines.push(text);
    else blocks.push({ type: "p", lines: [heading ? `**${text}**` : text] });
    i++;
  }
  return blocks;
}

const Markdown = ({ text, className }: { text: string; className?: string }) => (
  <div className={className}>
    {parse(text).map((block, b) => {
      const key = `b${b}`;
      if (block.type === "code") {
        return (
          <pre key={key} className="overflow-x-auto rounded-sm border border-border bg-muted/60 p-3 font-mono text-[12.5px] leading-relaxed">
            <code>{block.text}</code>
          </pre>
        );
      }
      if (block.type !== "p") {
        const List = block.type;
        return (
          <List key={key} className={block.type === "ul" ? "space-y-1.5" : "list-decimal space-y-1.5 pl-5"}>
            {block.items.map((item, n) => (
              <li key={n} className={block.type === "ul" ? "flex gap-3" : "pl-1"}>
                {block.type === "ul" && <span aria-hidden className="mt-[0.72em] h-px w-3 shrink-0 bg-primary" />}
                <span>{inline(item, `${key}-${n}`)}</span>
              </li>
            ))}
          </List>
        );
      }
      return (
        <p key={key}>
          {block.lines.map((l, n) => (
            <Fragment key={n}>
              {n > 0 && <br />}
              {inline(l, `${key}-${n}`)}
            </Fragment>
          ))}
        </p>
      );
    })}
  </div>
);

export default Markdown;
