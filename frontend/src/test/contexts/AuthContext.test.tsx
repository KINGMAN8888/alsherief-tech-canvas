import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import React from 'react';

// Mock the api module
vi.mock('@/lib/api', () => ({
    default: {
        get: vi.fn(),
    },
}));

import api from '@/lib/api';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Helper component to expose auth context values
const TestConsumer = () => {
    const { user, loading, login, logout } = useAuth();
    return (
        <div>
            <span data-testid="loading">{String(loading)}</span>
            <span data-testid="user">{user ? user.email : 'null'}</span>
            <button onClick={() => login('test-token', { id: '1', email: 'test@test.com', name: 'Test', role: 'admin' })}>
                Login
            </button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

const mockUser = { id: '1', email: 'admin@test.com', name: 'Admin', role: 'admin' };

beforeEach(() => {
    vi.resetAllMocks(); // resetAllMocks clears queued mockResolvedValueOnce responses
    localStorage.clear();
});

describe('AuthContext', () => {
    it('starts loading and resolves to no user when no token exists', async () => {
        // No token in localStorage
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
        expect(screen.getByTestId('user').textContent).toBe('null');
        expect(api.get).not.toHaveBeenCalled();
    });

    it('verifies token from localStorage on mount', async () => {
        localStorage.setItem('token', 'valid-token');
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user').textContent).toBe(mockUser.email);
        });
        expect(api.get).toHaveBeenCalledWith('/auth/me');
    });

    it('clears user and token when token verification fails', async () => {
        localStorage.setItem('token', 'expired-token');
        vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
        expect(screen.getByTestId('user').textContent).toBe('null');
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('login() stores token and sets user', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({ data: null });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

        await act(async () => {
            screen.getByText('Login').click();
        });

        expect(screen.getByTestId('user').textContent).toBe('test@test.com');
        expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('logout() removes token and clears user', async () => {
        localStorage.setItem('token', 'tok');
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByTestId('user').textContent).toBe(mockUser.email));

        await act(async () => {
            screen.getByText('Logout').click();
        });

        expect(screen.getByTestId('user').textContent).toBe('null');
        expect(localStorage.getItem('token')).toBeNull();
    });
});
