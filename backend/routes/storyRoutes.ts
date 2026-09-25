import { Router } from 'express';
import { getStories, getStoryBySlugOrId, createStory, updateStory, deleteStory } from '../controllers/storyController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.get('/', getStories);
router.get('/:identifier', getStoryBySlugOrId);
router.post('/', protect, authorize('super_admin', 'editor', 'content_manager'), createStory);
router.put('/:id', protect, authorize('super_admin', 'editor', 'content_manager'), updateStory);
router.delete('/:id', protect, authorize('super_admin', 'editor'), deleteStory);

export default router;
