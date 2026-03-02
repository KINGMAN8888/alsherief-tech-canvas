import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminAccount from '@/pages/admin/AdminAccount';

const mockPut = vi.fn();
const mockLogin = vi.fn();

vi.mock('@/lib/api', () => ({
    default: {
        put: (...args: unknown[]) => mockPut(...args),
    },
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({
        user: {
            id: '1',
            email: 'admin@techcanvas.io',
            name: 'Admin',
            role: 'admin',
        },
        login: mockLogin,
        logout: vi.fn(),
    }),
}));

describe('AdminAccount email form', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem('token', 'tkn');
    });

    it('submits email update payload without currentPassword', async () => {
        mockPut.mockResolvedValueOnce({
            data: {
                user: {
                    id: '1',
                    email: 'admin@youssefalsherief.tech',
                    name: 'Admin',
                    role: 'admin',
                },
            },
        });

        render(
            <MemoryRouter initialEntries={['/en/admin/account']}>
                <Routes>
                    <Route path="/:locale/admin/account" element={<AdminAccount />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('new@example.com'), {
            target: { value: 'admin@youssefalsherief.tech' },
        });

        fireEvent.change(screen.getByPlaceholderText('Repeat new email'), {
            target: { value: 'admin@youssefalsherief.tech' },
        });

        fireEvent.click(screen.getByRole('button', { name: /update email/i }));

        await waitFor(() => {
            expect(mockPut).toHaveBeenCalledTimes(1);
        });

        expect(mockPut).toHaveBeenCalledWith('/auth/account/email', {
            newEmail: 'admin@youssefalsherief.tech',
            confirmEmail: 'admin@youssefalsherief.tech',
        });

        expect(mockLogin).toHaveBeenCalledTimes(1);
    });
});
