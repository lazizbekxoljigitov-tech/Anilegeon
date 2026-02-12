"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware, role_middleware_1.adminOnly);
router.get('/stats', admin_controller_1.AdminController.getStats);
router.get('/users', admin_controller_1.AdminController.getUsers);
router.delete('/users/:id', admin_controller_1.AdminController.deleteUser);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map