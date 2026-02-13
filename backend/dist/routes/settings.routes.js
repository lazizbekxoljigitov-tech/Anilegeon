"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("../controllers/settings.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Profile
router.put('/profile', settings_controller_1.SettingsController.updateProfile);
// Preferences
router.get('/preferences', settings_controller_1.SettingsController.getPreferences);
router.put('/preferences', settings_controller_1.SettingsController.updatePreferences);
// Privacy
router.get('/privacy', settings_controller_1.SettingsController.getPrivacy);
router.put('/privacy', settings_controller_1.SettingsController.updatePrivacy);
// Notifications
router.get('/notifications', settings_controller_1.SettingsController.getNotifications);
router.put('/notifications', settings_controller_1.SettingsController.updateNotifications);
// Blocked Users
router.get('/blocked-users', settings_controller_1.SettingsController.getBlockedUsers);
router.delete('/blocked-users/:id', settings_controller_1.SettingsController.unblockUser);
// Watch History
router.delete('/watch-history', settings_controller_1.SettingsController.clearWatchHistory);
router.get('/watch-history/export', settings_controller_1.SettingsController.exportWatchHistory);
// Danger Zone
router.post('/delete-account', settings_controller_1.SettingsController.deleteAccount);
router.get('/export-data', settings_controller_1.SettingsController.exportAccountData);
exports.default = router;
//# sourceMappingURL=settings.routes.js.map