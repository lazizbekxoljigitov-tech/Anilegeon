import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare function optionalAuth(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map