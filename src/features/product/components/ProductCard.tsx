import type { FC } from "react";
import { useState, useEffect } from "react";
import type { Product } from "../models/type";
import Toast    from "../../../shared/components/Toast";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../../auth/store/useAuth";
import { useMyAllergenSummary } from "../../allergen/hooks/useMyAllergenSummary";
import { likeProduct, unlikeProduct } from "../../like/services/likeApi";
import { addLocalLike, removeLocalLike, isLocallyLiked } from "../../like/store/likeLocalStore";
import { addCartItems } from "../../cart/services/cartApi";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (id: string) => UUID_RE.test(id);

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

const CartIco: FC<{ filled: boolean }> = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={filled ? '#fff' : '#3A4A3F'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="6" x2="21" y2="6" stroke={filled ? '#fff' : '#3A4A3F'} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 10a4 4 0 01-8 0" stroke={filled ? '#fff' : '#3A4A3F'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProductCard: FC<ProductCardProps> = ({ product, onClick, allergyHits: hitsProp }) => {
  const { brand, name, price, originalPrice, discountRate, rating, reviewCount, badge, imageSrc } = product;
  const { isLoggedIn } = useAuth();
  const { allergenNames, diseaseNames } = useMyAllergenSummary();
  const [isHearted, setIsHearted] = useState(() => isLoggedIn && isLocallyLiked(product.id));
  const [isCarted,  setIsCarted]  = useState(false);
  const [burst,     setBurst]     = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    setIsHearted(isLoggedIn && isLocallyLiked(product.id));
  }, [isLoggedIn, product.id]);

  const badgeStyle = (badge ? BADGE_STYLE[badge] : undefined) ?? BADGE_STYLE.BEST;
  const discount   = discountRate > 0 ? discountRate : (originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0);

  const hits = hitsProp ?? (
    allergenNames.length > 0
      ? (product.allergens ?? []).filter(a => allergenNames.includes(a))
      : []
  );
  const hasDiseaseRisk = diseaseNames.length > 0
    ? (product.riskDiseases ?? []).some(d => diseaseNames.includes(d))
    : false;
  const isDanger = hits.length > 0 || hasDiseaseRisk;

  async function handleHeart(e: React.MouseEvent) {
    e.stopPropagation();
    setBurst(true);
    setTimeout(() => setBurst(false), 400);
    const next = !isHearted;
    setIsHearted(next);
    showToast(next ? "heart" : "heartCancel");
    if (next) {
      addLocalLike({
        product_id: product.id,
        title: product.name,
        thumbnail_file_id: '',
        image_url: product.imageSrc,
        is_available: true,
        liked_at: new Date().toISOString(),
      });
      if (isUUID(product.id)) likeProduct(product.id).catch(() => {});
    } else {
      removeLocalLike(product.id);
      if (isUUID(product.id)) unlikeProduct(product.id).catch(() => {});
    }
  }

  async function handleCart(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !isCarted;
    setIsCarted(next);
    showToast(next ? "cart" : "cartCancel");
    if (!next || !isUUID(product.id)) return;
    try {
      await addCartItems([{ option_id: product.id, quantity: 1 }]);
    } catch { /* 무시 */ }
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
          {badge === 'BEST' || badge === 'recommended' ? (
            <span style={{ position: 'absolute', top: 8, left: 8, background: badgeStyle.bg, color: badgeStyle.color, padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ShieldIco /> 맞춤픽
            </span>
          ) : badge ? (
            <span style={{ position: 'absolute', top: 8, left: 8, background: badgeStyle.bg, color: badgeStyle.color, padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
              {badge === 'SALE' || badge === 'danger' ? '주의' : badge === 'deal' ? '특가' : badge}
            </span>
          ) : null}

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

          {/* 장바구니 버튼 (로그인 시, 이미지 오버레이) */}
          {isLoggedIn && (
            <button
              onClick={handleCart}
              style={{
                position: 'absolute', top: 8, right: 48,
                width: 32, height: 32, borderRadius: 999, border: 'none',
                background: isCarted ? '#1F4D2C' : 'rgba(255,255,255,0.92)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)', transition: 'background 200ms',
              }}
              aria-label="장바구니"
            >
              <CartIco filled={isCarted} />
            </button>
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

      <Toast toast={toast} onNavigate={type => {
        const tab = type === 'heart' ? 'wishlist' : 'cart';
        window.dispatchEvent(new CustomEvent("pickfood:navigate", { detail: { tab } }));
      }} />
    </>
  );
};

export default ProductCard;
