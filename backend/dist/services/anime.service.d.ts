export declare class AnimeService {
    static getAll(query: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        sort?: string;
        trending?: boolean;
        featured?: boolean;
        status?: string;
    }): Promise<{
        anime: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static getById(id: string): Promise<any>;
    static create(animeData: {
        title: string;
        description?: string;
        banner_url?: string;
        thumbnail_url?: string;
        rating?: number;
        is_trending?: boolean;
        is_featured?: boolean;
        status?: string;
        category_ids?: string[];
    }): Promise<any>;
    static update(id: string, animeData: {
        title?: string;
        description?: string;
        banner_url?: string;
        thumbnail_url?: string;
        rating?: number;
        is_trending?: boolean;
        is_featured?: boolean;
        status?: string;
        category_ids?: string[];
    }): Promise<any>;
    static delete(id: string): Promise<{
        message: string;
    }>;
    static getTrending(): Promise<any[]>;
    static getFeatured(): Promise<any[]>;
    static getTopRated(): Promise<any[]>;
    static getNewEpisodes(): Promise<any[]>;
    static getRelated(animeId: string): Promise<any[]>;
    static incrementViewCount(animeId: string): Promise<void>;
    static recordView(userId: string | undefined, animeId: string, episodeId?: string): Promise<void>;
}
//# sourceMappingURL=anime.service.d.ts.map