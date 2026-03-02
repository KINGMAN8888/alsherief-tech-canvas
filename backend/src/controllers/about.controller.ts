import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import logger from "../lib/logger";
import cache, { CACHE_KEYS } from "../lib/cache";

// --- About Section ---
export const getAbout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const about = await prisma.about.findUnique({ where: { id: "main" } });
        if (!about) {
            const newAbout = await prisma.about.create({ data: { id: "main" } });
            res.json(newAbout);
            return;
        }
        res.json(about);
    } catch (error) {
        next(error);
    }
};

export const updateAbout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await prisma.about.upsert({
            where: { id: "main" },
            update: req.body,
            create: { id: "main", ...req.body },
        });
        cache.del(CACHE_KEYS.about);
        logger.info("About section updated");
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

// --- Services ---
export const getServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
        res.json(services);
    } catch (error) {
        next(error);
    }
};

export const getService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const service = await prisma.service.findUnique({ where: { id: req.params.id } });
        if (!service) {
            res.status(404).json({ error: "Service not found" });
            return;
        }
        res.json(service);
    } catch (error) {
        next(error);
    }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const service = await prisma.service.create({ data: req.body });
        cache.del(CACHE_KEYS.services);
        logger.info("Service created", { id: service.id });
        res.status(201).json(service);
    } catch (error) {
        next(error);
    }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const service = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
        cache.del(CACHE_KEYS.services);
        res.json(service);
    } catch (error) {
        next(error);
    }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.service.delete({ where: { id: req.params.id } });
        cache.del(CACHE_KEYS.services);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
