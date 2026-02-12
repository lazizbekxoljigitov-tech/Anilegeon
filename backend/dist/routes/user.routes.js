"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/history', user_controller_1.UserController.getWatchHistory);
router.post('/history', user_controller_1.UserController.updateWatchHistory);
router.get('/saved', user_controller_1.UserController.getSavedAnime);
router.post('/saved/toggle', user_controller_1.UserController.toggleSaveAnime);
router.get('/saved/check/:animeId', user_controller_1.UserController.checkSaved);
exports.default = router;
//# sourceMappingURL=user.routes.js.map