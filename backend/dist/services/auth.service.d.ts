import { User } from '../types';
export declare class AuthService {
    private static generateOTP;
    static register(name: string, email: string, password: string): Promise<{
        message: string;
    }>;
    static verifyOTP(email: string, otp: string): Promise<{
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            avatar_url: any;
            created_at: any;
        };
        token: string;
    }>;
    static login(email: string, password: string): Promise<{
        user: any;
        token: string;
    }>;
    static requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    static resetPassword(email: string, otp: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    static getProfile(userId: string): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        avatar_url: any;
        created_at: any;
    }>;
    static updateProfile(userId: string, updates: Partial<Pick<User, 'name' | 'avatar_url'>>): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        avatar_url: any;
        created_at: any;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map