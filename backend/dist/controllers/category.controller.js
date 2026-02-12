"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../services/category.service");
class CategoryController {
    static async getAll(req, res, next) {
        try {
            const categories = await category_service_1.CategoryService.getAll();
            res.json({ success: true, data: categories });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const category = await category_service_1.CategoryService.getById(req.params.id);
            res.json({ success: true, data: category });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const { name } = req.body;
            const category = await category_service_1.CategoryService.create(name);
            res.status(201).json({ success: true, data: category });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { name } = req.body;
            const category = await category_service_1.CategoryService.update(req.params.id, name);
            res.json({ success: true, data: category });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const result = await category_service_1.CategoryService.delete(req.params.id);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map