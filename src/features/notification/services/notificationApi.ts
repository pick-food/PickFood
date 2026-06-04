import { apiClient } from "../../../shared/lib/apiClient";

interface ApiResponse<T> {
  resultCode: string;
  data: T;
}

// ── 타입 ──────────────────────────────────────────────────────────────────────

export type NotificationType =
  | 'allergy' | 'delivery' | 'deal' | 'coupon' | 'review' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ── 내 알림 목록 조회  GET /notifications ─────────────────────────────────────
export async function getNotifications(): Promise<Notification[]> {
  const res = await apiClient.get<ApiResponse<Notification[]>>("/notifications");
  return res.data.data;
}

// ── 알림 일괄 삭제  DELETE /notifications ─────────────────────────────────────
export async function deleteNotifications(ids: string[]): Promise<void> {
  await apiClient.delete("/notifications", { data: { notification_ids: ids } });
}

// ── 알림 일괄 읽음 처리  PATCH /notifications/read ────────────────────────────
export async function readNotifications(ids: string[]): Promise<void> {
  await apiClient.patch("/notifications/read", { notification_ids: ids });
}

// ── 알림 전체 읽음 처리  PATCH /notifications/read-all ───────────────────────
export async function readAllNotifications(): Promise<void> {
  await apiClient.patch("/notifications/read-all");
}

// ── 알림 전체 삭제  DELETE /notifications/all ─────────────────────────────────
export async function deleteAllNotifications(): Promise<void> {
  await apiClient.delete("/notifications/all");
}
