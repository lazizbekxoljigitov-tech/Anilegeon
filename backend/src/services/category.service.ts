import { supabase } from '../config/supabase';
import { AppError } from '../utils/helpers';

export class CategoryService {
  static async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new AppError('Failed to fetch categories', 500);
    return data || [];
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError('Category not found', 404);
    return data;
  }

  static async create(name: string) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', name)
      .single();

    if (existing) throw new AppError('Category already exists', 400);

    const { data, error } = await supabase
      .from('categories')
      .insert({ name })
      .select()
      .single();

    if (error) throw new AppError('Failed to create category: ' + error.message, 500);
    return data;
  }

  static async update(id: string, name: string) {
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError('Failed to update category: ' + error.message, 500);
    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new AppError('Failed to delete category: ' + error.message, 500);
    return { message: 'Category deleted successfully' };
  }
}
