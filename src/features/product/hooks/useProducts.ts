import type { Product, BadgeType } from "../models/type";
import { PF_PRODUCTS } from "../../../data/pfData";

function mapToProduct(p: typeof PF_PRODUCTS[0]): Product {
  const originalPrice = p.originalPrice ?? p.price;
  const discountRate  = originalPrice > p.price ? Math.round((1 - p.price / originalPrice) * 100) : 0;
  return {
    id:            p.id,
    brand:         p.brand,
    name:          p.name,
    price:         p.price,
    originalPrice,
    discountRate,
    rating:        p.rating,
    reviewCount:   p.reviews,
    badge:         p.badge as BadgeType,
    badgeBg:       '#0F1E12',
    badgeColor:    '#A8E063',
    imageSrc:      p.img,
    allergens:     p.allergens,
    category:      p.cat,
    subcat:        p.subcat,
    origin:        p.origin,
    tags:          p.tags,
    riskDiseases:  p.riskDiseases,
    nutrition:     p.nutrition,
    delivery:      p.delivery,
  };
}

export function useProducts() {
  return { products: PF_PRODUCTS.map(mapToProduct) };
}
