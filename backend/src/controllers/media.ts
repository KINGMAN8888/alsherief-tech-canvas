import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'application/pdf',
]);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeBaseName = path
            .basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 60) || 'media';

        cb(null, `${Date.now()}-${safeBaseName}${ext}`);
    },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
        cb(new Error('Unsupported file type'));
        return;
    }
    cb(null, true);
};

export const uploadSingleMedia = multer({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 },
}).single('file');

export const handleMediaUpload = (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const publicPath = `/uploads/${req.file.filename}`;

    res.status(201).json({
        filename: req.file.filename,
        path: publicPath,
        url: `${baseUrl}${publicPath}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
    });
};
