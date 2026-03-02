import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';

// Mock the cache module
vi.mock('../lib/cache', () => ({
    default: {
        get: vi.fn(),
        set: vi.fn(),
        del: vi.fn(),
    },
    CACHE_KEYS: {
        projects: 'portfolio:projects',
        skills: 'portfolio:skills',
    },
}));

import cache from '../lib/cache';
import { validate } from '../middleware/validate';
import { globalErrorHandler } from '../middleware/errorHandler';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// ── validate middleware ───────────────────────────────────────────────────────

const testSchema = z.object({
    name: z.string({ error: 'Name required' }).min(2, 'Too short'),
    email: z.string({ error: 'Email required' }).email('Invalid email'),
});

const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res as Response;
};

const mockReq = (body: object): Partial<Request> => ({
    body,
    path: '/test',
    method: 'POST',
});

describe('validate middleware', () => {
    it('calls next() when body is valid', () => {
        const req = mockReq({ name: 'Youssef', email: 'y@test.com' });
        const res = mockRes();
        const next = vi.fn();

        validate(testSchema)(req as Request, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith(); // no error argument
        expect(res.status).not.toHaveBeenCalled();
    });

    it('returns 400 with field-level errors on invalid body', () => {
        const req = mockReq({ name: 'A', email: 'bad' });
        const res = mockRes();
        const next = vi.fn();

        validate(testSchema)(req as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: 'Validation failed',
                details: expect.arrayContaining([
                    expect.objectContaining({ field: 'name' }),
                    expect.objectContaining({ field: 'email' }),
                ]),
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('replaces req.body with parsed (coerced) data', () => {
        const req = mockReq({ name: 'Youssef', email: 'y@test.com', extra: 'stripped' });
        const res = mockRes();
        const next = vi.fn();

        validate(testSchema)(req as Request, res, next);

        // Zod strips unknown keys by default
        expect((req as Request).body).not.toHaveProperty('extra');
        expect((req as Request).body).toMatchObject({ name: 'Youssef', email: 'y@test.com' });
    });

    it('returns 400 when body is empty', () => {
        const req = mockReq({});
        const res = mockRes();
        const next = vi.fn();

        validate(testSchema)(req as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});

// ── globalErrorHandler middleware ─────────────────────────────────────────────

describe('globalErrorHandler', () => {
    const next: NextFunction = vi.fn();

    it('returns 409 for Prisma P2002 (unique constraint)', () => {
        const prismaErr = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002',
            clientVersion: '6.0',
            meta: { target: ['slug'] },
        });

        const req = mockReq({});
        const res = mockRes();

        globalErrorHandler(prismaErr, req as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: expect.stringContaining('slug') })
        );
    });

    it('returns 404 for Prisma P2025 (record not found)', () => {
        const prismaErr = new Prisma.PrismaClientKnownRequestError('Record not found', {
            code: 'P2025',
            clientVersion: '6.0',
        });

        const req = mockReq({});
        const res = mockRes();

        globalErrorHandler(prismaErr, req as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns 500 for generic Error in development', () => {
        process.env.NODE_ENV = 'development';
        const err = new Error('Something exploded');

        const req = mockReq({});
        const res = mockRes();

        globalErrorHandler(err, req as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: 'Something exploded' })
        );
    });

    it('hides error message in production', () => {
        process.env.NODE_ENV = 'production';
        const err = new Error('DB password exposed');

        const req = mockReq({});
        const res = mockRes();

        globalErrorHandler(err, req as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred.' });
        process.env.NODE_ENV = 'development';
    });
});
