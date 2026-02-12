import { supabase } from '../config/supabase';
import { AppError, paginate } from '../utils/helpers';

export class UserService {
  static async getAll(query: { page?: number; limit?: number; search?: string }) {
    const { offset, limit } = paginate(query.page, query.limit);

    let q = supabase
      .from('users')
      .select('id, name, email, role, avatar_url, created_at', { count: 'exact' });

    if (query.search) {
      q = q.or(`name.ilike.%${query.search}%,email.ilike.%${query.search}%`);
    }

    q = q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error, count } = await q;

    if (error) throw new AppError('Failed to fetch users', 500);

    return {
      users: data || [],
      total: count || 0,
      page: query.page || 1,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  static async delete(id: string) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw new AppError('Failed to delete user: ' + error.message, 500);
    return { message: 'User deleted successfully' };
  }

  static async getWatchHistory(userId: string) {
    const { data, error } = await supabase
      .from('watch_history')
      .select('*, anime(id, title, thumbnail_url, banner_url), episodes(id, title, episode_number)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) throw new AppError('Failed to fetch watch history', 500);
    return data || [];
  }

  static async updateWatchHistory(userId: string, animeId: string, episodeId: string, progress: number) {
    const { data, error } = await supabase
      .from('watch_history')
      .upsert(
        { user_id: userId, anime_id: animeId, episode_id: episodeId, progress, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,anime_id,episode_id' }
      )
      .select()
      .single();

    if (error) throw new AppError('Failed to update watch history', 500);
    return data;
  }

  static async getSavedAnime(userId: string) {
    const { data, error } = await supabase
      .from('saved_anime')
      .select('*, anime(id, title, thumbnail_url, banner_url, rating)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Failed to fetch saved anime', 500);
    return data || [];
  }

  static async saveAnime(userId: string, animeId: string) {
    const { data: existing } = await supabase
      .from('saved_anime')
      .select('id')
      .eq('user_id', userId)
      .eq('anime_id', animeId)
      .single();

    if (existing) {
      // Toggle: remove if already saved
      await supabase.from('saved_anime').delete().eq('id', existing.id);
      return { saved: false, message: 'Anime removed from saved' };
    }

    const { error } = await supabase
      .from('saved_anime')
      .insert({ user_id: userId, anime_id: animeId });

    if (error) throw new AppError('Failed to save anime', 500);
    return { saved: true, message: 'Anime saved successfully' };
  }

  static async checkSaved(userId: string, animeId: string) {
    const { data } = await supabase
      .from('saved_anime')
      .select('id')
      .eq('user_id', userId)
      .eq('anime_id', animeId)
      .single();

    return { saved: !!data };
  }

  static async getStats() {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: totalAnime } = await supabase
      .from('anime')
      .select('*', { count: 'exact', head: true });

    const { count: totalViews } = await supabase
      .from('views')
      .select('*', { count: 'exact', head: true });

    const { count: totalEpisodes } = await supabase
      .from('episodes')
      .select('*', { count: 'exact', head: true });

    return {
      totalUsers: totalUsers || 0,
      totalAnime: totalAnime || 0,
      totalViews: totalViews || 0,
      totalEpisodes: totalEpisodes || 0,
    };
  }

  static async searchById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, avatar_url')
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError('User not found', 404);
    return data;
  }
}
