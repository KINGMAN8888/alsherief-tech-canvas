import express from 'express';
import { login, me, changeEmail, changePassword } from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, changeEmailSchema, changePasswordSchema } from '../schemas/auth.schemas';

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/login', validate(loginSchema), login);

// ── Protected ─────────────────────────────────────────────────────────────────
router.get('/me',                 authenticateToken,                                      me);
router.put('/account/email',      authenticateToken, validate(changeEmailSchema),    changeEmail);
router.put('/account/password',   authenticateToken, validate(changePasswordSchema), changePassword);

export default router;
