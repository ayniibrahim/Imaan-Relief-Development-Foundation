import { Router } from 'express';
import { getSettings, updateSettings, getDashboardStats } from '../controllers/settingsController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.get('/', getSettings);
router.put('/', protect, authorize('super_admin', 'editor'), updateSettings);
router.get('/dashboard/stats', protect, getDashboardStats);

export default router;
