"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
router.post('/register', validate_middleware_1.registerValidation, auth_controller_1.AuthController.register);
router.post('/login', validate_middleware_1.loginValidation, auth_controller_1.AuthController.login);
router.get('/profile', auth_middleware_1.authMiddleware, auth_controller_1.AuthController.getProfile);
router.put('/profile', auth_middleware_1.authMiddleware, multer_1.upload.single('avatar'), auth_controller_1.AuthController.updateProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map