"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const supabase_1 = require("../config/supabase");
const helpers_1 = require("../utils/helpers");
class UserService {
    static async getAll(query) {
        const { offset, limit } = (0, helpers_1.paginate)(query.page, query.limit);
        let q = supabase_1.supabase
            .from('users')
            .select('id, name, email, role, avatar_url, created_at', { count: 'exact' });
        if (query.search) {
            q = q.or(`name.ilike.%${query.search}%,email.ilike.%${query.search}%`);
        }
        q = q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
        const { data, error, count } = await q;
        if (error)
            throw new helpers_1.AppError('Failed to fetch users', 500);
        return {
            users: data || [],
            total: count || 0,
            page: query.page || 1,
            totalPages: Math.ceil((count || 0) / limit),
        };
    }
    static async delete(id) {
        const { error } = await supabase_1.supabase.from('users').delete().eq('id', id);
        if (error)
            throw new helpers_1.AppError('Failed to delete user: ' + error.message, 500);
        return { message: 'User deleted successfully' };
    }
    static async getWatchHistory(userId) {
        const { data, error } = await supabase_1.supabase
            .from('watch_history')
            .select('*, anime(id, title, thumbnail_url, banner_url), episodes(id, title, episode_number)')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(50);
        if (error)
            throw new helpers_1.AppError('Failed to fetch watch history', 500);
        return data || [];
    }
    static async updateWatchHistory(userId, animeId, episodeId, progress) {
        const { data, error } = await supabase_1.supabase
            .from('watch_history')
            .upsert({ user_id: userId, anime_id: animeId, episode_id: episodeId, progress, updated_at: new Date().toISOString() }, { onConflict: 'user_id,anime_id,episode_id' })
            .select()
            .single();
        if (error)
            throw new helpers_1.AppError('Failed to update watch history', 500);
        return data;
    }
    static async getSavedAnime(userId) {
        const { data, error } = await supabase_1.supabase
            .from('saved_anime')
            .select('*, anime(id, title, thumbnail_url, banner_url, rating)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw new helpers_1.AppError('Failed to fetch saved anime', 500);
        return data || [];
    }
    static async saveAnime(userId, animeId) {
        const { data: existing } = await supabase_1.supabase
            .from('saved_anime')
            .select('id')
            .eq('user_id', userId)
            .eq('anime_id', animeId)
            .single();
        if (existing) {
            // Toggle: remove if already saved
            await supabase_1.supabase.from('saved_anime').delete().eq('id', existing.id);
            return { saved: false, message: 'Anime removed from saved' };
        }
        const { error } = await supabase_1.supabase
            .from('saved_anime')
            .insert({ user_id: userId, anime_id: animeId });
        if (error)
            throw new helpers_1.AppError('Failed to save anime', 500);
        return { saved: true, message: 'Anime saved successfully' };
    }
    static async checkSaved(userId, animeId) {
        const { data } = await supabase_1.supabase
            .from('saved_anime')
            .select('id')
            .eq('user_id', userId)
            .eq('anime_id', animeId)
            .single();
        return { saved: !!data };
    }
    static async getStats() {
        const { count: totalUsers } = await supabase_1.supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
        const { count: totalAnime } = await supabase_1.supabase
            .from('anime')
            .select('*', { count: 'exact', head: true });
        const { count: totalViews } = await supabase_1.supabase
            .from('views')
            .select('*', { count: 'exact', head: true });
        const { count: totalEpisodes } = await supabase_1.supabase
            .from('episodes')
            .select('*', { count: 'exact', head: true });
        return {
            totalUsers: totalUsers || 0,
            totalAnime: totalAnime || 0,
            totalViews: totalViews || 0,
            totalEpisodes: totalEpisodes || 0,
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map