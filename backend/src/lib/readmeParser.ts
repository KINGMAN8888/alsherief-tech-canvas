// Smart README parser: splits markdown into structured sections
// and extracts overview, features, challenges, and tech details.

interface ParsedReadme {
    overview: string;
    longDescription: string;
    features: string[];
    challenges: string;
    techDetails: string;
}

// Keywords to match section headings (case-insensitive)
const FEATURE_PATTERNS = /feature|what|functionality|highlights|capabilities|includes|offers|what.+do/i;
const CHALLENGE_PATTERNS = /challenge|issue|difficulty|problem|limitation|known.bug|todo|roadmap/i;
const TECH_PATTERNS = /tech|stack|built.with|architecture|dependencies|prerequisit|requirement|technology|framework|installation|setup|getting.started|how.+work/i;
const OVERVIEW_PATTERNS = /overview|about|introduction|intro|description|summary|what.+is/i;

function stripMarkdown(text: string): string {
    return text
        .replace(/!\[.*?\]\(.*?\)/g, '')       // remove images
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')  // replace links with text
        .replace(/`{1,3}[^`]*`{1,3}/g, '')      // remove inline code
        .replace(/^#{1,6}\s*/gm, '')             // remove headings
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')// bold/italic
        .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')  // underscore bold/italic
        .replace(/^\s*[-*+]\s*/gm, '• ')        // normalize bullet points
        .replace(/^\s*\d+\.\s*/gm, '• ')        // normalize numbered lists
        .replace(/^\s*>\s*/gm, '')               // remove blockquotes
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function extractBullets(text: string): string[] {
    const lines = text.split('\n');
    const bullets: string[] = [];
    for (const line of lines) {
        const trimmed = line.trim();
        // Match markdown list items (-, *, +, 1.)
        const match = trimmed.match(/^[-*+]\s+(.+)|^\d+\.\s+(.+)/);
        if (match) {
            const bullet = (match[1] || match[2]).replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1').trim();
            if (bullet.length > 10) {
                bullets.push(bullet);
            }
        }
    }
    return bullets;
}

function sectionsToProse(sectionContent: string): string {
    // Extract paragraphs from a section (non-bullet-list lines)
    const lines = sectionContent.split('\n');
    const paragraphs: string[] = [];
    let current = '';

    for (const line of lines) {
        const trimmed = line.trim();
        // Skip bullet points and headers
        if (trimmed.match(/^[-*+]\s/) || trimmed.match(/^\d+\.\s/) || trimmed.startsWith('#')) {
            if (current) { paragraphs.push(current.trim()); current = ''; }
            continue;
        }
        if (trimmed === '') {
            if (current) { paragraphs.push(current.trim()); current = ''; }
        } else {
            current += (current ? ' ' : '') + trimmed;
        }
    }
    if (current) paragraphs.push(current.trim());

    return paragraphs.filter(p => p.length > 20).join('\n\n');
}

export function parseReadme(markdown: string): ParsedReadme {
    // Split by level 2 headings (## Heading)
    const sectionRegex = /^#{1,3}\s+(.+)$/gm;
    const sections: Array<{ heading: string; content: string }> = [];

    let lastIndex = 0;
    let lastHeading = '__intro__';
    let match;

    const lines = markdown.split('\n');
    let currentHeading = '__intro__';
    let currentLines: string[] = [];

    for (const line of lines) {
        const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
        if (headingMatch) {
            sections.push({ heading: currentHeading, content: currentLines.join('\n') });
            currentHeading = headingMatch[1].trim();
            currentLines = [];
        } else {
            currentLines.push(line);
        }
    }
    sections.push({ heading: currentHeading, content: currentLines.join('\n') });

    const result: ParsedReadme = {
        overview: '',
        longDescription: '',
        features: [],
        challenges: '',
        techDetails: '',
    };

    for (const section of sections) {
        const heading = section.heading.toLowerCase();
        const content = section.content.trim();
        if (!content) continue;

        if (section.heading === '__intro__' || OVERVIEW_PATTERNS.test(heading)) {
            // Intro section: first paragraphs before any heading
            const prose = sectionsToProse(content);
            if (prose && !result.longDescription) {
                result.longDescription = stripMarkdown(prose).slice(0, 2000);
            }
            // Short overview: first sentence or paragraph
            if (!result.overview) {
                const firstParagraph = prose.split('\n')[0] || '';
                result.overview = stripMarkdown(firstParagraph).slice(0, 500);
            }
        }

        if (FEATURE_PATTERNS.test(heading)) {
            const bullets = extractBullets(content);
            if (bullets.length > 0) {
                result.features = [...result.features, ...bullets].slice(0, 15);
            } else {
                // Try to extract sentences as features
                const prose = sectionsToProse(content);
                const sentences = prose.split('. ').filter(s => s.length > 20).slice(0, 6);
                result.features = [...result.features, ...sentences].slice(0, 15);
            }
        }

        if (CHALLENGE_PATTERNS.test(heading)) {
            const prose = sectionsToProse(content);
            if (prose && !result.challenges) {
                result.challenges = stripMarkdown(prose).slice(0, 1500);
            }
        }

        if (TECH_PATTERNS.test(heading)) {
            const bullets = extractBullets(content);
            const prose = sectionsToProse(content);
            const combined = [
                prose ? stripMarkdown(prose).slice(0, 800) : '',
                bullets.length > 0 ? bullets.join(' · ') : '',
            ].filter(Boolean).join('\n\n');
            if (combined && !result.techDetails) {
                result.techDetails = combined.slice(0, 1500);
            }
        }
    }

    return result;
}
