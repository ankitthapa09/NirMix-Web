import { API_BASE } from "./property-api";
import { apiFetch } from "./api-client";

export type NotificationType = "visit_requested" | "visit_status" | "review_received";

/** Light property summary populated on notifications that reference a listing. */
export interface ApiNotificationProperty {
  _id: string;
  title: string;
  referenceId?: string;
  photos?: { url: string; publicId: string }[];
}

export interface ApiNotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  property?: ApiNotificationProperty | string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResult {
  notifications: ApiNotification[];
  unreadCount: number;
}

/** The signed-in user's notifications + unread count. */
export async function fetchNotifications(): Promise<NotificationsResult> {
  const res = await apiFetch(`${API_BASE}/notifications`);
  if (!res.ok) throw new Error("Failed to load notifications");
  const json = await res.json();
  return (json.data as NotificationsResult) ?? { notifications: [], unreadCount: 0 };
}

/** Mark a single notification as read. */
export async function markNotificationRead(id: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/notifications/${id}/read`, { method: "PATCH" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Failed to mark as read");
}

/** Mark every unread notification as read; resolves with how many changed. */
export async function markAllNotificationsRead(): Promise<number> {
  const res = await apiFetch(`${API_BASE}/notifications/read-all`, { method: "PATCH" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Failed to mark all as read");
  return json.data?.updated ?? 0;
}

/** Remove a notification. */
export async function deleteNotification(id: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/notifications/${id}`, { method: "DELETE" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Failed to delete notification");
}
