import { Router } from 'express';
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.get('/', getTeam);
router.post('/', protect, authorize('super_admin', 'editor'), createTeamMember);
router.put('/:id', protect, authorize('super_admin', 'editor'), updateTeamMember);
router.delete('/:id', protect, authorize('super_admin'), deleteTeamMember);

export default router;
