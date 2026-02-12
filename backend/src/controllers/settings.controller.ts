import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';

export class SettingsController {

  // ── Profile ──
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.updateProfile(req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // ── Preferences ──
  static async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.getPreferences(req.user!.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.updatePreferences(req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // ── Privacy ──
  static async getPrivacy(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.getPrivacy(req.user!.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async updatePrivacy(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.updatePrivacy(req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // ── Notifications ──
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.getNotifications(req.user!.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async updateNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.updateNotifications(req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // ── Blocked Users ──
  static async getBlockedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.getBlockedUsers(req.user!.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.unblockUser(req.user!.id, req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // ── Watch History ──
  static async clearWatchHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.clearWatchHistory(req.user!.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async exportWatchHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.exportWatchHistory(req.user!.id);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="watch_history.json"');
      res.json(data);
    } catch (error) { next(error); }
  }

  // ── Account / Danger Zone ──
  static async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { confirmation } = req.body;
      if (confirmation !== 'DELETE') {
        return res.status(400).json({ success: false, error: 'Type DELETE to confirm' });
      }
      const data = await SettingsService.deleteAccount(req.user!.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async exportAccountData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.exportAccountData(req.user!.id);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="account_data.json"');
      res.json(data);
    } catch (error) { next(error); }
  }
}
