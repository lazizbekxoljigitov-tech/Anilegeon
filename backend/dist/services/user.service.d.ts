export declare class UserService {
    static getAll(query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        users: {
            id: any;
            name: any;
            email: any;
            role: any;
            avatar_url: any;
            created_at: any;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static delete(id: string): Promise<{
        message: string;
    }>;
    static getWatchHistory(userId: string): Promise<any[]>;
    static updateWatchHistory(userId: string, animeId: string, episodeId: string, progress: number): Promise<any>;
    static getSavedAnime(userId: string): Promise<any[]>;
    static saveAnime(userId: string, animeId: string): Promise<{
        saved: boolean;
        message: string;
    }>;
    static checkSaved(userId: string, animeId: string): Promise<{
        saved: boolean;
    }>;
    static getStats(): Promise<{
        totalUsers: number;
        totalAnime: number;
        totalViews: number;
        totalEpisodes: number;
    }>;
    static searchById(id: string): Promise<{
        id: any;
        name: any;
        avatar_url: any;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map