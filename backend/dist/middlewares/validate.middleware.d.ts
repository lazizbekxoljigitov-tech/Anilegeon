import { Request, Response, NextFunction } from 'express';
type ValidationRule = {
    field: string;
    required?: boolean;
    type?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
};
export declare function validate(rules: ValidationRule[]): (req: Request, res: Response, next: NextFunction) => void;
export declare const registerValidation: (req: Request, res: Response, next: NextFunction) => void;
export declare const loginValidation: (req: Request, res: Response, next: NextFunction) => void;
export declare const animeValidation: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate.middleware.d.ts.map