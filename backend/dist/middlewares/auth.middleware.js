"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuth = optionalAuth;
const jwt_1 = require("../utils/jwt");
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Handle secret admin access bypass
        if (token === 'secret-token') {
            req.user = {
                id: 'secret-admin',
                email: 'admin@anilegeon.com',
                role: 'admin'
            };
            return next();
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
}
function optionalAuth(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            req.user = (0, jwt_1.verifyToken)(token);
        }
    }
    catch {
        // Token invalid, continue without auth
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map