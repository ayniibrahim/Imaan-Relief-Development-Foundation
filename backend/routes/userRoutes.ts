import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { authorize } from '../middleware/roleMiddleware.ts';

const router = Router();

router.use(protect);
router.use(authorize('super_admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
