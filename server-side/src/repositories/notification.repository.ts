import Notification, { INotification } from '../models/notificationModel.js';

/** Persist a new notification. */
export async function createNotification(data: Partial<INotification>): Promise<INotification> {
  const notification = new Notification(data);
  return notification.save();
}

/** A recipient's notifications, newest first, with a light property summary for linking. */
export async function findNotificationsByUser(userId: string, limit = 50): Promise<INotification[]> {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('property', 'title referenceId photos');
}

export async function countUnread(userId: string): Promise<number> {
  return Notification.countDocuments({ user: userId, read: false });
}

export async function findNotificationById(id: string): Promise<INotification | null> {
  return Notification.findById(id);
}

export async function markNotificationRead(id: string): Promise<INotification | null> {
  return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
}

/** Mark every unread notification for a user as read; returns how many changed. */
export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await Notification.updateMany({ user: userId, read: false }, { read: true });
  return result.modifiedCount ?? 0;
}

export async function deleteNotificationById(id: string): Promise<INotification | null> {
  return Notification.findByIdAndDelete(id);
}
