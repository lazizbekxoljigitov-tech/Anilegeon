"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
exports.notFoundMiddleware = notFoundMiddleware;
const logger_1 = require("../utils/logger");
const helpers_1 = require("../utils/helpers");
function errorMiddleware(err, _req, res, _next) {
    logger_1.logger.error(err.message);
    if (err instanceof helpers_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }
    if (err.name === 'MulterError') {
        res.status(400).json({
            success: false,
            error: `Upload error: ${err.message}`,
        });
        return;
    }
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            error: 'Invalid token',
        });
        return;
    }
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
}
function notFoundMiddleware(_req, res) {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
}
//# sourceMappingURL=error.middleware.js.map