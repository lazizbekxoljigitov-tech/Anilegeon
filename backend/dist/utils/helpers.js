"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.sanitizeString = sanitizeString;
exports.paginate = paginate;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function sanitizeString(str) {
    return str.replace(/[<>]/g, '').trim();
}
function paginate(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return { offset, limit: Math.min(limit, 100) };
}
//# sourceMappingURL=helpers.js.map