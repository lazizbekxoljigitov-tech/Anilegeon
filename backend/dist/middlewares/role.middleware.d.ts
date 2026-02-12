import { Request, Response, NextFunction } from 'express';
export declare function roleMiddleware(...roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
export declare const adminOnly: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map