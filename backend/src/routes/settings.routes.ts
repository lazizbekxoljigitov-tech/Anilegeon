import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Profile
router.put('/profile', SettingsController.updateProfile);

// Preferences
router.get('/preferences', SettingsController.getPreferences);
router.put('/preferences', SettingsController.updatePreferences);

// Privacy
router.get('/privacy', SettingsController.getPrivacy);
router.put('/privacy', SettingsController.updatePrivacy);

// Notifications
router.get('/notifications', SettingsController.getNotifications);
router.put('/notifications', SettingsController.updateNotifications);

// Blocked Users
router.get('/blocked-users', SettingsController.getBlockedUsers);
router.delete('/blocked-users/:id', SettingsController.unblockUser);

// Watch History
router.delete('/watch-history', SettingsController.clearWatchHistory);
router.get('/watch-history/export', SettingsController.exportWatchHistory);

// Danger Zone
router.post('/delete-account', SettingsController.deleteAccount);
router.get('/export-data', SettingsController.exportAccountData);

export default router;
