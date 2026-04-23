import type { Product } from "../models/type";

const PRODUCTS: Product[] = [
  {
    id: "1", brand: "몰가홀푸드", name: "비건 귀리 그래놀라 500g",
    price: 12900, originalPrice: 15200, discountRate: 15,
    rating: 4.3, reviewCount: 90,
    badge: "BEST", badgeBg: "#8B3A1A", badgeColor: "#FFF3F0",
    imageSrc: "/images/products/product1.png",
  },
  {
    id: "2", brand: "CJ제일제당", name: "당뇨케어 현미밥 200g × 6",
    price: 8400, originalPrice: 10500, discountRate: 20,
    rating: 4.3, reviewCount: 90,
    badge: "BEST", badgeBg: "#8B3A1A", badgeColor: "#FFF3F0",
    imageSrc: "/images/products/product2.png",
  },
  {
    id: "3", brand: "풀무원", name: "글루텐프리 파스타 400g",
    price: 6800, originalPrice: 6800, discountRate: 0,
    rating: 4.3, reviewCount: 90,
    badge: "SALE", badgeBg: "#333333", badgeColor: "#FFF3F0",
    imageSrc: "/images/products/product3.png",
  },
  {
    id: "4", brand: "남양유업", name: "무가당 그릭요거트 400g",
    price: 4900, originalPrice: 5450, discountRate: 10,
    rating: 4.3, reviewCount: 90,
    badge: "BEST", badgeBg: "#8B3A1A", badgeColor: "#FFF3F0",
    imageSrc: "/images/products/product4.png",
  },
  {
    id: "5", brand: "정식품", name: "유기농 검정콩두유 190ml × 6",
    price: 7600, originalPrice: 9270, discountRate: 18,
    rating: 4.3, reviewCount: 90,
    badge: "BEST", badgeBg: "#8B3A1A", badgeColor: "#FFF3F0",
    imageSrc: "/images/products/product5.png",
  },
];

export function useProducts() {
  return { products: PRODUCTS };
}