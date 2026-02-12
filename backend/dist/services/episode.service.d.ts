export declare class EpisodeService {
    static getByAnimeId(animeId: string): Promise<any[]>;
    static getById(id: string): Promise<any>;
    static create(episodeData: {
        anime_id: string;
        title?: string;
        episode_number: number;
        video_url?: string;
        video_url_720p?: string;
        video_url_1080p?: string;
        video_url_4k?: string;
        duration?: number;
    }): Promise<any>;
    static update(id: string, updates: {
        title?: string;
        episode_number?: number;
        video_url?: string;
        video_url_720p?: string;
        video_url_1080p?: string;
        video_url_4k?: string;
        duration?: number;
    }): Promise<any>;
    static delete(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=episode.service.d.ts.map