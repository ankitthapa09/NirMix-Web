import { Request, Response, NextFunction } from 'express';
import notificationService from '../services/notification.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

class NotificationController {
  /**
   * GET /api/notifications
   * The caller's notifications (newest first) plus their unread count.
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const result = await notificationService.getNotifications(userId);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'Notifications fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notifications/read-all
   * Mark every unread notification as read.
   */
  async markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const updated = await notificationService.markAllRead(userId);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { updated }, 'All notifications marked as read')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notifications/:id/read
   * Mark a single notification as read (recipient only).
   */
  async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const notification = await notificationService.markRead(userId, String(req.params.id));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, notification, 'Notification marked as read')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/notifications/:id
   * Remove a notification (recipient only).
   */
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      await notificationService.remove(userId, String(req.params.id));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, 'Notification deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
