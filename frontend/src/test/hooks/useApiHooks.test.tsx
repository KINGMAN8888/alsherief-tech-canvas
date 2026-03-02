import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the API module before importing hooks
vi.mock('@/lib/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

import api from '@/lib/api';
import { useApiQuery, useApiAdd, useApiUpdate, useApiDelete } from '@/hooks/useApiHooks';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);
};

beforeEach(() => {
    vi.clearAllMocks();
});

// ─── useApiQuery ───────────────────────────────────────────────────────────────

describe('useApiQuery', () => {
    it('fetches data and returns array', async () => {
        const mockProjects = [{ id: '1', title: 'Project A' }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockProjects });

        const { result } = renderHook(() => useApiQuery<{ id: string; title: string }>('projects'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockProjects);
        expect(api.get).toHaveBeenCalledWith('/portfolio/projects');
    });

    it('wraps non-array response in an array', async () => {
        const mockProfile = { id: 'main', name: 'Youssef' };
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockProfile });

        const { result } = renderHook(() => useApiQuery('profile'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([mockProfile]);
    });

    it('handles fetch error', async () => {
        vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useApiQuery('projects'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBeDefined();
    });
});

// ─── useApiAdd ────────────────────────────────────────────────────────────────

describe('useApiAdd', () => {
    it('posts data to the correct endpoint', async () => {
        const newProject = { title: 'New Project', slug: 'new-project' };
        const createdProject = { id: '2', ...newProject };
        vi.mocked(api.post).mockResolvedValueOnce({ data: createdProject });

        const { result } = renderHook(() => useApiAdd('projects'), {
            wrapper: createWrapper(),
        });

        result.current.mutate(newProject);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(api.post).toHaveBeenCalledWith('/portfolio/projects', newProject);
        expect(result.current.data).toEqual(createdProject);
    });
});

// ─── useApiUpdate ─────────────────────────────────────────────────────────────

describe('useApiUpdate', () => {
    it('sends PUT request with id to correct endpoint', async () => {
        const updated = { id: '1', title: 'Updated' };
        vi.mocked(api.put).mockResolvedValueOnce({ data: updated });

        const { result } = renderHook(() => useApiUpdate('projects'), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ id: '1', data: { title: 'Updated' } });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(api.put).toHaveBeenCalledWith('/portfolio/projects/1', { title: 'Updated' });
    });

    it('sends PUT without id for profile endpoint', async () => {
        const profileData = { name: 'Youssef' };
        vi.mocked(api.put).mockResolvedValueOnce({ data: profileData });

        const { result } = renderHook(() => useApiUpdate('profile'), {
            wrapper: createWrapper(),
        });

        result.current.mutate({ id: 'main', data: profileData });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(api.put).toHaveBeenCalledWith('/portfolio/profile', profileData);
    });
});

// ─── useApiDelete ─────────────────────────────────────────────────────────────

describe('useApiDelete', () => {
    it('sends DELETE request with id', async () => {
        vi.mocked(api.delete).mockResolvedValueOnce({ data: { success: true } });

        const { result } = renderHook(() => useApiDelete('projects'), {
            wrapper: createWrapper(),
        });

        result.current.mutate('1');

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(api.delete).toHaveBeenCalledWith('/portfolio/projects/1');
    });
});
