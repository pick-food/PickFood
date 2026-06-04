import type { FC } from "react";
import { useBanners } from "../hooks/useBanners";
import type { AdBanner, HeroBanner, PromoBanner, SideBanner } from "../models/types";

function bgStyle(imageSrc: string): React.CSSProperties {
  if (imageSrc) {
    return { backgroundImage: `url(${imageSrc})`, backgroundSize: "cover", backgroundPosition: "center" };
  }
  return {};
}
function bgClass(imageSrc: string, from: string, to: string) {
  return imageSrc ? "" : `bg-gradient-to-br ${from} ${to}`;
}

const ArrowRight: FC<{ color?: string }> = ({ color = "currentColor" }) => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M2.625 7H11.375M7.875 3.5L11.375 7L7.875 10.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Hero Banner ─────────────────────────────────────────────
const HeroBannerCard: FC<{ b: HeroBanner }> = ({ b }) => (
  <div
    className={`relative w-full rounded-2xl overflow-hidden pf-hover-lift ${bgClass(b.imageSrc, b.gradientFrom, b.gradientTo)}`}
    style={{ height: 240, ...bgStyle(b.imageSrc) }}
  >
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,30,18,0.85) 0%, rgba(31,77,44,0.55) 100%)' }} />
    <div className="relative z-10 flex flex-col justify-between h-full p-6">
      <div className="flex flex-col gap-2">
        <span
          className="self-start px-2.5 py-1 rounded-full text-[10px] font-semibold"
          style={{ background: 'rgba(168,224,99,0.18)', color: '#A8E063', border: '1px solid rgba(168,224,99,0.25)' }}
        >
          {b.tag}
        </span>
        <p className="text-[22px] font-bold text-white whitespace-pre-line leading-snug">
          {b.title}
        </p>
        <p className="text-[13px] text-white/70">{b.subtitle}</p>
      </div>
      <button
        className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-[#0F1E12] pf-press"
        style={{ background: '#A8E063' }}
      >
        {b.ctaText}
        <ArrowRight color="#0F1E12" />
      </button>
    </div>
  </div>
);

// ── Side Banner ─────────────────────────────────────────────
const SideBannerCard: FC<{ b: SideBanner }> = ({ b }) => (
  <div
    className={`relative rounded-2xl overflow-hidden w-full pf-hover-lift ${bgClass(b.imageSrc, b.gradientFrom, b.gradientTo)}`}
    style={{ height: 117, ...bgStyle(b.imageSrc) }}
  >
    <div className="absolute inset-0" style={{ background: 'rgba(15,30,18,0.5)' }} />
    <div className="relative z-10 flex flex-col justify-end h-full p-4">
      <span
        className="self-start mb-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold"
        style={{ background: 'rgba(168,224,99,0.2)', color: '#A8E063' }}
      >
        {b.tag}
      </span>
      <p className="text-[15px] font-bold text-white whitespace-pre-line leading-tight">{b.title}</p>
    </div>
  </div>
);

// ── Ad Banner ───────────────────────────────────────────────
const AdBannerCard: FC<{ b: AdBanner }> = ({ b }) => (
  <div
    className={`relative rounded-2xl overflow-hidden flex-1 pf-hover-lift ${bgClass(b.imageSrc, b.gradientFrom, b.gradientTo)}`}
    style={{ height: 90, ...bgStyle(b.imageSrc) }}
  >
    <div className="absolute inset-0" style={{ background: 'rgba(15,30,18,0.5)' }} />
    <div className="relative z-10 flex flex-col justify-between h-full p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-white/70">{b.brand}</span>
        <span
          className="px-1.5 py-0.5 rounded text-[9px] font-bold"
          style={{ background: 'rgba(168,224,99,0.2)', color: '#A8E063' }}
        >
          AD
        </span>
      </div>
      <div>
        <p className="text-[13px] font-bold text-white">{b.productName}</p>
        <p className={`text-[10px] font-semibold ${b.highlightColor}`}>{b.highlight}</p>
      </div>
    </div>
  </div>
);

// ── Promo Banner ────────────────────────────────────────────
const PromoBannerCard: FC<{ b: PromoBanner }> = ({ b }) => (
  <div
    className={`relative rounded-2xl overflow-hidden flex-1 pf-hover-lift ${bgClass(b.imageSrc, b.gradientFrom, b.gradientTo)}`}
    style={{ height: 128, ...bgStyle(b.imageSrc) }}
  >
    <div className="absolute inset-0" style={{ background: 'rgba(15,30,18,0.5)' }} />
    <div className="relative z-10 flex flex-col justify-between h-full p-4">
      <span className={`text-[11px] font-bold ${b.eyebrowColor}`}>{b.eyebrow}</span>
      <p className="text-[14px] font-bold text-white whitespace-pre-line leading-snug">{b.title}</p>
      <button className={`flex items-center gap-1 text-[11px] font-semibold ${b.ctaColor}`}>
        {b.ctaText}
        <ArrowRight />
      </button>
    </div>
  </div>
);

// ── BannerSection ───────────────────────────────────────────
const BannerSection: FC = () => {
  const { heroBanner, sideBanners, adBanners } = useBanners();

  return (
    <section className="flex flex-col gap-3 pf-fade-up">
      <div className="flex gap-3">
        <div className="flex-[7]">
          <HeroBannerCard b={heroBanner} />
        </div>
        <div className="flex-[3] flex flex-col gap-3">
          {sideBanners.map((b) => (
            <SideBannerCard key={b.id} b={b} />
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        {adBanners.map((b) => (
          <AdBannerCard key={b.id} b={b} />
        ))}
      </div>
    </section>
  );
};

export const PromoBannerSection: FC = () => {
  const { promoBanners } = useBanners();
  return (
    <div className="flex gap-3 pf-fade-up">
      {promoBanners.map((b) => (
        <PromoBannerCard key={b.id} b={b} />
      ))}
    </div>
  );
};

export default BannerSection;
