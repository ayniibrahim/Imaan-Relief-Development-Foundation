import { Router } from 'express';
import { submitVolunteer, getVolunteers, getVolunteerById, updateVolunteer, deleteVolunteer } from '../controllers/volunteerController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.post('/', submitVolunteer);
router.get('/', protect, authorize('super_admin', 'editor'), getVolunteers);
router.get('/:id', protect, authorize('super_admin', 'editor'), getVolunteerById);
router.put('/:id', protect, authorize('super_admin', 'editor'), updateVolunteer);
router.delete('/:id', protect, authorize('super_admin', 'editor'), deleteVolunteer);

export default router;
