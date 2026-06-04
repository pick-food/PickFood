import type { FC } from "react";
import { useState } from "react";
import type { Product } from "../models/type";
import Toast    from "../../../shared/components/Toast";
import { useToast } from "../hooks/useToast";

// Mock allergens per product (keyed by product id) — replace with real API data when available
const PRODUCT_ALLERGENS: Record<string, string[]> = {
  "1": [],
  "2": ["대두"],
  "3": ["밀"],
  "4": ["우유"],
  "5": ["대두"],
};
// User's active allergen profile (replace with auth store data when available)
const USER_ACTIVE_ALLERGENS: string[] = [];

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  /** Override allergy hits — e.g. from a logged-in user's profile */
  allergyHits?: string[];
}

/* ── 아이콘 ───────────────────────────────────────────────── */
const StarIco = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#E89B26">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const CheckIco = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="#1F4D2C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const HeartIco: FC<{ filled: boolean }> = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? '#fff' : 'none'}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
      stroke={filled ? '#fff' : '#3A4A3F'} strokeWidth="1.8"/>
  </svg>
);
const ShieldIco = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#A8E063" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="#A8E063" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  BEST:    { bg: '#0F1E12', color: '#A8E063' },
  SALE:    { bg: '#1F4D2C', color: '#A8E063' },
  NEW:     { bg: '#E89B26', color: '#fff'    },
  deal:    { bg: '#1F4D2C', color: '#A8E063' },
  recommended: { bg: '#0F1E12', color: '#A8E063' },
};

const ProductCard: FC<ProductCardProps> = ({ product, onClick, allergyHits: hitsProp }) => {
  const { brand, name, price, originalPrice, discountRate, rating, reviewCount, badge, imageSrc } = product;
  const [isHearted, setIsHearted] = useState(false);
  const [burst,     setBurst]     = useState(false);
  const { toast, showToast } = useToast();

  const badgeStyle = BADGE_STYLE[badge] ?? BADGE_STYLE.BEST;
  const discount   = discountRate > 0 ? discountRate : (originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0);

  // Allergy warning: use prop if provided, otherwise derive from mock data
  const hits = hitsProp ?? (PRODUCT_ALLERGENS[product.id] ?? []).filter(a => USER_ACTIVE_ALLERGENS.includes(a));
  const isDanger = hits.length > 0;

  function handleHeart(e: React.MouseEvent) {
    e.stopPropagation();
    setBurst(true);
    setTimeout(() => setBurst(false), 400);
    const next = !isHearted;
    setIsHearted(next);
    showToast(next ? "heart" : "heartCancel");
  }

  return (
    <>
      <div
        onClick={onClick}
        className="pf-press pf-fade-up"
        style={{ background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
      >
        {/* 이미지 영역 */}
        <div
          className="pf-img-zoom"
          style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', borderRadius: 8, background: '#fff', border: '1px solid #ECEEE7' }}
        >
          <img
            src={imageSrc}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />

          {/* 배지 */}
          {badge === 'BEST' && (
            <span style={{ position: 'absolute', top: 8, left: 8, background: badgeStyle.bg, color: badgeStyle.color, padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ShieldIco /> 맞춤픽
            </span>
          )}
          {badge !== 'BEST' && (
            <span style={{ position: 'absolute', top: 8, left: 8, background: badgeStyle.bg, color: badgeStyle.color, padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
              {badge === 'SALE' ? '특가' : badge}
            </span>
          )}

          {/* 알레르기 경고 오버레이 */}
          {isDanger && (
            <div style={{
              position: 'absolute', left: 8, right: 8, bottom: 8,
              background: 'rgba(211,47,47,0.94)', color: '#fff',
              padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
              backdropFilter: 'blur(6px)',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="1.8"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span>{hits.join('·')} 함유</span>
            </div>
          )}

          {/* 찜 버튼 */}
          <button
            onClick={handleHeart}
            className={burst ? 'pf-heart-burst' : ''}
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 32, height: 32, borderRadius: 999, border: 'none',
              background: isHearted ? '#D32F2F' : 'rgba(255,255,255,0.92)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', transition: 'background 200ms',
            }}
            aria-label="찜하기"
          >
            <HeartIco filled={isHearted} />
          </button>
        </div>

        {/* 텍스트 정보 */}
        <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 11, color: '#6B7A6E', fontWeight: 600 }}>{brand}</div>
          <div style={{
            fontSize: 14, fontWeight: 500, color: '#0F1E12', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 39,
          } as React.CSSProperties}>{name}</div>

          {/* 가격 */}
          <div style={{ marginTop: 4 }}>
            {discount > 0 && (
              <div style={{ fontSize: 12, color: '#9AA89D', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>
                {originalPrice.toLocaleString()}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              {discount > 0 && (
                <span style={{ fontSize: 17, fontWeight: 800, color: '#D32F2F', fontVariantNumeric: 'tabular-nums' }}>{discount}%</span>
              )}
              <span style={{ fontSize: 17, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
                {price.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 600, marginLeft: 1 }}>원</span>
              </span>
            </div>
          </div>

          {/* 별점 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12 }}>
            <StarIco />
            <span style={{ fontWeight: 700, color: '#0F1E12', fontVariantNumeric: 'tabular-nums' }}>{rating}</span>
            <span style={{ color: '#9AA89D' }}>· 리뷰 {reviewCount.toLocaleString()}</span>
          </div>

          {/* 배송 + 안전 태그 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', background: '#F0F6F1', color: '#1F6B45', borderRadius: 4 }}>
              내일 도착
            </span>
            {isDanger ? (
              <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', background: '#FEF2F2', color: '#B71C1C', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                ⚠ 주의
              </span>
            ) : (
              <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', background: '#EAF7D4', color: '#1F4D2C', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <CheckIco /> 안전
              </span>
            )}
          </div>
        </div>
      </div>

      <Toast toast={toast} onNavigate={() => {}} />
    </>
  );
};

export default ProductCard;
