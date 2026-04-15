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

// ── Arrow ──────────────────────────────────────────────────────────────────────
const ArrowRight: FC<{ className?: string }> = ({ className }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
    <path d="M2.625 7H11.375M7.875 3.5L11.375 7L7.875 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AdBadge: FC = () => (
  <span className="inline-flex items-center px-[9px] py-1 rounded-xs text-[10px] font-medium text-warn-light bg-white/30 border border-gray-200">
    AD
  </span>
);

// ── Hero Banner ────────────────────────────────────────────────────────────────
const HeroBannerCard: FC<{ b: HeroBanner }> = ({ b }) => (
  <div
    className={`relative w-full rounded-lg overflow-hidden ${bgClass(b.imageSrc, b.gradientFrom, b.gradientTo)}`}
    style={{ height: 243, ...bgStyle(b.imageSrc) }}
  >
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 flex flex-col justify-between h-full p-6">
      <div className="flex flex-col gap-2">
        <span className={`self-start px-[9px] py-1 rounded-xs text-[10px] font-medium text-warn-light ${b.tagBg}`}>
          {b.tag}
        </span>
        <p className="text-b-22 font-semibold text-white whitespace-pre-line leading-[140%]">
          {b.title}
        </p>
        <p className="text-b-12 font-medium text-white/90">{b.subtitle}</p>
      </div>
      <button className="self-start inline-flex items-center gap-1.5 px-3 py-2 rounded-xs bg-primary-red border border-warn-active text-[12px] text-warn-border font-normal hover:bg-warn-active transition-colors">
        {b.ctaText}
        <ArrowRight className="text-warn-border" />
      </button>
    </div>
  </div>
);

// ── Side Banner ────────────────────────────────────────────────────────────────
const SideBannerCard: FC<{ b: SideBanner }> = ({ b }) => (
  <div
    className={`relative rounded-base overflow-hidden w-full ${bgClass(b.imageSrc, b.gradientFrom, b.gradientTo)}`}
    style={{ height: 120, ...bgStyle(b.imageSrc) }}
  >
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 flex flex-col justify-end h-full p-4">
      <span className={`self-start mb-2 px-[9px] py-0.5 rounded-xs text-[10px] font-medium text-warn-light ${b.tagBg}`}>
        {b.tag}
      </span>
      <p className="text-b-16 font-semibold text-white whitespace-pre-line leading-[140%]">
        {b.title}
      </p>
    </div>
  </div>
);

// ── Ad Banner ─────────────────────────────────────────────────────────────────
const AdBannerCard: FC<{ b: AdBanner }> = ({ b }) => (
  <div
    className={`relative rounded-base overflow-hidden flex-1 ${bgClass(b.imageSrc, b.gradientFrom, b.gradientTo)}`}
    style={{ height: 91, ...bgStyle(b.imageSrc) }}
  >
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 flex flex-col justify-between h-full p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-warn-light">{b.brand}</span>
        <AdBadge />
      </div>
      <div>
        <p className="text-h-14 font-semibold text-white">{b.productName}</p>
        <p className={`text-[10px] font-semibold ${b.highlightColor}`}>{b.highlight}</p>
      </div>
    </div>
  </div>
);

// ── Promo Banner ──────────────────────────────────────────────────────────────
const PromoBannerCard: FC<{ b: PromoBanner }> = ({ b }) => (
  <div
    className={`relative rounded-base overflow-hidden flex-1 ${bgClass(b.imageSrc, b.gradientFrom, b.gradientTo)}`}
    style={{ height: 130, ...bgStyle(b.imageSrc) }}
  >
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 flex flex-col justify-between h-full p-4">
      <span className={`text-[10px] font-semibold ${b.eyebrowColor}`}>{b.eyebrow}</span>
      <p className="text-h-14 font-semibold text-white whitespace-pre-line leading-[140%]">
        {b.title}
      </p>
      <button className={`flex items-center gap-1 text-[10px] font-semibold ${b.ctaColor}`}>
        {b.ctaText}
        <ArrowRight className={b.ctaColor} />
      </button>
    </div>
  </div>
);

// ── BannerSection ──────────────────────────────────────────────────────────────
const BannerSection: FC = () => {
  const { heroBanner, sideBanners, adBanners } = useBanners();

  return (
    <section className="flex flex-col gap-3">
      {/* Row 1: Hero(70%) + Side(30%) */}
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

      {/* Row 2: Ad banners (3개) */}
      <div className="flex gap-3">
        {adBanners.map((b) => (
          <AdBannerCard key={b.id} b={b} />
        ))}
      </div>
    </section>
  );
};

// ── PromoBannerSection (실시간 베스트 하단) ────────────────────────────────────
export const PromoBannerSection: FC = () => {
  const { promoBanners } = useBanners();

  return (
    <div className="flex gap-3">
      {promoBanners.map((b) => (
        <PromoBannerCard key={b.id} b={b} />
      ))}
    </div>
  );
};

export default BannerSection;