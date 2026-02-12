import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  static async getWatchHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.getWatchHistory(req.user!.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateWatchHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { anime_id, episode_id, progress } = req.body;
      const data = await UserService.updateWatchHistory(req.user!.id, anime_id, episode_id, progress);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getSavedAnime(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.getSavedAnime(req.user!.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async toggleSaveAnime(req: Request, res: Response, next: NextFunction) {
    try {
      const { anime_id } = req.body;
      const data = await UserService.saveAnime(req.user!.id, anime_id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async checkSaved(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.checkSaved(req.user!.id, req.params.animeId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async searchUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.searchById(req.params.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
