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

export function validate(rules: ValidationRule[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(rule.message || `${rule.field} is required`);
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rule.type && typeof value !== rule.type) {
        errors.push(`${rule.field} must be a ${rule.type}`);
      }

      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
      }

      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
      }

      if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
        errors.push(`${rule.field} must be at least ${rule.min}`);
      }

      if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
        errors.push(`${rule.field} must be at most ${rule.max}`);
      }

      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push(rule.message || `${rule.field} format is invalid`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ success: false, errors });
      return;
    }

    next();
  };
}

export const registerValidation = validate([
  { field: 'name', required: true, minLength: 2, maxLength: 100 },
  { field: 'email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email is required' },
  { field: 'password', required: true, minLength: 6, message: 'Password must be at least 6 characters' },
]);

export const loginValidation = validate([
  { field: 'email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email is required' },
  { field: 'password', required: true, message: 'Password is required' },
]);

export const animeValidation = validate([
  { field: 'title', required: true, minLength: 1, maxLength: 255 },
]);
