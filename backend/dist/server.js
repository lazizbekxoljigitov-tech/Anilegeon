"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const startServer = async () => {
    try {
        // Validate environment variables
        (0, env_1.validateEnv)();
        const PORT = env_1.env.PORT || 5000;
        app_1.default.listen(PORT, () => {
            logger_1.logger.success(`🚀 ANILEGEON Backend running at http://localhost:${PORT}`);
            logger_1.logger.info(`Environment: ${env_1.env.NODE_ENV}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map