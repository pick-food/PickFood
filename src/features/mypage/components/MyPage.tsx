import { useState, type FC } from "react";
import { useAuth } from "../../auth/store/useAuth";
import {
  PF_CURRENT_USER, PF_ORDERS, PF_WISHLIST,
  getPFActiveAllergenNames, getPFActiveDiseaseNames, getPFProductById,
  type PFOrder, type PFOrderStatus,
} from "../../../data/pfData";

/* ── SVG Icons ─────────────────────────────────────────────── */
const ShipIco    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="1" y="3" width="15" height="13" rx="1" stroke="currentColor" strokeWidth="1.8"/><path d="M16 8h4l3 5v4h-7V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>;
const CartIco    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8"/><path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8"/></svg>;
const HeartIco   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.8"/></svg>;
const ShieldIco  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const MapPinIco  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>;
const UserIco    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const BellIco    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const MapPin2Ico = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#9AA89D" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="#9AA89D" strokeWidth="2"/></svg>;

type TabId = 'orders' | 'cart' | 'wishlist' | 'safety' | 'address' | 'profile' | 'notifications';

const STATUS_LABEL: Record<PFOrderStatus, string> = {
  delivered: '배송 완료',
  shipping:  '배송 중',
  preparing: '상품 준비',
  cancelled: '취소',
};
const STATUS_COLOR: Record<PFOrderStatus, { bg: string; color: string }> = {
  delivered: { bg: '#E8F5E9', color: '#1F6B45' },
  shipping:  { bg: '#E3F2FD', color: '#1565C0' },
  preparing: { bg: '#FFF8E1', color: '#B97308' },
  cancelled: { bg: '#FCE4EC', color: '#C62828' },
};

/* ── ShippingProgressCard ───────────────────────────────────── */
const ShippingProgressCard: FC<{ order: PFOrder }> = ({ order }) => {
  const doneCount  = order.tracking.filter(s => s.done).length;
  const totalSteps = order.tracking.length;
  const pct        = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  return (
    <div style={{
      background: '#0F1E12', borderRadius: 16, padding: '24px 28px', marginBottom: 24,
      color: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ background: '#1F6B45', color: '#A8E063', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>배송 중</span>
        <span style={{ fontSize: 12, color: '#5A6F60' }}>{order.id}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
        오늘 새벽 7시 이전 도착 예정
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: '#9AA89D' }}>
        <MapPin2Ico /> {order.addr}
      </div>

      {/* Progress bar */}
      <div style={{ background: '#1A2E1F', borderRadius: 999, height: 6, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #1F6B45, #A8E063)', borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>

      {/* Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${order.tracking.length}, 1fr)`, gap: 4 }}>
        {order.tracking.map((step, i) => {
          const isCurrent = step.current;
          const isDone    = step.done && !isCurrent;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 999,
                background: isDone ? '#1F6B45' : isCurrent ? '#A8E063' : '#1A2E1F',
                border: `2px solid ${isDone ? '#1F6B45' : isCurrent ? '#A8E063' : '#2E4035'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDone && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {isCurrent && <div style={{ width: 8, height: 8, borderRadius: 999, background: '#0F1E12' }} />}
              </div>
              <div style={{ fontSize: 11, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#A8E063' : isDone ? '#6B9E76' : '#3A4A3F', textAlign: 'center' }}>{step.step}</div>
              <div style={{ fontSize: 10, color: '#3A4A3F', textAlign: 'center', lineHeight: 1.3 }}>{step.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── ActionButtons ──────────────────────────────────────────── */
const ActionButtons: FC<{ status: PFOrderStatus }> = ({ status }) => {
  const btn = (label: string, primary = false) => (
    <button key={label} style={{
      padding: '6px 14px', border: `1px solid ${primary ? '#1F4D2C' : '#E5E7E1'}`,
      borderRadius: 6, background: primary ? '#1F4D2C' : '#fff',
      color: primary ? '#fff' : '#3A4A3F', fontFamily: 'inherit',
      fontSize: 12, fontWeight: 600, cursor: 'pointer',
    }}>{label}</button>
  );

  if (status === 'shipping')  return <div style={{ display: 'flex', gap: 6 }}>{btn('배송 조회', true)}{btn('주문취소')}</div>;
  if (status === 'preparing') return <div style={{ display: 'flex', gap: 6 }}>{btn('주문 상세')}{btn('주문취소')}</div>;
  if (status === 'cancelled') return <div style={{ display: 'flex', gap: 6 }}>{btn('주문 상세')}{btn('재주문')}</div>;
  return <div style={{ display: 'flex', gap: 6 }}>{btn('주문 상세')}{btn('후기 작성')}{btn('반품')}{btn('환불')}{btn('재주문')}</div>;
};

/* ── OrderCard ──────────────────────────────────────────────── */
const OrderCard: FC<{ order: PFOrder }> = ({ order }) => {
  const sc = STATUS_COLOR[order.status];
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
      {/* Header row */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F2EC', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#6B7A6E', fontVariantNumeric: 'tabular-nums' }}>{order.date}</span>
        <span style={{ width: 1, height: 12, background: '#E5E7E1' }} />
        <span style={{ fontSize: 13, color: '#6B7A6E' }}>{order.id}</span>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: sc.bg, color: sc.color }}>{STATUS_LABEL[order.status]}</span>
        <div style={{ marginLeft: 'auto' }}>
          <ActionButtons status={order.status} />
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {order.items.map(({ p, qty }) => {
          const product = getPFProductById(p);
          if (!product) return null;
          return (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F4F5F1' }}>
                <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#9AA89D', marginBottom: 2 }}>{product.brand}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E12', lineHeight: 1.4 }}>{product.name}</div>
                <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                  {product.price.toLocaleString()}원 · {qty}개
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F2EC', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#9AA89D' }}>총 결제금액</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#0F1E12', fontVariantNumeric: 'tabular-nums' }}>{order.total.toLocaleString()}원</span>
      </div>
    </div>
  );
};

/* ── OrdersContent ──────────────────────────────────────────── */
type OrderTab = 'all' | PFOrderStatus;

const TABS: { id: OrderTab; label: string }[] = [
  { id: 'all',       label: '전체'    },
  { id: 'preparing', label: '상품 준비' },
  { id: 'shipping',  label: '배송 중'  },
  { id: 'delivered', label: '배송 완료' },
  { id: 'cancelled', label: '취소/반품' },
];

const OrdersContent: FC = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>('all');
  const shippingOrder = PF_ORDERS.find(o => o.status === 'shipping');
  const filtered = activeTab === 'all' ? PF_ORDERS : PF_ORDERS.filter(o => o.status === activeTab);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F1E12', marginBottom: 20 }}>주문 / 배송 조회</h2>

      {/* Active shipping progress card */}
      {shippingOrder && activeTab === 'all' && <ShippingProgressCard order={shippingOrder} />}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E7E1', marginBottom: 20 }}>
        {TABS.map(t => {
          const count = t.id === 'all' ? PF_ORDERS.length : PF_ORDERS.filter(o => o.status === t.id).length;
          const active = t.id === activeTab;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '12px 18px', background: 'transparent', border: 'none',
              borderBottom: active ? '2px solid #0F1E12' : '2px solid transparent',
              fontFamily: 'inherit', fontSize: 13,
              fontWeight: active ? 700 : 500,
              color: active ? '#0F1E12' : '#6B7A6E',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {t.label}{t.id === 'all' && ` ${count}`}
            </button>
          );
        })}
      </div>

      {/* Order list */}
      {filtered.map(order => <OrderCard key={order.id} order={order} />)}

      {filtered.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#9AA89D' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#3A4A3F' }}>주문 내역이 없습니다</div>
        </div>
      )}
    </div>
  );
};

/* ── SimpleContent (placeholder) ───────────────────────────── */
const PlaceholderContent: FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '60px 0', textAlign: 'center' }}>
    <div style={{ fontSize: 36, marginBottom: 16 }}>🚧</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: '#0F1E12', marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 13, color: '#9AA89D' }}>준비 중입니다</div>
  </div>
);

/* ── MyPage ─────────────────────────────────────────────────── */
interface MyPageProps {
  onBack?: () => void;
}

const MENU: { id: TabId; label: string; icon: FC; badge?: number }[] = [
  { id: 'orders',        label: '주문/배송',  icon: ShipIco,   badge: PF_ORDERS.filter(o => o.status === 'shipping' || o.status === 'preparing').length },
  { id: 'cart',          label: '장바구니',   icon: CartIco   },
  { id: 'wishlist',      label: '찜한 상품',  icon: HeartIco,  badge: PF_WISHLIST.length },
  { id: 'safety',        label: '안전 프로필', icon: ShieldIco  },
  { id: 'address',       label: '배송지',     icon: MapPinIco  },
  { id: 'profile',       label: '회원 정보',  icon: UserIco    },
  { id: 'notifications', label: '알림 설정',  icon: BellIco    },
];

const MyPage: FC<MyPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState<TabId>('orders');

  const displayName   = user?.name ?? PF_CURRENT_USER.name;
  const allergenNames = getPFActiveAllergenNames();
  const diseaseNames  = getPFActiveDiseaseNames();

  const shippingCount = PF_ORDERS.filter(o => o.status === 'shipping').length;
  const wishlistCount = PF_WISHLIST.length;

  return (
    <div style={{ background: '#F4F5F1', minHeight: '100vh', paddingBottom: 80 }}>

      {/* ── Profile Header ─────────────────────────────────── */}
      <div style={{ background: '#0F1E12', color: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>

          {/* Safety filter strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, fontSize: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#A8E063" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#A8E063" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ color: '#A8E063', fontWeight: 700 }}>안전 필터 ON</span>
            <span style={{ color: '#3A4A3F' }}>·</span>
            <span style={{ color: '#9AA89D' }}>
              {displayName}님
              {allergenNames.length > 0 && ` / ${allergenNames.join('·')}`}
              {diseaseNames.length > 0 && ` / ${diseaseNames.join('·')} 케어`}
              {' '}적용 중
            </span>
            <div style={{ marginLeft: 'auto', color: '#A8E063', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              필터 관리
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#A8E063" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Profile row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Avatar */}
            <div style={{
              width: 64, height: 64, borderRadius: 999, flexShrink: 0,
              background: 'linear-gradient(135deg, #1F4D2C, #2E8B57)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 900, color: '#A8E063',
              border: '2px solid #1F6B45',
            }}>
              {displayName.charAt(0)}
            </div>

            {/* Name + info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{displayName}</span>
                <span style={{
                  background: '#B97308', color: '#fff',
                  fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 4,
                }}>
                  {PF_CURRENT_USER.grade} 멤버
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#6B7A6E' }}>
                {PF_CURRENT_USER.email}
                <span style={{ margin: '0 6px' }}>·</span>
                가입 {PF_CURRENT_USER.joinDate}
                <span style={{ margin: '0 6px' }}>·</span>
                누적 주문 {PF_ORDERS.length}건
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, flexShrink: 0 }}>
              {[
                { label: '배송중',    value: shippingCount,            color: '#A8E063' },
                { label: '장바구니', value: 0,                         color: '#fff'    },
                { label: '찜',       value: wishlistCount,              color: '#fff'    },
                { label: '포인트EP', value: PF_CURRENT_USER.points,    color: '#E89B26' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>
                    {s.value.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: '#5A6F60', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: Sidebar + Content ─────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <aside style={{
          width: 200, flexShrink: 0, background: '#fff', borderRadius: 12,
          border: '1px solid #E5E7E1', overflow: 'hidden', position: 'sticky', top: 24,
        }}>
          {MENU.map((item, i) => {
            const active = activeMenu === item.id;
            const Icon   = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                style={{
                  width: '100%', padding: '14px 20px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: active ? '#F0F6F1' : 'transparent',
                  borderTop: i > 0 ? '1px solid #F4F5F1' : 'none',
                  border: 'none', borderLeft: active ? '3px solid #1F4D2C' : '3px solid transparent',
                  fontFamily: 'inherit', fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? '#1F4D2C' : '#3A4A3F',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ color: active ? '#1F4D2C' : '#9AA89D', display: 'flex' }}><Icon /></span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span style={{
                    background: '#D32F2F', color: '#fff', borderRadius: 999,
                    fontSize: 10, fontWeight: 800, padding: '2px 6px', minWidth: 18, textAlign: 'center',
                  }}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, border: '1px solid #E5E7E1', padding: '28px 32px', minHeight: 400 }}>
          {activeMenu === 'orders'        && <OrdersContent />}
          {activeMenu === 'cart'          && <PlaceholderContent title="장바구니" />}
          {activeMenu === 'wishlist'      && <PlaceholderContent title="찜한 상품" />}
          {activeMenu === 'safety'        && <PlaceholderContent title="안전 프로필" />}
          {activeMenu === 'address'       && <PlaceholderContent title="배송지 관리" />}
          {activeMenu === 'profile'       && <PlaceholderContent title="회원 정보" />}
          {activeMenu === 'notifications' && <PlaceholderContent title="알림 설정" />}
        </div>
      </div>

      {onBack && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px 16px' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: '#6B7A6E', display: 'flex', alignItems: 'center', gap: 4 }}>
            ← 메인으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPage;
