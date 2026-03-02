import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import logger from '../lib/logger';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn('Failed login attempt', { email });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        logger.info('User logged in', { userId: user.id });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, role: true },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// ── Change Email ──────────────────────────────────────────────────────────────
export const changeEmail = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { newEmail } = req.body;

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const conflict = await prisma.user.findUnique({ where: { email: newEmail } });
        if (conflict && conflict.id !== user.id) {
            return res.status(409).json({ error: 'That email address is already in use' });
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { email: newEmail },
            select: { id: true, email: true, name: true, role: true },
        });

        logger.info('User email updated', { userId: user.id });
        res.json({ message: 'Email updated successfully', user: updated });
    } catch (error) {
        next(error);
    }
};

// ── Change Password ───────────────────────────────────────────────────────────
export const changePassword = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            logger.warn('Failed password-change — wrong current password', { userId: user.id });
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({ error: 'New password must be different from the current password' });
        }

        const hashed = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

        logger.info('User password updated', { userId: user.id });
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};
