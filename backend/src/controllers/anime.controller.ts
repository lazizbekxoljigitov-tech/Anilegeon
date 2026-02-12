import { Request, Response, NextFunction } from 'express';
import { AnimeService } from '../services/anime.service';
import { UploadService } from '../services/upload.service';

export class AnimeController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, category, sort, trending, featured, status } = req.query;
      const result = await AnimeService.getAll({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        search: search as string,
        category: category as string,
        sort: sort as string,
        trending: trending !== undefined ? trending === 'true' : undefined,
        featured: featured !== undefined ? featured === 'true' : undefined,
        status: status as string,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const anime = await AnimeService.getById(req.params.id);
      res.json({ success: true, data: anime });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const animeData = { ...req.body };

      // Ensure types are correct for the service
      if (animeData.rating) animeData.rating = parseFloat(animeData.rating);
      if (animeData.is_trending !== undefined) {
         animeData.is_trending = animeData.is_trending === 'true' || animeData.is_trending === true;
      }
      if (animeData.is_featured !== undefined) {
         animeData.is_featured = animeData.is_featured === 'true' || animeData.is_featured === true;
      }

      const anime = await AnimeService.create(animeData);
      res.status(201).json({ success: true, data: anime });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const animeData = { ...req.body };

      if (animeData.rating) animeData.rating = parseFloat(animeData.rating);
      if (animeData.is_trending !== undefined) {
         animeData.is_trending = animeData.is_trending === 'true' || animeData.is_trending === true;
      }
      if (animeData.is_featured !== undefined) {
         animeData.is_featured = animeData.is_featured === 'true' || animeData.is_featured === true;
      }

      const anime = await AnimeService.update(req.params.id, animeData);
      res.json({ success: true, data: anime });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AnimeService.delete(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getTrending(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnimeService.getTrending();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnimeService.getFeatured();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getTopRated(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnimeService.getTopRated();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getNewEpisodes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnimeService.getNewEpisodes();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getRelated(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnimeService.getRelated(req.params.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async recordView(req: Request, res: Response, next: NextFunction) {
    try {
      const { anime_id, episode_id } = req.body;
      await AnimeService.recordView(req.user?.id, anime_id, episode_id);
      res.json({ success: true, message: 'View recorded' });
    } catch (error) {
      next(error);
    }
  }
}
