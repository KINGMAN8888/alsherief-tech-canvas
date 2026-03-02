import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import cache from '../lib/cache';

const { mockPrisma } = vi.hoisted(() => ({
    mockPrisma: {
        user: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        project: {
            findMany: vi.fn(),
        },
    },
}));

vi.mock('../prisma', () => ({
    prisma: mockPrisma,
}));

import { app } from '../server';

const makeToken = () => jwt.sign({ id: 'user-1', role: 'admin' }, process.env.JWT_SECRET as string);

describe('Auth + Caching integration routes', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test_secret_key';
        vi.clearAllMocks();
        cache.flushAll();
    });

    it('updates account email without requiring current password', async () => {
        mockPrisma.user.findUnique
            .mockResolvedValueOnce({ id: 'user-1', email: 'admin@techcanvas.io', password: 'hashed' })
            .mockResolvedValueOnce(null);

        mockPrisma.user.update.mockResolvedValue({
            id: 'user-1',
            email: 'admin@youssefalsherief.tech',
            name: 'Admin',
            role: 'admin',
        });

        const token = makeToken();

        const response = await request(app)
            .put('/api/auth/account/email')
            .set('Authorization', `Bearer ${token}`)
            .send({
                newEmail: 'admin@youssefalsherief.tech',
                confirmEmail: 'admin@youssefalsherief.tech',
            });

        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe('admin@youssefalsherief.tech');
        expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
        expect(mockPrisma.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: { email: 'admin@youssefalsherief.tech' },
            })
        );
    });

    it('validates email-change payload and returns 400 for missing fields', async () => {
        const token = makeToken();

        const response = await request(app)
            .put('/api/auth/account/email')
            .set('Authorization', `Bearer ${token}`)
            .send({ newEmail: 'admin@youssefalsherief.tech' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'confirmEmail' }),
            ])
        );
    });

    it('serves /projects from cache on second request', async () => {
        mockPrisma.project.findMany.mockResolvedValue([{ id: 'p1', slug: 'x' }]);

        const first = await request(app).get('/api/portfolio/projects');
        const second = await request(app).get('/api/portfolio/projects');

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        expect(second.body).toEqual(first.body);
        expect(mockPrisma.project.findMany).toHaveBeenCalledTimes(1);
    });
});
