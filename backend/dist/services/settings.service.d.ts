export declare class SettingsService {
    static getPreferences(userId: string): Promise<any>;
    static updatePreferences(userId: string, updates: any): Promise<any>;
    static getPrivacy(userId: string): Promise<any>;
    static updatePrivacy(userId: string, updates: any): Promise<any>;
    static getNotifications(userId: string): Promise<any>;
    static updateNotifications(userId: string, updates: any): Promise<any>;
    static getBlockedUsers(userId: string): Promise<{
        id: any;
        blocked_user_id: any;
        created_at: any;
        users: {
            id: any;
            name: any;
            avatar_url: any;
        }[];
    }[]>;
    static unblockUser(userId: string, blockId: string): Promise<{
        message: string;
    }>;
    static clearWatchHistory(userId: string): Promise<{
        message: string;
    }>;
    static exportWatchHistory(userId: string): Promise<any[]>;
    static updateProfile(userId: string, updates: any): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        avatar_url: any;
        bio: any;
        gender: any;
        country: any;
        dob: any;
        created_at: any;
    }>;
    static deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    static exportAccountData(userId: string): Promise<{
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            avatar_url: any;
            bio: any;
            gender: any;
            country: any;
            dob: any;
            created_at: any;
        } | null;
        preferences: any;
        privacy: any;
        notifications: any;
        watch_history: any[];
        saved_anime: any[];
        exported_at: string;
    }>;
}
//# sourceMappingURL=settings.service.d.ts.map