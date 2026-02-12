import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware, adminOnly);

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.getUsers);
router.delete('/users/:id', AdminController.deleteUser);

export default router;
