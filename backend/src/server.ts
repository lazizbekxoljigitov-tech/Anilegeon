import app from './app';
import { env, validateEnv } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    // Validate environment variables
    validateEnv();

    const PORT = env.PORT || 5000;

    app.listen(PORT, '0.0.0.0', () => {
      logger.success(`🚀 ANILEGEON Backend running and listening on 0.0.0.0:${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
