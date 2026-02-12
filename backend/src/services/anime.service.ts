import { supabase } from '../config/supabase';
import { AppError, paginate } from '../utils/helpers';

export class AnimeService {
  static async getAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: string;
    trending?: boolean;
    featured?: boolean;
    status?: string;
  }) {
    const { offset, limit } = paginate(query.page, query.limit);

    let q = supabase
      .from('anime')
      .select('*, anime_categories(category_id, categories(id, name))', { count: 'exact' });

    if (query.search) {
      q = q.ilike('title', `%${query.search}%`);
    }

    if (query.status) {
      q = q.eq('status', query.status);
    }

    if (query.trending !== undefined) {
      q = q.eq('is_trending', query.trending);
    }

    if (query.featured !== undefined) {
      q = q.eq('is_featured', query.featured);
    }

    switch (query.sort) {
      case 'rating':
        q = q.order('rating', { ascending: false });
        break;
      case 'oldest':
        q = q.order('created_at', { ascending: true });
        break;
      case 'views':
        q = q.order('view_count', { ascending: false });
        break;
      default:
        q = q.order('created_at', { ascending: false });
    }

    q = q.range(offset, offset + limit - 1);

    const { data, error, count } = await q;

    if (error) throw new AppError('Failed to fetch anime: ' + error.message, 500);

    // If filtering by category, we need a different approach
    if (query.category) {
      const { data: categoryAnime, error: catError } = await supabase
        .from('anime_categories')
        .select('anime_id')
        .eq('category_id', query.category);

      if (catError) throw new AppError('Failed to filter by category', 500);

      const animeIds = categoryAnime?.map((ac) => ac.anime_id) || [];

      let catQuery = supabase
        .from('anime')
        .select('*, anime_categories(category_id, categories(id, name))', { count: 'exact' })
        .in('id', animeIds)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: filteredData, error: filteredError, count: filteredCount } = await catQuery;
      if (filteredError) throw new AppError('Failed to fetch anime', 500);

      return {
        anime: filteredData || [],
        total: filteredCount || 0,
        page: query.page || 1,
        totalPages: Math.ceil((filteredCount || 0) / limit),
      };
    }

    return {
      anime: data || [],
      total: count || 0,
      page: query.page || 1,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('anime')
      .select('*, anime_categories(category_id, categories(id, name)), episodes(*)')
      .eq('id', id)
      .order('episode_number', { referencedTable: 'episodes', ascending: true })
      .single();

    if (error || !data) throw new AppError('Anime not found', 404);
    return data;
  }

  static async create(animeData: {
    title: string;
    description?: string;
    banner_url?: string;
    thumbnail_url?: string;
    rating?: number;
    is_trending?: boolean;
    is_featured?: boolean;
    status?: string;
    category_ids?: string[];
  }) {
    const { category_ids, ...insertData } = animeData;

    const { data, error } = await supabase
      .from('anime')
      .insert(insertData)
      .select()
      .single();

    if (error) throw new AppError('Failed to create anime: ' + error.message, 500);

    // Link categories
    if (category_ids && category_ids.length > 0) {
      const links = category_ids.map((catId) => ({
        anime_id: data.id,
        category_id: catId,
      }));
      await supabase.from('anime_categories').insert(links);
    }

    return data;
  }

  static async update(id: string, animeData: {
    title?: string;
    description?: string;
    banner_url?: string;
    thumbnail_url?: string;
    rating?: number;
    is_trending?: boolean;
    is_featured?: boolean;
    status?: string;
    category_ids?: string[];
  }) {
    const { category_ids, ...updateData } = animeData;

    const { data, error } = await supabase
      .from('anime')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError('Failed to update anime: ' + error.message, 500);

    // Update categories
    if (category_ids !== undefined) {
      await supabase.from('anime_categories').delete().eq('anime_id', id);
      if (category_ids.length > 0) {
        const links = category_ids.map((catId) => ({
          anime_id: id,
          category_id: catId,
        }));
        await supabase.from('anime_categories').insert(links);
      }
    }

    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase.from('anime').delete().eq('id', id);
    if (error) throw new AppError('Failed to delete anime: ' + error.message, 500);
    return { message: 'Anime deleted successfully' };
  }

  static async getTrending() {
    const { data, error } = await supabase
      .from('anime')
      .select('*, anime_categories(category_id, categories(id, name))')
      .eq('is_trending', true)
      .order('view_count', { ascending: false })
      .limit(20);

    if (error) {
      console.error('getTrending error:', error);
      throw new AppError('Failed to fetch trending: ' + error.message, 500);
    }
    return data || [];
  }

  static async getFeatured() {
    const { data, error } = await supabase
      .from('anime')
      .select('*, anime_categories(category_id, categories(id, name))')
      .eq('is_featured', true)
      .limit(5);

    if (error) {
      console.error('getFeatured error:', error);
      throw new AppError('Failed to fetch featured: ' + error.message, 500);
    }
    return data || [];
  }

  static async getTopRated() {
    const { data, error } = await supabase
      .from('anime')
      .select('*, anime_categories(category_id, categories(id, name))')
      .order('rating', { ascending: false })
      .limit(20);

    if (error) {
      console.error('getTopRated error:', error);
      throw new AppError('Failed to fetch top rated: ' + error.message, 500);
    }
    return data || [];
  }

  static async getNewEpisodes() {
    const { data, error } = await supabase
      .from('episodes')
      .select('*, anime(id, title, thumbnail_url, banner_url)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('getNewEpisodes error:', error);
      throw new AppError('Failed to fetch new episodes: ' + error.message, 500);
    }
    return data || [];
  }

  static async getRelated(animeId: string) {
    // Get categories of this anime
    const { data: cats } = await supabase
      .from('anime_categories')
      .select('category_id')
      .eq('anime_id', animeId);

    if (!cats || cats.length === 0) {
      const { data } = await supabase
        .from('anime')
        .select('*, anime_categories(category_id, categories(id, name))')
        .neq('id', animeId)
        .order('rating', { ascending: false })
        .limit(10);
      return data || [];
    }

    const catIds = cats.map((c) => c.category_id);
    const { data: relatedLinks } = await supabase
      .from('anime_categories')
      .select('anime_id')
      .in('category_id', catIds)
      .neq('anime_id', animeId);

    const relatedIds = [...new Set(relatedLinks?.map((r) => r.anime_id) || [])].slice(0, 10);

    if (relatedIds.length === 0) return [];

    const { data } = await supabase
      .from('anime')
      .select('*, anime_categories(category_id, categories(id, name))')
      .in('id', relatedIds)
      .limit(10);

    return data || [];
  }

  static async incrementViewCount(animeId: string) {
    const { data: anime } = await supabase
      .from('anime')
      .select('view_count')
      .eq('id', animeId)
      .single();

    if (anime) {
      await supabase
        .from('anime')
        .update({ view_count: (anime.view_count || 0) + 1 })
        .eq('id', animeId);
    }
  }

  static async recordView(userId: string | undefined, animeId: string, episodeId?: string) {
    await supabase.from('views').insert({
      user_id: userId || null,
      anime_id: animeId,
      episode_id: episodeId || null,
    });
    await this.incrementViewCount(animeId);
  }
}
