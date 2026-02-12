"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const supabase_1 = require("../config/supabase");
const helpers_1 = require("../utils/helpers");
class CategoryService {
    static async getAll() {
        const { data, error } = await supabase_1.supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });
        if (error)
            throw new helpers_1.AppError('Failed to fetch categories', 500);
        return data || [];
    }
    static async getById(id) {
        const { data, error } = await supabase_1.supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data)
            throw new helpers_1.AppError('Category not found', 404);
        return data;
    }
    static async create(name) {
        const { data: existing } = await supabase_1.supabase
            .from('categories')
            .select('id')
            .ilike('name', name)
            .single();
        if (existing)
            throw new helpers_1.AppError('Category already exists', 400);
        const { data, error } = await supabase_1.supabase
            .from('categories')
            .insert({ name })
            .select()
            .single();
        if (error)
            throw new helpers_1.AppError('Failed to create category: ' + error.message, 500);
        return data;
    }
    static async update(id, name) {
        const { data, error } = await supabase_1.supabase
            .from('categories')
            .update({ name })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new helpers_1.AppError('Failed to update category: ' + error.message, 500);
        return data;
    }
    static async delete(id) {
        const { error } = await supabase_1.supabase.from('categories').delete().eq('id', id);
        if (error)
            throw new helpers_1.AppError('Failed to delete category: ' + error.message, 500);
        return { message: 'Category deleted successfully' };
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map