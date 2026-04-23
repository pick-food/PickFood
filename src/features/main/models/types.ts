// src/features/main/models/types.ts

// Product 타입은 product에서 가져옴
export type { Product, BadgeType } from "../../product/models/type";

// ─── Category ──────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  label: string;
  icon: string;
}

// ─── Feature Card ──────────────────────────────────────────────────────────────
export interface FeatureCard {
  id: string;
  number: string;
  title: string;
  description: string;
  descriptionColor: string;
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