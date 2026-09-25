import { Router } from 'express';
import { getProjects, getProjectBySlugOrId, createProject, updateProject, deleteProject } from '../controllers/projectController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.get('/', getProjects);
router.get('/:identifier', getProjectBySlugOrId);
router.post('/', protect, authorize('super_admin', 'editor', 'content_manager'), createProject);
router.put('/:id', protect, authorize('super_admin', 'editor', 'content_manager'), updateProject);
router.delete('/:id', protect, authorize('super_admin', 'editor'), deleteProject);

export default router;
