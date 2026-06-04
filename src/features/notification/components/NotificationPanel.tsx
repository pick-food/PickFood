import { useState, useEffect, useRef, type FC } from "react";
import { useNotifications } from "../hooks/useNotifications";
import type { Notification, NotificationType } from "../services/notificationApi";

// ── 알림 타입별 메타 ────────────────────────────────────────────────────────
const TYPE_META: Record<NotificationType, { emoji: string; label: string; bg: string; color: string }> = {
  allergy:  { emoji: '⚠️', label: '안전 알림', bg: '#FEF2F2', color: '#D32F2F' },
  delivery: { emoji: '🚚', label: '배송',      bg: '#F0F6F1', color: '#1F6B45' },
  deal:     { emoji: '🏷️', label: '혜택',      bg: '#FFF8EC', color: '#B97308' },
  coupon:   { emoji: '🎟️', label: '쿠폰',      bg: '#FFF8EC', color: '#B97308' },
  review:   { emoji: '✍️', label: '후기',      bg: '#F4F5F1', color: '#3A4A3F' },
  system:   { emoji: '🔔', label: '시스템',    bg: '#F4F5F1', color: '#3A4A3F' },
};

function formatTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return '방금 전';
  if (diff < 3600)  return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

// ── Props ───────────────────────────────────────────────────────────────────
interface NotificationPanelProps {
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
  /** Ref of the container that wraps both the trigger button and this panel.
   *  Outside-click will NOT close the panel when the click is inside this container. */
  containerRef?: React.RefObject<HTMLElement | null>;
}

// ── Component ───────────────────────────────────────────────────────────────
const NotificationPanel: FC<NotificationPanelProps> = ({ onClose, onUnreadCountChange, containerRef }) => {
  const {
    notifications, unreadCount, loading, error,
    fetchNotifications, markRead, markAllRead, removeSelected, removeAll,
  } = useNotifications();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  // 패널 열릴 때 알림 로드
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 읽지 않은 수 상위로 전달
  useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  // 외부 클릭 시 닫기 — 트리거 버튼과 패널을 감싸는 containerRef 내부는 제외
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node;
      const insideContainer = containerRef?.current?.contains(target);
      if (!insideContainer) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, containerRef]);

  // ── 체크박스 핸들러 ─────────────────────────────────────────────────────
  const isAllSelected = notifications.length > 0 && selected.size === notifications.length;

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(notifications.map(n => n.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ── 액션 핸들러 ────────────────────────────────────────────────────────
  async function handleMarkRead(ids: string[]) {
    await markRead(ids);
    setSelected(prev => { const s = new Set(prev); ids.forEach(id => s.delete(id)); return s; });
  }

  async function handleRemoveSelected() {
    const ids = [...selected];
    await removeSelected(ids);
    setSelected(new Set());
  }

  async function handleRemoveAll() {
    await removeAll();
    setSelected(new Set());
  }

  async function handleMarkAllRead() {
    await markAllRead();
    setSelected(new Set());
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      ref={panelRef}
      className="pf-scale-in"
      style={{
        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
        width: 420, maxHeight: 580, background: '#fff', borderRadius: 14,
        border: '1px solid #E5E7E1', boxShadow: '0 16px 48px rgba(15,30,18,0.16)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 70,
        transformOrigin: 'top right',
      }}
    >
      {/* ── 헤더 ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0F2EC', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12' }}>알림</span>
          {unreadCount > 0 && (
            <span style={{ marginLeft: 7, fontSize: 11, fontWeight: 700, padding: '2px 7px', background: '#D32F2F', color: '#fff', borderRadius: 999 }}>
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={handleMarkAllRead}
          style={{ background: '#F0F6F1', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#1F4D2C', fontWeight: 700, padding: '6px 10px', borderRadius: 8 }}
        >
          전체 읽음
        </button>
        <button
          onClick={handleRemoveAll}
          style={{ background: '#FEF2F2', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#D32F2F', fontWeight: 700, padding: '6px 10px', borderRadius: 8 }}
        >
          전체 삭제
        </button>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6l-12 12" stroke="#9AA89D" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── 툴바 (항목 있을 때) ──────────────────────────────────────────── */}
      {notifications.length > 0 && (
        <div style={{ padding: '8px 18px', borderBottom: '1px solid #F0F2EC', display: 'flex', alignItems: 'center', gap: 10, background: '#FAFAF7' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' as const }}>
            <span
              onClick={toggleSelectAll}
              style={{
                width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                border: `1.5px solid ${isAllSelected ? '#1F4D2C' : '#C9CFC4'}`,
                background: isAllSelected ? '#1F4D2C' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              {isAllSelected && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span style={{ fontSize: 12, color: '#3A4A3F', fontWeight: 600 }}>
              전체 선택 {selected.size > 0 && `(${selected.size}개 선택됨)`}
            </span>
          </label>
          {selected.size > 0 && (
            <button
              onClick={handleRemoveSelected}
              style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #E5E7E1', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#D32F2F', fontWeight: 600, padding: '4px 10px', borderRadius: 6 }}
            >
              선택 삭제
            </button>
          )}
        </div>
      )}

      {/* ── 알림 목록 ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9AA89D', fontSize: 13 }}>불러오는 중…</div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#D32F2F', fontSize: 13 }}>{error}</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔔</div>
            <div style={{ fontSize: 13, color: '#6B7A6E', fontWeight: 600 }}>알림이 없습니다</div>
            <div style={{ fontSize: 12, color: '#9AA89D', marginTop: 4 }}>새로운 알림이 오면 여기에 표시됩니다</div>
          </div>
        ) : (
          notifications.map(notif => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              isSelected={selected.has(notif.id)}
              onToggle={() => toggleOne(notif.id)}
              onMarkRead={() => handleMarkRead([notif.id])}
              onDelete={() => removeSelected([notif.id])}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ── NotificationItem ─────────────────────────────────────────────────────────
const NotificationItem: FC<{
  notif: Notification;
  isSelected: boolean;
  onToggle: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
}> = ({ notif, isSelected, onToggle, onMarkRead, onDelete }) => {
  const meta = TYPE_META[notif.type] ?? TYPE_META.system;

  return (
    <div
      style={{
        padding: '12px 18px', borderBottom: '1px solid #F4F5F0',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: notif.is_read ? '#fff' : '#FAFAF7',
        transition: 'background 160ms',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F4F5F1')}
      onMouseLeave={e => (e.currentTarget.style.background = notif.is_read ? '#fff' : '#FAFAF7')}
    >
      {/* 체크박스 */}
      <span
        onClick={onToggle}
        style={{
          width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 2, cursor: 'pointer',
          border: `1.5px solid ${isSelected ? '#1F4D2C' : '#C9CFC4'}`,
          background: isSelected ? '#1F4D2C' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isSelected && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>

      {/* 타입 아이콘 */}
      <div style={{ width: 34, height: 34, borderRadius: 8, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
        {meta.emoji}
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, padding: '1px 6px', background: meta.bg, borderRadius: 4 }}>
            {meta.label}
          </span>
          {!notif.is_read && (
            <span style={{ width: 5, height: 5, borderRadius: 999, background: '#D32F2F', flexShrink: 0 }} />
          )}
        </div>
        <div style={{ fontSize: 13, fontWeight: notif.is_read ? 500 : 700, color: '#0F1E12', lineHeight: 1.35 }}>
          {notif.title}
        </div>
        <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 3, lineHeight: 1.5 }}>
          {notif.message}
        </div>
        <div style={{ fontSize: 11, color: '#9AA89D', marginTop: 5, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{formatTime(notif.created_at)}</span>
          {!notif.is_read && (
            <button
              onClick={e => { e.stopPropagation(); onMarkRead(); }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, color: '#1F4D2C', fontWeight: 700, padding: 0 }}
            >
              읽음 처리
            </button>
          )}
        </div>
      </div>

      {/* 삭제 버튼 */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px', flexShrink: 0, opacity: 0.5, lineHeight: 1 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6l-12 12" stroke="#3A4A3F" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

export default NotificationPanel;
