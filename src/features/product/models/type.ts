export type BadgeType = "BEST" | "SALE" | "NEW";

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
}