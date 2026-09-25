import { Router } from 'express';
import { getEvents, getEventBySlugOrId, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.get('/', getEvents);
router.get('/:identifier', getEventBySlugOrId);
router.post('/', protect, authorize('super_admin', 'editor', 'content_manager'), createEvent);
router.put('/:id', protect, authorize('super_admin', 'editor', 'content_manager'), updateEvent);
router.delete('/:id', protect, authorize('super_admin', 'editor'), deleteEvent);

export default router;
