// ─── Category ──────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  label: string;
  emoji: string;
  bgColor: string;
}

// ─── Feature Card (OCR / 필터링 / 추천) ────────────────────────────────────────
export interface FeatureCard {
  id: string;
  number: string;
  title: string;
  description: string;
  descriptionColor: string; // Tailwind text class
  imageSrc: string;
  gradientFrom: string;
  gradientTo: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────
export type BadgeType = "BEST" | "SALE" | "NEW";

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  origin: string;
  badge: BadgeType;
  imageSrc: string;
  gradientFrom: string;
  gradientTo: string;
}

// ─── Banners ──────────────────────────────────────────────────────────────────
export interface HeroBanner {
  id: string;
  tag: string;
  tagBg: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageSrc: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface SideBanner {
  id: string;
  tag: string;
  tagBg: string;
  title: string;
  imageSrc: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface AdBanner {
  id: string;
  brand: string;
  productName: string;
  highlight: string;
  highlightColor: string;
  imageSrc: string;
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
  imageSrc: string;
  gradientFrom: string;
  gradientTo: string;
}