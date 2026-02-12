import { supabase } from '../config/supabase';
import { AppError } from '../utils/helpers';

export class EpisodeService {
  static async getByAnimeId(animeId: string) {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('anime_id', animeId)
      .order('episode_number', { ascending: true });

    if (error) throw new AppError('Failed to fetch episodes', 500);
    return data || [];
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('episodes')
      .select('*, anime(id, title, thumbnail_url)')
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError('Episode not found', 404);
    return data;
  }

  static async create(episodeData: {
    anime_id: string;
    title?: string;
    episode_number: number;
    video_url?: string;
    video_url_720p?: string;
    video_url_1080p?: string;
    video_url_4k?: string;
    duration?: number;
  }) {
    // Check if episode number already exists for this anime
    const { data: existing } = await supabase
      .from('episodes')
      .select('id')
      .eq('anime_id', episodeData.anime_id)
      .eq('episode_number', episodeData.episode_number)
      .single();

    if (existing) {
      throw new AppError(`Episode ${episodeData.episode_number} already exists for this anime`, 400);
    }

    const { data, error } = await supabase
      .from('episodes')
      .insert(episodeData)
      .select()
      .single();

    if (error) throw new AppError('Failed to create episode: ' + error.message, 500);
    return data;
  }

  static async update(id: string, updates: {
    title?: string;
    episode_number?: number;
    video_url?: string;
    video_url_720p?: string;
    video_url_1080p?: string;
    video_url_4k?: string;
    duration?: number;
  }) {
    const { data, error } = await supabase
      .from('episodes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError('Failed to update episode: ' + error.message, 500);
    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase.from('episodes').delete().eq('id', id);
    if (error) throw new AppError('Failed to delete episode: ' + error.message, 500);
    return { message: 'Episode deleted successfully' };
  }
}
