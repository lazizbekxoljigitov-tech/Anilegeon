import { Request, Response, NextFunction } from 'express';
import { EpisodeService } from '../services/episode.service';
import { UploadService } from '../services/upload.service';

export class EpisodeController {
  static async getByAnimeId(req: Request, res: Response, next: NextFunction) {
    try {
      const episodes = await EpisodeService.getByAnimeId(req.params.animeId);
      res.json({ success: true, data: episodes });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const episode = await EpisodeService.getById(req.params.id);
      res.json({ success: true, data: episode });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const episodeData = { ...req.body };
      
      // Strict type safety for numeric fields
      if (episodeData.episode_number) episodeData.episode_number = Number(episodeData.episode_number);
      if (episodeData.duration) episodeData.duration = Number(episodeData.duration);

      const episode = await EpisodeService.create(episodeData);
      res.status(201).json({ success: true, data: episode });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updates = { ...req.body };
      
      if (updates.episode_number) updates.episode_number = Number(updates.episode_number);
      if (updates.duration) updates.duration = Number(updates.duration);

      const episode = await EpisodeService.update(req.params.id, updates);
      res.json({ success: true, data: episode });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EpisodeService.delete(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
