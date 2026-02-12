"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodeService = void 0;
const supabase_1 = require("../config/supabase");
const helpers_1 = require("../utils/helpers");
class EpisodeService {
    static async getByAnimeId(animeId) {
        const { data, error } = await supabase_1.supabase
            .from('episodes')
            .select('*')
            .eq('anime_id', animeId)
            .order('episode_number', { ascending: true });
        if (error)
            throw new helpers_1.AppError('Failed to fetch episodes', 500);
        return data || [];
    }
    static async getById(id) {
        const { data, error } = await supabase_1.supabase
            .from('episodes')
            .select('*, anime(id, title, thumbnail_url)')
            .eq('id', id)
            .single();
        if (error || !data)
            throw new helpers_1.AppError('Episode not found', 404);
        return data;
    }
    static async create(episodeData) {
        // Check if episode number already exists for this anime
        const { data: existing } = await supabase_1.supabase
            .from('episodes')
            .select('id')
            .eq('anime_id', episodeData.anime_id)
            .eq('episode_number', episodeData.episode_number)
            .single();
        if (existing) {
            throw new helpers_1.AppError(`Episode ${episodeData.episode_number} already exists for this anime`, 400);
        }
        const { data, error } = await supabase_1.supabase
            .from('episodes')
            .insert(episodeData)
            .select()
            .single();
        if (error)
            throw new helpers_1.AppError('Failed to create episode: ' + error.message, 500);
        return data;
    }
    static async update(id, updates) {
        const { data, error } = await supabase_1.supabase
            .from('episodes')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new helpers_1.AppError('Failed to update episode: ' + error.message, 500);
        return data;
    }
    static async delete(id) {
        const { error } = await supabase_1.supabase.from('episodes').delete().eq('id', id);
        if (error)
            throw new helpers_1.AppError('Failed to delete episode: ' + error.message, 500);
        return { message: 'Episode deleted successfully' };
    }
}
exports.EpisodeService = EpisodeService;
//# sourceMappingURL=episode.service.js.map