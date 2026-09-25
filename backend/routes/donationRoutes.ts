import { Router } from 'express';
import { createDonation, getDonations, getDonationById, updateDonation, deleteDonation } from '../controllers/donationController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.post('/', createDonation);
router.get('/', protect, authorize('super_admin', 'editor'), getDonations);
router.get('/:id', protect, authorize('super_admin', 'editor'), getDonationById);
router.put('/:id', protect, authorize('super_admin', 'editor'), updateDonation);
router.delete('/:id', protect, authorize('super_admin'), deleteDonation);

export default router;
