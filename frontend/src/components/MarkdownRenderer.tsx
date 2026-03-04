import React from "react";

// ─── Inline text renderer (bold, italic, inline code, links) ────────────────
function renderInline(text: string): React.ReactNode {
    // Split on markdown inline tokens
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        // Skip badges / shield.io patterns entirely
        const badgeMatch = remaining.match(/^!\[.*?\]\(https?:\/\/[^)]*\)/);
        if (badgeMatch) { remaining = remaining.slice(badgeMatch[0].length); continue; }

        // Bold **text** or __text__
        const boldMatch = remaining.match(/^(\*{2}|_{2})(.*?)\1/);
        if (boldMatch) {
            parts.push(<strong key={key++} className="font-semibold text-slate-200">{boldMatch[2]}</strong>);
            remaining = remaining.slice(boldMatch[0].length);
            continue;
        }

        // Italic *text* or _text_
        const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
        if (italicMatch) {
            parts.push(<em key={key++} className="italic text-slate-300">{italicMatch[2]}</em>);
            remaining = remaining.slice(italicMatch[0].length);
            continue;
        }

        // Inline code `code`
        const codeMatch = remaining.match(/^`([^`]+)`/);
        if (codeMatch) {
            parts.push(
                <code key={key++} className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-xs text-emerald-300/90">
                    {codeMatch[1]}
                </code>
            );
            remaining = remaining.slice(codeMatch[0].length);
            continue;
        }

        // Link [text](url)
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
            parts.push(
                <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
                    className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors">
                    {linkMatch[1]}
                </a>
            );
            remaining = remaining.slice(linkMatch[0].length);
            continue;
        }

        // Collect plain text up to the next token
        const nextSpecial = remaining.search(/\*{1,2}|_{1,2}|`|\[|!\[/);
        if (nextSpecial > 0) {
            parts.push(remaining.slice(0, nextSpecial));
            remaining = remaining.slice(nextSpecial);
        } else {
            parts.push(remaining);
            break;
        }
    }

    return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : <>{parts}</>;
}

// ─── Main Renderer ───────────────────────────────────────────────────────────

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const elements: React.ReactNode[] = [];
    const lines = content.split("\n");
    let i = 0;
    let elementKey = 0;

    const k = () => elementKey++;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // ── Skip pure badge lines ──────────────────────────────────────────────
        if (/^(\[!\[.*?\]\(https?:\/\/[^)]*\)\]\(.*?\)\s*)+$/.test(trimmed)) {
            i++; continue;
        }

        // ── Fenced code blocks ─────────────────────────────────────────────────
        if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
            const fence = trimmed.startsWith("```") ? "```" : "~~~";
            const lang = trimmed.slice(fence.length).trim() || "bash";
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith(fence)) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // skip closing fence
            const code = codeLines.join("\n").trim();
            if (code) {
                elements.push(
                    <div key={k()} className="my-4 overflow-hidden rounded-xl border border-slate-700/50 bg-[#0d1117]">
                        <div className="flex items-center gap-2 border-b border-slate-700/40 bg-slate-900/60 px-4 py-2.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                            <span className="ml-2 font-mono text-xs text-slate-500">{lang}</span>
                        </div>
                        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-emerald-300/90 font-mono whitespace-pre">
                            <code>{code}</code>
                        </pre>
                    </div>
                );
            }
            continue;
        }

        // ── Headings ────────────────────────────────────────────────────────────
        const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            // Remove emoji prefix for cleaner display
            const headingText = headingMatch[2].replace(/^[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}]\s*/u, "").trim();

            if (level === 1) {
                // Skip h1 (usually the project title, already shown in hero)
                i++; continue;
            } else if (level === 2) {
                elements.push(
                    <div key={k()} className="mt-8 mb-4 flex items-center gap-3">
                        <div className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500 flex-shrink-0" />
                        <h2 className="font-rajdhani text-lg font-bold text-white tracking-wide">{renderInline(headingText)}</h2>
                    </div>
                );
            } else if (level === 3) {
                elements.push(
                    <h3 key={k()} className="mt-5 mb-2 font-rajdhani text-base font-semibold text-cyan-300/80">
                        {renderInline(headingText)}
                    </h3>
                );
            } else {
                elements.push(
                    <h4 key={k()} className="mt-4 mb-1 font-rajdhani text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        {renderInline(headingText)}
                    </h4>
                );
            }
            i++; continue;
        }

        // ── Horizontal rule ─────────────────────────────────────────────────────
        if (/^[-*_]{3,}$/.test(trimmed)) {
            elements.push(<hr key={k()} className="my-6 border-slate-800/60" />);
            i++; continue;
        }

        // ── Bullet / numbered lists ─────────────────────────────────────────────
        const isBullet = /^[-*+]\s+/.test(trimmed);
        const isNumbered = /^\d+\.\s+/.test(trimmed);
        if (isBullet || isNumbered) {
            const items: React.ReactNode[] = [];
            while (i < lines.length) {
                const t = lines[i].trim();
                const bm = t.match(/^[-*+]\s+(.+)|^\d+\.\s+(.+)/);
                if (!bm) break;
                items.push(bm[1] ?? bm[2]);
                i++;
            }
            elements.push(
                <ul key={k()} className="my-3 space-y-2">
                    {items.map((item, ji) => (
                        <li key={ji} className="flex items-start gap-3">
                            <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                            <span className="font-cairo text-sm leading-relaxed text-slate-400">{renderInline(String(item))}</span>
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // ── Block quote ─────────────────────────────────────────────────────────
        if (trimmed.startsWith(">")) {
            const quoteLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith(">")) {
                quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
                i++;
            }
            elements.push(
                <blockquote key={k()} className="my-3 border-l-2 border-cyan-500/40 pl-4 font-cairo text-sm italic text-slate-500">
                    {quoteLines.join(" ")}
                </blockquote>
            );
            continue;
        }

        // ── Empty line ──────────────────────────────────────────────────────────
        if (!trimmed) { i++; continue; }

        // ── Paragraph ──────────────────────────────────────────────────────────
        const paraLines: string[] = [];
        while (i < lines.length) {
            const t = lines[i].trim();
            if (!t) break;
            if (/^#{1,4}\s/.test(t)) break;
            if (/^[-*+]\s/.test(t) || /^\d+\.\s/.test(t)) break;
            if (/^[-*_]{3,}$/.test(t)) break;
            if (t.startsWith("```") || t.startsWith("~~~")) break;
            if (t.startsWith(">")) break;
            paraLines.push(t);
            i++;
        }
        if (paraLines.length > 0) {
            elements.push(
                <p key={k()} className="my-3 font-cairo text-sm leading-[1.9] text-slate-400">
                    {renderInline(paraLines.join(" "))}
                </p>
            );
        }
    }

    return <div className="markdown-prose">{elements}</div>;
}
