import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import logger from '../lib/logger';

/**
 * Maps Prisma-specific error codes to meaningful HTTP responses.
 */
function handlePrismaError(
    err: Prisma.PrismaClientKnownRequestError
): { status: number; message: string } {
    switch (err.code) {
        case 'P2002': {
            // Unique constraint violation
            const fields = (err.meta?.target as string[])?.join(', ') ?? 'field';
            return {
                status: 409,
                message: `A record with this ${fields} already exists.`,
            };
        }
        case 'P2025':
            // Record not found
            return { status: 404, message: 'Record not found.' };

        case 'P2003':
            // Foreign key constraint
            return { status: 400, message: 'Related record does not exist.' };

        case 'P2014':
            // Required relationship violation
            return { status: 400, message: 'Invalid relationship data provided.' };

        default:
            return { status: 500, message: 'A database error occurred.' };
    }
}

/**
 * Global Express error-handling middleware.
 * Must be registered LAST in server.ts (after all routes).
 */
export const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
): void => {
    // ── Prisma known errors ──────────────────────────────────────────────────
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const { status, message } = handlePrismaError(err);
        logger.warn(`Prisma error [${err.code}]: ${message}`, {
            path: req.path,
            method: req.method,
            code: err.code,
        });
        res.status(status).json({ error: message });
        return;
    }

    // ── Prisma validation errors ─────────────────────────────────────────────
    if (err instanceof Prisma.PrismaClientValidationError) {
        logger.warn('Prisma validation error', { path: req.path, method: req.method });
        res.status(400).json({ error: 'Invalid data provided to the database.' });
        return;
    }

    // ── Standard JS errors ───────────────────────────────────────────────────
    if (err instanceof Error) {
        logger.error(`Unhandled error: ${err.message}`, {
            path: req.path,
            method: req.method,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
        res.status(500).json({
            error:
                process.env.NODE_ENV === 'development'
                    ? err.message
                    : 'An unexpected error occurred.',
        });
        return;
    }

    // ── Unknown errors ───────────────────────────────────────────────────────
    logger.error('Unknown error type thrown', { err });
    res.status(500).json({ error: 'An unexpected error occurred.' });
};
