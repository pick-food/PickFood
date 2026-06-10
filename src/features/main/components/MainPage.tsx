import { useState, useEffect, type FC } from "react";
import { useAuth }      from "../../auth/store/useAuth";
import { useProducts }  from "../../product/hooks/useProducts";
import ProductCard      from "../../product/components/ProductCard";
import type { Product } from "../../product/models/type";

/* ── props ──────────────────────────────────────────────── */
interface MainPageProps {
  onProductClick?: (product: Product) => void;
  onSignup?: () => void;
  onGoToProduct?: (cat?: string) => void;
}

/* ── 공통 SVG 아이콘 ──────────────────────────────────────── */
const ChevRight = ({ size = 14, color = "#1F4D2C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ShieldIco = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#A8E063" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="#A8E063" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── SectionHeader ───────────────────────────────────────── */
const SectionHeader: FC<{
  kicker?: string;
  title: string;
  desc?: string;
  right?: React.ReactNode;
}> = ({ kicker, title, desc, right }) => (
  <div style={{ marginBottom: 18, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
    <div>
      {kicker && (
        <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7A6E', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
          {kicker}
        </div>
      )}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>{title}</h2>
      {desc && <p style={{ fontSize: 13, color: '#6B7A6E', marginTop: 4, lineHeight: 1.5 }}>{desc}</p>}
    </div>
    {right}
  </div>
);

const ViewAllBtn: FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'transparent', border: 'none', cursor: 'pointer',
      fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#1F4D2C',
      padding: '6px 0',
    }}
  >
    전체보기 <ChevRight />
  </button>
);


const CATS = [
  { id: 'all',      name: '전체' },
  { id: 'meat',     name: '정육·수산' },
  { id: 'fruit',    name: '과일' },
  { id: 'vegetable',name: '채소' },
  { id: 'dairy',    name: '유제품·음료' },
  { id: 'staple',   name: '주식·간편식' },
  { id: 'frozen',   name: '냉동·즉석' },
  { id: 'snack',    name: '간식·과자' },
  { id: 'baby',     name: '베이비푸드' },
  { id: 'health',   name: '건강기능식품' },
];

const SUB_CATS: Record<string, string[]> = {
  all:       ['신선식품', '특가·할인', '새벽배송', '베스트', '신규입고', '알레르기 안전'],
  meat:      ['소고기', '돼지고기', '닭고기', '오리·양고기', '생선', '조개·갑각류', '기타 수산'],
  fruit:     ['사과·배', '딸기·베리', '감귤·오렌지', '수박·참외', '수입 과일', '건조 과일'],
  vegetable: ['잎채소', '뿌리채소', '양파·마늘', '버섯류', '새싹·나물', '콩·두부'],
  dairy:     ['우유·생크림', '요거트', '치즈', '탄산음료', '주스', '두유·대체유', '커피·차'],
  staple:    ['쌀·잡곡', '면류', '빵·베이커리', '즉석밥', '가정간편식', '소스·양념'],
  frozen:    ['냉동 밥·반찬', '냉동 육류', '냉동 해산물', '라면', '즉석조리식', '아이스크림'],
  snack:     ['쿠키·비스킷', '칩·스낵', '캔디·젤리', '초콜릿', '시리얼·그래놀라', '견과류'],
  baby:      ['이유식', '유아 간식', '분유·두유', '유아 음료', '어린이 영양제'],
  health:    ['비타민·미네랄', '오메가3', '단백질·보충제', '유산균·프로바이오틱스', '한방·허브', '다이어트'],
};

/* ── SubCatStrip ─────────────────────────────────────────── */
const SubCatStrip: FC<{ catId: string; onSelect: (sub: string) => void }> = ({ catId, onSelect }) => {
  const subs = SUB_CATS[catId] ?? [];
  if (!subs.length) return null;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
      {subs.map(sub => (
        <button key={sub} onClick={() => onSelect(sub)} style={{
          padding: '8px 16px', borderRadius: 999, border: '1px solid #E5E7E1',
          background: '#fff', color: '#3A4A3F', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'border-color 160ms, background 160ms',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1F4D2C'; (e.currentTarget as HTMLButtonElement).style.background = '#F0F6F1'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7E1'; (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
        >
          {sub}
        </button>
      ))}
    </div>
  );
};

/* ── TrustStrip ──────────────────────────────────────────── */
const TrustStrip: FC = () => {
  const items = [
    { icon: '🛡️', title: '식약처 허가 성분 검증', desc: '15종 알레르기 성분을 라벨에서 자동 추출' },
    { icon: '✅', title: '의료 전문 식이 기준', desc: '9개 만성질환 베스트 가이드를 의료진과 함께 작성' },
    { icon: '🚚', title: '새벽 배송', desc: '콜드체인으로 신선 유지 · 안전한 포장재 사용' },
    { icon: '🔒', title: '개인 건강정보 보호', desc: '알레르기·질병 데이터는 KISA 인증 암호화 저장' },
  ];
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '28px 32px',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
      border: '1px solid #E5E7E1',
    }}>
      {items.map(it => (
        <div key={it.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: '#F0F6F1',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>{it.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{it.title}</div>
          <div style={{ fontSize: 12, color: '#6B7A6E', lineHeight: 1.5 }}>{it.desc}</div>
        </div>
      ))}
    </div>
  );
};

/* ── AllergenGrid (비로그인) ─────────────────────────────── */
const ALLERGENS = [
  { name: '새우', emoji: '🦐', count: 34 },
  { name: '게',   emoji: '🦀', count: 22 },
  { name: '땅콩', emoji: '🥜', count: 41 },
  { name: '우유', emoji: '🥛', count: 67 },
  { name: '달걀', emoji: '🥚', count: 53 },
  { name: '밀',   emoji: '🌾', count: 88 },
  { name: '대두', emoji: '🫘', count: 76 },
  { name: '견과류', emoji: '🌰', count: 29 },
];

const AllergenGrid: FC = () => (
  <section style={{ marginBottom: 36 }}>
    <SectionHeader kicker="식품 안전 가이드" title="자주 놓치는 알레르기 원재료 15종" desc="가공식품 라벨에서 자주 누락되는 원재료입니다. 프로필에 등록하면 자동으로 걸러집니다." />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
      {ALLERGENS.map(a => (
        <div key={a.name} style={{
          background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10,
          padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 30 }}>{a.emoji}</span>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12' }}>{a.name}</div>
          <div style={{ fontSize: 10, color: '#9AA89D' }}>{a.count}개 상품</div>
        </div>
      ))}
    </div>
  </section>
);

/* ── BestRankingGrid ─────────────────────────────────────── */
const BestRankingGrid: FC<{ products: Product[]; onProductClick?: (p: Product) => void }> = ({ products, onProductClick }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12 }}>
    {products.slice(0, 8).map((p, i) => (
      <div key={p.id} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onProductClick?.(p)}>
        <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: '#F4F5F1' }}>
          <img src={p.imageSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div style={{
            position: 'absolute', top: 6, left: 6, width: 24, height: 24,
            background: i < 3 ? '#0F1E12' : '#fff',
            color: i < 3 ? '#A8E063' : '#0F1E12',
            fontSize: 12, fontWeight: 800, borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: i >= 3 ? '1px solid #E5E7E1' : 'none',
          }}>{i + 1}</div>
        </div>
        <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 8, fontWeight: 600 }}>{p.brand}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1E12', lineHeight: 1.3, marginTop: 2,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{p.name}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{p.price.toLocaleString()}원</div>
      </div>
    ))}
  </div>
);

/* ── ProductGrid (5-column) ──────────────────────────────── */
const ProductGrid: FC<{ products: Product[]; onProductClick?: (p: Product) => void }> = ({ products, onProductClick }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
    {products.map(p => (
      <ProductCard key={p.id} product={p} onClick={() => onProductClick?.(p)} />
    ))}
  </div>
);


/* ── Countdown ──────────────────────────────────────────── */
const Countdown: FC = () => {
  const [time, setTime] = useState({ h: 2, m: 34, s: 12 });
  useEffect(() => {
    const t = setInterval(() => setTime(c => {
      let s = c.s - 1, m = c.m, h = c.h;
      if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) { h = 23; }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ color: '#B97308', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
      {String(time.h).padStart(2,'0')}:{String(time.m).padStart(2,'0')}:{String(time.s).padStart(2,'0')}
    </span>
  );
};

/* ── MainPage ────────────────────────────────────────────── */
const MainPage: FC<MainPageProps> = ({ onProductClick, onGoToProduct }) => {
  const { isLoggedIn, user } = useAuth();
  const { products }         = useProducts();
  const [activeCat, setActiveCat] = useState('all');

  return (
    <div style={{ background: '#fff', paddingBottom: 80 }}>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px 0' }}>

        {/* 서브카테고리 */}
        <SubCatStrip catId={activeCat} onSelect={(sub) => onGoToProduct?.(sub)} />

        {/* 비로그인 - 알레르기 교육 */}
        {!isLoggedIn && <AllergenGrid />}

        {/* 시간 특가 */}
        <section style={{ marginBottom: 44 }}>
          <SectionHeader
            kicker="⏱ TIME DEAL"
            title="놓치면 후회하는 시간 특가"
            desc={<>종료까지 <Countdown /></> as unknown as string}
            right={<ViewAllBtn />}
          />
          <ProductGrid products={products} onProductClick={onProductClick} />
        </section>

        {/* 맞춤 추천 */}
        <section style={{ marginBottom: 44 }}>
          <SectionHeader
            kicker={isLoggedIn ? `${user?.name ?? ''}님 PICK` : '에디터 추천'}
            title={isLoggedIn ? '회원님께 안전한 맞춤 식품' : '이번 주 에디터가 고른 식품'}
            desc={isLoggedIn ? '알레르기·질병을 모두 통과한 식품만 모았습니다' : '영양과 안전 기준으로 검증된 식품입니다'}
            right={<ViewAllBtn />}
          />
          <ProductGrid products={products} onProductClick={onProductClick} />
        </section>

        {/* 베스트 셀러 - 8열 랭킹 */}
        <section style={{ marginBottom: 44 }}>
          <SectionHeader
            kicker="BEST"
            title="이번 주 베스트 셀러"
            desc="가장 많이 주문된 식품 TOP 8"
            right={<ViewAllBtn />}
          />
          <BestRankingGrid products={products} onProductClick={onProductClick} />
        </section>

        {/* 신규 입고 */}
        <section style={{ marginBottom: 44 }}>
          <SectionHeader
            kicker="NEW"
            title="새로 들어온 신식품"
            desc="검증을 마치고 안전한 식품을 가장 먼저 만나보세요"
            right={<ViewAllBtn />}
          />
          <ProductGrid products={products} onProductClick={onProductClick} />
        </section>

        {/* 카테고리 필터 + 그리드 */}
        <section style={{ marginBottom: 36 }}>
          <SectionHeader kicker="카테고리" title="원하는 카테고리에서 골라보기" desc="안전 필터는 모든 카테고리에 적용됩니다" />
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                style={{
                  padding: '8px 14px', borderRadius: 999,
                  border: '1px solid ' + (activeCat === c.id ? '#1F4D2C' : '#E5E7E1'),
                  background: activeCat === c.id ? '#1F4D2C' : '#fff',
                  color: activeCat === c.id ? '#fff' : '#3A4A3F',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >{c.name}</button>
            ))}
          </div>
          <ProductGrid products={products} onProductClick={onProductClick} />
        </section>

        {/* 신뢰 스트립 */}
        <TrustStrip />
      </div>
    </div>
  );
};

export default MainPage;
