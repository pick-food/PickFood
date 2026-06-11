import type { FC } from "react";
import { useRef, useState, useEffect } from "react";
import type { Product } from "../models/type";
import { useProductDetail } from "../../product/hooks/useProductDetail";
import { useToast } from "../hooks/useToast";
import Toast from "../../../shared/components/Toast";

interface ProductDetailPageProps {
  product: Product;
  onBack?: () => void;
}

// ── Mock data (no backend nutrition/allergen fields yet) ──────────────────────
const MOCK_NUTRITION = { kcal: 420, protein: 12, fat: 8, sugar: 5, sodium: 320, carbs: 65 };
const MOCK_ALLERGENS_IN_PRODUCT = ['밀', '대두'];
const ALL_ALLERGENS = ['난류','우유','메밀','땅콩','대두','밀','고등어','게','새우','돼지고기','복숭아','토마토','아황산류','호두','닭고기'];
const MOCK_TAGS = ['국내산', '저당', 'HACCP 인증', '고단백'];
const DISEASE_COMPAT = [
  { name: '당뇨',     ok: MOCK_NUTRITION.sugar < 6,    note: `당류 ${MOCK_NUTRITION.sugar}g` },
  { name: '고혈압',   ok: MOCK_NUTRITION.sodium < 500, note: `나트륨 ${MOCK_NUTRITION.sodium}mg` },
  { name: '고지혈증', ok: MOCK_NUTRITION.fat < 20,     note: `지방 ${MOCK_NUTRITION.fat}g` },
  { name: '신장질환', ok: MOCK_NUTRITION.sodium < 300, note: `나트륨 ${MOCK_NUTRITION.sodium}mg` },
];
const MOCK_REVIEWS = [
  { id: 1, user: '김**', score: 5, date: '2026.05.08', verified: true, profile: '본인 · 밀 알레르기', body: '경고가 미리 뜬 덕에 성분을 꼼꼼히 확인하고 구매할 수 있었어요. 일반 쇼핑몰에서는 라벨을 일일이 봐야 하는데 정말 편합니다.', helpful: 42 },
  { id: 2, user: '박**', score: 5, date: '2026.05.05', verified: true, profile: '아버지 · 당뇨',       body: '당뇨 필터로 거른 상품인데 실제로 당류 함량이 적어서 안심하고 드시게 되었습니다. 영양 정보가 이렇게 상세하게 나오는 게 좋아요.', helpful: 28 },
  { id: 3, user: '이**', score: 4, date: '2026.05.03', verified: true, profile: '본인 · 견과류 알레르기', body: '맛도 좋고 안전 검증도 마음에 들어요. 다만 포장이 조금만 더 환경 친화적이면 좋겠어요.', helpful: 14 },
  { id: 4, user: '정**', score: 5, date: '2026.05.01', verified: true, profile: '엄마 · 고혈압',       body: '저나트륨이라 부모님께 선물로 보내드리기 너무 좋아요. 안전 필터 정말 유용해요.', helpful: 11 },
];
const MOCK_QNA = [
  { id: 1, q: '이 제품 견과류 알레르기 있어도 먹을 수 있나요?', a: '이 상품은 견과류를 직접 포함하지 않으나, 동일 제조 라인에서 견과류 함유 제품이 생산될 수 있어 교차오염 가능성이 있습니다. 주의 부탁드립니다.', status: 'answered', date: '2026.05.06' },
  { id: 2, q: '냉동 보관 가능한가요?', a: '냉동 보관 시 변질될 수 있어 냉장 또는 상온 보관을 권장드립니다.', status: 'answered', date: '2026.05.04' },
  { id: 3, q: '유통기한이 어떻게 되나요?', a: null, status: 'pending', date: '2026.05.10' },
];

// ── Shared inline styles ──────────────────────────────────────────────────────
const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'pointer',
  fontFamily: 'inherit', fontSize: 14,
  fontWeight: active ? 700 : 500,
  color: active ? '#0F1E12' : '#6B7A6E',
  borderBottom: `2px solid ${active ? '#0F1E12' : 'transparent'}`,
  display: 'inline-flex', alignItems: 'center', gap: 6,
  whiteSpace: 'nowrap' as const,
});

// ── SectionTitle ──────────────────────────────────────────────────────────────
const SectionTitle: FC<{ kicker?: string; title: string }> = ({ kicker, title }) => (
  <div style={{ marginBottom: 20 }}>
    {kicker && <div style={{ fontSize: 11, fontWeight: 800, color: '#1F4D2C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{kicker}</div>}
    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>{title}</h2>
  </div>
);

// ── DescriptionTab ────────────────────────────────────────────────────────────
const DescriptionTab: FC<{ product: Product }> = ({ product }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
    {/* Editorial hero */}
    <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '16/7', background: '#F4F5F1' }}>
      <img src={product.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,30,18,0.72), transparent 55%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 48, transform: 'translateY(-50%)', color: '#fff', maxWidth: 460 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#A8E063', textTransform: 'uppercase', marginBottom: 10 }}>pickfood editor's note</div>
        <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 }}>매일 식탁에 올라도<br/>부담 없이 즐겁게.</h2>
        <p style={{ fontSize: 14, marginTop: 12, lineHeight: 1.7, opacity: 0.85 }}>
          {product.brand}이 정성껏 만든 제품. 알레르기·질병 정보가 라벨 한 줄에 머무르지 않도록<br/>pickfood가 다시 한 번 검증했습니다.
        </p>
      </div>
    </div>

    {/* Feature grid */}
    <div>
      <SectionTitle kicker="제품 특징" title="이 상품을 고른 이유" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {MOCK_TAGS.slice(0, 3).map((tag, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9AA89D', letterSpacing: '0.1em' }}>0{i + 1}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0F1E12', marginTop: 8 }}>{tag}</div>
            <p style={{ fontSize: 13, color: '#6B7A6E', marginTop: 8, lineHeight: 1.6 }}>
              pickfood 안전 기준을 충족하는 상품입니다. 자세한 분석은 안전·영양 항목에서 확인하실 수 있습니다.
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Story strip */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
      <div>
        <SectionTitle kicker="식재료 이야기" title="어디서 어떻게 만들어졌나" />
        <p style={{ fontSize: 14, color: '#3A4A3F', lineHeight: 1.8 }}>
          {product.brand}의 협력 농장에서 직접 재배·가공되는 식재료를 사용했습니다. 가공 단계마다 HACCP 검사를 통해 위생을 관리하고, pickfood는 매주 1회 무작위 표본 검사를 통해 라벨 정확도를 점검합니다.
        </p>
        <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
          {[['원산지','국내산'],['가공 공장','국내'],['인증','HACCP · 식약처']].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9AA89D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12', marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', background: '#F4F5F1' }}>
        <img src={product.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>
    </div>

    {/* Cooking suggestions */}
    <div>
      <SectionTitle kicker="활용 제안" title="이렇게 드시면 좋아요" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[{ title: '단독으로', desc: '데워서 또는 그대로 먹어도 맛있게 즐길 수 있습니다.', tag: '5분' },
          { title: '식사 대용', desc: '하루 한 끼 단백질 보충으로 활용하기 좋습니다.', tag: '10분' },
          { title: '요리 응용', desc: '샐러드·덮밥 등 다양한 메뉴에 활용 가능합니다.', tag: '15분' }].map((s, i) => (
          <div key={i} style={{ background: '#F4F5F1', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'inline-block', padding: '3px 8px', background: '#0F1E12', color: '#A8E063', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{s.tag}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F1E12', marginTop: 12 }}>{s.title}</div>
            <p style={{ fontSize: 13, color: '#6B7A6E', marginTop: 6, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── SafetyTab ─────────────────────────────────────────────────────────────────
const SafetyTab: FC = () => {
  const n = MOCK_NUTRITION;
  const bars = [
    { label: '나트륨', value: n.sodium, max: 2000, color: '#E89B26', unit: 'mg' },
    { label: '당류',   value: n.sugar,  max: 50,   color: '#D32F2F', unit: 'g'  },
    { label: '지방',   value: n.fat,    max: 65,   color: '#B97308', unit: 'g'  },
    { label: '단백질', value: n.protein,max: 55,   color: '#1F6B45', unit: 'g'  },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Nutrition block */}
      <div>
        <SectionTitle kicker="영양 정보" title="100g당 영양 성분" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
          {[['열량', `${n.kcal}kcal`], ['탄수화물', `${n.carbs}g`], ['단백질', `${n.protein}g`], ['지방', `${n.fat}g`], ['나트륨', `${n.sodium}mg`]].map(([k, v]) => (
            <div key={k} style={{ background: '#F4F5F1', borderRadius: 10, padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9AA89D', marginBottom: 8 }}>{k}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0F1E12' }}>{v}</div>
            </div>
          ))}
        </div>
        {/* Daily intake bars */}
        <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', marginBottom: 14 }}>1일 권장 섭취량 대비 (성인 기준)</div>
          {bars.map(b => {
            const pct = Math.min(100, (b.value / b.max) * 100);
            return (
              <div key={b.label} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px', alignItems: 'center', gap: 16, padding: '8px 0' }}>
                <span style={{ fontSize: 12, color: '#3A4A3F', fontWeight: 600 }}>{b.label}</span>
                <div style={{ position: 'relative', height: 8, background: '#F4F5F1', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: b.color, borderRadius: 999 }} />
                </div>
                <span style={{ fontSize: 12, color: '#3A4A3F', textAlign: 'right', fontWeight: 600 }}>
                  {Math.round(b.value)}{b.unit} · <span style={{ color: '#9AA89D' }}>{Math.round(pct)}%</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allergen section */}
      <div>
        <SectionTitle kicker="알레르기 검증" title="식재료 · 알레르기 정보" />
        <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#3A4A3F', marginBottom: 12 }}>이 상품이 포함하는 식재료</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {MOCK_ALLERGENS_IN_PRODUCT.map(a => (
              <div key={a} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 18px', minWidth: 80, background: '#FEF2F2', border: '1.5px solid #FCD7D7', borderRadius: 10 }}>
                <span style={{ fontSize: 24 }}>⚠️</span>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#B71C1C' }}>{a}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #F4F5F1', paddingTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7A6E', marginBottom: 14 }}>전체 15종 표시 — 불투명 = 비함유</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
              {ALL_ALLERGENS.map(a => {
                const has = MOCK_ALLERGENS_IN_PRODUCT.includes(a);
                return (
                  <div key={a} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, opacity: has ? 1 : 0.28, padding: '8px 4px', background: has ? '#FEF2F2' : 'transparent', borderRadius: 8 }}>
                    <span style={{ fontSize: 20 }}>🌾</span>
                    <div style={{ fontSize: 10, fontWeight: 600, color: has ? '#B71C1C' : '#3A4A3F', textAlign: 'center' }}>{a}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Disease compatibility */}
      <div>
        <SectionTitle kicker="질환 적합성" title="만성질환 영양 적합성" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {DISEASE_COMPAT.map(r => (
            <div key={r.name} style={{ background: r.ok ? '#F0F6F1' : '#FFF8EC', border: `1px solid ${r.ok ? '#DCE9DF' : '#FBE9C7'}`, borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: r.ok ? '#1F6B45' : '#E89B26', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {r.ok
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#fff" strokeWidth="1.8"/><line x1="12" y1="9" x2="12" y2="13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
                }
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: r.ok ? '#1F6B45' : '#B97308' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: r.ok ? '#1F6B45' : '#B97308', opacity: 0.85, marginTop: 2 }}>{r.ok ? '적합' : '주의'} · {r.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── ReviewsTab ────────────────────────────────────────────────────────────────
const ReviewsTab: FC<{ product: Product }> = ({ product }) => {
  const [filter, setFilter] = useState('all');
  const dist = [{ s: 5, p: 78 }, { s: 4, p: 16 }, { s: 3, p: 4 }, { s: 2, p: 1 }, { s: 1, p: 1 }];
  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, marginBottom: 28, padding: '24px 28px', background: '#F4F5F1', borderRadius: 14 }}>
        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.04em', lineHeight: 1 }}>{product.rating}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, marginTop: 8 }}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill={i <= Math.round(product.rating) ? '#E89B26' : '#DDE2DC'}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 8 }}>전체 {product.reviewCount.toLocaleString()}건의 후기</div>
        </div>
        <div style={{ paddingTop: 8 }}>
          {dist.map(r => (
            <div key={r.s} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 44px', alignItems: 'center', gap: 12, padding: '4px 0' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#3A4A3F' }}>{r.s}점</span>
              <div style={{ height: 6, background: '#fff', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.p}%`, background: '#E89B26', borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 12, color: '#6B7A6E', textAlign: 'right' }}>{r.p}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {[{ id: 'all', label: '전체' }, { id: 'photo', label: '사진 후기' }, { id: 'best', label: '도움됨' }].map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{
            padding: '7px 14px', borderRadius: 999,
            border: `1px solid ${filter === c.id ? '#0F1E12' : '#E5E7E1'}`,
            background: filter === c.id ? '#0F1E12' : '#fff',
            color: filter === c.id ? '#fff' : '#3A4A3F',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{c.label}</button>
        ))}
      </div>

      {/* Reviews */}
      <div>
        {MOCK_REVIEWS.map(r => (
          <div key={r.id} style={{ padding: '22px 0', borderTop: '1px solid #E5E7E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= r.score ? '#E89B26' : '#DDE2DC'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{r.user}</span>
              {r.verified && <span style={{ fontSize: 10, padding: '2px 6px', background: '#F0F6F1', color: '#1F6B45', borderRadius: 4, fontWeight: 700 }}>✓ 구매확인</span>}
              <span style={{ fontSize: 11, padding: '2px 7px', background: '#fff', color: '#3A4A3F', border: '1px solid #E5E7E1', borderRadius: 4 }}>{r.profile}</span>
              <span style={{ fontSize: 12, color: '#9AA89D', marginLeft: 'auto' }}>{r.date}</span>
            </div>
            <p style={{ fontSize: 14, color: '#3A4A3F', lineHeight: 1.7, marginBottom: 10 }}>{r.body}</p>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#fff', border: '1px solid #E5E7E1', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#3A4A3F' }}>
              👍 도움이 됐어요 {r.helpful}
            </button>
          </div>
        ))}
      </div>

      <button style={{ width: '100%', padding: 14, marginTop: 20, background: '#fff', border: '1px solid #E5E7E1', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer' }}>
        후기 더 보기 ({product.reviewCount - 4}건)
      </button>
    </div>
  );
};

// ── InquiryTab ────────────────────────────────────────────────────────────────
const InquiryTab: FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionTitle kicker="상품 문의" title="궁금한 점을 물어보세요" />
        <button style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #1F4D2C, #2A6339)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          문의 작성하기
        </button>
      </div>
      <div>
        {MOCK_QNA.map(item => (
          <div key={item.id} style={{ borderTop: '1px solid #E5E7E1' }}>
            <button onClick={() => item.a ? setExpanded(expanded === item.id ? null : item.id) : undefined} style={{ width: '100%', padding: '20px 0', background: 'transparent', border: 'none', cursor: item.a ? 'pointer' : 'default', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ padding: '3px 8px', borderRadius: 4, background: item.status === 'answered' ? '#1F4D2C' : '#E89B26', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {item.status === 'answered' ? '답변완료' : '답변대기'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F1E12' }}>Q. {item.q}</div>
                <div style={{ fontSize: 11, color: '#9AA89D', marginTop: 4 }}>{item.date}</div>
              </div>
            </button>
            {expanded === item.id && item.a && (
              <div style={{ padding: '16px 20px', background: '#F4F5F1', borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1F4D2C', marginBottom: 6 }}>A. pickfood 답변</div>
                <p style={{ fontSize: 13, color: '#3A4A3F', lineHeight: 1.7 }}>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── DeliveryTab ───────────────────────────────────────────────────────────────
const DeliveryTab: FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
    {[
      { title: '배송 안내', emoji: '🚚', bg: '#F0F6F1', items: [['주문 마감','오후 3시 (월~금)'],['배송 도착','주문 다음 영업일 도착'],['배송 지역','서울 · 경기 · 인천 (일부 제외)'],['배송비','40,000원 이상 무료, 미만 시 3,000원'],['포장재','100% 재활용 종이 박스']] },
      { title: '교환 · 반품 안내', emoji: '🔄', bg: '#FFF8EC', items: [['신청 기한','수령일로부터 7일 이내'],['신선식품','단순 변심에 의한 반품 불가'],['알레르기 누락','라벨 정보 누락 시 100% 환불 + 사례금'],['문의','고객센터 1670-1234 (평일 9시~18시)']] },
    ].map(col => (
      <div key={col.title} style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: col.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{col.emoji}</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E12', marginBottom: 14 }}>{col.title}</h3>
        <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {col.items.map(([k, v]) => (
            <li key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 12, fontSize: 13 }}>
              <span style={{ color: '#6B7A6E', fontWeight: 600 }}>{k}</span>
              <span style={{ color: '#3A4A3F', lineHeight: 1.55 }}>{v}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

// ── ProductDetailPage ─────────────────────────────────────────────────────────
type TabId = 'desc' | 'safety' | 'review' | 'inquiry' | 'delivery';
const TABS: { id: TabId; label: string }[] = [
  { id: 'desc',     label: '상품 설명' },
  { id: 'safety',   label: '안전·영양' },
  { id: 'review',   label: '후기' },
  { id: 'inquiry',  label: '상품 문의' },
  { id: 'delivery', label: '배송/반품' },
];

const ProductDetailPage: FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const { quantity, increment, decrement, isHearted, toggleHeart, isCarted, toggleCart, totalPrice } = useProductDetail(product);
  const { toast, showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabId>('desc');
  const tabBarRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs: Record<TabId, React.RefObject<HTMLDivElement | null>> = {
    desc:     useRef(null),
    safety:   useRef(null),
    review:   useRef(null),
    inquiry:  useRef(null),
    delivery: useRef(null),
  };
  const [headerHeight, setHeaderHeight] = useState(100);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    setHeaderHeight(header.getBoundingClientRect().height);
    const obs = new ResizeObserver(() => setHeaderHeight(header.getBoundingClientRect().height));
    obs.observe(header);
    return () => obs.disconnect();
  }, []);

  function handleTabClick(id: TabId) {
    setActiveTab(id);
    const el = sectionRefs[id].current;
    const tabBar = tabBarRef.current;
    if (!el) return;
    const tabBarH = tabBar ? tabBar.getBoundingClientRect().height : 0;
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elTop - headerHeight - tabBarH - 8, behavior: 'smooth' });
  }

  function handleHeart() { const next = !isHearted; toggleHeart(); showToast(next ? 'heart' : 'heartCancel'); }
  function handleCart()  { const next = !isCarted;  toggleCart();  showToast(next ? 'cart'  : 'cartCancel'); }

  const discount = product.discountRate > 0 ? product.discountRate
    : (product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0);

  const gallery = [product.imageSrc, product.imageSrc, product.imageSrc, product.imageSrc];
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <>
      <div style={{ background: '#fff', paddingBottom: 100 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 40px 0' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7A6E', marginBottom: 24 }}>
            <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#6B7A6E' }}>홈</button>
            <span style={{ color: '#C9CFC4' }}>›</span>
            <span style={{ color: '#0F1E12' }}>{product.brand}</span>
          </div>

          {/* Main grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '520px 1fr', gap: 52, alignItems: 'flex-start', marginBottom: 56 }}>

            {/* Left: sticky gallery */}
            <div style={{ position: 'sticky', top: headerHeight + 16 }}>
              <div style={{ borderRadius: 12, overflow: 'hidden', background: '#F4F5F1', aspectRatio: '1/1', position: 'relative' }}>
                <img src={gallery[imgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                {/* Prev/Next */}
                {([['left', () => setImgIdx((imgIdx - 1 + 4) % 4), '‹'], ['right', () => setImgIdx((imgIdx + 1) % 4), '›']] as const).map(([side, fn, ico]) => (
                  <button key={side} onClick={fn} style={{
                    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                    [side]: 12, width: 36, height: 36, borderRadius: 999,
                    background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer',
                    fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}>{ico}</button>
                ))}
                <div style={{ position: 'absolute', bottom: 12, right: 12, padding: '4px 10px', background: 'rgba(15,30,18,0.7)', color: '#fff', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                  {imgIdx + 1} / 4
                </div>
              </div>
              {/* Thumbnails */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 10 }}>
                {gallery.map((g, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{
                    border: 'none', padding: 0, cursor: 'pointer', borderRadius: 8, overflow: 'hidden',
                    aspectRatio: '1/1', background: '#F4F5F1',
                    outline: i === imgIdx ? '2px solid #0F1E12' : 'none', outlineOffset: -2,
                  }}>
                    <img src={g} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </button>
                ))}
              </div>
              {/* Trust badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
                {[['🛡️', 'HACCP 인증'], ['✅', '원산지 검증'], ['🚛', '콜드체인']].map(([ico, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 10px', background: '#F4F5F1', borderRadius: 8 }}>
                    <span style={{ fontSize: 14 }}>{ico}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#3A4A3F' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: purchase column */}
            <div>
              {/* Brand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1F4D2C' }}>{product.brand}</span>
                <span style={{ width: 1, height: 10, background: '#E5E7E1' }} />
                <button style={{ fontSize: 12, color: '#6B7A6E', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>브랜드 전체 보기 →</button>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F1E12', letterSpacing: '-0.02em', lineHeight: 1.35, marginBottom: 8 }}>{product.name}</h1>
              <div style={{ fontSize: 13, color: '#6B7A6E', marginBottom: 14 }}>{MOCK_TAGS.join(' · ')}</div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(product.rating) ? '#E89B26' : '#DDE2DC'}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', marginLeft: 4 }}>{product.rating}</span>
                </div>
                <button style={{ fontSize: 13, color: '#3A4A3F', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  후기 {product.reviewCount.toLocaleString()}건 보기
                </button>
              </div>

              {/* Price */}
              <div style={{ paddingTop: 20, borderTop: '1px solid #E5E7E1', marginBottom: 20 }}>
                {discount > 0 && (
                  <div style={{ fontSize: 13, color: '#9AA89D', textDecoration: 'line-through', marginBottom: 4 }}>
                    {product.originalPrice.toLocaleString()}원
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  {discount > 0 && <span style={{ fontSize: 30, fontWeight: 800, color: '#D32F2F', letterSpacing: '-0.02em' }}>{discount}%</span>}
                  <span style={{ fontSize: 30, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>
                    {product.price.toLocaleString()}<span style={{ fontSize: 16, fontWeight: 600, marginLeft: 2 }}>원</span>
                  </span>
                </div>
              </div>

              {/* Spec lines */}
              <div style={{ paddingTop: 16, borderTop: '1px solid #F4F5F1', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[['배송', '🚚 새벽 배송 · 내일 도착'], ['포장', '냉장 · 종이 포장재'], ['판매단위', '1합'], ['원산지', '국내산 (또는: 미국)'], ['유통기한', '수령일로부터 5일 이상']].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, fontSize: 13 }}>
                    <span style={{ width: 64, color: '#9AA89D', fontWeight: 500, flexShrink: 0 }}>{label}</span>
                    <span style={{ color: '#3A4A3F', flex: 1, lineHeight: 1.55 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Coupon strip */}
              <div style={{ padding: '14px 18px', background: '#F0F6F1', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1F4D2C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 18 }}>🏷️</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1F4D2C' }}>회원 적용 쿠폰 1,000원 할인</div>
                  <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 2 }}>마이페이지에서 발급 후 결제 시 자동 적용</div>
                </div>
                <button style={{ padding: '7px 12px', background: '#fff', border: '1px solid #1F4D2C', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: '#1F4D2C' }}>쿠폰 받기</button>
              </div>

              {/* Quantity + total */}
              <div style={{ paddingTop: 20, borderTop: '1px solid #E5E7E1', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#3A4A3F' }}>수량</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #C9CFC4', borderRadius: 8 }}>
                    <button onClick={decrement} style={{ width: 36, height: 36, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#3A4A3F' }}>−</button>
                    <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{quantity}</span>
                    <button onClick={increment} style={{ width: 36, height: 36, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#3A4A3F' }}>+</button>
                  </div>
                </div>
                <div style={{ padding: '16px 18px', background: '#F4F5F1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#3A4A3F' }}>총 상품금액</span>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>
                    {totalPrice.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 600, marginLeft: 2 }}>원</span>
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleHeart} style={{ width: 52, height: 52, background: '#fff', border: '1px solid #C9CFC4', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={isHearted ? '#D32F2F' : 'none'}>
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={isHearted ? '#D32F2F' : '#3A4A3F'} strokeWidth="1.8"/>
                  </svg>
                </button>
                <button onClick={handleCart} style={{ flex: 1, height: 52, background: '#fff', border: '1px solid #1F4D2C', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, color: '#1F4D2C' }}>장바구니</button>
                <button style={{ flex: 1.3, height: 52, background: 'linear-gradient(135deg, #1F4D2C, #2A6339)', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, color: '#fff' }}>바로 구매하기</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky tab bar */}
        <div ref={tabBarRef} style={{ position: 'sticky', top: headerHeight, background: '#fff', borderTop: '1px solid #E5E7E1', borderBottom: '1px solid #E5E7E1', zIndex: 20 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0, overflowX: 'auto' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => handleTabClick(t.id)} style={tabBtnStyle(activeTab === t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 0' }}>
          <section ref={sectionRefs.desc} style={{ marginBottom: 64 }}>
            <DescriptionTab product={product} />
          </section>
          <section ref={sectionRefs.safety} style={{ marginBottom: 64 }}>
            <SafetyTab />
          </section>
          <section ref={sectionRefs.review} style={{ marginBottom: 64 }}>
            <ReviewsTab product={product} />
          </section>
          <section ref={sectionRefs.inquiry} style={{ marginBottom: 64 }}>
            <InquiryTab />
          </section>
          <section ref={sectionRefs.delivery} style={{ marginBottom: 64 }}>
            <DeliveryTab />
          </section>
        </div>
      </div>

      {/* Sticky bottom buy bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E5E7E1', padding: '12px 40px', zIndex: 50, boxShadow: '0 -4px 20px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={product.imageSrc} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E12', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{product.name}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#3A4A3F', marginTop: 2 }}>{product.price.toLocaleString()}원 × {quantity}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#6B7A6E' }}>합계</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12' }}>{totalPrice.toLocaleString()}원</span>
          </div>
          <button onClick={handleHeart} style={{ width: 44, height: 44, background: '#fff', border: '1px solid #C9CFC4', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isHearted ? '#D32F2F' : 'none'}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={isHearted ? '#D32F2F' : '#3A4A3F'} strokeWidth="1.8"/></svg>
          </button>
          <button onClick={handleCart} style={{ padding: '10px 22px', background: '#fff', border: '1px solid #1F4D2C', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1F4D2C' }}>장바구니</button>
          <button style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #1F4D2C, #2A6339)', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#fff' }}>바로 구매</button>
        </div>
      </div>

      <Toast toast={toast} onNavigate={type => {
        const tab = type === 'heart' ? 'wishlist' : 'cart';
        window.dispatchEvent(new CustomEvent("pickfood:navigate", { detail: { tab } }));
      }} />
    </>
  );
};

export default ProductDetailPage;
