"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const anime_controller_1 = require("../controllers/anime.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
// Public routes
router.get('/', anime_controller_1.AnimeController.getAll);
router.get('/trending', anime_controller_1.AnimeController.getTrending);
router.get('/featured', anime_controller_1.AnimeController.getFeatured);
router.get('/top-rated', anime_controller_1.AnimeController.getTopRated);
router.get('/new-episodes', anime_controller_1.AnimeController.getNewEpisodes);
router.get('/:id', anime_controller_1.AnimeController.getById);
router.get('/:id/related', anime_controller_1.AnimeController.getRelated);
// Protected routes
router.post('/view', auth_middleware_1.optionalAuth, anime_controller_1.AnimeController.recordView);
// Admin routes
router.post('/', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, multer_1.upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]), validate_middleware_1.animeValidation, anime_controller_1.AnimeController.create);
router.put('/:id', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, multer_1.upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]), anime_controller_1.AnimeController.update);
router.delete('/:id', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, anime_controller_1.AnimeController.delete);
exports.default = router;
//# sourceMappingURL=anime.routes.js.map