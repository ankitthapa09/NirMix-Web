export const NOTIFICATION_TYPES = [
  'visit_requested', // someone booked a visit on the recipient's property
  'visit_status', // the owner confirmed / cancelled / completed the visitor's request
  'review_received', // someone reviewed the recipient's property
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/**
 * Payload for raising a notification. Notifications are only ever created
 * server-side as a side effect of another action, so there is no client-facing
 * zod schema — nothing here is posted by a user.
 */
export interface CreateNotificationInput {
  /** Recipient user id. */
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  /** Related property, when the notification is about a listing. */
  property?: string;
  /** Where clicking the notification should take the recipient. */
  link?: string;
}
