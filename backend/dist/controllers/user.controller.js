"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    static async getWatchHistory(req, res, next) {
        try {
            const data = await user_service_1.UserService.getWatchHistory(req.user.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateWatchHistory(req, res, next) {
        try {
            const { anime_id, episode_id, progress } = req.body;
            const data = await user_service_1.UserService.updateWatchHistory(req.user.id, anime_id, episode_id, progress);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async getSavedAnime(req, res, next) {
        try {
            const data = await user_service_1.UserService.getSavedAnime(req.user.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async toggleSaveAnime(req, res, next) {
        try {
            const { anime_id } = req.body;
            const data = await user_service_1.UserService.saveAnime(req.user.id, anime_id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async checkSaved(req, res, next) {
        try {
            const data = await user_service_1.UserService.checkSaved(req.user.id, req.params.animeId);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map