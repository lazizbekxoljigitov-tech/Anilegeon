import { Request, Response, NextFunction } from 'express';
export declare class SettingsController {
    static updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPreferences(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePreferences(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPrivacy(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePrivacy(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBlockedUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static unblockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static clearWatchHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static exportWatchHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteAccount(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static exportAccountData(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=settings.controller.d.ts.map