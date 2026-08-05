import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService.js';

export const userController = {
  async upsertUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, name, email, service, promotionToolkitData } = req.body;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
      }

      const user = await userService.upsertUser({ userId, name, email, service, promotionToolkitData });
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
};
