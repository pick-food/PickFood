import { useState, useEffect, useMemo, type FC } from "react";
import { useProducts }          from "../hooks/useProducts";
import { useAuth }              from "../../auth/store/useAuth";
import { useMyAllergenSummary } from "../../allergen/hooks/useMyAllergenSummary";
import { useAllergenData }      from "../../allergen/hooks/useAllergenData";
import ProductCard              from "./ProductCard";
import type { Product }         from "../models/type";

interface ProductPageProps {
  onProductClick?: (product: Product) => void;
  initialCategory?: string;
}

const CAT_NAMES: Record<string, string> = {
  all: '전체',
  protein: '정육·수산', fruit: '과일', veg: '채소',
  dairy: '유제품·음료', staple: '주식·간편식', ready: '냉동·즉석',
  snack: '간식·과자', baby: '베이비푸드', health: '건강기능식품',
};

const SUBCATS: Record<string, string[]> = {
  protein: ['전체', '소고기', '돼지고기', '닭/오리', '수산', '계란', '두부/콩'],
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
  { id: 'relevance', label: '관련도순' },
  { id: 'popular',   label: '인기순' },
  { id: 'new',       label: '신상품순' },
  { id: 'priceLow',  label: '낮은가격순' },
  { id: 'priceHigh', label: '높은가격순' },
  { id: 'rating',    label: '평점순' },
  { id: 'protein',   label: '단백질 높은순' },
];

const ORIGINS   = ['국내산', '수입산', '국내가공', '유럽', '북미', '동남아'];
const CERTS     = ['HACCP', '유기농 인증', '동물복지', 'GAP', '무항생제', '수산물 이력제'];
const DELIVERIES = ['내일 도착', '당일배송', '무료배송'];
const PER_PAGE  = 12;

/* ── SVG ─────────────────────────────── */
const SearchIco = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#3A4A3F" strokeWidth="1.8"/><path d="M21 21L16.65 16.65" stroke="#3A4A3F" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const XIcon     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;
const ShieldIco = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#1F4D2C" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#1F4D2C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChevIco   = ({ open }: { open: boolean }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms' }}><path d="M6 9l6 6 6-6" stroke="#9AA89D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const NoIco     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#5A8A62" strokeWidth="1.8"/><line x1="6" y1="18" x2="18" y2="6" stroke="#5A8A62" strokeWidth="1.8"/></svg>;
const GridIco   = ({ active }: { active: boolean }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill={active ? '#fff' : '#9AA89D'}/><rect x="14" y="3" width="7" height="7" rx="1.5" fill={active ? '#fff' : '#9AA89D'}/><rect x="3" y="14" width="7" height="7" rx="1.5" fill={active ? '#fff' : '#9AA89D'}/><rect x="14" y="14" width="7" height="7" rx="1.5" fill={active ? '#fff' : '#9AA89D'}/></svg>;
const ListIco   = ({ active }: { active: boolean }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="4" rx="1.2" fill={active ? '#fff' : '#9AA89D'}/><rect x="3" y="10" width="18" height="4" rx="1.2" fill={active ? '#fff' : '#9AA89D'}/><rect x="3" y="16" width="18" height="4" rx="1.2" fill={active ? '#fff' : '#9AA89D'}/></svg>;

/* ── Collapsible section ───────────────── */
const FSection: FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({
  title, children, defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #F4F5F1' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '11px 0 4px', fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F1E12', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</span>
        <ChevIco open={open} />
      </button>
      {open && <div style={{ paddingBottom: 12 }}>{children}</div>}
    </div>
  );
};

/* ── CheckRow ─────────────────────────── */
const CheckRow: FC<{ label: string; count?: number; checked: boolean; onChange: () => void }> = ({
  label, count, checked, onChange,
}) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', userSelect: 'none' }}>
    <div style={{
      width: 15, height: 15, borderRadius: 3,
      border: '1.5px solid ' + (checked ? '#1F4D2C' : '#C9CFC4'),
      background: checked ? '#1F4D2C' : '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, transition: 'all 130ms',
    }}>
      {checked && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
    <span style={{ fontSize: 12, color: '#3A4A3F', flex: 1 }}>{label}</span>
    {count !== undefined && <span style={{ fontSize: 11, color: '#C9CFC4' }}>{count}</span>}
    <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
  </label>
);

/* ── PillBtn ──────────────────────────── */
const PillBtn: FC<{ label: string; active: boolean; onClick: () => void; danger?: boolean }> = ({
  label, active, onClick, danger,
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '4px 10px', borderRadius: 999,
      border: '1px solid ' + (active ? (danger ? '#D32F2F' : '#1F4D2C') : '#E5E7E1'),
      background: active ? (danger ? '#FFF5F5' : '#EFF6EF') : '#fff',
      color: active ? (danger ? '#D32F2F' : '#1F4D2C') : '#3A4A3F',
      fontFamily: 'inherit', fontSize: 11, fontWeight: active ? 700 : 500, cursor: 'pointer',
    }}
  >{label}</button>
);

/* ── SliderRow ────────────────────────── */
const SliderRow: FC<{
  label: string; value: number; max: number; unit: string;
  onChange: (v: number) => void; isMin?: boolean;
}> = ({ label, value, max, unit, onChange, isMin }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7A6E', marginBottom: 3 }}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums', color: '#0F1E12', fontWeight: 600 }}>
        {isMin ? `${value}${unit} 이상` : `${value}${unit} 이하`}
      </span>
    </div>
    <input
      type="range" min={0} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: '#1F4D2C', height: 4 }}
    />
  </div>
);

/* ── FilterSidebar ────────────────────── */
interface SidebarProps {
  allProducts: Product[];
  activeCat: string;
  safeOnly: boolean;
  onSafeOnly: () => void;
  excludedGroups: string[];
  onToggleGroup: (id: string) => void;
  excludedAllergens: string[];
  onToggleAllergen: (n: string) => void;
  userName?: string;
  userAllergenNames: string[];
  userDiseaseNames: string[];
  allergenGroups: { id: string; name: string; allergenNames: string[] }[];
  availableAllergens: { id: string; name: string }[];
  availableDiseases: { id: string; name: string }[];
  excludedDiseases: string[];
  onToggleDisease: (n: string) => void;
  maxPrice: number;
  onMaxPrice: (v: number) => void;
  maxSugar: number;
  onMaxSugar: (v: number) => void;
  maxSodium: number;
  onMaxSodium: (v: number) => void;
  minProtein: number;
  onMinProtein: (v: number) => void;
  maxFat: number;
  onMaxFat: (v: number) => void;
  maxKcal: number;
  onMaxKcal: (v: number) => void;
  selectedBrands: string[];
  onToggleBrand: (b: string) => void;
  selectedTags: string[];
  onToggleTag: (t: string) => void;
  selectedOrigins: string[];
  onToggleOrigin: (o: string) => void;
  selectedCerts: string[];
  onToggleCert: (c: string) => void;
  selectedDelivery: string[];
  onToggleDelivery: (d: string) => void;
  discountOnly: boolean;
  onDiscountOnly: () => void;
  onReset: () => void;
}

const FilterSidebar: FC<SidebarProps> = ({
  allProducts, activeCat,
  safeOnly, onSafeOnly,
  excludedGroups, onToggleGroup,
  excludedAllergens, onToggleAllergen,
  excludedDiseases, onToggleDisease,
  maxPrice, onMaxPrice,
  maxSugar, onMaxSugar, maxSodium, onMaxSodium,
  minProtein, onMinProtein, maxFat, onMaxFat, maxKcal, onMaxKcal,
  selectedBrands, onToggleBrand,
  selectedTags, onToggleTag,
  selectedOrigins, onToggleOrigin,
  selectedCerts, onToggleCert,
  selectedDelivery, onToggleDelivery,
  userName, userAllergenNames, userDiseaseNames,
  allergenGroups, availableAllergens, availableDiseases,
  discountOnly, onDiscountOnly,
  onReset,
}) => {
  const catProducts = activeCat === 'all' ? allProducts : allProducts.filter(p => p.category === activeCat);
  const brandCounts: Record<string, number> = {};
  catProducts.forEach(p => { brandCounts[p.brand] = (brandCounts[p.brand] ?? 0) + 1; });
  const brands  = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);
  const allTags = [...new Set(catProducts.flatMap(p => p.tags ?? []))];

  return (
    <aside style={{
      width: 236, flexShrink: 0, background: '#fff',
      border: '1px solid #E5E7E1', borderRadius: 12,
      padding: '14px 16px',
      position: 'sticky', top: 24,
      maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 2, borderBottom: '1.5px solid #E5E7E1' }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12' }}>필터</h3>
        <button
          onClick={onReset}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, color: '#9AA89D', textDecoration: 'underline', fontFamily: 'inherit' }}
        >전체 초기화</button>
      </div>

      {/* 안전 필터 */}
      <FSection title="안전 필터">
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', marginTop: 4 }}>
          <div style={{ position: 'relative', width: 34, height: 19, flexShrink: 0, marginTop: 1 }}>
            <input type="checkbox" checked={safeOnly} onChange={onSafeOnly} style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: safeOnly ? '#1F4D2C' : '#D9DDD8', transition: 'background 200ms' }} />
            <div style={{ position: 'absolute', top: 2, left: safeOnly ? 17 : 2, width: 15, height: 15, borderRadius: 999, background: '#fff', transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldIco />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12' }}>안전 식품만 보기</span>
            </div>
            {userName && (userAllergenNames.length > 0 || userDiseaseNames.length > 0) && (
              <div style={{ fontSize: 10, color: '#6B7A6E', marginTop: 2, lineHeight: 1.4 }}>
                {userName}님 프로필 자동 적용
              </div>
            )}
            {userName && userAllergenNames.length === 0 && userDiseaseNames.length === 0 && (
              <div style={{ fontSize: 10, color: '#B0BAB3', marginTop: 2, lineHeight: 1.4 }}>
                등록된 알레르기·지병 없음
              </div>
            )}
          </div>
        </label>
      </FSection>

      {/* 알레르기 그룹 */}
      <FSection title="알레르기 그룹 제외">
        {allergenGroups.length === 0 ? (
          <div style={{ fontSize: 11, color: '#B0BAB3', padding: '6px 0' }}>등록된 알레르기 그룹이 없습니다</div>
        ) : allergenGroups.map(g => (
          <div key={g.id} style={{ marginBottom: 4 }}>
            <CheckRow label={g.name} checked={excludedGroups.includes(g.id)} onChange={() => onToggleGroup(g.id)} />
            <div style={{ paddingLeft: 23, fontSize: 10, color: '#B0BAB3', marginTop: -4, marginBottom: 2 }}>{g.allergenNames.join(', ')}</div>
          </div>
        ))}
      </FSection>

      {/* 개별 알레르기 */}
      <FSection title="개별 알레르기 제외" defaultOpen={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, paddingTop: 2 }}>
          {availableAllergens.map(a => (
            <PillBtn key={a.id} label={a.name} active={excludedAllergens.includes(a.name)} danger onClick={() => onToggleAllergen(a.name)} />
          ))}
        </div>
      </FSection>

      {/* 지병 케어 */}
      <FSection title="지병 케어 라인" defaultOpen={false}>
        <div style={{ fontSize: 10, color: '#B0BAB3', marginBottom: 7, lineHeight: 1.4 }}>선택 시 해당 지병 주의 상품이 제외됩니다</div>
        {availableDiseases.map(d => (
          <CheckRow key={d.id} label={d.name} checked={excludedDiseases.includes(d.name)} onChange={() => onToggleDisease(d.name)} />
        ))}
      </FSection>

      {/* 가격대 */}
      <FSection title="가격대">
        <SliderRow label="최대 가격" value={maxPrice} max={30000} unit="원" onChange={onMaxPrice} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#B0BAB3' }}>
          <span>0원</span><span>30,000원</span>
        </div>
      </FSection>

      {/* 영양 기준 */}
      <FSection title="영양 기준" defaultOpen={false}>
        <SliderRow label="당류"  value={maxSugar}   max={50}   unit="g"    onChange={onMaxSugar}   />
        <SliderRow label="나트륨" value={maxSodium}  max={2000} unit="mg"  onChange={onMaxSodium}  />
        <SliderRow label="단백질" value={minProtein} max={50}   unit="g"   onChange={onMinProtein} isMin />
        <SliderRow label="지방"   value={maxFat}     max={100}  unit="g"   onChange={onMaxFat}    />
        <SliderRow label="열량"   value={maxKcal}    max={800}  unit="kcal" onChange={onMaxKcal}   />
      </FSection>

      {/* 브랜드 */}
      {brands.length > 0 && (
        <FSection title="브랜드" defaultOpen={false}>
          {brands.map(([brand, count]) => (
            <CheckRow key={brand} label={brand} count={count} checked={selectedBrands.includes(brand)} onChange={() => onToggleBrand(brand)} />
          ))}
        </FSection>
      )}

      {/* 태그 */}
      {allTags.length > 0 && (
        <FSection title="태그" defaultOpen={false}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, paddingTop: 2 }}>
            {allTags.map(t => (
              <PillBtn key={t} label={t} active={selectedTags.includes(t)} onClick={() => onToggleTag(t)} />
            ))}
          </div>
        </FSection>
      )}

      {/* 원산지 */}
      <FSection title="원산지" defaultOpen={false}>
        {ORIGINS.map(o => (
          <CheckRow key={o} label={o} checked={selectedOrigins.includes(o)} onChange={() => onToggleOrigin(o)} />
        ))}
      </FSection>

      {/* 인증 */}
      <FSection title="인증" defaultOpen={false}>
        {CERTS.map(c => (
          <CheckRow key={c} label={c} checked={selectedCerts.includes(c)} onChange={() => onToggleCert(c)} />
        ))}
      </FSection>

      {/* 배송 */}
      <FSection title="배송" defaultOpen={false}>
        {DELIVERIES.map(d => (
          <CheckRow key={d} label={d} checked={selectedDelivery.includes(d)} onChange={() => onToggleDelivery(d)} />
        ))}
      </FSection>

      {/* 기타 */}
      <FSection title="기타" defaultOpen={false}>
        <CheckRow label="할인 상품만" checked={discountOnly} onChange={onDiscountOnly} />
      </FSection>
    </aside>
  );
};

/* ── ProductPage ─────────────────────── */
const ProductPage: FC<ProductPageProps> = ({ onProductClick, initialCategory }) => {
  const { products }                           = useProducts();
  const { user }                               = useAuth();
  const { allergenNames: userAllergenNames,
          diseaseNames:  userDiseaseNames }     = useMyAllergenSummary();
  const { myGroups, availableAllergens,
          availableDiseases }                  = useAllergenData();
  const [activeCat,  setActiveCat]  = useState(initialCategory ?? 'protein');
  const [activeSub,  setActiveSub]  = useState('전체');

  useEffect(() => {
    if (initialCategory) { setActiveCat(initialCategory); setActiveSub('전체'); }
  }, [initialCategory]);

  const [query,           setQuery]           = useState('');
  const [sort,            setSort]            = useState('relevance');
  const [curPage,         setCurPage]         = useState(1);
  const [safeOnly,        setSafeOnly]        = useState(false);
  const [excludedGroups,  setExcludedGroups]  = useState<string[]>([]);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [excludedDiseases,  setExcludedDiseases]  = useState<string[]>([]);
  const [maxPrice,        setMaxPrice]        = useState(30000);
  const [maxSugar,        setMaxSugar]        = useState(50);
  const [maxSodium,       setMaxSodium]       = useState(2000);
  const [minProtein,      setMinProtein]      = useState(0);
  const [maxFat,          setMaxFat]          = useState(100);
  const [maxKcal,         setMaxKcal]         = useState(800);
  const [selectedBrands,  setSelectedBrands]  = useState<string[]>([]);
  const [selectedTags,    setSelectedTags]    = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedCerts,   setSelectedCerts]   = useState<string[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<string[]>([]);
  const [discountOnly,    setDiscountOnly]    = useState(false);
  const [view,            setView]            = useState<'grid' | 'list'>('grid');

  const subs = SUBCATS[activeCat] ?? ['전체'];

  useEffect(() => { setCurPage(1); }, [
    activeCat, activeSub, query, sort, safeOnly,
    excludedGroups, excludedAllergens, excludedDiseases,
    maxPrice, maxSugar, maxSodium, minProtein, maxFat, maxKcal,
    selectedBrands, selectedTags, selectedOrigins, selectedCerts, selectedDelivery,
    discountOnly,
  ]);

  const groupAllergenNames = [...new Set(
    excludedGroups.flatMap(gid => {
      const g = myGroups.find(g => g.id === gid);
      return g?.allergenNames ?? [];
    }),
  )];

  const allExcludedAllergens = [...new Set([
    ...(safeOnly ? userAllergenNames : []),
    ...groupAllergenNames,
    ...excludedAllergens,
  ])];
  const allExcludedDiseases = [...new Set([
    ...(safeOnly ? userDiseaseNames : []),
    ...excludedDiseases,
  ])];

  const sorted = useMemo(() => {
    const filtered = products.filter(p => {
      if (activeCat !== 'all' && p.category !== activeCat) return false;
      if (activeSub !== '전체' && p.subcat !== activeSub) return false;
      if (query && !p.name.includes(query) && !p.brand.includes(query)) return false;
      if (allExcludedAllergens.length > 0 && (p.allergens ?? []).some(a => allExcludedAllergens.includes(a))) return false;
      if (allExcludedDiseases.length > 0 && (p.riskDiseases ?? []).some(d => allExcludedDiseases.includes(d))) return false;
      if (p.price > maxPrice) return false;
      if (p.nutrition) {
        if (p.nutrition.sugar   > maxSugar)   return false;
        if (p.nutrition.sodium  > maxSodium)  return false;
        if (p.nutrition.protein < minProtein) return false;
        if (p.nutrition.fat     > maxFat)     return false;
        if (p.nutrition.kcal    > maxKcal)    return false;
      }
      if (selectedBrands.length   > 0 && !selectedBrands.includes(p.brand))                          return false;
      if (selectedTags.length     > 0 && !selectedTags.some(t => (p.tags ?? []).includes(t)))        return false;
      if (selectedOrigins.length  > 0 && !selectedOrigins.includes(p.origin ?? ''))                  return false;
      if (selectedCerts.length    > 0 && !selectedCerts.some(c => (p.tags ?? []).includes(c)))       return false;
      if (selectedDelivery.length > 0 && !selectedDelivery.includes(p.delivery ?? ''))               return false;
      if (discountOnly && p.discountRate === 0) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'popular':   return b.reviewCount - a.reviewCount;
        case 'priceLow':  return a.price - b.price;
        case 'priceHigh': return b.price - a.price;
        case 'rating':    return b.rating - a.rating;
        case 'protein':   return (b.nutrition?.protein ?? 0) - (a.nutrition?.protein ?? 0);
        default:          return 0;
      }
    });
  }, [products, activeCat, activeSub, query, sort, allExcludedAllergens, allExcludedDiseases,
      maxPrice, maxSugar, maxSodium, minProtein, maxFat, maxKcal,
      selectedBrands, selectedTags, selectedOrigins, selectedCerts, selectedDelivery, discountOnly]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const pageItems  = sorted.slice((curPage - 1) * PER_PAGE, curPage * PER_PAGE);

  function tog<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  }

  function reset() {
    setSafeOnly(false); setExcludedGroups([]); setExcludedAllergens([]); setExcludedDiseases([]);
    setMaxPrice(30000); setMaxSugar(50); setMaxSodium(2000); setMinProtein(0); setMaxFat(100); setMaxKcal(800);
    setSelectedBrands([]); setSelectedTags([]); setSelectedOrigins([]); setSelectedCerts([]);
    setSelectedDelivery([]); setDiscountOnly(false); setQuery('');
  }

  // Applied filter chips
  type Chip = { label: string; icon?: React.ReactNode; onRemove: () => void };
  const activeChips: Chip[] = [
    ...excludedGroups.map(gid => {
      const g = myGroups.find(g => g.id === gid);
      return { label: `${g?.name ?? gid} 그룹 제외`, icon: <NoIco/>, onRemove: () => setExcludedGroups(prev => prev.filter(x => x !== gid)) };
    }),
    ...excludedAllergens.map(a => ({ label: `${a} 제외`, icon: <NoIco/>, onRemove: () => setExcludedAllergens(prev => prev.filter(x => x !== a)) })),
    ...excludedDiseases.map(d => ({ label: `${d} 케어`, icon: <NoIco/>, onRemove: () => setExcludedDiseases(prev => prev.filter(x => x !== d)) })),
    ...selectedOrigins.map(o => ({ label: o, onRemove: () => setSelectedOrigins(prev => prev.filter(x => x !== o)) })),
    ...selectedCerts.map(c => ({ label: c, onRemove: () => setSelectedCerts(prev => prev.filter(x => x !== c)) })),
    ...selectedDelivery.map(d => ({ label: d, onRemove: () => setSelectedDelivery(prev => prev.filter(x => x !== d)) })),
    ...selectedBrands.map(b => ({ label: b, onRemove: () => setSelectedBrands(prev => prev.filter(x => x !== b)) })),
    ...(discountOnly ? [{ label: '할인만', onRemove: () => setDiscountOnly(false) }] : []),
    ...(maxPrice < 30000 ? [{ label: `${maxPrice.toLocaleString()}원↓`, onRemove: () => setMaxPrice(30000) }] : []),
  ];

  const safeCount = sorted.filter(p =>
    (p.allergens ?? []).length === 0 ||
    (p.allergens ?? []).every(a => !allExcludedAllergens.includes(a)),
  ).length;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: 80 }}>

      {/* 서브카테고리 레일 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7E1' }}>
        <div
          style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 40px', display: 'flex', gap: 6, overflowX: 'auto', alignItems: 'center' }}
          className="scrollbar-hide"
        >
          {subs.map((s, i) => {
            const isActive = i === 0 ? activeSub === '전체' : s === activeSub;
            return (
              <button
                key={s}
                onClick={() => setActiveSub(i === 0 ? '전체' : s)}
                style={{
                  padding: '5px 14px', borderRadius: 999, flexShrink: 0,
                  border: '1px solid ' + (isActive ? '#1F4D2C' : '#E5E7E1'),
                  background: isActive ? '#1F4D2C' : '#fff',
                  color: isActive ? '#fff' : '#3A4A3F',
                  fontFamily: 'inherit', fontSize: 12, fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 150ms',
                }}
              >{s}</button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 40px 0' }}>

        {/* 검색바 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: '#fff', border: '1.5px solid #C9CFC4', borderRadius: 12, marginBottom: 18 }}>
          <SearchIco />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`${CAT_NAMES[activeCat] ?? '전체'} 안에서 검색`}
            style={{ flex: 1, fontFamily: 'inherit', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: '#0F1E12' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: '#9AA89D' }}>
              <XIcon />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* 사이드바 */}
          <FilterSidebar
            allProducts={products}
            activeCat={activeCat}
            safeOnly={safeOnly}
            onSafeOnly={() => setSafeOnly(v => !v)}
            excludedGroups={excludedGroups}
            onToggleGroup={id => setExcludedGroups(prev => tog(prev, id))}
            excludedAllergens={excludedAllergens}
            onToggleAllergen={n => setExcludedAllergens(prev => tog(prev, n))}
            excludedDiseases={excludedDiseases}
            onToggleDisease={n => setExcludedDiseases(prev => tog(prev, n))}
            userName={user?.name}
            userAllergenNames={userAllergenNames}
            userDiseaseNames={userDiseaseNames}
            allergenGroups={myGroups}
            availableAllergens={availableAllergens}
            availableDiseases={availableDiseases}
            maxPrice={maxPrice}
            onMaxPrice={setMaxPrice}
            maxSugar={maxSugar}
            onMaxSugar={setMaxSugar}
            maxSodium={maxSodium}
            onMaxSodium={setMaxSodium}
            minProtein={minProtein}
            onMinProtein={setMinProtein}
            maxFat={maxFat}
            onMaxFat={setMaxFat}
            maxKcal={maxKcal}
            onMaxKcal={setMaxKcal}
            selectedBrands={selectedBrands}
            onToggleBrand={b => setSelectedBrands(prev => tog(prev, b))}
            selectedTags={selectedTags}
            onToggleTag={t => setSelectedTags(prev => tog(prev, t))}
            selectedOrigins={selectedOrigins}
            onToggleOrigin={o => setSelectedOrigins(prev => tog(prev, o))}
            selectedCerts={selectedCerts}
            onToggleCert={c => setSelectedCerts(prev => tog(prev, c))}
            selectedDelivery={selectedDelivery}
            onToggleDelivery={d => setSelectedDelivery(prev => tog(prev, d))}
            discountOnly={discountOnly}
            onDiscountOnly={() => setDiscountOnly(v => !v)}
            onReset={reset}
          />

          {/* 상품 영역 */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* 카테고리 배너 카드 */}
            <div style={{
              background: 'linear-gradient(120deg, #0F1E12 0%, #1F4D2C 55%, #2E7D32 100%)',
              borderRadius: 16, padding: '22px 26px', marginBottom: 18,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#A8E063', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                  CATEGORY · {CAT_NAMES[activeCat] ?? activeCat}
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>
                  {CAT_NAMES[activeCat] ?? activeCat}
                </h1>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span>전체 <strong style={{ color: '#fff' }}>{sorted.length}</strong>개</span>
                  {user?.name && (
                    <>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span>{user.name}님 프로필 안전 <strong style={{ color: '#A8E063' }}>{safeCount}</strong>개</span>
                    </>
                  )}
                </div>
              </div>
              {safeOnly && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                  background: 'rgba(168,224,99,0.16)', border: '1px solid rgba(168,224,99,0.4)',
                  borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#A8E063', whiteSpace: 'nowrap', flexShrink: 0,
                }}>✓ 안전 필터 ON</span>
              )}
            </div>

            {/* 적용된 필터 칩 */}
            {activeChips.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A6E', marginBottom: 6 }}>적용 필터</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {activeChips.map(chip => (
                    <span
                      key={chip.label}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 10px', background: '#EFF6EF', color: '#1F4D2C',
                        borderRadius: 999, fontSize: 11, fontWeight: 600, border: '1px solid #C3E6CA',
                      }}
                    >
                      {chip.icon}
                      {chip.label}
                      <button
                        onClick={chip.onRemove}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#5A8A62' }}
                      ><XIcon /></button>
                    </span>
                  ))}
                  <button
                    onClick={reset}
                    style={{ padding: '3px 10px', borderRadius: 999, border: '1px solid #E5E7E1', background: 'transparent', color: '#9AA89D', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                  >전체 해제</button>
                </div>
              </div>
            )}

            {/* 정렬 + 결과 수 + 뷰 토글 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                {SORT_OPTS.map((opt, i) => (
                  <span key={opt.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {i > 0 && <span style={{ width: 1, height: 11, background: '#E5E7E1', margin: '0 5px' }} />}
                    <button
                      onClick={() => setSort(opt.id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        fontFamily: 'inherit', fontSize: 12,
                        fontWeight: sort === opt.id ? 700 : 500,
                        color: sort === opt.id ? '#0F1E12' : '#9AA89D',
                      }}
                    >
                      {sort === opt.id && <span style={{ width: 4, height: 4, borderRadius: 999, background: '#1F4D2C' }} />}
                      {opt.label}
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#6B7A6E' }}>
                  총 <strong style={{ color: '#0F1E12' }}>{sorted.length}</strong>개
                </span>
                <div style={{ display: 'flex', gap: 2, border: '1px solid #E5E7E1', borderRadius: 8, padding: 2 }}>
                  <button
                    onClick={() => setView('grid')}
                    aria-label="격자 보기"
                    style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 6, cursor: 'pointer', background: view === 'grid' ? '#1F4D2C' : 'transparent' }}
                  ><GridIco active={view === 'grid'} /></button>
                  <button
                    onClick={() => setView('list')}
                    aria-label="목록 보기"
                    style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 6, cursor: 'pointer', background: view === 'list' ? '#1F4D2C' : 'transparent' }}
                  ><ListIco active={view === 'list'} /></button>
                </div>
              </div>
            </div>

            {/* 상품 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: view === 'grid' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: 16 }}>
              {pageItems.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => onProductClick?.(p)} />
              ))}
            </div>

            {sorted.length === 0 && (
              <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#3A4A3F' }}>검색 결과가 없습니다</div>
                <div style={{ fontSize: 13, marginTop: 6, color: '#9AA89D' }}>필터를 조정하거나 다른 검색어를 시도해보세요</div>
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 32 }}>
                <button
                  onClick={() => { setCurPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
                  disabled={curPage === 1}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E7E1', background: '#fff', color: curPage === 1 ? '#C9CFC4' : '#3A4A3F', cursor: curPage === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: 13 }}
                >이전</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => { setCurPage(n); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid ' + (curPage === n ? '#1F4D2C' : '#E5E7E1'), background: curPage === n ? '#1F4D2C' : '#fff', color: curPage === n ? '#fff' : '#3A4A3F', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: curPage === n ? 700 : 500 }}
                  >{n}</button>
                ))}
                <button
                  onClick={() => { setCurPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
                  disabled={curPage === totalPages}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E7E1', background: '#fff', color: curPage === totalPages ? '#C9CFC4' : '#3A4A3F', cursor: curPage === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: 13 }}
                >다음</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
