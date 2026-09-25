import { Router } from 'express';
import { login, getMe, logout, updatePassword } from '../controllers/authController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.put('/update-password', protect, updatePassword);

export default router;
