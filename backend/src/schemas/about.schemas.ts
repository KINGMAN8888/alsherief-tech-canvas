import { z } from 'zod';

// ─── About Section ────────────────────────────────────────────────────────────

export const updateAboutSchema = z.object({
    bio1: z.string().optional(),
    bio1Ar: z.string().optional(),
    bio2: z.string().optional(),
    bio2Ar: z.string().optional(),
    bio3: z.string().optional(),
    bio3Ar: z.string().optional(),
    bio4: z.string().optional(),
    bio4Ar: z.string().optional(),
    servicesLabel: z.string().optional(),
    servicesLabelAr: z.string().optional(),
    servicesDesc: z.string().optional(),
    servicesDescAr: z.string().optional(),
});

// ─── Service ──────────────────────────────────────────────────────────────────

export const createServiceSchema = z.object({
    title: z.string({ error: 'Title is required' }).min(1),
    titleAr: z.string().optional(),
    badge: z.string().optional(),
    badgeAr: z.string().optional(),
    description: z.string({ error: 'Description is required' }).min(1),
    descriptionAr: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    glow: z.string().optional(),
    borderHover: z.string().optional(),
    order: z.number().int().nonnegative().optional().default(0),
});

export const updateServiceSchema = createServiceSchema.partial();

export type UpdateAboutInput = z.infer<typeof updateAboutSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
