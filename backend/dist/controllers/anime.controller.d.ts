import { Request, Response, NextFunction } from 'express';
export declare class AnimeController {
    static getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
    static delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTrending(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFeatured(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTopRated(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getNewEpisodes(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRelated(req: Request, res: Response, next: NextFunction): Promise<void>;
    static recordView(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=anime.controller.d.ts.map