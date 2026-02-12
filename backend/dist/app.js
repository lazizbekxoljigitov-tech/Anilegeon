"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middlewares/error.middleware");
const logger_1 = require("./utils/logger");
// Route imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const anime_routes_1 = __importDefault(require("./routes/anime.routes"));
const episode_routes_1 = __importDefault(require("./routes/episode.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging
app.use((req, _res, next) => {
    logger_1.logger.debug(`${req.method} ${req.path}`);
    next();
});
// Serve static files from the 'public' folder (Frontend build)
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/anime', anime_routes_1.default);
app.use('/api/episodes', episode_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/categories', category_routes_1.default);
// SPA wildcard route - serve index.html for any other requests
app.get('*', (req, res, next) => {
    // Check if it's an API route, if so, let it hit the 404 middleware
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path_1.default.resolve(__dirname, '../public/index.html'));
});
// Error Handling
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map