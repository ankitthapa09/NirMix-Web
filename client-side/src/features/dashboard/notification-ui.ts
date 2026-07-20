import { Bell, CalendarDays, CheckCircle2, Star, type LucideIcon } from "lucide-react";
import type { NotificationType } from "@/lib/notification-api";

export const NOTIFICATION_ACCENT = "#B05B33";

const TYPE_META: Record<NotificationType, { icon: LucideIcon; tint: string }> = {
  visit_requested: { icon: CalendarDays, tint: "#B05B33" },
  visit_status: { icon: CheckCircle2, tint: "#157A74" },
  review_received: { icon: Star, tint: "#E5A93A" },
};

/** Icon + tint for a notification type, with a safe fallback for unknown types. */
export function typeMeta(type: NotificationType): { icon: LucideIcon; tint: string } {
  return TYPE_META[type] ?? { icon: Bell, tint: NOTIFICATION_ACCENT };
}

/** Short relative time, falling back to a date once it's over a week old. */
export function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
