import type { FeatureCard } from "../models/types";

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "f1",
    number: "1",
    title: "OCR 자동 분석",
    description: "복잡한 상품들을 직접 살펴볼 필요 없이 자동으로 분석해줍니다.",
    descriptionColor: "text-warn-border",
    imageSrc: "/images/features/feature-1.png",
    gradientFrom: "from-stone-700",
    gradientTo: "to-stone-500",
  },
  {
    id: "f2",
    number: "2",
    title: "알레르기 필터링",
    description: "원하지 않거나 나에게 맞지 않는 성분은 자동으로 제외해줍니다.",
    descriptionColor: "text-safe-light",
    imageSrc: "/images/features/feature-2.png",
    gradientFrom: "from-green-800",
    gradientTo: "to-teal-600",
  },
  {
    id: "f3",
    number: "3",
    title: "안전한 상품 추천",
    description: "안전하게 먹을 수 있는 상품만 추천드립니다.",
    descriptionColor: "text-warn-border",
    imageSrc: "/images/features/feature-3.png",
    gradientFrom: "from-primary",
    gradientTo: "to-primary-dark",
  },
];

export function useFeatureCards() {
  return { featureCards: FEATURE_CARDS };
}