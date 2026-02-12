import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      console.log('Registration attempt for:', email);
      const result = await AuthService.register(name, email, password);
      console.log('Registration result:', result);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error('Registration error:', error);
      next(error);
    }
  }

  static async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyOTP(email, otp);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await AuthService.requestPasswordReset(email);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await AuthService.resetPassword(email, otp, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const updates: any = {};
      if (req.body.name) updates.name = req.body.name;

      if (req.file) {
        updates.avatar_url = await UploadService.uploadFile('avatars', req.file);
      }

      const user = await AuthService.updateProfile(req.user!.id, updates);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}
