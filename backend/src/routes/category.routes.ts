import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';

const router = Router();

// Public routes
router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);

// Admin routes
router.post('/', authMiddleware, adminOnly, CategoryController.create);
router.put('/:id', authMiddleware, adminOnly, CategoryController.update);
router.delete('/:id', authMiddleware, adminOnly, CategoryController.delete);

export default router;
