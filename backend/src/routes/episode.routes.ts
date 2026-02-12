import { Router } from 'express';
import { EpisodeController } from '../controllers/episode.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';
import { upload } from '../config/multer';

const router = Router();

// Public routes
router.get('/anime/:animeId', EpisodeController.getByAnimeId);
router.get('/:id', EpisodeController.getById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  adminOnly,
  EpisodeController.create
);

router.put(
  '/:id',
  authMiddleware,
  adminOnly,
  EpisodeController.update
);

router.delete('/:id', authMiddleware, adminOnly, EpisodeController.delete);

export default router;
