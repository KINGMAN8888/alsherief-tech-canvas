import { describe, it, expect, vi, beforeEach } from 'vitest';
import cache, { CACHE_KEYS } from '../lib/cache';

describe('NodeCache module', () => {
    beforeEach(() => {
        cache.flushAll();
    });

    it('stores and retrieves a value', () => {
        cache.set(CACHE_KEYS.projects, [{ id: '1', title: 'P1' }]);
        const value = cache.get(CACHE_KEYS.projects);
        expect(value).toEqual([{ id: '1', title: 'P1' }]);
    });

    it('returns undefined for missing key', () => {
        expect(cache.get(CACHE_KEYS.skills)).toBeUndefined();
    });

    it('deletes a key', () => {
        cache.set(CACHE_KEYS.profile, { name: 'Youssef' });
        cache.del(CACHE_KEYS.profile);
        expect(cache.get(CACHE_KEYS.profile)).toBeUndefined();
    });

    it('flushes all keys', () => {
        cache.set(CACHE_KEYS.projects, []);
        cache.set(CACHE_KEYS.skills, []);
        cache.flushAll();
        expect(cache.get(CACHE_KEYS.projects)).toBeUndefined();
        expect(cache.get(CACHE_KEYS.skills)).toBeUndefined();
    });

    it('all CACHE_KEYS are unique strings', () => {
        const keys = Object.values(CACHE_KEYS);
        const unique = new Set(keys);
        expect(unique.size).toBe(keys.length);
    });
});
