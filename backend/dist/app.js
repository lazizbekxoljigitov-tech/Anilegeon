"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middlewares/error.middleware");
// Route imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const anime_routes_1 = __importDefault(require("./routes/anime.routes"));
const episode_routes_1 = __importDefault(require("./routes/episode.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const app = (0, express_1.default)();
// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use((0, compression_1.default)());
// CORS — allow frontend dev server and production origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:4000',
    'http://127.0.0.1:5173',
];
// Add production URL from environment if exists
if (env_1.env.FRONTEND_URL) {
    allowedOrigins.push(env_1.env.FRONTEND_URL);
}
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, mobile apps)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        callback(new Error(`CORS: origin "${origin}" not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'ANILEGEON API is running',
        environment: env_1.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});
// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', auth_routes_1.default);
app.use('/api/anime', anime_routes_1.default);
app.use('/api/episodes', episode_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
// ─── 404 & Error Handling ─────────────────────────────────────────────────────
app.use(error_middleware_1.notFoundMiddleware);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map