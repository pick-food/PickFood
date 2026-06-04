import { useState, type FC } from "react";
import { useProducts }  from "../hooks/useProducts";
import ProductCard      from "./ProductCard";
import type { Product } from "../models/type";

interface ProductPageProps {
  onProductClick?: (product: Product) => void;
}

/* ── 정적 데이터 ─────────────────────────────────────────── */
const MAIN_CATS = [
  { id: 'protein', name: '단백질·육류' },
  { id: 'fruit',   name: '과일·채소' },
  { id: 'veg',     name: '채소·나물' },
  { id: 'dairy',   name: '유제품·두부' },
  { id: 'staple',  name: '쌀·잡곡' },
  { id: 'ready',   name: '간편식' },
  { id: 'snack',   name: '과자·간식' },
  { id: 'baby',    name: '아기·이유식' },
  { id: 'health',  name: '건강기능식품' },
];

const SUBCATS: Record<string, string[]> = {
  protein: ['전체', '소고기', '돼지고기', '닭/오리', '새우', '고등어', '두부/콩'],
  fruit:   ['전체', '국산', '수입', '냉동', '드라이'],
  veg:     ['전체', '잎채소', '뿌리채소', '버섯', '새싹채소', '샐러드'],
  dairy:   ['전체', '우유', '요거트', '치즈', '식물성', '두유'],
  staple:  ['전체', '쌀', '잡곡', '간편밥', '면류'],
  ready:   ['전체', '국·탕', '덮밥류', '주먹밥', '냉동식품'],
  snack:   ['전체', '쿠키', '견과류', '말린과일', '음료'],
  baby:    ['전체', '이유식', '간식', '분유'],
  health:  ['전체', '비타민', '프로바이오틱스', '단백질 보충', '오메가3'],
};

const SORT_OPTS = [
  { id: 'relevance', label: '추천순' },
  { id: 'popular',   label: '인기순' },
  { id: 'rating',    label: '평점순' },
  { id: 'priceLow',  label: '낮은가격' },
  { id: 'priceHigh', label: '높은가격' },
  { id: 'new',       label: '신상품' },
];

const ALLERGENS = ['새우', '게', '땅콩', '우유', '달걀', '밀', '대두', '견과류', '생선'];
const PRICE_RANGES = ['전체', '~5,000원', '5,000~10,000원', '10,000~20,000원', '20,000원~'];

/* ── SVG ───────────────────────────────────────────────── */
const SearchIco = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#3A4A3F" strokeWidth="1.8"/><path d="M21 21L16.65 16.65" stroke="#3A4A3F" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const XIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#9AA89D" strokeWidth="2" strokeLinecap="round"/></svg>;
const ShieldIco = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#1F4D2C" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#1F4D2C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;

/* ── FilterSection ───────────────────────────────────────── */
const FilterSection: FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div style={{ paddingBottom: 16, borderBottom: '1px solid #F4F5F1' }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12', marginBottom: 10 }}>{title}</div>
    {children}
  </div>
);

/* ── RangeSlider ──────────────────────────────────────────── */
const SliderRow: FC<{ label: string; value: number; max: number; unit: string; onChange: (v: number) => void }> = ({ label, value, max, unit, onChange }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7A6E', marginBottom: 4 }}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums', color: '#0F1E12', fontWeight: 600 }}>{value}{unit} 이하</span>
    </div>
    <input type="range" min={0} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: '#1F4D2C' }} />
  </div>
);

/* ── FilterSidebar ─────────────────────────────────────────── */
const FilterSidebar: FC<{
  excludedAllergens: string[];
  onToggleAllergen: (a: string) => void;
  safeOnly: boolean;
  onSafeOnly: () => void;
  maxSugar: number;
  onMaxSugar: (v: number) => void;
  maxSodium: number;
  onMaxSodium: (v: number) => void;
  maxKcal: number;
  onMaxKcal: (v: number) => void;
  priceRange: string;
  onPriceRange: (v: string) => void;
  onReset: () => void;
}> = ({ excludedAllergens, onToggleAllergen, safeOnly, onSafeOnly, maxSugar, onMaxSugar, maxSodium, onMaxSodium, maxKcal, onMaxKcal, priceRange, onPriceRange, onReset }) => (
  <aside style={{ width: 260, flexShrink: 0, background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 20, position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #F4F5F1' }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F1E12' }}>필터</h3>
      <button onClick={onReset} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, color: '#6B7A6E', textDecoration: 'underline' }}>전체 초기화</button>
    </div>

    {/* 안전 식품만 */}
    <FilterSection title="안전 필터">
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <div style={{ position: 'relative', width: 36, height: 20 }}>
          <input type="checkbox" checked={safeOnly} onChange={onSafeOnly} style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: safeOnly ? '#1F4D2C' : '#E5E7E1', transition: 'background 200ms' }} />
          <div style={{ position: 'absolute', top: 2, left: safeOnly ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff', transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ShieldIco />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F1E12' }}>안전 식품만 보기</span>
        </div>
      </label>
    </FilterSection>

    {/* 알레르기 제외 */}
    <FilterSection title="알레르기 제외">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {ALLERGENS.map(a => {
          const active = excludedAllergens.includes(a);
          return (
            <button key={a} onClick={() => onToggleAllergen(a)} style={{
              padding: '4px 10px', borderRadius: 999, border: '1px solid ' + (active ? '#D32F2F' : '#E5E7E1'),
              background: active ? '#FFF5F5' : '#fff', color: active ? '#D32F2F' : '#3A4A3F',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{a}</button>
          );
        })}
      </div>
    </FilterSection>

    {/* 영양 기준 */}
    <FilterSection title="영양 기준">
      <SliderRow label="당류" value={maxSugar}  max={50}   unit="g"  onChange={onMaxSugar}  />
      <SliderRow label="나트륨" value={maxSodium} max={2000} unit="mg" onChange={onMaxSodium} />
      <SliderRow label="열량" value={maxKcal}  max={800}  unit="kcal" onChange={onMaxKcal}  />
    </FilterSection>

    {/* 가격 */}
    <FilterSection title="가격대">
      {PRICE_RANGES.map(r => (
        <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
          <input type="radio" name="price" checked={priceRange === r} onChange={() => onPriceRange(r)} style={{ accentColor: '#1F4D2C' }} />
          <span style={{ fontSize: 13, color: '#3A4A3F' }}>{r}</span>
        </label>
      ))}
    </FilterSection>
  </aside>
);

/* ── ProductPage ────────────────────────────────────────── */
const ProductPage: FC<ProductPageProps> = ({ onProductClick }) => {
  const { products } = useProducts();
  const [activeCat,  setActiveCat]  = useState('protein');
  const [activeSub,  setActiveSub]  = useState('전체');
  const [query,      setQuery]      = useState('');
  const [sort,       setSort]       = useState('relevance');
  const [safeOnly,   setSafeOnly]   = useState(true);
  const [excluded,   setExcluded]   = useState<string[]>([]);
  const [maxSugar,   setMaxSugar]   = useState(50);
  const [maxSodium,  setMaxSodium]  = useState(2000);
  const [maxKcal,    setMaxKcal]    = useState(800);
  const [priceRange, setPriceRange] = useState('전체');

  const subs = SUBCATS[activeCat] || ['전체'];

  function toggleAllergen(a: string) {
    setExcluded(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  function reset() {
    setExcluded([]);
    setMaxSugar(50);
    setMaxSodium(2000);
    setMaxKcal(800);
    setPriceRange('전체');
  }

  // 간단한 클라이언트 필터 (실제로는 서버 필터)
  const filtered = products.filter(p => {
    if (query && !p.name.includes(query) && !p.brand.includes(query)) return false;
    return true;
  });

  const safeCount = filtered.length;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: 80 }}>

      {/* 카테고리 상단 레일 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7E1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', overflowX: 'auto' }}>
          {MAIN_CATS.map(c => (
            <button key={c.id} onClick={() => { setActiveCat(c.id); setActiveSub('전체'); }} style={{
              padding: '18px 22px', fontFamily: 'inherit', fontSize: 14,
              fontWeight: activeCat === c.id ? 700 : 500,
              color: activeCat === c.id ? '#1F4D2C' : '#3A4A3F',
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderBottom: '2px solid ' + (activeCat === c.id ? '#1F4D2C' : 'transparent'),
              whiteSpace: 'nowrap', transition: 'color 160ms',
            }}>{c.name}</button>
          ))}
        </div>
      </div>

      {/* 서브카테고리 레일 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7E1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 40px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {subs.map((s, i) => {
            const isActive = s === activeSub || (i === 0 && activeSub === '전체');
            return (
              <button key={s} onClick={() => setActiveSub(i === 0 ? '전체' : s)} style={{
                padding: '7px 14px', borderRadius: 999,
                border: '1px solid ' + (isActive ? '#0F1E12' : '#E5E7E1'),
                background: isActive ? '#0F1E12' : '#fff',
                color: isActive ? '#fff' : '#3A4A3F',
                fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{s}</button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px 0' }}>

        {/* 검색바 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#fff', border: '1.5px solid #C9CFC4', borderRadius: 14, marginBottom: 18 }}>
          <SearchIco />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`${MAIN_CATS.find(c => c.id === activeCat)?.name} 안에서 검색`}
            style={{ flex: 1, fontFamily: 'inherit', fontSize: 15, fontWeight: 500, border: 'none', outline: 'none', background: 'transparent', color: '#0F1E12' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <XIcon />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* 사이드바 필터 */}
          <FilterSidebar
            excludedAllergens={excluded}
            onToggleAllergen={toggleAllergen}
            safeOnly={safeOnly}
            onSafeOnly={() => setSafeOnly(v => !v)}
            maxSugar={maxSugar}
            onMaxSugar={setMaxSugar}
            maxSodium={maxSodium}
            onMaxSodium={setMaxSodium}
            maxKcal={maxKcal}
            onMaxKcal={setMaxKcal}
            priceRange={priceRange}
            onPriceRange={setPriceRange}
            onReset={reset}
          />

          {/* 상품 그리드 */}
          <div style={{ flex: 1 }}>
            {/* 결과 수 + 정렬 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#6B7A6E' }}>
                총 <strong style={{ color: '#0F1E12', fontVariantNumeric: 'tabular-nums' }}>{safeCount}</strong>개 상품
                {safeOnly && <span style={{ color: '#1F4D2C', marginLeft: 6, fontWeight: 600 }}>· 안전 식품 필터 적용</span>}
              </div>
              <div style={{ display: 'flex', gap: 0 }}>
                {SORT_OPTS.map((opt, i) => (
                  <span key={opt.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {i > 0 && <span style={{ width: 1, height: 12, background: '#E5E7E1', margin: '0 6px' }} />}
                    <button onClick={() => setSort(opt.id)} style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 13,
                      fontWeight: sort === opt.id ? 700 : 500,
                      color: sort === opt.id ? '#0F1E12' : '#6B7A6E',
                    }}>{opt.label}</button>
                  </span>
                ))}
              </div>
            </div>

            {/* 적용된 필터 태그 */}
            {(excluded.length > 0 || !safeOnly) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {excluded.map(a => (
                  <span key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: '#FFF5F5', color: '#D32F2F', borderRadius: 999, fontSize: 12, fontWeight: 600, border: '1px solid #FFCDD2' }}>
                    {a} 제외
                    <button onClick={() => toggleAllergen(a)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <XIcon />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 상품 그리드 4열 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => onProductClick?.(p)} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: '80px 20px', textAlign: 'center', color: '#9AA89D' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#3A4A3F' }}>검색 결과가 없습니다</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>필터를 조정하거나 다른 검색어를 시도해보세요</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
