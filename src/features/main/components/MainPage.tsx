import { useState, useEffect, type FC } from "react";
import { useAuth }               from "../../auth/store/useAuth";
import { useProducts }           from "../../product/hooks/useProducts";
import { useMyAllergenSummary }  from "../../allergen/hooks/useMyAllergenSummary";
import ProductCard               from "../../product/components/ProductCard";
import type { Product }          from "../../product/models/type";

interface MainPageProps {
  onProductClick?: (product: Product) => void;
  onSignup?: () => void;
  onGoToProduct?: (cat?: string) => void;
}

/* ── SVG / 공통 컴포넌트 ──────────────────────────────────── */
const ChevRight = ({ size = 14, color = "#1F4D2C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SectionHeader: FC<{
  kicker?: string; title: string; desc?: React.ReactNode; right?: React.ReactNode;
}> = ({ kicker, title, desc, right }) => (
  <div style={{ marginBottom: 18, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
    <div>
      {kicker && <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7A6E', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 5 }}>{kicker}</div>}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
      {desc && <div style={{ fontSize: 13, color: '#6B7A6E', marginTop: 4, lineHeight: 1.5 }}>{desc}</div>}
    </div>
    {right}
  </div>
);

const ViewAllBtn: FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#1F4D2C', padding: '6px 0', flexShrink: 0, whiteSpace: 'nowrap' }}>
    › 전체보기
  </button>
);

/* ── Countdown ──────────────────────────────────────────────── */
const Countdown: FC = () => {
  const [time, setTime] = useState({ h: 2, m: 29, s: 20 });
  useEffect(() => {
    const t = setInterval(() => setTime(c => {
      let { h, m, s } = c;
      s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(t);
  }, []);
  const p = (n: number) => String(n).padStart(2, '0');
  return <span style={{ color: '#B97308', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{p(time.h)}:{p(time.m)}:{p(time.s)}</span>;
};

/* ── Hero carousel data ─────────────────────────────────────── */
const HERO_SLIDES = [
  {
    tag: 'CURATED', accent: '#1F4D2C',
    kicker: '알레르기 안전 라인업',
    title: '새우 없이도\n다채로운 한 끼',
    desc: '갑각류 알레르기 회원 1만 명이 직접 고른 안전 상품 320선',
    cta: '안전 라인업 보기', meta: '5/12 ~ 5/18',
    bg: '#F0F6F1',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=85&auto=format&fit=crop',
  },
  {
    tag: '주간 할인', accent: '#B97308',
    kicker: '당뇨 케어 라인업',
    title: '저당·저GI 식품\n최대 35% 할인',
    desc: '의료진 자문 영양 기준 적용 · 28종 한정 특가',
    cta: '특가 보러가기', meta: '~6/12',
    bg: '#FFF8EC',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=85&auto=format&fit=crop',
  },
  {
    tag: 'NEW', accent: '#1F4D2C',
    kicker: '제철 채소 직배송',
    title: '오늘 아침 수확한\n신선 채소 모음',
    desc: '산지 직배송 · 당일 수확 · 세척 완료',
    cta: '신선 채소 보기', meta: '~6/30',
    bg: '#FAFAE5',
    img: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200&q=85&auto=format&fit=crop',
  },
  {
    tag: 'PB', accent: '#D55A2C',
    kicker: 'pickfood 안심 라인업',
    title: '단백질 걱정 없이\n22% 단독 할인',
    desc: '고단백·저지방 PB 상품 · 전 7종',
    cta: '고단백 보러가기', meta: '~6/20',
    bg: '#FFEFE5',
    img: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=1200&q=85&auto=format&fit=crop',
  },
];

/* ── SidePromo ──────────────────────────────────────────────── */
const SidePromo: FC<{
  bg: string; accent: string; kicker: React.ReactNode;
  title: string; desc: string; img?: string; cta: string;
  onCta?: () => void;
}> = ({ bg, accent, kicker, title, desc, img, cta, onCta }) => (
  <div
    style={{ flex: 1, background: bg, borderRadius: 14, padding: '18px 16px', display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer', overflow: 'hidden', border: '1px solid rgba(15,30,18,0.05)', minHeight: 0 }}
  >
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start', padding: '3px 8px', background: '#fff', color: accent, borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: '0.04em', border: '1px solid rgba(15,30,18,0.06)' }}>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: accent }} />
        {kicker}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: '#6B7A6E', lineHeight: 1.45 }}>{desc}</div>
      <button onClick={onCta} style={{ marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: accent, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
        {cta} <ChevRight size={11} color={accent} />
      </button>
    </div>
    {img && (
      <div style={{ width: 88, height: 88, borderRadius: 12, overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(15,30,18,0.08)' }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>
    )}
  </div>
);

/* ── Hero Section ───────────────────────────────────────────── */
const HeroSection: FC<{
  products: Product[];
  safeCount: number;
  isLoggedIn: boolean;
  userName?: string;
  onGoToProduct?: (cat?: string) => void;
}> = ({ products, safeCount, isLoggedIn, userName, onGoToProduct }) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused,   setPaused]   = useState(false);
  const topDeal = [...products].sort((a, b) => b.discountRate - a.discountRate)[0];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlideIdx(i => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, [paused]);

  const s    = HERO_SLIDES[slideIdx];
  const prev = () => setSlideIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setSlideIdx(i => (i + 1) % HERO_SLIDES.length);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 16, marginBottom: 48 }}>

      {/* ── 메인 히어로 (분할 레이아웃) ── */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: 'relative', borderRadius: 16, overflow: 'hidden',
          aspectRatio: '16/7', background: s.bg,
          transition: 'background 600ms ease',
          border: '1px solid rgba(15,30,18,0.05)',
        }}
      >
        {/* 절대 그리드: 좌 텍스트 / 우 이미지 */}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1.05fr' }}>
          {/* 왼쪽 텍스트 패널 */}
          <div
            key={slideIdx + '-txt'}
            className="pf-hero-text-enter"
            style={{ padding: '52px 0 52px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, color: '#0F1E12', position: 'relative', zIndex: 1 }}
          >
            {/* 태그 필 */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: '#fff', color: s.accent, borderRadius: 999, fontSize: 11, fontWeight: 800, alignSelf: 'flex-start', letterSpacing: '0.06em', border: '1px solid rgba(15,30,18,0.06)' }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: s.accent }} />
              {s.tag}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.accent, letterSpacing: '-0.005em' }}>{s.kicker}</div>
            <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em', whiteSpace: 'pre-line', margin: 0, color: '#0F1E12' }}>{s.title}</h1>
            <p style={{ fontSize: 14, color: 'rgba(15,30,18,0.65)', lineHeight: 1.55, maxWidth: 340, margin: 0 }}>{s.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
              <button
                onClick={() => onGoToProduct?.()}
                style={{ background: '#0F1E12', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >{s.cta} <ChevRight color="#fff" size={14} /></button>
              <span style={{ fontSize: 11, color: 'rgba(15,30,18,0.5)', fontWeight: 600 }}>{s.meta}</span>
            </div>
          </div>

          {/* 오른쪽 이미지 패널 */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            {HERO_SLIDES.map((h, i) => (
              <img key={h.kicker} src={h.img} alt="" style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: i === slideIdx ? 1 : 0,
                transform: i === slideIdx ? 'scale(1)' : 'scale(1.04)',
                transition: 'opacity 600ms ease, transform 700ms ease',
                clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
              }} />
            ))}
          </div>
        </div>

        {/* 이전/다음 화살표 (좌하단) */}
        <button onClick={prev} style={{ position: 'absolute', left: 14, bottom: 14, width: 36, height: 36, borderRadius: 999, border: '1px solid rgba(15,30,18,0.08)', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#0F1E12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={next} style={{ position: 'absolute', left: 56, bottom: 14, width: 36, height: 36, borderRadius: 999, border: '1px solid rgba(15,30,18,0.08)', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#0F1E12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* 카운터 필 + 진행바 (우하단) */}
        <div style={{ position: 'absolute', bottom: 18, right: 18, padding: '6px 12px', background: 'rgba(15,30,18,0.08)', backdropFilter: 'blur(6px)', borderRadius: 999, fontSize: 11, fontWeight: 700, color: '#0F1E12', zIndex: 2, display: 'flex', alignItems: 'center', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
          <span>{String(slideIdx + 1).padStart(2, '0')}</span>
          <span style={{ width: 30, height: 2, background: 'rgba(15,30,18,0.15)', borderRadius: 1, position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
            <span key={slideIdx + (paused ? '-p' : '')} style={{ position: 'absolute', inset: 0, background: s.accent, width: paused ? '40%' : '100%', animation: paused ? 'none' : 'pfBarFill 5.5s linear forwards' }} />
          </span>
          <span style={{ color: 'rgba(15,30,18,0.5)' }}>{String(HERO_SLIDES.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ── 우측 사이드 프로모 2개 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SidePromo
          bg="#FFF8EC" accent="#B97308"
          kicker={<>시간 특가 · <Countdown /></>}
          title={topDeal ? `${topDeal.name.slice(0, 14)}…` : '오늘의 특가'}
          desc={`지당·고섬유 베스트셀러 · 단 24시간`}
          img={topDeal?.imageSrc}
          cta="특가 보러가기"
          onCta={() => onGoToProduct?.()}
        />
        <SidePromo
          bg="#F0F6F1" accent="#1F4D2C"
          kicker={isLoggedIn ? '맞춤 추천' : '첫 주문 혜택'}
          title={isLoggedIn ? `안전 상품 ${safeCount}개` : '신규 가입 5,000원'}
          desc={isLoggedIn ? `${userName ?? '회원'}님 프로필 기준 안전 검증 완료` : '알레르기·지병 프로필 등록 후 자동 적용'}
          img={products.find(p => p.category === 'protein')?.imageSrc}
          cta={isLoggedIn ? '맞춤 보러가기' : '가입하기'}
          onCta={() => onGoToProduct?.()}
        />
      </div>
    </div>
  );
};

/* ── 5-column product grid ──────────────────────────────────── */
const ProductGrid: FC<{ products: Product[]; onProductClick?: (p: Product) => void }> = ({ products, onProductClick }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
    {products.map(p => (
      <ProductCard key={p.id} product={p} onClick={() => onProductClick?.(p)} />
    ))}
  </div>
);

/* ── Brand Showcase ─────────────────────────────────────────── */
const FEATURED_BRANDS = [
  { name: '풀무원',  tag: '유기농 전문',    pid: 'p1',  color: '#1F6B3D' },
  { name: '오아시스', tag: '신선 수산물',   pid: 'p9',  color: '#1A4E8A' },
  { name: '하림',    tag: '동물복지 인증',  pid: 'p13', color: '#8A6A1E' },
  { name: '매일유업', tag: '저당·락토프리', pid: 'p4',  color: '#C2477D' },
  { name: 'pickfood', tag: 'PB 안심 라인', pid: 'p5',  color: '#151515' },
  { name: '제주랜드', tag: '제주 직배송',   pid: 'p8',  color: '#6B3A2A' },
];

const BrandShowcase: FC<{ products: Product[] }> = ({ products }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
    {FEATURED_BRANDS.map(b => {
      const p = products.find(pr => pr.id === b.pid);
      return (
        <div key={b.name} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', background: '#E5E7E1' }}>
          {p && (
            <img src={p.imageSrc} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(0deg, ${b.color} 0%, ${b.color}CC 35%, ${b.color}00 100%)` }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 12px 12px' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{b.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{b.tag}</div>
          </div>
        </div>
      );
    })}
  </div>
);

/* ── Best Ranking Grid (8열) ────────────────────────────────── */
const BestRankingGrid: FC<{ products: Product[]; onProductClick?: (p: Product) => void }> = ({ products, onProductClick }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12 }}>
    {products.slice(0, 8).map((p, i) => (
      <div key={p.id} style={{ cursor: 'pointer' }} onClick={() => onProductClick?.(p)}>
        <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: '#F4F5F1' }}>
          <img src={p.imageSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div style={{ position: 'absolute', top: 5, left: 5, width: 22, height: 22, background: i < 3 ? '#0F1E12' : '#fff', color: i < 3 ? '#A8E063' : '#0F1E12', fontSize: 11, fontWeight: 800, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: i >= 3 ? '1px solid #E5E7E1' : 'none' }}>{i + 1}</div>
        </div>
        <div style={{ fontSize: 10, color: '#6B7A6E', marginTop: 7, fontWeight: 600 }}>{p.brand}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#0F1E12', lineHeight: 1.3, marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{p.name}</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0F1E12', marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>{p.price.toLocaleString()}원</div>
      </div>
    ))}
  </div>
);

/* ── 안전 필터 바 (로그인 시) ──────────────────────────────────── */
const SafeFilterBar: FC<{
  userName?: string;
  allergenNames: string[];
  diseaseNames: string[];
  totalCount: number;
  safeCount: number;
  onManage?: () => void;
}> = ({ userName, allergenNames, diseaseNames, totalCount, safeCount, onManage }) => {
  const warnCount = totalCount - safeCount;
  const chips = [
    ...allergenNames.map(n => ({ label: n + ' 제외', color: '#E53935' })),
    ...diseaseNames.map(n => ({ label: n + ' 케어', color: '#F57C00' })),
  ];
  return (
    <div style={{ background: '#F0F6EF', border: '1px solid #C8E6C9', borderRadius: 12, padding: '12px 18px', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <div style={{ width: 34, height: 34, borderRadius: 999, background: '#1F4D2C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" fill="#A8E063"/></svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>
          {userName ?? '회원'}님 안전 필터 적용 중
        </div>
        <div style={{ fontSize: 11, color: '#5A7A60', marginTop: 2 }}>
          {allergenNames.length > 0 ? allergenNames.join('·') + ' 알레르기' : '알레르기 없음'}
          {diseaseNames.length > 0 && ' / ' + diseaseNames.join('·') + ' 케어'}
          {' · 전체 '}<strong style={{ color: '#0F1E12' }}>{totalCount}</strong>개 중{' '}
          <strong style={{ color: '#1F4D2C' }}>{safeCount}개 안전</strong>
          {warnCount > 0 && <>, <strong style={{ color: '#C62828' }}>{warnCount}개 주의</strong></>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {chips.map(c => (
          <span key={c.label} style={{ padding: '4px 10px', borderRadius: 999, border: `1px solid ${c.color}22`, background: `${c.color}11`, color: c.color, fontSize: 11, fontWeight: 700 }}>
            {c.label}
          </span>
        ))}
        <button
          onClick={onManage}
          style={{ padding: '5px 12px', borderRadius: 999, border: '1px solid #1F4D2C', background: '#fff', color: '#1F4D2C', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginLeft: 4 }}
        >필터 관리</button>
      </div>
    </div>
  );
};

/* ── AllergenGrid (비로그인) ─────────────────────────────────── */
const ALLERGENS_DATA = [
  { name: '새우',  emoji: '🦐', count: 34 }, { name: '게',    emoji: '🦀', count: 22 },
  { name: '땅콩',  emoji: '🥜', count: 41 }, { name: '우유',  emoji: '🥛', count: 67 },
  { name: '달걀',  emoji: '🥚', count: 53 }, { name: '밀',    emoji: '🌾', count: 88 },
  { name: '대두',  emoji: '🫘', count: 76 }, { name: '견과류', emoji: '🌰', count: 29 },
];

const AllergenGrid: FC = () => (
  <section style={{ marginBottom: 40 }}>
    <SectionHeader kicker="식품 안전 가이드" title="자주 놓치는 알레르기 원재료 15종" desc="가공식품 라벨에서 자주 누락되는 원재료입니다. 프로필에 등록하면 자동으로 걸러집니다." />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
      {ALLERGENS_DATA.map(a => (
        <div key={a.name} style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>{a.emoji}</span>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12' }}>{a.name}</div>
          <div style={{ fontSize: 10, color: '#9AA89D' }}>{a.count}개 상품</div>
        </div>
      ))}
    </div>
  </section>
);

/* ── TrustStrip ─────────────────────────────────────────────── */
const TRUST_ITEMS = [
  { icon: '🛡️', title: '식약처 표시 대상 자동 검증', desc: '15종 알레르기 원재료를 라벨에서 자동 추출' },
  { icon: '✅', title: '의료 자문 영양 기준',          desc: '9개 만성질환 영양 가이드를 의료진과 함께 작성' },
  { icon: '🚚', title: '안심 배송',                    desc: '콜드체인으로 신선도 유지 · 안전한 포장재 사용' },
  { icon: '🔒', title: '개인 건강정보 암호화',          desc: '알레르기·지병 데이터는 KISA 인증 암호화 저장' },
];

const TrustStrip: FC = () => (
  <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 100, gap: 24, border: '1px solid #E5E7E1' }}>
    {TRUST_ITEMS.map(it => (
      <div key={it.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F0F6F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{it.icon}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{it.title}</div>
        <div style={{ fontSize: 12, color: '#6B7A6E', lineHeight: 1.5 }}>{it.desc}</div>
      </div>
    ))}
  </div>
);

/* ── 카테고리 탭 ────────────────────────────────────────────── */
const CATS = [
  { id: 'all',       name: '전체',        cat: ''        },
  { id: 'meat',      name: '정육·수산',   cat: 'protein' },
  { id: 'fruit',     name: '과일',        cat: 'fruit'   },
  { id: 'vegetable', name: '채소',        cat: 'veg'     },
  { id: 'dairy',     name: '유제품·음료', cat: 'dairy'   },
  { id: 'staple',    name: '주식·간편식', cat: 'staple'  },
  { id: 'frozen',    name: '냉동·즉석',   cat: 'ready'   },
  { id: 'snack',     name: '간식·과자',   cat: 'snack'   },
  { id: 'baby',      name: '베이비푸드',  cat: 'baby'    },
  { id: 'health',    name: '건강기능식품', cat: 'health' },
];

/* ── MainPage ───────────────────────────────────────────────── */
const MainPage: FC<MainPageProps> = ({ onProductClick, onGoToProduct }) => {
  const { isLoggedIn, user }              = useAuth();
  const { products }                      = useProducts();
  const { allergenNames, diseaseNames }   = useMyAllergenSummary();
  const [activeCat, setActiveCat]         = useState('all');

  const dealProducts = [...products].sort((a, b) => b.discountRate - a.discountRate);
  const bestProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount);
  const newProducts  = [...products].reverse();

  // 사용자 알레르기·지병 기준 안전 상품 계산
  // 설정된 알레르기가 없으면 전부 안전
  const safeProducts = (allergenNames.length === 0 && diseaseNames.length === 0)
    ? products
    : products.filter(p => {
        const hasAllergen = (p.allergens ?? []).some(a => allergenNames.includes(a));
        const hasDisease  = (p.riskDiseases ?? []).some(d => diseaseNames.includes(d));
        return !hasAllergen && !hasDisease;
      });

  const activeCatData = CATS.find(c => c.id === activeCat);
  const catProducts   = activeCatData?.cat
    ? products.filter(p => p.category === activeCatData.cat)
    : products;

  return (
    <div style={{ background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 40px 0' }}>

        {/* 히어로 */}
        <HeroSection
          products={products}
          safeCount={safeProducts.length}
          isLoggedIn={isLoggedIn}
          userName={user?.name}
          onGoToProduct={onGoToProduct}
        />

        {/* 안전 필터 바 (로그인 시) */}
        {isLoggedIn && (
          <SafeFilterBar
            userName={user?.name}
            allergenNames={allergenNames}
            diseaseNames={diseaseNames}
            totalCount={products.length}
            safeCount={safeProducts.length}
            onManage={() => onGoToProduct?.()}
          />
        )}

        {/* 비로그인: 알레르기 안내 */}
        {!isLoggedIn && <AllergenGrid />}

        {/* 시간 특가 */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeader
            kicker="⏱ TIME DEAL"
            title="놓치면 후회하는 시간 특가"
            desc={<>종료까지 <Countdown /></>}
            right={<ViewAllBtn onClick={() => onGoToProduct?.()} />}
          />
          <ProductGrid products={dealProducts.slice(0, 5)} onProductClick={onProductClick} />
        </section>

        {/* 맞춤 상품 */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeader
            kicker={isLoggedIn ? `${user?.name ?? ''}님 PICK` : '에디터 추천'}
            title={isLoggedIn ? '회원님께 안전한 맞춤 상품' : '이번 주 에디터가 고른 식품'}
            desc={isLoggedIn ? '알레르기·지병을 모두 통과한 상품만 모았습니다' : '영양과 안전 기준으로 검증된 식품입니다'}
            right={<ViewAllBtn onClick={() => onGoToProduct?.()} />}
          />
          <ProductGrid
            products={(isLoggedIn && safeProducts.length > 0 ? safeProducts : products).slice(0, 4)}
            onProductClick={onProductClick}
          />
        </section>

        {/* 브랜드 쇼케이스 */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeader kicker="입점 브랜드" title="신뢰할 수 있는 식품 브랜드" desc="안전성·인증·원산지를 모두 검증한 파트너 브랜드입니다." />
          <BrandShowcase products={products} />
        </section>

        {/* 베스트 셀러 */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeader
            kicker="BEST"
            title="이번 주 베스트 셀러"
            desc="가장 많이 주문된 상품 TOP 8"
            right={<ViewAllBtn onClick={() => onGoToProduct?.()} />}
          />
          <BestRankingGrid products={bestProducts} onProductClick={onProductClick} />
        </section>

        {/* 신상품 */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeader
            kicker="NEW"
            title="새로 들어온 신상품"
            desc="검증을 갓 마치고 입점한 상품을 가장 먼저 만나보세요"
            right={<ViewAllBtn onClick={() => onGoToProduct?.()} />}
          />
          <ProductGrid products={newProducts.slice(0, 5)} onProductClick={onProductClick} />
        </section>

        {/* 카테고리 둘러보기 */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeader kicker="카테고리" title="원하는 카테고리에서 골라보기" desc="안전 필터는 모든 카테고리에 적용됩니다" />
          <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
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
          <ProductGrid products={catProducts.slice(0, 5)} onProductClick={onProductClick} />
        </section>

        {/* 신뢰 스트립 */}
        <TrustStrip/>
      </div>
    </div>
  );
};

export default MainPage;
