import { useState, useEffect, type FC } from "react";
import { useAuth } from "../../auth/store/useAuth";
import { useCart } from "../../cart/hooks/useCart";
import { useLike } from "../../like/hooks/useLike";
import type { Product, BadgeType } from "../../product/models/type";
import type { CartGroupUI, CartItemUI } from "../../cart/models/types";
import { useMyAllergenSummary } from "../../allergen/hooks/useMyAllergenSummary";
import ProductCard from "../../product/components/ProductCard";
import { getMyAllergenGroups, getAllergens, type AllergenGroup, type Allergen } from "../../allergen/services/allergenApi";
import { getMyDiseaseGroups, updateDiseaseGroup, type DiseaseGroup } from "../../allergen/services/diseaseGroupApi";
import {
  getAddresses, createAddress, updateAddress, deleteAddresses,
  type Address, type AddressPayload,
} from "../../address/services/addressApi";
import {
  PF_CURRENT_USER, PF_ORDERS,
  getPFProductById,
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

/* ── WishlistContent ────────────────────────────────────────── */
interface WishlistContentProps {
  onProductClick?: (product: Product) => void;
}

const WishlistContent: FC<WishlistContentProps> = ({ onProductClick }) => {
  const { items, isLoading } = useLike();

  if (isLoading) return (
    <div style={{ padding: '60px 0', textAlign: 'center', color: '#9AA89D', fontSize: 14 }}>
      찜 목록을 불러오는 중...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F1E12', margin: 0 }}>찜한 상품</h2>
        <div style={{ fontSize: 13, color: '#9AA89D', marginTop: 4 }}>총 {items.length}개</div>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '60px 0', background: '#FAFAFA', borderRadius: 12, border: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 16 }}>
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#D0D5CE" strokeWidth="1.5"/>
          </svg>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#3A4A3F', marginBottom: 8 }}>찜한 상품이 없어요</div>
          <div style={{ fontSize: 13, color: '#9AA89D' }}>
            안전한 상품을 찾으면 <span style={{ color: '#E53935' }}>♥</span> 버튼으로 저장해 두세요.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {items.map(item => {
            const pf = getPFProductById(item.product_id);
            const product: Product = pf ? {
              id: pf.id,
              name: pf.name,
              brand: pf.brand,
              price: pf.price,
              originalPrice: pf.originalPrice ?? pf.price,
              discountRate: pf.originalPrice ? Math.round((1 - pf.price / pf.originalPrice) * 100) : 0,
              rating: pf.rating,
              reviewCount: pf.reviews,
              badge: pf.badge as BadgeType,
              badgeBg: '',
              badgeColor: '',
              imageSrc: pf.img,
              allergens: pf.allergens,
              riskDiseases: pf.riskDiseases,
            } : {
              id: item.product_id,
              name: item.title,
              brand: '',
              price: 0,
              originalPrice: 0,
              discountRate: 0,
              rating: 0,
              reviewCount: 0,
              badge: null,
              badgeBg: '',
              badgeColor: '',
              imageSrc: item.image_url ?? '',
            };
            return (
              <ProductCard
                key={item.product_id}
                product={product}
                onClick={() => onProductClick?.(product)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── CartContent ────────────────────────────────────────────── */
const FREE_SHIPPING_AT = 43000;
const SHIPPING_FEE     = 3000;

interface CartContentProps {
  groups: CartGroupUI[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  allChecked: boolean;
  checkedItems: CartItemUI[];
  toggleAll: () => void;
  toggleOne: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  removeOne: (id: string) => void;
  clearChecked: () => void;
}

const CartContent: FC<CartContentProps> = ({
  groups, totalCount, isLoading, error,
  allChecked, checkedItems,
  toggleAll, toggleOne, setQuantity, removeOne, clearChecked,
}) => {

  const productTotal = checkedItems.reduce((sum, i) => sum + i.option.price * i.quantity, 0);
  const shipping     = productTotal > 0 && productTotal < FREE_SHIPPING_AT ? SHIPPING_FEE : 0;
  const grandTotal   = productTotal + shipping;
  const remaining    = FREE_SHIPPING_AT - productTotal;

  if (isLoading) return (
    <div style={{ padding: '60px 0', textAlign: 'center', color: '#9AA89D', fontSize: 14 }}>
      장바구니를 불러오는 중...
    </div>
  );

  if (error) return (
    <div style={{ padding: '60px 0', textAlign: 'center', color: '#E57373', fontSize: 14 }}>
      {error}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F1E12', margin: 0 }}>장바구니</h2>
        <div style={{ fontSize: 13, color: '#9AA89D', marginTop: 4 }}>총 {totalCount}개</div>
      </div>

      {groups.length === 0 ? (
        <div style={{ padding: '60px 0', background: '#FAFAFA', borderRadius: 12, border: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 16 }}>
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#D0D5CE" strokeWidth="1.5" strokeLinejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="#D0D5CE" strokeWidth="1.5"/>
            <path d="M16 10a4 4 0 01-8 0" stroke="#D0D5CE" strokeWidth="1.5"/>
          </svg>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#3A4A3F', marginBottom: 8 }}>장바구니가 비어 있어요</div>
          <div style={{ fontSize: 13, color: '#9AA89D' }}>
            상품 상세 페이지에서 '장바구니'를 눌러 담아 보세요.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* 왼쪽: 상품 목록 */}
          <div style={{ flex: 1 }}>
            {/* 전체선택 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '10px 16px', background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0F1E12' }}>
                <input type="checkbox" checked={allChecked} onChange={toggleAll}
                  style={{ width: 16, height: 16, accentColor: '#1F4D2C', cursor: 'pointer' }} />
                전체선택 ( {checkedItems.length} )
              </label>
              <button onClick={clearChecked} style={{ background: 'transparent', border: '1px solid #E5E7E1', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: '#6B7A6E', cursor: 'pointer', fontFamily: 'inherit' }}>
                선택 비우기
              </button>
            </div>

            {/* 판매자별 그룹 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {groups.map(group => (
                <div key={group.seller.id} style={{ border: '1px solid #E5E7E1', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', background: '#F8FAF8', borderBottom: '1px solid #E5E7E1', fontSize: 12, fontWeight: 700, color: '#3A4A3F' }}>
                    {group.seller.business_name}
                  </div>
                  {group.items.map((item, idx) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderTop: idx > 0 ? '1px solid #F4F5F1' : 'none', background: '#fff' }}>
                      <input type="checkbox" checked={item.checked} onChange={() => toggleOne(item.id)}
                        style={{ width: 16, height: 16, accentColor: '#1F4D2C', cursor: 'pointer', flexShrink: 0 }} />
                      <div style={{ width: 60, height: 60, borderRadius: 8, flexShrink: 0, background: '#F4F5F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#C9CFC4" strokeWidth="1.5" strokeLinejoin="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="#C9CFC4" strokeWidth="1.5"/><path d="M16 10a4 4 0 01-8 0" stroke="#C9CFC4" strokeWidth="1.5"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E12', lineHeight: 1.4 }}>{item.product.title}</div>
                        <div style={{ fontSize: 12, color: '#9AA89D', marginTop: 2 }}>{item.option.name}</div>
                        <div style={{ fontSize: 12, color: '#9AA89D', marginTop: 1 }}>{item.option.price.toLocaleString()}원 · 1개당</div>
                      </div>

                      {/* 수량 조절 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #E5E7E1', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        <button onClick={() => setQuantity(item.id, item.quantity - 1)}
                          style={{ width: 32, height: 32, border: 'none', background: '#F4F5F1', cursor: 'pointer', fontSize: 16, color: '#3A4A3F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#0F1E12' }}>{item.quantity}</span>
                        <button onClick={() => setQuantity(item.id, item.quantity + 1)}
                          style={{ width: 32, height: 32, border: 'none', background: '#F4F5F1', cursor: 'pointer', fontSize: 16, color: '#3A4A3F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>

                      {/* 금액 */}
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12', flexShrink: 0, minWidth: 80, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {(item.option.price * item.quantity).toLocaleString()}원
                      </div>

                      {/* 삭제 */}
                      <button onClick={() => removeOne(item.id)}
                        style={{ flexShrink: 0, background: 'transparent', border: 'none', cursor: 'pointer', color: '#C9CFC4', padding: 4, display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 결제 요약 */}
          <div style={{ width: 280, flexShrink: 0, background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: '20px', position: 'sticky', top: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12', marginBottom: 18 }}>결제 요약</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {[
                { label: '상품금액', value: productTotal.toLocaleString() + '원', color: '#0F1E12' },
                { label: '배송비',   value: shipping === 0 ? '무료' : shipping.toLocaleString() + '원', color: shipping === 0 ? '#1F6B45' : '#0F1E12' },
                { label: '포인트',   value: '0P', color: '#F59E0B' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#6B7A6E' }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>총 결제금액</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#0F1E12', fontVariantNumeric: 'tabular-nums' }}>{grandTotal.toLocaleString()}원</span>
              </div>
            </div>
            {remaining > 0 && (
              <div style={{ background: '#FFF8E1', borderRadius: 8, padding: '10px 12px', marginBottom: 14, fontSize: 12, color: '#B97308' }}>
                ⓘ {remaining.toLocaleString()}원 더 담으면 무료배송
              </div>
            )}
            <button style={{ width: '100%', padding: '14px', background: '#0F1E12', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
              {grandTotal.toLocaleString()}원 주문하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── SafetyContent ──────────────────────────────────────────── */
const DISEASE_LABEL: Record<string, string> = {
  diabetes: '당뇨', hyper_lip: '고지혈증', hyper_tension: '고혈압',
  kidney: '신장질환', thyroid: '갑상선질환', gout: '통풍',
  fatty_liver: '지방간', cardiovascular: '심혈관질환',
};

const DISEASE_LIMITS: Record<string, Array<{ label: string; value: string }>> = {
  diabetes:      [{ label: '당류',   value: '25g'    }, { label: '나트륨', value: '2000mg' }],
  hyper_tension: [{ label: '나트륨', value: '1500mg' }],
  hyper_lip:     [{ label: '지방',   value: '50g'    }, { label: '포화지방', value: '15g' }],
  kidney:        [{ label: '칼륨',   value: '2000mg' }, { label: '인',     value: '700mg'  }],
  gout:          [{ label: '퓨린',   value: '150mg'  }],
  cardiovascular:[{ label: '나트륨', value: '1500mg' }, { label: '포화지방', value: '20g' }],
};

const AVATAR_COLORS = ['#1F4D2C', '#1565C0', '#B97308', '#7B1FA2', '#C62828'];

function flatAllergenList(list: Allergen[]): { id: string; name: string }[] {
  return list.flatMap(a => a.children?.length ? [a, ...flatAllergenList(a.children)] : [{ id: a.id, name: a.name }]);
}

const ToggleSwitch: FC<{ active: boolean; onToggle?: () => void }> = ({ active, onToggle }) => (
  <div
    onClick={onToggle}
    style={{ width: 40, height: 22, borderRadius: 999, background: active ? '#1F4D2C' : '#C9CFC4', position: 'relative', cursor: onToggle ? 'pointer' : 'default', flexShrink: 0, transition: 'background 200ms' }}
  >
    <div style={{ position: 'absolute', top: 3, left: active ? 21 : 3, width: 16, height: 16, borderRadius: 999, background: '#fff', transition: 'left 200ms' }} />
  </div>
);

const SafetyContent: FC = () => {
  const { isLoggedIn } = useAuth();
  const [allergenGroups, setAllergenGroups] = useState<AllergenGroup[]>([]);
  const [allergenList,   setAllergenList]   = useState<Allergen[]>([]);
  const [diseaseGroups,  setDiseaseGroups]  = useState<DiseaseGroup[]>([]);
  const [isLoading,      setIsLoading]      = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    Promise.all([
      getMyAllergenGroups().catch(() => [] as AllergenGroup[]),
      getAllergens().catch(() => [] as Allergen[]),
      getMyDiseaseGroups().catch(() => [] as DiseaseGroup[]),
    ])
      .then(([groups, allergens, diseases]) => {
        setAllergenGroups(Array.isArray(groups)   ? groups   : []);
        setAllergenList  (Array.isArray(allergens) ? allergens : []);
        setDiseaseGroups (Array.isArray(diseases)  ? diseases  : []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isLoggedIn]);

  const flat = flatAllergenList(allergenList ?? []);
  function resolveAllergens(ids: string[]): string[] {
    return ids.map(id => flat.find(a => a.id === id)?.name ?? '').filter(Boolean);
  }

  async function toggleDisease(group: DiseaseGroup) {
    const updated = { ...group, is_active: !group.is_active };
    setDiseaseGroups(prev => prev.map(g => g.id === group.id ? updated : g));
    try { await updateDiseaseGroup(group.id, { name: group.name, disease_ids: group.disease_ids, is_active: updated.is_active }); }
    catch { setDiseaseGroups(prev => prev.map(g => g.id === group.id ? group : g)); }
  }

  const activeAllergenNames = [...new Set(allergenGroups.flatMap(g => resolveAllergens(g.allergen_ids)))];
  const activeDiseaseNames  = [...new Set(diseaseGroups.filter(g => g.is_active).flatMap(g => g.disease_ids.map(d => DISEASE_LABEL[d]).filter(Boolean)))];

  if (isLoading) return (
    <div style={{ padding: '60px 0', textAlign: 'center', color: '#9AA89D', fontSize: 14 }}>
      안전 프로필을 불러오는 중...
    </div>
  );

  return (
    <div>
      {/* 타이틀 */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F1E12', margin: 0 }}>안전 프로필</h2>
        <p style={{ fontSize: 13, color: '#6B7A6E', marginTop: 6, marginBottom: 0 }}>
          알레르기·지병 그룹을 만들면 모든 상품 페이지에서 자동으로 위험 원재료를 검출합니다.
        </p>
      </div>

      {/* 요약 카드 */}
      <div style={{ background: '#0F1E12', borderRadius: 16, padding: '24px 28px', marginBottom: 32, display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 24 }}>
        <div>
          <span style={{ background: '#1F4D2C', color: '#A8E063', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, display: 'inline-block', marginBottom: 16 }}>
            안전 보호 활성
          </span>
          <div style={{ fontSize: 13, color: '#5A6F60', marginBottom: 4 }}>적용 중인 그룹</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{allergenGroups.length}개</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {activeAllergenNames.map(n => (
              <span key={n} style={{ background: '#1A2E1F', color: '#A8E063', borderRadius: 4, padding: '3px 8px', fontSize: 12, fontWeight: 600 }}>{n}</span>
            ))}
            {activeDiseaseNames.map(n => (
              <span key={n} style={{ background: '#B97308', color: '#fff', borderRadius: 4, padding: '3px 8px', fontSize: 12, fontWeight: 600 }}>{n}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#5A6F60', marginBottom: 8 }}>이번 달 자동 차단</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#A8E063' }}>–</div>
          <div style={{ fontSize: 12, color: '#3A4A3F', marginTop: 4 }}>집계 중</div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#5A6F60', marginBottom: 8 }}>이번 달 검사 상품</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#A8E063' }}>–</div>
          <div style={{ fontSize: 12, color: '#3A4A3F', marginTop: 4 }}>집계 중</div>
        </div>
      </div>

      {/* 알레르기 그룹 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F1E12', margin: 0 }}>알레르기 그룹</h3>
            <p style={{ fontSize: 12, color: '#9AA89D', marginTop: 4, marginBottom: 0 }}>
              가족 구성원별로 그룹을 만들고 필요할 때만 적용하세요. 토글로 즉시 켜고 끌 수 있습니다.
            </p>
          </div>
          <button style={{ padding: '8px 14px', background: '#fff', border: '1px solid #C9CFC4', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#0F1E12', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 16 }}>
            + 그룹 추가
          </button>
        </div>

        {allergenGroups.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', background: '#FAFAFA', borderRadius: 12, border: '1px solid #F0F0F0', color: '#9AA89D', fontSize: 14 }}>
            등록된 알레르기 그룹이 없습니다
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {allergenGroups.map((group, idx) => {
              const isActive = (group as AllergenGroup & { is_active?: boolean }).is_active !== false;
              const names    = resolveAllergens(group.allergen_ids);
              return (
                <div key={group.id} style={{ background: '#fff', border: `1.5px solid ${isActive ? '#1F4D2C' : '#E5E7E1'}`, borderRadius: 12, padding: '18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 999, background: AVATAR_COLORS[idx % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                      {group.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>{group.name}</div>
                    <ToggleSwitch active={isActive} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14, minHeight: 28 }}>
                    {names.length > 0 ? names.map(n => (
                      <span key={n} style={{ background: '#FFF0F0', color: '#D32F2F', borderRadius: 4, padding: '3px 8px', fontSize: 12, fontWeight: 600 }}>
                        🍴 {n}
                      </span>
                    )) : (
                      <span style={{ fontSize: 12, color: '#9AA89D' }}>알레르기 없음</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ flex: 1, padding: '7px 0', border: '1px solid #E5E7E1', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer', fontFamily: 'inherit' }}>편집</button>
                    <button style={{ flex: 1, padding: '7px 0', border: '1px solid #E5E7E1', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer', fontFamily: 'inherit' }}>이력 보기</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 지병·영양 그룹 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F1E12', margin: 0 }}>지병·영양 그룹</h3>
            <p style={{ fontSize: 12, color: '#9AA89D', marginTop: 4, marginBottom: 0 }}>
              당뇨·고혈압 등 영양 기준이 필요한 질환을 등록하면 1일 권장 섭취량 기반으로 자동 체크합니다.
            </p>
          </div>
          <button style={{ padding: '8px 14px', background: '#fff', border: '1px solid #C9CFC4', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#0F1E12', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 16 }}>
            + 그룹 추가
          </button>
        </div>

        {diseaseGroups.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', background: '#FAFAFA', borderRadius: 12, border: '1px solid #F0F0F0', color: '#9AA89D', fontSize: 14 }}>
            등록된 지병·영양 그룹이 없습니다
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {diseaseGroups.map((group) => {
              const limits = group.disease_ids
                .flatMap(d => DISEASE_LIMITS[d] ?? [])
                .filter((l, i, arr) => arr.findIndex(x => x.label === l.label) === i);
              return (
                <div key={group.id} style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: '18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 999, background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      ❤️
                    </div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>{group.name}</div>
                    <ToggleSwitch active={group.is_active} onToggle={() => toggleDisease(group)} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: limits.length > 0 ? 12 : 14 }}>
                    {group.disease_ids.map(d => DISEASE_LABEL[d]).filter(Boolean).map(name => (
                      <span key={name} style={{ background: '#FFF8E1', color: '#B97308', borderRadius: 4, padding: '3px 8px', fontSize: 12, fontWeight: 600 }}>{name}</span>
                    ))}
                  </div>
                  {limits.length > 0 && (
                    <div style={{ background: '#F8FAF8', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: '#9AA89D', fontWeight: 600, marginBottom: 8 }}>1일 권장 한도</div>
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(limits.length, 3)}, 1fr)`, gap: 8 }}>
                        {limits.map(l => (
                          <div key={l.label}>
                            <div style={{ fontSize: 11, color: '#9AA89D' }}>{l.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12' }}>{l.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ flex: 1, padding: '7px 0', border: '1px solid #E5E7E1', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer', fontFamily: 'inherit' }}>편집</button>
                    <button style={{ flex: 1, padding: '7px 0', border: '1px solid #E5E7E1', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer', fontFamily: 'inherit' }}>의료진 정보</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 응급 시 연락처 */}
      <div style={{ background: '#FFF5F5', border: '1px solid #FFCDD2', borderRadius: 12, padding: '16px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#D32F2F" strokeWidth="1.8"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="#D32F2F" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#D32F2F" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#C62828', marginBottom: 2 }}>응급 시 연락처</div>
            <div style={{ fontSize: 12, color: '#D32F2F' }}>심한 알레르기 반응 시 119 · 등록된 보호자에게 자동 알림</div>
          </div>
        </div>
        <button style={{ padding: '8px 14px', border: '1px solid #FFCDD2', borderRadius: 8, background: '#fff', color: '#C62828', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
          보호자 관리
        </button>
      </div>

      {/* 건강 정보 암호화 */}
      <div style={{ background: '#F8FAF8', border: '1px solid #E5E7E1', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6B7A6E" strokeWidth="1.8"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#6B7A6E" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="#6B7A6E"/>
          </svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12', marginBottom: 2 }}>건강 정보 암호화 저장</div>
            <div style={{ fontSize: 12, color: '#9AA89D' }}>알레르기·지병 정보는 KISA 인증 AES-256 암호화로 저장되며, 회원님만 열람할 수 있습니다.</div>
          </div>
        </div>
        <button style={{ padding: '8px 14px', border: '1px solid #E5E7E1', borderRadius: 8, background: '#fff', color: '#3A4A3F', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
          상세 보기
        </button>
      </div>
    </div>
  );
};

/* ── AddressContent ─────────────────────────────────────────── */
const EMPTY_FORM: AddressPayload = {
  alias: '', recipient_name: '', phone: '',
  zip_code: '', address1: '', address2: '', is_default: false,
};

const AddressContent: FC = () => {
  const { user } = useAuth();
  const [addresses,  setAddresses]  = useState<Address[]>([]);
  const [isLoading,  setIsLoading]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState<string | null>(null);
  const [form,       setForm]       = useState<AddressPayload>(EMPTY_FORM);
  const [formError,  setFormError]  = useState('');

  useEffect(() => {
    setIsLoading(true);
    getAddresses()
      .then(list => setAddresses(Array.isArray(list) ? list : []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  function openNew() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, recipient_name: user?.name ?? '' });
    setFormError('');
    setShowForm(true);
  }

  function openEdit(addr: Address) {
    setEditId(addr.id);
    setForm({
      alias: addr.alias, recipient_name: addr.recipient_name,
      phone: addr.phone, zip_code: addr.zip_code,
      address1: addr.address1, address2: addr.address2,
      is_default: addr.is_default,
    });
    setFormError('');
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditId(null); }

  async function handleSave() {
    if (!form.alias.trim())          { setFormError('배송지 이름을 입력해주세요.'); return; }
    if (!form.recipient_name.trim()) { setFormError('받는 분 이름을 입력해주세요.'); return; }
    if (!form.phone.trim())          { setFormError('연락처를 입력해주세요.'); return; }
    if (!form.address1.trim())       { setFormError('주소를 입력해주세요.'); return; }
    setSaving(true);
    setFormError('');
    try {
      if (editId) {
        const updated = await updateAddress(editId, form);
        setAddresses(prev => {
          const next = prev.map(a => a.id === editId ? updated : a);
          return form.is_default ? next.map(a => a.id === editId ? a : { ...a, is_default: false }) : next;
        });
      } else {
        const created = await createAddress(form);
        // POST may return updated list or single item — normalise defensively
        if (Array.isArray(created) && created.length > 0) {
          setAddresses(created);
        } else {
          const list = await getAddresses();
          setAddresses(Array.isArray(list) ? list : []);
        }
      }
      closeForm();
    } catch {
      setFormError('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setAddresses(prev => prev.filter(a => a.id !== id));
    try { await deleteAddresses([id]); }
    catch { getAddresses().then(list => setAddresses(Array.isArray(list) ? list : [])).catch(() => {}); }
  }

  async function handleSetDefault(addr: Address) {
    setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === addr.id })));
    try {
      await updateAddress(addr.id, {
        alias: addr.alias, recipient_name: addr.recipient_name,
        phone: addr.phone, zip_code: addr.zip_code,
        address1: addr.address1, address2: addr.address2,
        is_default: true,
      });
    } catch { getAddresses().then(list => setAddresses(Array.isArray(list) ? list : [])).catch(() => {}); }
  }

  const inp = (style?: React.CSSProperties): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box', padding: '10px 12px',
    border: '1px solid #C9CFC4', borderRadius: 8, fontSize: 13,
    fontFamily: 'inherit', color: '#0F1E12', outline: 'none', ...style,
  });

  if (isLoading) return (
    <div style={{ padding: '60px 0', textAlign: 'center', color: '#9AA89D', fontSize: 14 }}>
      배송지를 불러오는 중...
    </div>
  );

  return (
    <div>
      {/* 타이틀 + 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F1E12', margin: 0 }}>배송지 관리</h2>
        <button
          onClick={openNew}
          style={{ padding: '8px 16px', background: '#fff', border: '1px solid #C9CFC4', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#0F1E12', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          + 배송지 추가
        </button>
      </div>

      {/* 입력 폼 */}
      {showForm && (
        <div style={{ background: '#F8FAF8', border: '1.5px solid #1F4D2C', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12', marginBottom: 16 }}>
            {editId ? '배송지 편집' : '새 배송지 추가'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#3A4A3F' }}>배송지 이름 *</label>
              <input style={inp()} placeholder="집, 회사, 기타..." value={form.alias}
                onChange={e => setForm(f => ({ ...f, alias: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#3A4A3F' }}>받는 분 *</label>
              <input style={inp()} placeholder="이름" value={form.recipient_name}
                onChange={e => setForm(f => ({ ...f, recipient_name: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#3A4A3F' }}>연락처 *</label>
              <input style={inp()} placeholder="01012345678" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#3A4A3F' }}>우편번호</label>
              <input style={inp()} placeholder="예) 06234" value={form.zip_code}
                onChange={e => setForm(f => ({ ...f, zip_code: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#3A4A3F' }}>주소 *</label>
              <input style={inp()} placeholder="도로명 주소" value={form.address1}
                onChange={e => setForm(f => ({ ...f, address1: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#3A4A3F' }}>상세 주소</label>
              <input style={inp()} placeholder="동·호수, 건물명 등" value={form.address2}
                onChange={e => setForm(f => ({ ...f, address2: e.target.value }))} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 13, color: '#0F1E12', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_default}
              onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))}
              style={{ width: 15, height: 15, accentColor: '#1F4D2C', cursor: 'pointer' }} />
            기본 배송지로 설정
          </label>
          {formError && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#D32F2F', fontWeight: 600 }}>{formError}</div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
            <button onClick={closeForm} style={{ padding: '9px 20px', border: '1px solid #C9CFC4', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#6B7A6E', cursor: 'pointer', fontFamily: 'inherit' }}>
              취소
            </button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '9px 20px', border: 'none', borderRadius: 8, background: saving ? '#9AA89D' : '#1F4D2C', fontSize: 13, fontWeight: 700, color: '#fff', cursor: saving ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      )}

      {/* 주소 목록 */}
      {addresses.length === 0 && !showForm ? (
        <div style={{ minHeight: 300, background: '#FAFAFA', borderRadius: 12, border: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 12 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#D0D5CE" strokeWidth="1.5"/>
            <circle cx="12" cy="10" r="3" stroke="#D0D5CE" strokeWidth="1.5"/>
          </svg>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#3A4A3F', marginBottom: 6 }}>저장된 배송지가 없어요</div>
          <div style={{ fontSize: 13, color: '#9AA89D' }}>+ 배송지 추가를 눌러 배송지를 등록하세요.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {addresses.map(addr => (
            <div
              key={addr.id}
              style={{ background: '#fff', border: `1.5px solid ${addr.is_default ? '#1F4D2C' : '#E5E7E1'}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}
            >
              {/* 핀 아이콘 */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke={addr.is_default ? '#1F4D2C' : '#9AA89D'} strokeWidth="1.8"/>
                <circle cx="12" cy="10" r="3" stroke={addr.is_default ? '#1F4D2C' : '#9AA89D'} strokeWidth="1.8"/>
              </svg>

              {/* 정보 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>{addr.alias}</span>
                  {addr.is_default && (
                    <span style={{ background: '#1F4D2C', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>기본 배송지</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#6B7A6E', marginBottom: 3 }}>
                  {addr.recipient_name} · {addr.phone}
                </div>
                <div style={{ fontSize: 13, color: '#1F4D2C', fontWeight: 500 }}>
                  {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}
                </div>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    style={{ marginTop: 8, padding: '4px 10px', border: '1px solid #C9CFC4', borderRadius: 4, background: '#fff', fontSize: 11, fontWeight: 600, color: '#6B7A6E', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    기본 배송지로 설정
                  </button>
                )}
              </div>

              {/* 액션 버튼 */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(addr)}
                  style={{ padding: '6px 14px', border: '1px solid #E5E7E1', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  편집
                </button>
                {!addr.is_default && (
                  <button
                    onClick={() => handleDelete(addr.id)}
                    style={{ padding: '6px 14px', border: '1px solid #FFCDD2', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, color: '#D32F2F', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
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
  initialTab?: TabId;
  onProductClick?: (product: Product) => void;
}


const MyPage: FC<MyPageProps> = ({ onBack, initialTab, onProductClick }) => {
  const { user } = useAuth();
  const { items: likedItems } = useLike();
  const { allergenNames, diseaseNames } = useMyAllergenSummary();
  const cartHook = useCart();
  const [activeMenu, setActiveMenu] = useState<TabId>(initialTab ?? 'orders');

  useEffect(() => {
    if (initialTab) setActiveMenu(initialTab);
  }, [initialTab]);

  const displayName   = user?.name ?? PF_CURRENT_USER.name;
  const shippingCount  = PF_ORDERS.filter(o => o.status === 'shipping').length;
  const wishlistCount  = likedItems.length;
  const cartCount      = cartHook.totalCount;

  const menuItems: { id: TabId; label: string; icon: FC; badge?: number }[] = [
    { id: 'orders',        label: '주문/배송',  icon: ShipIco,  badge: PF_ORDERS.filter(o => o.status === 'shipping' || o.status === 'preparing').length || undefined },
    { id: 'cart',          label: '장바구니',   icon: CartIco,  badge: cartCount || undefined },
    { id: 'wishlist',      label: '찜한 상품',  icon: HeartIco, badge: wishlistCount || undefined },
    { id: 'safety',        label: '안전 프로필', icon: ShieldIco  },
    { id: 'address',       label: '배송지',     icon: MapPinIco  },
    { id: 'profile',       label: '회원 정보',  icon: UserIco    },
    { id: 'notifications', label: '알림 설정',  icon: BellIco    },
  ];

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
                {user?.email ?? PF_CURRENT_USER.email}
                {user?.created_at && (
                  <>
                    <span style={{ margin: '0 6px' }}>·</span>
                    가입 {user.created_at.slice(0, 10).replace(/-/g, '.')}
                  </>
                )}
                <span style={{ margin: '0 6px' }}>·</span>
                누적 주문 {PF_ORDERS.length}건
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, flexShrink: 0 }}>
              {[
                { label: '배송중',    value: shippingCount,            color: '#A8E063' },
                { label: '장바구니', value: cartCount,                  color: '#fff'    },
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
          {menuItems.map((item, i) => {
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
          {activeMenu === 'cart'          && <CartContent {...cartHook} />}
          {activeMenu === 'wishlist'      && <WishlistContent onProductClick={onProductClick} />}
          {activeMenu === 'safety'        && <SafetyContent />}
          {activeMenu === 'address'       && <AddressContent />}
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
