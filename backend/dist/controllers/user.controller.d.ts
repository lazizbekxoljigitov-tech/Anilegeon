import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    static getWatchHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateWatchHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSavedAnime(req: Request, res: Response, next: NextFunction): Promise<void>;
    static toggleSaveAnime(req: Request, res: Response, next: NextFunction): Promise<void>;
    static checkSaved(req: Request, res: Response, next: NextFunction): Promise<void>;
    static searchUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map