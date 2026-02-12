import express from 'express';
import path from 'path';
import cors from 'cors';
import { env } from './config/env';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';
import { logger } from './utils/logger';

// Route imports
import authRoutes from './routes/auth.routes';
import animeRoutes from './routes/anime.routes';
import episodeRoutes from './routes/episode.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import categoryRoutes from './routes/category.routes';
import uploadRoutes from './routes/upload.routes';
import settingsRoutes from './routes/settings.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../public')));

// ...

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// SPA wildcard route - serve index.html for any other requests
app.get('*', (req, res, next) => {
  // Check if it's an API route, if so, let it hit the 404 middleware
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// Error Handling
app.use(errorMiddleware);

export default app;
