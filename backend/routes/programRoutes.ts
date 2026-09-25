import { Router } from 'express';
import { getPrograms, getProgramBySlugOrId, createProgram, updateProgram, deleteProgram } from '../controllers/programController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.get('/', getPrograms);
router.get('/:identifier', getProgramBySlugOrId);
router.post('/', protect, authorize('super_admin', 'editor', 'content_manager'), createProgram);
router.put('/:id', protect, authorize('super_admin', 'editor', 'content_manager'), updateProgram);
router.delete('/:id', protect, authorize('super_admin', 'editor'), deleteProgram);

export default router;
