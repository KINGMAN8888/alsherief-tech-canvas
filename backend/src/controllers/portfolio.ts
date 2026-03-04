import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import logger from '../lib/logger';
import cache, { CACHE_KEYS } from '../lib/cache';
import { parseReadme } from '../lib/readmeParser';

// ── Public Fetchers ───────────────────────────────────────────────────────────

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(projects);
    } catch (error) { next(error); }
};

export const getSkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skills = await prisma.skill.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(skills);
    } catch (error) { next(error); }
};

export const getCertifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const certs = await prisma.certification.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(certs);
    } catch (error) { next(error); }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await prisma.profile.findFirst();
        res.json(profile ? [profile] : []);
    } catch (error) { next(error); }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(messages);
    } catch (error) { next(error); }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = await prisma.contactMessage.create({ data: req.body });
        logger.info('New contact message received', { email: req.body.email });
        res.status(201).json(message);
    } catch (error) { next(error); }
};

// ── Generic CRUD Generator for Admin (with cache invalidation) ────────────────

const handleCreate =
    (model: any, cacheKey?: string) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const item = await model.create({ data: req.body });
                if (cacheKey) cache.del(cacheKey);
                res.status(201).json(item);
            } catch (err) { next(err); }
        };

const handleUpdate =
    (model: any, cacheKey?: string) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const item = await model.update({ where: { id: req.params.id }, data: req.body });
                if (cacheKey) cache.del(cacheKey);
                res.json(item);
            } catch (err) { next(err); }
        };

const handleDelete =
    (model: any, cacheKey?: string) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await model.delete({ where: { id: req.params.id } });
                if (cacheKey) cache.del(cacheKey);
                res.json({ success: true });
            } catch (err) { next(err); }
        };

// ── Admin Controllers ─────────────────────────────────────────────────────────

export const createProject = handleCreate(prisma.project, CACHE_KEYS.projects);
export const updateProject = handleUpdate(prisma.project, CACHE_KEYS.projects);
export const deleteProject = handleDelete(prisma.project, CACHE_KEYS.projects);

export const createSkill = handleCreate(prisma.skill, CACHE_KEYS.skills);
export const updateSkill = handleUpdate(prisma.skill, CACHE_KEYS.skills);
export const deleteSkill = handleDelete(prisma.skill, CACHE_KEYS.skills);

export const createCertification = handleCreate(prisma.certification, CACHE_KEYS.certifications);
export const updateCertification = handleUpdate(prisma.certification, CACHE_KEYS.certifications);
export const deleteCertification = handleDelete(prisma.certification, CACHE_KEYS.certifications);

export const updateMessage = handleUpdate(prisma.contactMessage);
export const deleteMessage = handleDelete(prisma.contactMessage);

// Profile (upsert — single record id="main") ──────────────────────────────────
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const profile = await prisma.profile.upsert({
            where: { id: 'main' },
            create: { ...data, id: 'main' },
            update: data,
        });
        cache.del(CACHE_KEYS.profile);
        res.json(profile);
    } catch (err) { next(err); }
};

// Blog ─────────────────────────────────────────────────────────────────────────

export const getBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true } } },
        });
        res.json(posts);
    } catch (error) { next(error); }
};

export const getBlogPostsAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true, id: true } } },
        });
        res.json(posts);
    } catch (error) { next(error); }
};

export const createBlogPost = handleCreate(prisma.blogPost, CACHE_KEYS.blog);
export const updateBlogPost = handleUpdate(prisma.blogPost, CACHE_KEYS.blog);
export const deleteBlogPost = handleDelete(prisma.blogPost, CACHE_KEYS.blog);

// ── GitHub Smart Fetcher ──────────────────────────────────────────────────────
// Fetches repo metadata, languages, and README, parses README into structured
// sections (overview, features, challenges, tech details), and returns everything.

export const fetchGithubRepo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { url } = req.body;
        if (!url) { res.status(400).json({ error: 'GitHub URL is required' }); return; }

        const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
        if (!match) { res.status(400).json({ error: 'Invalid GitHub URL format' }); return; }

        const [, owner, repo] = match;
        const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
        if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

        // 1. Repo metadata
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (!repoRes.ok) {
            res.status(repoRes.status).json({ error: 'Repository not found or inaccessible.' });
            return;
        }
        const repoData = await repoRes.json();

        // 2. Languages breakdown
        let techStack: string[] = repoData.topics || [];
        try {
            const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
            if (langRes.ok) {
                const langs = await langRes.json();
                if (techStack.length === 0) techStack = Object.keys(langs);
            }
        } catch { /* ignore */ }
        if (techStack.length === 0 && repoData.language) techStack = [repoData.language];

        // 3. README — fetch, decode from base64, and parse intelligently
        let readmeMarkdown = '';
        let parsedReadme = { overview: '', longDescription: '', features: [] as string[], challenges: '', techDetails: '' };
        try {
            const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
            if (readmeRes.ok) {
                const readmeData = await readmeRes.json();
                readmeMarkdown = Buffer.from(readmeData.content, 'base64').toString('utf-8');
                parsedReadme = parseReadme(readmeMarkdown);
            }
        } catch { /* no README, continue with basic info */ }

        // 4. Build a pretty title from the repo name (e.g. "my-cool-project" -> "My Cool Project")
        const prettyTitle = repoData.name
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c: string) => c.toUpperCase());

        res.json({
            // Identifiers
            name: repoData.name,
            slug: repoData.name,
            title: prettyTitle,
            // Descriptions
            description: repoData.description || parsedReadme.overview || '',
            longDescription: parsedReadme.longDescription || repoData.description || '',
            // Structured README sections (real headings, bullets, prose)
            sections: parsedReadme.sections,
            features: parsedReadme.features,
            challenges: parsedReadme.challenges,
            techDetails: parsedReadme.techDetails,
            readmeRaw: readmeMarkdown.slice(0, 50000),
            // Tech
            tech: techStack,
            language: repoData.language || '',
            // Links
            html_url: repoData.html_url,
            homepage: repoData.homepage || '',
            owner,
            repo,
            // GitHub stats
            stars: repoData.stargazers_count || 0,
            forks: repoData.forks_count || 0,
            // Preview image (GitHub's OG image)
            image: `https://opengraph.githubassets.com/1/${owner}/${repo}`,
        });
    } catch (error) { next(error); }
};
