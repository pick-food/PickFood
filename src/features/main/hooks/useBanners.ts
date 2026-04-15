import type { HeroBanner, SideBanner, AdBanner, PromoBanner } from "../models/types";

export const HERO_BANNER: HeroBanner = {
  id: "hero-1",
  tag: "4월 기획전",
  tagBg: "bg-primary-red",
  title: "알레르기 걱정 없이\n안심하고 먹는 식품",
  subtitle: "성분 전수 분석 • 실시간 위험 성분 경고",
  ctaText: "지금 쇼핑하기",
  gradientFrom: "from-green-800",
  gradientTo: "to-emerald-600",
};

export const SIDE_BANNERS: SideBanner[] = [
  {
    id: "side-1",
    tag: "당뇨 관리",
    tagBg: "bg-primary",
    title: "저GL 식품만\n모아봤어요",
    gradientFrom: "from-slate-700",
    gradientTo: "to-slate-500",
  },
  {
    id: "side-2",
    tag: "비건",
    tagBg: "bg-safe",
    title: "식물성 100%\n비건 식품관",
    gradientFrom: "from-green-700",
    gradientTo: "to-teal-500",
  },
];

export const AD_BANNERS: AdBanner[] = [
  {
    id: "ad-1",
    brand: "풀무원 · 광고",
    productName: "두부면 파스타",
    highlight: "지금 20% 할인 중",
    highlightColor: "text-accent-peach",
    gradientFrom: "from-amber-800",
    gradientTo: "to-orange-600",
  },
  {
    id: "ad-2",
    brand: "동서식품 · 광고",
    productName: "저당 커피믹스",
    highlight: "당류 70% 감소",
    highlightColor: "text-accent-peach",
    gradientFrom: "from-stone-700",
    gradientTo: "to-amber-700",
  },
  {
    id: "ad-3",
    brand: "CJ제일제당 · 광고",
    productName: "비건 만두",
    highlight: "식물성 재료만 사용",
    highlightColor: "text-accent-mint",
    gradientFrom: "from-green-800",
    gradientTo: "to-emerald-700",
  },
];

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: "promo-1",
    eyebrow: "이번주 기획전",
    eyebrowColor: "text-accent-peach",
    title: "글루텐프리\n식품 모음전",
    ctaText: "쇼핑하기",
    ctaColor: "text-accent-peach",
    gradientFrom: "from-stone-800",
    gradientTo: "to-stone-600",
  },
  {
    id: "promo-2",
    eyebrow: "신규 입점",
    eyebrowColor: "text-accent-mint",
    title: "비건 브랜드\n첫 구매 혜택",
    ctaText: "혜택 받기",
    ctaColor: "text-accent-mint",
    gradientFrom: "from-green-900",
    gradientTo: "to-emerald-700",
  },
];

export function useBanners() {
  return {
    heroBanner: HERO_BANNER,
    sideBanners: SIDE_BANNERS,
    adBanners: AD_BANNERS,
    promoBanners: PROMO_BANNERS,
  };
}