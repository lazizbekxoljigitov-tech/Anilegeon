"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const episode_controller_1 = require("../controllers/episode.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
// Public routes
router.get('/anime/:animeId', episode_controller_1.EpisodeController.getByAnimeId);
router.get('/:id', episode_controller_1.EpisodeController.getById);
// Admin routes
router.post('/', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, multer_1.upload.single('video'), episode_controller_1.EpisodeController.create);
router.put('/:id', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, multer_1.upload.single('video'), episode_controller_1.EpisodeController.update);
router.delete('/:id', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, episode_controller_1.EpisodeController.delete);
exports.default = router;
//# sourceMappingURL=episode.routes.js.map