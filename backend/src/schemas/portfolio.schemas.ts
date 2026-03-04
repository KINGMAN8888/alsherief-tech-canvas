import { z } from 'zod';

// ─── Message (Contact Form) ───────────────────────────────────────────────────

export const createMessageSchema = z.object({
    name: z
        .string({ error: 'Name is required' })
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: z
        .string({ error: 'Email is required' })
        .email('Invalid email format'),
    phone: z.string().optional(),
    service: z.string().optional(),
    message: z
        .string({ error: 'Message is required' })
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message must not exceed 2000 characters'),
});

// ─── Project ─────────────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
    title: z.string().nullish(),
    titleAr: z.string().nullish(),
    slug: z
        .string({ error: 'Slug is required' })
        .min(1)
        .regex(/^[a-zA-Z0-9._-]+$/, 'Slug must be alphanumeric with hyphens, dots or underscores'),
    description: z.string().nullish(),
    descriptionAr: z.string().nullish(),
    longDescription: z.string().nullish(),
    features: z.array(z.string()).nullish(),
    sections: z.array(z.object({
        heading: z.string().nullish(),
        level: z.number().int().nullish(),
        content: z.string().nullish(),
        bullets: z.array(z.string()).nullish(),
        prose: z.string().nullish(),
        codeBlocks: z.array(z.string()).nullish(),
        isBulletList: z.boolean().nullish(),
        isEmpty: z.boolean().nullish(),
    })).nullish(),
    challenges: z.string().nullish(),
    techDetails: z.string().nullish(),
    readmeRaw: z.string().nullish(),
    language: z.string().nullish(),
    stars: z.number().int().nonnegative().nullish(),
    forks: z.number().int().nonnegative().nullish(),
    emoji: z.string().nullish(),
    tech: z.array(z.string()).nullish().default([]),
    link: z.string().url('Invalid URL').nullish().or(z.literal('')),
    github: z.string().url('Invalid GitHub URL').nullish().or(z.literal('')),
    image: z.string().nullish(),
    color: z.string().nullish(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ─── Skill ───────────────────────────────────────────────────────────────────

export const createSkillSchema = z.object({
    category: z.string({ error: 'Category is required' }).min(1),
    categoryAr: z.string().optional(),
    sub: z.string().optional(),
    subAr: z.string().optional(),
    items: z.array(z.string()).min(1, 'At least one skill item is required'),
});

export const updateSkillSchema = createSkillSchema.partial();

// ─── Certification ────────────────────────────────────────────────────────────

export const createCertificationSchema = z.object({
    title: z.string({ error: 'Title is required' }).min(1),
    titleAr: z.string().optional(),
    issuer: z.string({ error: 'Issuer is required' }).min(1),
    issuerAr: z.string().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
});

export const updateCertificationSchema = createCertificationSchema.partial();

// ─── GitHub Fetch ──────────────────────────────────────────────────────────────

export const githubFetchSchema = z.object({
    url: z.string({ error: 'URL is required' }).url('Invalid URL'),
});

// ─── Blog Post ────────────────────────────────────────────────────────────────

export const createBlogPostSchema = z.object({
    title: z.string({ error: 'Title is required' }).min(1),
    titleAr: z.string().optional(),
    slug: z
        .string({ error: 'Slug is required' })
        .min(1)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    excerpt: z.string().optional(),
    excerptAr: z.string().optional(),
    content: z.string({ error: 'Content is required' }).min(1),
    contentAr: z.string().optional(),
    imageUrl: z.string().optional(),
    category: z.string().optional(),
    readingTime: z.number().int().positive().optional(),
    color: z.string().optional(),
    published: z.boolean().optional().default(false),
    authorId: z.string().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

// ─── Profile ──────────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
    name: z.string().optional(),
    nameAr: z.string().optional(),
    headline: z.string().optional(),
    headlineAr: z.string().optional(),
    bio: z.string().optional(),
    bioAr: z.string().optional(),
    heroBio: z.string().optional(),
    heroBioAr: z.string().optional(),
    heroBioCyan: z.string().optional(),
    heroBioViolet: z.string().optional(),
    heroRoles: z.any().optional(),
    location: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    socialLinks: z.any().optional(),
    yearsExp: z.number().int().nonnegative().optional(),
    projectsCount: z.number().int().nonnegative().optional(),
    technologiesCount: z.number().int().nonnegative().optional(),
    countriesCount: z.number().int().nonnegative().optional(),
});

// ─── Message Update ───────────────────────────────────────────────────────────

export const updateMessageSchema = z.object({
    isRead: z.boolean().optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type CreateCertificationInput = z.infer<typeof createCertificationSchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
