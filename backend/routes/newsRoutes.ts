import { Router } from 'express';
import { getNews, getNewsBySlugOrId, createNews, updateNews, deleteNews } from '../controllers/newsController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.get('/', getNews);
router.get('/:identifier', getNewsBySlugOrId);
router.post('/', protect, authorize('super_admin', 'editor', 'content_manager'), createNews);
router.put('/:id', protect, authorize('super_admin', 'editor', 'content_manager'), updateNews);
router.delete('/:id', protect, authorize('super_admin', 'editor'), deleteNews);

export default router;
