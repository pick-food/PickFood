export type BadgeType = "BEST" | "SALE" | "NEW" | "recommended" | "deal" | "danger" | null;

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice: number;
  discountRate: number;
  rating: number;
  reviewCount: number;
  badge: BadgeType;
  badgeBg: string;
  badgeColor: string;
  imageSrc: string;
  allergens?: string[];
  category?: string;
  subcat?: string;
  origin?: string;
  tags?: string[];
  riskDiseases?: string[];
  nutrition?: { protein: number; carb: number; fat: number; sodium: number; sugar: number; kcal: number };
  delivery?: string;
}
