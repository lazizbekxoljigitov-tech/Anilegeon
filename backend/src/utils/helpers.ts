export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function sanitizeString(str: string): string {
  return str.replace(/[<>]/g, '').trim();
}

export function paginate(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  return { offset, limit: Math.min(limit, 100) };
}
