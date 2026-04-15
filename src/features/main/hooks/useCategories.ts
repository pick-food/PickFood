import type { Category } from "../models/types";

const CATEGORIES: Category[] = [
  { id: "health",    label: "건강식품",  emoji: "💊", bgColor: "bg-orange-50" },
  { id: "drink",     label: "음료•차",   emoji: "🍵", bgColor: "bg-green-50" },
  { id: "fresh",     label: "신선식품",  emoji: "🥦", bgColor: "bg-emerald-50" },
  { id: "processed", label: "가공식품",  emoji: "🥫", bgColor: "bg-yellow-50" },
  { id: "organic",   label: "유기농",    emoji: "🌿", bgColor: "bg-lime-50" },
  { id: "simple",    label: "간편식",    emoji: "🍱", bgColor: "bg-amber-50" },
  { id: "diet",      label: "다이어트",  emoji: "🥗", bgColor: "bg-teal-50" },
  { id: "diabetes",  label: "당뇨관리",  emoji: "🩺", bgColor: "bg-blue-50" },
  { id: "gluten",    label: "글루텐프리", emoji: "🌾", bgColor: "bg-stone-50" },
  { id: "today",     label: "오늘특가",  emoji: "🔥", bgColor: "bg-red-50" },
];

export function useCategories() {
  return { categories: CATEGORIES };
}