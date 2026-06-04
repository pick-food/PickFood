import type { FC } from "react";

const FEATURE_ITEMS = [
  {
    id: "1",
    number: "01",
    title: "OCR 성분 분석",
    description: "식품 라벨을 촬영하면 AI가 자동으로 성분을 읽어 알레르기 성분을 표시합니다.",
    gradient: "linear-gradient(135deg, #1F4D2C 0%, #2A6339 100%)",
    accent: "#A8E063",
  },
  {
    id: "2",
    number: "02",
    title: "맞춤 필터링",
    description: "나의 알레르기 프로필을 등록하면 위험 성분이 포함된 식품을 미리 걸러드립니다.",
    gradient: "linear-gradient(135deg, #163321 0%, #1F4D2C 100%)",
    accent: "#A8E063",
  },
  {
    id: "3",
    number: "03",
    title: "안심 쇼핑",
    description: "검증된 안전 식품만 모아 알레르기 걱정 없이 편리하게 주문하세요.",
    gradient: "linear-gradient(135deg, #0F2E18 0%, #1A3320 100%)",
    accent: "#A8E063",
  },
];

const FeatureCardItem: FC<{ card: typeof FEATURE_ITEMS[0] }> = ({ card }) => (
  <div
    className="relative rounded-2xl overflow-hidden flex-1 pf-hover-lift"
    style={{ height: 240, background: card.gradient }}
  >
    <div className="relative z-10 flex flex-col justify-between h-full p-6">
      <span
        className="text-[44px] font-black leading-none"
        style={{ color: 'rgba(168,224,99,0.25)' }}
      >
        {card.number}
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-[22px] font-bold text-white leading-snug">
          {card.title}
        </p>
        <p className="text-[13px] leading-relaxed max-w-[220px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {card.description}
        </p>
        <span
          className="self-start mt-1 text-[11px] font-semibold"
          style={{ color: card.accent }}
        >
          자세히 보기 →
        </span>
      </div>
    </div>
  </div>
);

const FeatureCards: FC = () => (
  <section className="flex gap-4 pf-fade-up">
    {FEATURE_ITEMS.map((card) => (
      <FeatureCardItem key={card.id} card={card} />
    ))}
  </section>
);

export default FeatureCards;
