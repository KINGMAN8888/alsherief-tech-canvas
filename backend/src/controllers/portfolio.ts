import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import logger from '../lib/logger';
import cache, { CACHE_KEYS } from '../lib/cache';

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

// GitHub Fetcher ───────────────────────────────────────────────────────────────

export const fetchGithubRepo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { url } = req.body;
        if (!url) {
            res.status(400).json({ error: 'GitHub URL is required' });
            return;
        }

        const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
        if (!match) {
            res.status(400).json({ error: 'Invalid GitHub URL format' });
            return;
        }

        const [, owner, repo] = match;
        const fetchOptions: RequestInit = {
            headers: { Accept: "application/vnd.github+json" },
        };

        // Use token if available to access private repos
        if (process.env.GITHUB_TOKEN) {
            fetchOptions.headers = {
                ...fetchOptions.headers,
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            };
        }

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, fetchOptions);

        if (!response.ok) {
            res.status(response.status).json({ error: 'Failed to fetch repository. May be private without a token.' });
            return;
        }

        const data = await response.json();
        res.json({
            name: data.name,
            description: data.description || "",
            html_url: data.html_url,
            homepage: data.homepage,
            owner: owner,
            repo: repo,
            topics: data.topics || [],
            language: data.language
        });
    } catch (error) { next(error); }
};

