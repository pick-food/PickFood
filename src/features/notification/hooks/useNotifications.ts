import { useState, useCallback } from "react";
import {
  getNotifications,
  deleteNotifications,
  readNotifications,
  readAllNotifications,
  deleteAllNotifications,
} from "../services/notificationApi";
import type { Notification } from "../services/notificationApi";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // ── GET /notifications ────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {
      setError("알림을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── PATCH /notifications/read (선택 읽음) ──────────────────────────────────
  const markRead = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    try {
      await readNotifications(ids);
      setNotifications(prev =>
        prev.map(n => ids.includes(n.id) ? { ...n, is_read: true } : n)
      );
    } catch {
      setError("읽음 처리에 실패했습니다.");
    }
  }, []);

  // ── PATCH /notifications/read-all (전체 읽음) ─────────────────────────────
  const markAllRead = useCallback(async () => {
    try {
      await readAllNotifications();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {
      setError("전체 읽음 처리에 실패했습니다.");
    }
  }, []);

  // ── DELETE /notifications (선택 삭제) ─────────────────────────────────────
  const removeSelected = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    try {
      await deleteNotifications(ids);
      setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
    } catch {
      setError("알림 삭제에 실패했습니다.");
    }
  }, []);

  // ── DELETE /notifications/all (전체 삭제) ────────────────────────────────
  const removeAll = useCallback(async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch {
      setError("전체 삭제에 실패했습니다.");
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markRead,
    markAllRead,
    removeSelected,
    removeAll,
  };
}
