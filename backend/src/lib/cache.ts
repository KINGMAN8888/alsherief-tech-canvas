import NodeCache from 'node-cache';

const cacheTtlSeconds = Number(process.env.CACHE_TTL_SECONDS ?? 300);
const cacheCheckPeriodSeconds = Number(process.env.CACHE_CHECK_PERIOD_SECONDS ?? 60);

/**
 * Application-wide in-memory cache.
 * TTL: 5 minutes — suitable for portfolio public data that rarely changes.
 * checkperiod: every 60 s removes expired keys automatically.
 */
const cache = new NodeCache({
    stdTTL: Number.isFinite(cacheTtlSeconds) ? cacheTtlSeconds : 300,
    checkperiod: Number.isFinite(cacheCheckPeriodSeconds) ? cacheCheckPeriodSeconds : 60,
    useClones: false,
});

export default cache;

/** Canonical cache key constants — keeps keys consistent across producers & consumers */
export const CACHE_KEYS = {
    projects:       'portfolio:projects',
    skills:         'portfolio:skills',
    certifications: 'portfolio:certifications',
    profile:        'portfolio:profile',
    blog:           'portfolio:blog',
    about:          'about:main',
    services:       'about:services',
} as const;

export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];
