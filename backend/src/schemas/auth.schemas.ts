import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ error: 'Email is required' })
        .email('Invalid email format'),
    password: z
        .string({ error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ── Change Email ──────────────────────────────────────────────────────────────
export const changeEmailSchema = z.object({
    newEmail: z
        .string({ error: 'New email is required' })
        .min(1, 'New email is required')
        .email('Invalid email format'),
    confirmEmail: z
        .string({ error: 'Please confirm your new email' })
        .min(1, 'Please confirm your new email')
        .email('Invalid email format'),
}).refine((d) => d.newEmail === d.confirmEmail, {
    message: "Emails don't match",
    path: ['confirmEmail'],
});

// ── Change Password ───────────────────────────────────────────────────────────
export const changePasswordSchema = z.object({
    currentPassword: z
        .string({ error: 'Current password is required' })
        .min(1, 'Current password is required'),
    newPassword: z
        .string({ error: 'New password is required' })
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z
        .string({ error: 'Please confirm your new password' })
        .min(1, 'Please confirm your new password'),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type ChangeEmailInput    = z.infer<typeof changeEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
