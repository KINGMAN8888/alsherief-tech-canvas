// Smart README parser — extracts ALL sections with their REAL headings.
// Returns structured data for fully dynamic rendering on the project detail page.

export interface ReadmeSection {
    heading: string;       // Actual heading from README
    level: number;         // Heading depth (1, 2, 3, 4)
    content: string;       // Original markdown content of the section
    bullets: string[];     // Extracted bullet points
    prose: string;         // Cleaned prose text (no bullets, no code blocks)
    codeBlocks: string[];  // Extracted code blocks (preserved for rendering)
    isBulletList: boolean; // True when the section is primarily bullets
    isEmpty: boolean;      // True if nothing renderable was found
}

export interface ParsedReadme {
    sections: ReadmeSection[];
    // Convenience fields for backward compat
    overview: string;
    longDescription: string;
    features: string[];
    challenges: string;
    techDetails: string;
}

// ─── Markdown stripping (prose only) ────────────────────────────────────────

function stripMarkdown(text: string): string {
    return text
        .replace(/!\[.*?\]\(.*?\)/g, '')           // images
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')     // links → text
        .replace(/`([^`]+)`/g, '$1')               // inline code
        .replace(/^#{1,6}\s*/gm, '')               // headings
        .replace(/\*{2}([^*]+)\*{2}/g, '$1')       // bold
        .replace(/\*([^*]+)\*/g, '$1')             // italic
        .replace(/_{2}([^_]+)_{2}/g, '$1')         // bold underscore
        .replace(/_([^_]+)_/g, '$1')               // italic underscore
        .replace(/^\s*>\s*/gm, '')                 // blockquotes
        .replace(/\[x\]|\[ \]/gi, '')              // checkboxes
        .replace(/<!--[\s\S]*?-->/g, '')           // HTML comments
        .replace(/<[^>]+>/g, '')                   // HTML tags
        // Badges (shield.io, img.shields.io, etc.)
        .replace(/\[!\[.*?\]\(https?:\/\/[^)]*\)\]\(.*?\)/gi, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// ─── Extract code blocks from text ──────────────────────────────────────────

function extractCodeBlocks(text: string): { cleaned: string; blocks: string[] } {
    const blocks: string[] = [];
    // Match fenced code blocks (``` or ~~~)
    const cleaned = text.replace(/`{3,}([a-z]*)\n?([\s\S]*?)`{3,}/g, (_, lang, code) => {
        const trimmed = code.trim();
        if (trimmed.length > 0) blocks.push(trimmed);
        return ''; // remove from prose
    }).replace(/~{3,}([a-z]*)\n?([\s\S]*?)~{3,}/g, (_, lang, code) => {
        const trimmed = code.trim();
        if (trimmed.length > 0) blocks.push(trimmed);
        return '';
    });
    return { cleaned, blocks };
}

// ─── Extract bullet points ───────────────────────────────────────────────────

function extractBullets(text: string): string[] {
    const bullets: string[] = [];
    for (const line of text.split('\n')) {
        const m = line.trim().match(/^[-*+]\s+(.+)|^\d+\.\s+(.+)/);
        if (m) {
            const bullet = (m[1] || m[2])
                .replace(/\*{2}([^*]+)\*{2}/g, '$1')
                .replace(/\*([^*]+)\*/g, '$1')
                .replace(/`([^`]+)`/g, '$1')
                .trim();
            if (bullet.length > 4) bullets.push(bullet);
        }
    }
    return bullets;
}

// ─── Extract prose paragraphs (non-bullet, non-heading lines) ───────────────

function extractProse(text: string): string {
    const paras: string[] = [];
    let cur = '';
    for (const line of text.split('\n')) {
        const t = line.trim();
        if (!t || t.match(/^[-*+]\s/) || t.match(/^\d+\.\s/) || t.startsWith('#')) {
            if (cur) { paras.push(cur.trim()); cur = ''; }
            continue;
        }
        cur += (cur ? ' ' : '') + t;
    }
    if (cur) paras.push(cur.trim());
    return stripMarkdown(paras.filter(p => p.length > 8).join('\n\n')).slice(0, 2000);
}

// ─── Intro detection ─────────────────────────────────────────────────────────

const INTRO_PATTERNS = /^(overview|about|introduction|intro|description|summary|what.+is|project|features|highlights)/i;

// ─── Main parser ─────────────────────────────────────────────────────────────

export function parseReadme(markdown: string): ParsedReadme {
    if (!markdown.trim()) {
        return { sections: [], overview: '', longDescription: '', features: [], challenges: '', techDetails: '' };
    }

    // Strip leading badge block before any real content
    const clean = markdown
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\n{3,}/g, '\n\n');

    // ── Split into sections by heading ────────────────────────────────────────
    const lines = clean.split('\n');
    const rawSections: Array<{ heading: string; level: number; lines: string[] }> = [];
    let curHeading = '';
    let curLevel = 0;
    let curLines: string[] = [];

    for (const line of lines) {
        const hm = line.match(/^(#{1,4})\s+(.+)$/);
        if (hm) {
            if (curLines.join('').trim()) {
                rawSections.push({ heading: curHeading, level: curLevel, lines: curLines });
            }
            curHeading = hm[2].trim()
                .replace(/[`*_]/g, '')              // strip inline markdown from heading
                .replace(/^[^\w\s]+\s*/, '');       // strip leading emoji/symbols
            curLevel = hm[1].length;
            curLines = [];
        } else {
            curLines.push(line);
        }
    }
    if (curLines.join('').trim()) {
        rawSections.push({ heading: curHeading, level: curLevel, lines: curLines });
    }

    // ── Process each section ─────────────────────────────────────────────────
    const sections: ReadmeSection[] = [];
    let overview = '';
    let longDescription = '';
    let features: string[] = [];
    let challenges = '';
    let techDetails = '';

    for (const raw of rawSections) {
        const rawContent = raw.lines.join('\n').trim();
        if (!rawContent && !raw.heading) continue;

        // Extract code blocks FIRST (before prose extraction)
        const { cleaned: noCodeContent, blocks: codeBlocks } = extractCodeBlocks(rawContent);

        const bullets = extractBullets(noCodeContent);
        const prose = extractProse(noCodeContent);
        const isBulletList = bullets.length >= 2 && bullets.length >= (prose.split('.').length - 1);

        // A section is empty only if there's truly nothing to show
        const isEmpty = bullets.length === 0 && prose.length < 10 && codeBlocks.length === 0;

        if (isEmpty && raw.heading === '') continue; // skip truly empty unnamed sections

        const section: ReadmeSection = {
            heading: raw.heading,
            level: raw.level,
            content: rawContent,
            bullets,
            prose,
            codeBlocks,
            isBulletList,
            isEmpty,
        };

        // ── Convenience field mapping ─────────────────────────────────────────
        const h = raw.heading.toLowerCase();

        if (!raw.heading || INTRO_PATTERNS.test(h)) {
            if (!longDescription) longDescription = prose;
            if (!overview && prose) overview = prose.split('\n')[0].slice(0, 500);
        }
        if (/feature|highlight|capabilit|what.+offer|what.+do|function/i.test(h)) {
            if (features.length === 0) features = isBulletList ? bullets : prose.split('. ').filter(s => s.length > 20);
        }
        if (/challenge|problem|difficult|issue|limitation/i.test(h)) {
            if (!challenges) challenges = prose;
        }
        if (/tech|stack|built.with|architect|tool|framework|technology/i.test(h)) {
            if (!techDetails) techDetails = isBulletList ? bullets.join(' · ') : prose;
        }

        sections.push(section);
    }

    // ── Merge sub-sections (level 3+) under their parent ─────────────────────
    // This way "## Tech Stack > ### Frontend > ### Backend" appear as one card
    const merged: ReadmeSection[] = [];
    for (const sec of sections) {
        if (sec.level >= 3 && merged.length > 0) {
            const parent = merged[merged.length - 1];
            // Append sub-section content to parent
            if (sec.heading && (sec.bullets.length > 0 || sec.prose.length > 0 || sec.codeBlocks.length > 0)) {
                // Add sub-heading as a bold label inside bullets/prose
                const subLabel = `**${sec.heading}**`;
                if (sec.isBulletList) {
                    parent.bullets.push(subLabel, ...sec.bullets);
                    parent.isBulletList = true;
                } else if (sec.prose.length > 10) {
                    parent.prose += `\n\n**${sec.heading}**\n${sec.prose}`;
                }
                parent.codeBlocks.push(...sec.codeBlocks);
                parent.isEmpty = false;
            }
        } else {
            merged.push(sec);
        }
    }

    return { sections: merged, overview, longDescription, features, challenges, techDetails };
}
