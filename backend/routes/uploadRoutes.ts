import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController.ts';
import { upload } from '../middleware/uploadMiddleware.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

// Allow authenticated admins to upload images/documents, and public volunteer CV upload
router.post('/', upload.single('file'), uploadFile);

export default router;
