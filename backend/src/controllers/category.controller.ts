import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAll();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getById(req.params.id);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const category = await CategoryService.create(name);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const category = await CategoryService.update(req.params.id, name);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.delete(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
