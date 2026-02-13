"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeController = void 0;
const anime_service_1 = require("../services/anime.service");
class AnimeController {
    static async getAll(req, res, next) {
        try {
            const { page, limit, search, category, sort, trending, featured, status } = req.query;
            const result = await anime_service_1.AnimeService.getAll({
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 20,
                search: search,
                category: category,
                sort: sort,
                trending: trending !== undefined ? trending === 'true' : undefined,
                featured: featured !== undefined ? featured === 'true' : undefined,
                status: status,
            });
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const anime = await anime_service_1.AnimeService.getById(req.params.id);
            res.json({ success: true, data: anime });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const animeData = { ...req.body };
            // Ensure types are correct for the service
            if (animeData.rating)
                animeData.rating = parseFloat(animeData.rating);
            if (animeData.is_trending !== undefined) {
                animeData.is_trending = animeData.is_trending === 'true' || animeData.is_trending === true;
            }
            if (animeData.is_featured !== undefined) {
                animeData.is_featured = animeData.is_featured === 'true' || animeData.is_featured === true;
            }
            const anime = await anime_service_1.AnimeService.create(animeData);
            res.status(201).json({ success: true, data: anime });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const animeData = { ...req.body };
            if (animeData.rating)
                animeData.rating = parseFloat(animeData.rating);
            if (animeData.is_trending !== undefined) {
                animeData.is_trending = animeData.is_trending === 'true' || animeData.is_trending === true;
            }
            if (animeData.is_featured !== undefined) {
                animeData.is_featured = animeData.is_featured === 'true' || animeData.is_featured === true;
            }
            const anime = await anime_service_1.AnimeService.update(req.params.id, animeData);
            res.json({ success: true, data: anime });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const result = await anime_service_1.AnimeService.delete(req.params.id);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getTrending(req, res, next) {
        try {
            const data = await anime_service_1.AnimeService.getTrending();
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async getFeatured(req, res, next) {
        try {
            const data = await anime_service_1.AnimeService.getFeatured();
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async getTopRated(req, res, next) {
        try {
            const data = await anime_service_1.AnimeService.getTopRated();
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async getNewEpisodes(req, res, next) {
        try {
            const data = await anime_service_1.AnimeService.getNewEpisodes();
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async getRelated(req, res, next) {
        try {
            const data = await anime_service_1.AnimeService.getRelated(req.params.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async recordView(req, res, next) {
        try {
            const { anime_id, episode_id } = req.body;
            await anime_service_1.AnimeService.recordView(req.user?.id, anime_id, episode_id);
            res.json({ success: true, message: 'View recorded' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnimeController = AnimeController;
//# sourceMappingURL=anime.controller.js.map