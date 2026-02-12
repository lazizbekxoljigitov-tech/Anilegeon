import app from './app';
import { env, validateEnv } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    // Validate environment variables
    validateEnv();

    const PORT = env.PORT || 5000;

    app.listen(PORT, () => {
      logger.success(`🚀 ANILEGEON Backend running at http://localhost:${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
