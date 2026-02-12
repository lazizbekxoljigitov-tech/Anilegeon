import { Router } from 'express';
import { AnimeController } from '../controllers/anime.controller';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';
import { animeValidation } from '../middlewares/validate.middleware';
import { upload } from '../config/multer';

const router = Router();

// Public routes
router.get('/', AnimeController.getAll);
router.get('/trending', AnimeController.getTrending);
router.get('/featured', AnimeController.getFeatured);
router.get('/top-rated', AnimeController.getTopRated);
router.get('/new-episodes', AnimeController.getNewEpisodes);
router.get('/:id', AnimeController.getById);
router.get('/:id/related', AnimeController.getRelated);

// Protected routes
router.post('/view', optionalAuth, AnimeController.recordView);

// Admin routes
router.post(
  '/',
  authMiddleware,
  adminOnly,
  animeValidation,
  AnimeController.create
);

router.put(
  '/:id',
  authMiddleware,
  adminOnly,
  AnimeController.update
);

router.delete('/:id', authMiddleware, adminOnly, AnimeController.delete);

export default router;
