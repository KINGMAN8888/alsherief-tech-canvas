import express from 'express';
import {
    getProjects, getSkills, getCertifications, getProfile, getMessages, createMessage, getBlogPosts,
    getBlogPostsAdmin, createBlogPost, updateBlogPost, deleteBlogPost,
    createProject, updateProject, deleteProject,
    createSkill, updateSkill, deleteSkill,
    createCertification, updateCertification, deleteCertification,
    updateProfile,
    updateMessage, deleteMessage
} from '../controllers/portfolio';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { cacheResponse } from '../middleware/cacheResponse';
import { CACHE_KEYS } from '../lib/cache';
import {
    createMessageSchema,
    createProjectSchema, updateProjectSchema,
    createSkillSchema, updateSkillSchema,
    createCertificationSchema, updateCertificationSchema,
    createBlogPostSchema, updateBlogPostSchema,
    updateProfileSchema, updateMessageSchema,
} from '../schemas/portfolio.schemas';

const router = express.Router();

// ── Public Routes (cached 5 min) ──────────────────────────────────────────────
router.get('/projects',       cacheResponse(CACHE_KEYS.projects),       getProjects);
router.get('/skills',         cacheResponse(CACHE_KEYS.skills),         getSkills);
router.get('/certifications', cacheResponse(CACHE_KEYS.certifications), getCertifications);
router.get('/profile',        cacheResponse(CACHE_KEYS.profile),        getProfile);
router.get('/blog',           cacheResponse(CACHE_KEYS.blog),           getBlogPosts);
router.post('/messages',      validate(createMessageSchema),             createMessage);

// ── Admin: Projects ────────────────────────────────────────────────────────────
router.post('/projects',        authenticateToken, requireAdmin, validate(createProjectSchema),       createProject);
router.put('/projects/:id',     authenticateToken, requireAdmin, validate(updateProjectSchema),       updateProject);
router.delete('/projects/:id',  authenticateToken, requireAdmin,                                     deleteProject);

// ── Admin: Skills ──────────────────────────────────────────────────────────────
router.post('/skills',          authenticateToken, requireAdmin, validate(createSkillSchema),         createSkill);
router.put('/skills/:id',       authenticateToken, requireAdmin, validate(updateSkillSchema),         updateSkill);
router.delete('/skills/:id',    authenticateToken, requireAdmin,                                     deleteSkill);

// ── Admin: Certifications ──────────────────────────────────────────────────────
router.post('/certifications',       authenticateToken, requireAdmin, validate(createCertificationSchema), createCertification);
router.put('/certifications/:id',    authenticateToken, requireAdmin, validate(updateCertificationSchema), updateCertification);
router.delete('/certifications/:id', authenticateToken, requireAdmin,                                      deleteCertification);

// ── Admin: Profile ─────────────────────────────────────────────────────────────
router.put('/profile', authenticateToken, requireAdmin, validate(updateProfileSchema), updateProfile);

// ── Admin: Messages ────────────────────────────────────────────────────────────
router.get('/messages',         authenticateToken, requireAdmin,                               getMessages);
router.put('/messages/:id',     authenticateToken, requireAdmin, validate(updateMessageSchema), updateMessage);
router.delete('/messages/:id',  authenticateToken, requireAdmin,                               deleteMessage);

// ── Admin: Blog ────────────────────────────────────────────────────────────────
router.get('/blog/admin',    authenticateToken, requireAdmin,                             getBlogPostsAdmin);
router.post('/blog',         authenticateToken, requireAdmin, validate(createBlogPostSchema), createBlogPost);
router.put('/blog/:id',      authenticateToken, requireAdmin, validate(updateBlogPostSchema), updateBlogPost);
router.delete('/blog/:id',   authenticateToken, requireAdmin,                             deleteBlogPost);

export default router;
