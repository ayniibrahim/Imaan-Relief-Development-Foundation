import { Router } from 'express';
import { getGallery, createGallery, updateGallery, deleteGallery } from '../controllers/galleryController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.get('/', getGallery);
router.post('/', protect, authorize('super_admin', 'editor', 'content_manager'), createGallery);
router.put('/:id', protect, authorize('super_admin', 'editor', 'content_manager'), updateGallery);
router.delete('/:id', protect, authorize('super_admin', 'editor'), deleteGallery);

export default router;
