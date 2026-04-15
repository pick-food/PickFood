// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavTab {
  id: string;
  label: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  label: string;
  emoji: string;         // emoji used as placeholder icon
  bgColor: string;       // Tailwind bg class for the circle
}

// ─── Product ──────────────────────────────────────────────────────────────────
export type BadgeType = "BEST" | "SALE" | "NEW";

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;         // 할인 적용 후 최종 가격
  originalPrice: number;
  discount: number;      // %
  origin: string;
  badge: BadgeType;
  gradientFrom: string;  // Tailwind gradient-from class (image placeholder)
  gradientTo: string;
}

// ─── Banners ──────────────────────────────────────────────────────────────────
export interface HeroBanner {
  id: string;
  tag: string;
  tagBg: string;         // Tailwind bg class
  title: string;
  subtitle: string;
  ctaText: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface SideBanner {
  id: string;
  tag: string;
  tagBg: string;
  title: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface AdBanner {
  id: string;
  brand: string;
  productName: string;
  highlight: string;
  highlightColor: string; // Tailwind text class
  gradientFrom: string;
  gradientTo: string;
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  ctaText: string;
  ctaColor: string;
  gradientFrom: string;
  gradientTo: string;
}