import { Router } from 'express';
import { submitContact, getContacts, getContactById, updateContact, deleteContact } from '../controllers/contactController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.post('/', submitContact);
router.get('/', protect, authorize('super_admin', 'editor'), getContacts);
router.get('/:id', protect, authorize('super_admin', 'editor'), getContactById);
router.put('/:id', protect, authorize('super_admin', 'editor'), updateContact);
router.delete('/:id', protect, authorize('super_admin', 'editor'), deleteContact);

export default router;
