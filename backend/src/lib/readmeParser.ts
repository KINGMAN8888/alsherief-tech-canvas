// Smart README parser — extracts ALL sections with their real headings.
// Returns structured data for dynamic rendering.

export interface ReadmeSection {
    heading: string;     // The actual heading text from the README
    level: number;       // Heading level (1, 2, 3)
    content: string;     // Raw markdown content
    bullets: string[];   // Extracted bullet points (if any)
    prose: string;       // Cleaned prose text
    isBulletList: boolean;
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

// Strip markdown syntax to get clean readable text
function stripMarkdown(text: string): string {
    return text
        .replace(/!\[.*?\]\(.*?\)/g, '')          // remove images
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')    // links → text
        .replace(/`{3}[\s\S]*?`{3}/gm, '')        // code blocks
        .replace(/`([^`]+)`/g, '$1')              // inline code
        .replace(/^#{1,6}\s*/gm, '')              // headings
        .replace(/\*{2}([^*]+)\*{2}/g, '$1')      // bold
        .replace(/\*([^*]+)\*/g, '$1')            // italic
        .replace(/_{2}([^_]+)_{2}/g, '$1')        // bold underscore
        .replace(/_([^_]+)_/g, '$1')              // italic underscore
        .replace(/^\s*>\s*/gm, '')                // blockquotes
        .replace(/\[x\]|\[ \]/gi, '')             // checkboxes
        .replace(/<!--[\s\S]*?-->/g, '')          // HTML comments
        .replace(/<[^>]+>/g, '')                  // HTML tags
        // Remove badges (shield.io patterns)
        .replace(/\[!\[.*?\]\(https?:\/\/.*?badge.*?\)\]\(.*?\)/gi, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// Extract bullet points from markdown content
function extractBullets(text: string): string[] {
    const bullets: string[] = [];
    const lines = text.split('\n');
    for (const line of lines) {
        const match = line.trim().match(/^[-*+]\s+(.+)|^\d+\.\s+(.+)/);
        if (match) {
            let bullet = (match[1] || match[2])
                .replace(/\*{2}([^*]+)\*{2}/g, '$1')
                .replace(/\*([^*]+)\*/g, '$1')
                .replace(/`([^`]+)`/g, '$1')
                .trim();
            if (bullet.length > 5) bullets.push(bullet);
        }
    }
    return bullets;
}

// Extract clean prose paragraphs (exclude bullets and headings)
function extractProse(text: string): string {
    const lines = text.split('\n');
    const paras: string[] = [];
    let current = '';

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.match(/^[-*+]\s/) || trimmed.match(/^\d+\.\s/) || trimmed.startsWith('#')) {
            if (current) { paras.push(current.trim()); current = ''; }
            continue;
        }
        current += (current ? ' ' : '') + trimmed;
    }
    if (current) paras.push(current.trim());

    return stripMarkdown(paras.filter(p => p.length > 10).join('\n\n')).slice(0, 1500);
}

// Sections to SKIP (installation, license, badge-only sections, etc.)
const SKIP_PATTERNS = /^(installation|getting.started|license|contributing|changelog|credits|acknowledgment|badge|copyright|contact|author|prerequisit|how.to.run|setup|clone|npm|yarn|docker.compose)/i;

// Sections we consider "intro" (no heading or top-level title)
const INTRO_PATTERNS = /^(overview|about|introduction|intro|description|summary|what.+is|project)/i;

export function parseReadme(markdown: string): ParsedReadme {
    if (!markdown.trim()) {
        return { sections: [], overview: '', longDescription: '', features: [], challenges: '', techDetails: '' };
    }

    // Remove leading badges / shields block before any real content
    const cleanedMarkdown = markdown
        .replace(/(?:!\[.*?\]\(https?:\/\/[^\)]*\)\s*)+\n*/g, '')
        .replace(/<!--[\s\S]*?-->/g, '');

    const lines = cleanedMarkdown.split('\n');
    const rawSections: Array<{ heading: string; level: number; lines: string[] }> = [];
    let currentHeading = '';
    let currentLevel = 0;
    let currentLines: string[] = [];

    for (const line of lines) {
        const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
        if (headingMatch) {
            if (currentLines.join('').trim()) {
                rawSections.push({ heading: currentHeading, level: currentLevel, lines: currentLines });
            }
            currentHeading = headingMatch[2].trim().replace(/[`*_]/g, '');
            currentLevel = headingMatch[1].length;
            currentLines = [];
        } else {
            currentLines.push(line);
        }
    }
    if (currentLines.join('').trim()) {
        rawSections.push({ heading: currentHeading, level: currentLevel, lines: currentLines });
    }

    const sections: ReadmeSection[] = [];
    let overview = '';
    let longDescription = '';
    let features: string[] = [];
    let challenges = '';
    let techDetails = '';

    for (const raw of rawSections) {
        const content = raw.lines.join('\n').trim();
        if (!content) continue;

        const headingLower = raw.heading.toLowerCase();

        // Skip noise sections
        if (raw.heading && SKIP_PATTERNS.test(headingLower)) continue;

        // Skip very short sections (< 30 chars of real content)
        const stripped = stripMarkdown(content);
        if (stripped.length < 20 && raw.heading) continue;

        const bullets = extractBullets(content);
        const prose = extractProse(content);
        const isBulletList = bullets.length >= 2;

        const section: ReadmeSection = {
            heading: raw.heading || '',
            level: raw.level,
            content,
            bullets,
            prose,
            isBulletList,
        };

        // Fill convenience fields
        if (!raw.heading || INTRO_PATTERNS.test(headingLower)) {
            if (!longDescription) longDescription = prose;
            if (!overview) overview = prose.split('\n')[0].slice(0, 500);
        }

        if (/feature|highlight|capabilit|what.+offer|what.+do|function/i.test(headingLower)) {
            if (features.length === 0) features = isBulletList ? bullets : prose.split('. ').filter(s => s.length > 20);
        }
        if (/challenge|problem|difficult|issue|limitation/i.test(headingLower)) {
            if (!challenges) challenges = prose;
        }
        if (/tech|stack|built.with|architect|tool|framework|technology/i.test(headingLower)) {
            if (!techDetails) techDetails = isBulletList ? bullets.join(' · ') : prose;
        }

        sections.push(section);
    }

    return { sections, overview, longDescription, features, challenges, techDetails };
}
