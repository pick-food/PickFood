import { useState, type FC } from "react";
import { useProducts } from "../../product/hooks/useProducts";
import { useCookingMethods } from "../../product/hooks/useCookingMethods";
import { PF_COOKING_TIPS, type PFCookingTip } from "../../../data/pfData";
import type { Product } from "../../product/models/type";

interface RecipePageProps {
  onBack?: () => void;
}

const StorageIco = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#1F4D2C" strokeWidth="1.8"/>
    <path d="M3 9h18M9 21V9" stroke="#1F4D2C" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const CalIco = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#1F4D2C" strokeWidth="1.8"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="#1F4D2C" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const CookIco = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a7 7 0 00-7 7c0 3.87 3.13 7 7 7s7-3.13 7-7a7 7 0 00-7-7z" stroke="#1F4D2C" strokeWidth="1.8"/>
    <path d="M12 22v-6M8 22h8" stroke="#1F4D2C" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const RecipeCard: FC<{ product: Product; tip: PFCookingTip | undefined }> = ({ product, tip }) => (
  <div style={{
    background: '#fff', borderRadius: 16, border: '1px solid #E5E7E1',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    transition: 'box-shadow 160ms',
  }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,30,18,0.10)')}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
  >
    {/* 이미지 */}
    <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: '#F4F5F1' }}>
      <img
        src={product.imageSrc}
        alt={product.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      {/* Method chips overlay */}
      {tip && tip.methods.length > 0 && (
        <div style={{ position: 'absolute', bottom: 8, left: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tip.methods.map(m => (
            <span key={m} style={{
              padding: '2px 8px', borderRadius: 999,
              background: 'rgba(15,30,18,0.80)', color: '#A8E063',
              fontSize: 11, fontWeight: 700,
            }}>{m}</span>
          ))}
        </div>
      )}
    </div>

    <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* 상품명 */}
      <div>
        <div style={{ fontSize: 11, color: '#9AA89D', fontWeight: 600, marginBottom: 2 }}>{product.brand}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12', lineHeight: 1.4 }}>{product.name}</div>
      </div>

      {tip ? (
        <>
          {/* 보관 + 유통기한 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}><StorageIco /></span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1F4D2C', marginBottom: 1 }}>보관 방법</div>
                <div style={{ fontSize: 12, color: '#3A4A3F', lineHeight: 1.5 }}>{tip.storage}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}><CalIco /></span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1F4D2C', marginBottom: 1 }}>유통·소비기한</div>
                <div style={{ fontSize: 12, color: '#3A4A3F', lineHeight: 1.5 }}>{tip.shelfLife}</div>
              </div>
            </div>
          </div>

          {/* 조리 방법 */}
          <div style={{ background: '#F0F6EF', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <CookIco />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#1F4D2C' }}>조리 방법</span>
            </div>
            <div style={{ fontSize: 12, color: '#2E4D35', lineHeight: 1.6 }}>{tip.how}</div>
          </div>

          {/* 팁 */}
          {tip.tips.length > 0 && (
            <div style={{ borderTop: '1px solid #F4F5F1', paddingTop: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9AA89D', marginBottom: 6 }}>TIP</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {tip.tips.map((t, i) => (
                  <li key={i} style={{ display: 'flex', gap: 6, fontSize: 12, color: '#6B7A6E', lineHeight: 1.5 }}>
                    <span style={{ color: '#A8E063', fontWeight: 800, flexShrink: 0 }}>·</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div style={{ fontSize: 12, color: '#C9CFC4', fontStyle: 'italic', padding: '8px 0' }}>조리 정보 준비 중</div>
      )}
    </div>
  </div>
);

const RecipePage: FC<RecipePageProps> = () => {
  const { products } = useProducts();
  const { methods }  = useCookingMethods();
  const [activeMethod, setActiveMethod] = useState('전체');

  const filtered = products.filter(p => {
    if (activeMethod === '전체') return true;
    const tip = PF_COOKING_TIPS[p.id];
    return tip?.methods.includes(activeMethod) ?? false;
  });

  const allMethods = ['전체', ...methods.map(m => m.name)];

  return (
    <div style={{ background: '#FAFAF6', minHeight: '100vh', paddingBottom: 80 }}>

      {/* 히어로 헤더 */}
      <div style={{ background: 'linear-gradient(135deg, #0F1E12 0%, #1F4D2C 60%, #2E7D32 100%)', padding: '36px 40px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>조리법 가이드</h1>
          <p style={{ fontSize: 13, color: '#A8E063', fontWeight: 500, margin: 0 }}>
            보관 방법부터 조리 팁까지 — 상품별 맞춤 가이드를 확인해보세요
          </p>
        </div>
      </div>

      {/* 조리법 필터 (수평 스크롤 필 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7E1', position: 'sticky', top: 0, zIndex: 10 }}>
        <div
          style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 40px', display: 'flex', gap: 8, overflowX: 'auto' }}
          className="scrollbar-hide"
        >
          {allMethods.map(name => {
            const isActive = activeMethod === name;
            return (
              <button
                key={name}
                onClick={() => setActiveMethod(name)}
                style={{
                  padding: '8px 18px', borderRadius: 999, flexShrink: 0,
                  border: '1.5px solid ' + (isActive ? '#1F4D2C' : '#E5E7E1'),
                  background: isActive ? '#1F4D2C' : '#fff',
                  color: isActive ? '#fff' : '#3A4A3F',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer', transition: 'all 160ms',
                }}
              >{name}</button>
            );
          })}
        </div>
      </div>

      {/* 상품 그리드 */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        <div style={{ marginBottom: 20, fontSize: 13, color: '#6B7A6E' }}>
          {activeMethod !== '전체' ? (
            <>
              <strong style={{ color: '#1F4D2C' }}>{activeMethod}</strong>으로 조리 가능한{' '}
            </>
          ) : '전체 '}
          <strong style={{ color: '#0F1E12' }}>{filtered.length}</strong>개 상품
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {filtered.map(p => (
              <RecipeCard key={p.id} product={p} tip={PF_COOKING_TIPS[p.id]} />
            ))}
          </div>
        ) : (
          <div style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🍳</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#3A4A3F' }}>해당 조리법의 상품이 없습니다</div>
            <div style={{ fontSize: 13, marginTop: 6, color: '#9AA89D' }}>다른 조리법을 선택해보세요</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
