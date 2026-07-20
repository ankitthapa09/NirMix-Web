"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, BellOff, CheckCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type ApiNotification,
} from "@/lib/notification-api";
import { typeMeta, timeAgo, NOTIFICATION_ACCENT } from "../notification-ui";

/** Most recent notifications shown in the dropdown; the rest live on the full page. */
const MAX_ITEMS = 8;

export function NotificationBell() {
  const { user } = useAuth();
  const [items, setItems] = useState<ApiNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load once the user is known; silent on failure (badge just stays hidden).
  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      try {
        const data = await fetchNotifications();
        if (!active) return;
        setItems(data.notifications);
        setUnread(data.unreadCount);
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Optimistic — the row is already navigating, so don't block on the request.
  const handleOpenItem = (n: ApiNotification) => {
    setOpen(false);
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t mark all as read.");
    }
  };

  if (!user) return null;

  const visible = items.slice(0, MAX_ITEMS);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread > 0 ? `Notifications (${unread} unread)` : "Notifications"}
        aria-expanded={open}
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white cursor-pointer"
      >
        <Bell className="h-8 w-8 text-black" />
        {unread > 0 && (
          <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#4A5544] bg-red-500 px-1 text-[10px] font-extrabold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#E0D4C5] bg-white shadow-[0_20px_50px_-20px_rgba(52,36,23,0.45)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E0D4C5]/70 px-4 py-3">
            <p className="text-sm font-extrabold text-[#342417]">
              Notifications
              {unread > 0 && (
                <span className="ml-1.5 text-[11px] font-bold text-[#5C4D3C]/60">({unread} new)</span>
              )}
            </p>
            {unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5C4D3C]/70 transition hover:text-[#342417] cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <span
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${NOTIFICATION_ACCENT}1a`, color: NOTIFICATION_ACCENT }}
              >
                <BellOff className="h-5 w-5" />
              </span>
              <p className="text-sm font-bold text-[#342417]">No notifications yet</p>
              <p className="mt-1 text-xs text-[#5C4D3C]/70">
                Visit requests and reviews will appear here.
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-[#E0D4C5]/50">
              {visible.map((n) => {
                const meta = typeMeta(n.type);
                const Icon = meta.icon;
                return (
                  <Link
                    key={n._id}
                    href={n.link ?? "/dashboard/notifications"}
                    onClick={() => handleOpenItem(n)}
                    className={`flex items-start gap-3 px-4 py-3 transition hover:bg-[#FBF7EF] ${
                      n.read ? "" : "bg-[#FBF7EF]/60"
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${meta.tint}1a`, color: meta.tint }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-bold text-[#342417]">{n.title}</span>
                        {!n.read && (
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: NOTIFICATION_ACCENT }}
                          />
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-[#5C4D3C]">
                        {n.message}
                      </span>
                      <span className="mt-1 block text-[10px] text-[#5C4D3C]/55">{timeAgo(n.createdAt)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 border-t border-[#E0D4C5]/70 px-4 py-3 text-xs font-bold text-[#342417] transition hover:bg-[#FBF7EF]"
          >
            View all notifications
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
