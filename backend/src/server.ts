import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { prisma } from './prisma';
import authRoutes from './routes/auth';
import portfolioRoutes from './routes/portfolio';
import aboutRoutes from './routes/about.routes';
import mediaRoutes from './routes/media';
import { globalErrorHandler } from './middleware/errorHandler';
import logger from './lib/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ── Security Headers (Helmet) ──────────────────────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:8080,http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. curl, mobile apps, Postman)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS: Origin ${origin} not allowed`));
            }
        },
        credentials: true,
    })
);

// ── Body Parser ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));

// ── Static uploads ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ── Global Rate Limiter (all /api routes) ──────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// ── Strict Rate Limiter (contact form — anti-spam) ─────────────────────────────
const messageLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many messages sent. Please wait an hour before trying again.' },
});
app.use('/api/portfolio/messages', messageLimiter);

// ── Auth Rate Limiter (brute-force protection) ─────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts, please try again in 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/portfolio/about', aboutRoutes);
app.use('/api/media', mediaRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(globalErrorHandler);

// ── Start Server ───────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
    });
}

export { app, prisma };
