import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Zod validation middleware factory.
 * Validates req.body against the given schema.
 * On failure returns 400 with detailed field-level errors.
 */
export const validate =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const issues = (result.error as ZodError).issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));

            res.status(400).json({
                error: 'Validation failed',
                details: issues,
            });
            return;
        }

        // Replace req.body with the parsed (and coerced/defaulted) data
        req.body = result.data;
        next();
    };
