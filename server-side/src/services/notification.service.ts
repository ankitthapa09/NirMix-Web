import { Types } from 'mongoose';
import {
  createNotification,
  findNotificationsByUser,
  countUnread,
  findNotificationById,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotificationById,
} from '../repositories/notification.repository.js';
import { INotification } from '../models/notificationModel.js';
import { CreateNotificationInput } from '../types/notification.types.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

class NotificationService {
  /**
   * Raise a notification. This runs as a side effect of another action (a visit
   * booking, a review), so it deliberately never throws — failing to notify must
   * not fail the action that triggered it.
   */
  async notify(input: CreateNotificationInput): Promise<void> {
    try {
      await createNotification({
        user: new Types.ObjectId(input.user),
        type: input.type,
        title: input.title,
        message: input.message,
        property: input.property ? new Types.ObjectId(input.property) : undefined,
        link: input.link,
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  /** A user's notifications plus their unread count. */
  async getNotifications(
    userId: string
  ): Promise<{ notifications: INotification[]; unreadCount: number }> {
    const [notifications, unreadCount] = await Promise.all([
      findNotificationsByUser(userId),
      countUnread(userId),
    ]);
    return { notifications, unreadCount };
  }

  /** Mark one notification read — only its recipient may do this. */
  async markRead(userId: string, id: string): Promise<INotification> {
    await this.ownedOrThrow(userId, id);
    const updated = await markNotificationRead(id);
    if (!updated) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Notification not found');
    }
    return updated;
  }

  /** Mark every unread notification read; returns how many changed. */
  async markAllRead(userId: string): Promise<number> {
    return markAllNotificationsRead(userId);
  }

  /** Delete a notification — only its recipient may do this. */
  async remove(userId: string, id: string): Promise<void> {
    await this.ownedOrThrow(userId, id);
    await deleteNotificationById(id);
  }

  /** Loads a notification and asserts the caller is its recipient. */
  private async ownedOrThrow(userId: string, id: string): Promise<INotification> {
    const notification = await findNotificationById(id);
    if (!notification) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Notification not found');
    }
    if (notification.user.toString() !== userId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only manage your own notifications');
    }
    return notification;
  }
}

export default new NotificationService();
