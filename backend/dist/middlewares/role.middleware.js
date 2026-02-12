"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Authentication required.' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ success: false, error: 'Access denied. Insufficient permissions.' });
            return;
        }
        next();
    };
}
exports.adminOnly = roleMiddleware('admin');
//# sourceMappingURL=role.middleware.js.map