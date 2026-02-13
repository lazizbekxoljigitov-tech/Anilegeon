"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const settings_service_1 = require("../services/settings.service");
class SettingsController {
    // ── Profile ──
    static async updateProfile(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.updateProfile(req.user.id, req.body);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ── Preferences ──
    static async getPreferences(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.getPreferences(req.user.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePreferences(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.updatePreferences(req.user.id, req.body);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ── Privacy ──
    static async getPrivacy(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.getPrivacy(req.user.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePrivacy(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.updatePrivacy(req.user.id, req.body);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ── Notifications ──
    static async getNotifications(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.getNotifications(req.user.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateNotifications(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.updateNotifications(req.user.id, req.body);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ── Blocked Users ──
    static async getBlockedUsers(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.getBlockedUsers(req.user.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async unblockUser(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.unblockUser(req.user.id, req.params.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ── Watch History ──
    static async clearWatchHistory(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.clearWatchHistory(req.user.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async exportWatchHistory(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.exportWatchHistory(req.user.id);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename="watch_history.json"');
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    // ── Account / Danger Zone ──
    static async deleteAccount(req, res, next) {
        try {
            const { confirmation } = req.body;
            if (confirmation !== 'DELETE') {
                return res.status(400).json({ success: false, error: 'Type DELETE to confirm' });
            }
            const data = await settings_service_1.SettingsService.deleteAccount(req.user.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async exportAccountData(req, res, next) {
        try {
            const data = await settings_service_1.SettingsService.exportAccountData(req.user.id);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename="account_data.json"');
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=settings.controller.js.map