import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { registerValidation, loginValidation } from '../middlewares/validate.middleware';
import { upload } from '../config/multer';

const router = Router();

router.post('/register', registerValidation, AuthController.register);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/login', loginValidation, AuthController.login);
router.post('/forgot-password', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.resetPassword);
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), AuthController.updateProfile);

export default router;
