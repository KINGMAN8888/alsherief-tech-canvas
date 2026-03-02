import { Request, Response, NextFunction } from 'express';
import cache, { CacheKey } from '../lib/cache';
import logger from '../lib/logger';

/**
 * Express middleware factory: serves GET responses from cache.
 * On a cache miss it intercepts res.json() to store the result before sending.
 *
 * Usage:
 *   router.get('/projects', cacheResponse(CACHE_KEYS.projects), getProjects);
 */
export const cacheResponse =
    (key: CacheKey) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const cached = cache.get(key);

        if (cached !== undefined) {
            logger.debug(`Cache HIT: ${key}`);
            res.json(cached);
            return;
        }

        logger.debug(`Cache MISS: ${key}`);

        // Monkey-patch res.json to intercept the response and store it
        const originalJson = res.json.bind(res);
        res.json = (body: unknown) => {
            if (res.statusCode === 200) {
                cache.set(key, body);
            }
            return originalJson(body);
        };

        next();
    };
