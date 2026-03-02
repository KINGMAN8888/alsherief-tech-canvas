import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { handleMediaUpload, uploadSingleMedia } from '../controllers/media';

const router = express.Router();

router.post('/upload', authenticateToken, requireAdmin, (req, res, next) => {
    uploadSingleMedia(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message || 'Upload failed' });
        }
        next();
    });
}, handleMediaUpload);

export default router;
