"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type ApiNotification,
} from "./notification-api";

interface NotificationContextType {
  notifications: ApiNotification[];
  unreadCount: number;
  loading: boolean;
  /** Optimistically mark one read — safe to call while navigating away. */
  markRead: (id: string) => void;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications);
    } catch {
      /* silent — keep whatever we have */
    }
  }, []);

  // Load (or clear) notifications as auth state settles.
  useEffect(() => {
    if (isLoading) return;
    let active = true;
    (async () => {
      if (!isAuthenticated) {
        setNotifications([]);
        return;
      }
      setLoading(true);
      try {
        const data = await fetchNotifications();
        if (active) setNotifications(data.notifications);
      } catch {
        /* silent */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated, isLoading]);

  // Derived from the list so the badge and the page can never disagree.
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markRead = useCallback(
    (id: string) => {
      const target = notifications.find((n) => n._id === id);
      if (!target || target.read) return; // already read — nothing to do
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      void markNotificationRead(id).catch(() => {});
    },
    [notifications]
  );

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t mark all as read.");
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t delete the notification.");
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, markRead, markAllRead, remove, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}
