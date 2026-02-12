"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', category_controller_1.CategoryController.getAll);
router.get('/:id', category_controller_1.CategoryController.getById);
// Admin routes
router.post('/', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, category_controller_1.CategoryController.create);
router.put('/:id', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, category_controller_1.CategoryController.update);
router.delete('/:id', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, category_controller_1.CategoryController.delete);
exports.default = router;
//# sourceMappingURL=category.routes.js.map