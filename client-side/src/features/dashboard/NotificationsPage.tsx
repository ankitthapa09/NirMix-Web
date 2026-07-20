"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BellOff, LogIn, ArrowRight, Trash2, CheckCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type ApiNotification,
} from "@/lib/notification-api";
import { typeMeta, timeAgo, NOTIFICATION_ACCENT as ACCENT } from "./notification-ui";

function RowSkeleton() {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#E0D4C5]/60 bg-white p-4">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#EFE7D8]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 animate-pulse rounded bg-[#EFE7D8]" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-[#EFE7D8]" />
      </div>
    </div>
  );
}

export function NotificationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<ApiNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    (async () => {
      try {
        const data = await fetchNotifications();
        if (!active) return;
        setItems(data.notifications);
        setUnread(data.unreadCount);
      } catch {
        // Fall through to the empty state.
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  // Optimistic — the row is already navigating, so don't block on the request.
  const handleOpen = (n: ApiNotification) => {
    if (n.read) return;
    setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
    setUnread((u) => Math.max(0, u - 1));
    void markNotificationRead(n._id).catch(() => {});
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((x) => ({ ...x, read: true })));
      setUnread(0);
      toast.success("All notifications marked as read.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t mark all as read.");
    }
  };

  const handleDelete = async (id: string) => {
    const target = items.find((x) => x._id === id);
    try {
      await deleteNotification(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
      if (target && !target.read) setUnread((u) => Math.max(0, u - 1));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t delete the notification.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-[2px] w-5 bg-[#B05B33]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#B05B33]">Activity</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#342417] sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-[#5C4D3C]/70">
            {unread > 0 ? `${unread} unread notification${unread === 1 ? "" : "s"}.` : "You’re all caught up."}
          </p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E0D4C5] bg-white px-4 py-2 text-xs font-bold text-[#342417] shadow-sm transition hover:bg-[#FBF7EF] cursor-pointer"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {authLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      ) : !isAuthenticated ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E0D4C5] bg-white/60 px-6 py-20 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}>
            <LogIn className="h-7 w-7" />
          </span>
          <h3 className="text-lg font-extrabold text-[#342417]">Log in to see your notifications</h3>
          <p className="mt-1.5 max-w-sm text-sm text-[#5C4D3C]/70">
            We’ll tell you about visit requests, status updates and new reviews.
          </p>
          <Link href="/login" className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#342417] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#251910]">
            Log in <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E0D4C5] bg-white/60 px-6 py-20 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}>
            <BellOff className="h-7 w-7" />
          </span>
          <h3 className="text-lg font-extrabold text-[#342417]">No notifications yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-[#5C4D3C]/70">
            When someone requests a visit or reviews your listing, it’ll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const meta = typeMeta(n.type);
            const Icon = meta.icon;
            return (
              <div
                key={n._id}
                className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
                  n.read
                    ? "border-[#E0D4C5]/60 bg-white"
                    : "border-[#E0D4C5] bg-[#FBF7EF] shadow-sm"
                }`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${meta.tint}1a`, color: meta.tint }}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <Link
                  href={n.link ?? "/dashboard"}
                  onClick={() => handleOpen(n)}
                  className="min-w-0 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-[#342417]">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />}
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-[#5C4D3C]">{n.message}</p>
                  <span className="mt-1 block text-[11px] text-[#5C4D3C]/55">{timeAgo(n.createdAt)}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(n._id)}
                  aria-label="Delete notification"
                  className="shrink-0 rounded-lg p-1.5 text-[#5C4D3C]/40 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
