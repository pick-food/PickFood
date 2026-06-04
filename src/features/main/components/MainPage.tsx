import { useState, useEffect, type FC } from "react";
import { useAuth }      from "../../auth/store/useAuth";
import { useProducts }  from "../../product/hooks/useProducts";
// import { useCategories } from "../hooks/useCategories";
import ProductCard      from "../../product/components/ProductCard";
import type { Product } from "../../product/models/type";

/* ── props ──────────────────────────────────────────────── */
interface MainPageProps {
  onProductClick?: (product: Product) => void;
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

/* ── HeroCarousel ────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 'h1', tag: 'CURATED', kicker: '알레르기 안전 라인업',
    title: '자연 재료\n다채로운 한 끼',
    desc: '개인별 알레르기 반응 1만 명이 직접 고른 안전 식품 320종',
    cta: '안전 라인업 보기',
    img: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=85&auto=format&fit=crop',
    bg: '#F0F6F1', accent: '#1F4D2C', textColor: '#0F1E12', meta: '5/12 ~ 5/18',
  },
  {
    id: 'h2', tag: '주간 할인', kicker: '당뇨 케어 라인업',
    title: '저당·저GI 식품\n최대 35% 할인',
    desc: '의료 전문 식이 기준 적용 · 28종 한정 특가',
    cta: '특가 보러가기',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=85&auto=format&fit=crop',
    bg: '#FFF8EC', accent: '#B97308', textColor: '#0F1E12', meta: '~ 6/12',
  },
  {
    id: 'h3', tag: 'NEW', kicker: '알리샌 인증 라인',
    title: '국내 최초\n글루텐프리 28종',
    desc: '의료진 전문 식이 · 첫 주문 기념 무료 배송',
    cta: '둘러보기',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85&auto=format&fit=crop',
    bg: '#FAFAE5', accent: '#1F4D2C', textColor: '#0F1E12', meta: '신규',
  },
];

const SIDE_PROMOS = [
  {
    bg: '#FFF8EC', accent: '#B97308',
    kicker: '시간 특가',
    title: '현미밥 22% 할인',
    desc: '저당·고식이섬유 베스트셀러 · 단 24시간',
    img: '/images/products/product2.png',
    cta: '특가 보기',
  },
  {
    bg: '#F0F6F1', accent: '#1F4D2C',
    kicker: '신규 회원 혜택',
    title: '첫 주문 5,000원',
    desc: '알레르기·질병 프로필 등록 시 즉시 적용',
    img: '/images/products/product4.png',
    cta: '회원가입',
  },
];

const SidePromo: FC<typeof SIDE_PROMOS[0]> = ({ bg, accent, kicker, title, desc, img, cta }) => (
  <div
    style={{
      background: bg, borderRadius: 14, padding: 16,
      display: 'flex', gap: 14, alignItems: 'center', flex: 1,
      cursor: 'pointer', overflow: 'hidden', position: 'relative',
      border: '1px solid rgba(15,30,18,0.05)', minHeight: 0,
    }}
  >
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
        padding: '3px 8px', background: '#fff', color: accent,
        borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
        border: '1px solid rgba(15,30,18,0.06)', marginBottom: 2,
      }}>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: accent }} />
        {kicker}
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: '#6B7A6E', lineHeight: 1.45 }}>{desc}</div>
      <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: accent }}>
        {cta} <ChevRight size={11} color={accent} />
      </div>
    </div>
    <div style={{ width: 88, height: 88, borderRadius: 12, overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(15,30,18,0.06)' }}>
      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    </div>
  </div>
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

/* ── SafetyBanner (로그인 시) ────────────────────────────── */
const SafetyBanner: FC<{ safeCount: number; dangerCount: number }> = ({ safeCount, dangerCount }) => (
  <section style={{
    background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12,
    padding: '18px 22px', marginBottom: 32,
    display: 'flex', alignItems: 'center', gap: 20,
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 999, background: '#0F1E12',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <ShieldIco />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>박지수님 안전 필터 적용 중</div>
      <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2 }}>
        새우·게 알레르기 / 당뇨 식이 · 전체 식품 중{' '}
        <strong style={{ color: '#1F6B45' }}>{safeCount}개 안전</strong>,{' '}
        <strong style={{ color: '#B71C1C' }}>{dangerCount}개 주의</strong>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 6 }}>
      {['🦐 새우 제외', '🦀 게 제외', '💉 당뇨 식이'].map(tag => (
        <span key={tag} style={{ padding: '4px 10px', background: '#F0F6F1', color: '#1F4D2C', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{tag}</span>
      ))}
    </div>
    <button style={{ padding: '8px 14px', border: '1px solid #E5E7E1', borderRadius: 8, background: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer' }}>
      필터 관리
    </button>
  </section>
);

/* ── HeroCarousel ────────────────────────────────────────── */
const HeroCarousel: FC = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = HERO_SLIDES[idx];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative', borderRadius: 16, overflow: 'hidden',
        aspectRatio: '16/7', background: slide.bg,
        transition: 'background 600ms ease', border: '1px solid rgba(15,30,18,0.05)',
      }}
    >
      {/* Split layout */}
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1.05fr' }}>
        {/* 텍스트 패널 */}
        <div
          key={slide.id + '-txt'}
          className="pf-fade-up"
          style={{
            padding: '52px 0 52px 56px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14,
            color: slide.textColor, position: 'relative', zIndex: 1,
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 12px', background: '#fff', color: slide.accent, borderRadius: 999,
            fontSize: 11, fontWeight: 800, alignSelf: 'flex-start', letterSpacing: '0.06em',
            border: '1px solid rgba(15,30,18,0.06)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: slide.accent }} />
            {slide.tag}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: slide.accent }}>{slide.kicker}</div>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em', whiteSpace: 'pre-line', marginTop: -2 }}>{slide.title}</h1>
          <p style={{ fontSize: 14, color: 'rgba(15,30,18,0.65)', lineHeight: 1.55, maxWidth: 340 }}>{slide.desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
            <button style={{
              background: '#0F1E12', color: '#fff', border: 'none', borderRadius: 8,
              padding: '12px 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {slide.cta} <ChevRight color="#fff" />
            </button>
            <span style={{ fontSize: 11, color: 'rgba(15,30,18,0.5)', fontWeight: 600 }}>{slide.meta}</span>
          </div>
        </div>
        {/* 이미지 패널 */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {HERO_SLIDES.map((h, i) => (
            <img key={h.id} src={h.img} alt="" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: i === idx ? 1 : 0,
              transform: i === idx ? 'scale(1)' : 'scale(1.04)',
              transition: 'opacity 600ms ease, transform 700ms ease',
              clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
            }} />
          ))}
        </div>
      </div>

      {/* 이전/다음 버튼 */}
      <button onClick={() => setIdx((idx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} style={{
        position: 'absolute', left: 14, bottom: 14, width: 36, height: 36, borderRadius: 999,
        border: '1px solid rgba(15,30,18,0.08)', background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
      }}>‹</button>
      <button onClick={() => setIdx((idx + 1) % HERO_SLIDES.length)} style={{
        position: 'absolute', left: 56, bottom: 14, width: 36, height: 36, borderRadius: 999,
        border: '1px solid rgba(15,30,18,0.08)', background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
      }}>›</button>

      {/* 카운터 */}
      <div style={{
        position: 'absolute', bottom: 18, right: 18, padding: '6px 12px',
        background: 'rgba(15,30,18,0.08)', backdropFilter: 'blur(6px)',
        borderRadius: 999, fontSize: 11, fontWeight: 700, color: '#0F1E12', zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 8, fontVariantNumeric: 'tabular-nums',
      }}>
        <span>{String(idx + 1).padStart(2, '0')}</span>
        <span style={{ width: 30, height: 2, background: 'rgba(15,30,18,0.15)', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', inset: 0, background: slide.accent, width: '60%' }} />
        </span>
        <span style={{ color: 'rgba(15,30,18,0.5)' }}>{String(HERO_SLIDES.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

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
const MainPage: FC<MainPageProps> = ({ onProductClick }) => {
  const { isLoggedIn } = useAuth();
  const { products }   = useProducts();
  const [activeCat, setActiveCat] = useState('all');

  const totalCount  = products.length;
  const safeCount   = Math.floor(totalCount * 0.7);
  const dangerCount = totalCount - safeCount;

  return (
    <div style={{ background: '#fff', paddingBottom: 80 }}>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px 0' }}>

        {/* 히어로 캐러셀 + 사이드 프로모 */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 36 }}>
          <HeroCarousel />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SIDE_PROMOS.map((sp, i) => <SidePromo key={i} {...sp} />)}
          </div>
        </section>

        {/* 로그인 - 안전 배너 */}
        {isLoggedIn && <SafetyBanner safeCount={safeCount} dangerCount={dangerCount} />}

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
            kicker={isLoggedIn ? '박지수님 PICK' : '에디터 추천'}
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
