import { Router } from "express";
import {
    getAbout, updateAbout,
    getServices, getService, createService, updateService, deleteService,
} from "../controllers/about.controller";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { cacheResponse } from "../middleware/cacheResponse";
import { CACHE_KEYS } from "../lib/cache";
import { updateAboutSchema, createServiceSchema, updateServiceSchema } from "../schemas/about.schemas";

const router = Router();

// ── Public routes (cached) ────────────────────────────────────────────────────
router.get("/",             cacheResponse(CACHE_KEYS.about),    getAbout);
router.get("/services",     cacheResponse(CACHE_KEYS.services), getServices);
router.get("/services/:id",                                     getService);

// ── Protected routes ───────────────────────────────────────────────────────────
router.put("/",               authenticateToken, validate(updateAboutSchema),   updateAbout);
router.post("/services",      authenticateToken, validate(createServiceSchema), createService);
router.put("/services/:id",   authenticateToken, validate(updateServiceSchema), updateService);
router.delete("/services/:id", authenticateToken,                               deleteService);

export default router;
