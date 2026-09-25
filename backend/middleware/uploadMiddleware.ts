import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = /jpeg|jpg|png|webp|svg|gif/;
  const allowedDocTypes = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isImage = allowedImageTypes.test(ext) || allowedImageTypes.test(file.mimetype);
  const isDoc = allowedDocTypes.test(ext) || allowedDocTypes.test(file.mimetype);

  if (isImage || isDoc) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only images (JPG, PNG, WebP, SVG, GIF) and documents (PDF, DOC) are permitted.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
  fileFilter,
});
