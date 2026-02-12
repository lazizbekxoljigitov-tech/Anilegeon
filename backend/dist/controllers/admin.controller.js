"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_service_1 = require("../services/user.service");
class AdminController {
    static async getStats(req, res, next) {
        try {
            const stats = await user_service_1.UserService.getStats();
            res.json({ success: true, data: stats });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUsers(req, res, next) {
        try {
            const { page, limit, search } = req.query;
            const result = await user_service_1.UserService.getAll({
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 20,
                search: search,
            });
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const result = await user_service_1.UserService.delete(req.params.id);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map