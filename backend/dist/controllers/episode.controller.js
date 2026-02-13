"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodeController = void 0;
const episode_service_1 = require("../services/episode.service");
class EpisodeController {
    static async getByAnimeId(req, res, next) {
        try {
            const episodes = await episode_service_1.EpisodeService.getByAnimeId(req.params.animeId);
            res.json({ success: true, data: episodes });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const episode = await episode_service_1.EpisodeService.getById(req.params.id);
            res.json({ success: true, data: episode });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const episodeData = { ...req.body };
            // Strict type safety for numeric fields
            if (episodeData.episode_number)
                episodeData.episode_number = Number(episodeData.episode_number);
            if (episodeData.duration)
                episodeData.duration = Number(episodeData.duration);
            const episode = await episode_service_1.EpisodeService.create(episodeData);
            res.status(201).json({ success: true, data: episode });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const updates = { ...req.body };
            if (updates.episode_number)
                updates.episode_number = Number(updates.episode_number);
            if (updates.duration)
                updates.duration = Number(updates.duration);
            const episode = await episode_service_1.EpisodeService.update(req.params.id, updates);
            res.json({ success: true, data: episode });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const result = await episode_service_1.EpisodeService.delete(req.params.id);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.EpisodeController = EpisodeController;
//# sourceMappingURL=episode.controller.js.map