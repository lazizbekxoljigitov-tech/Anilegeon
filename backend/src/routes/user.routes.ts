import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/history', UserController.getWatchHistory);
router.post('/history', UserController.updateWatchHistory);

router.get('/saved', UserController.getSavedAnime);
router.post('/saved/toggle', UserController.toggleSaveAnime);
router.get('/saved/check/:animeId', UserController.checkSaved);
router.get('/search-id/:id', UserController.searchUserById);

export default router;
