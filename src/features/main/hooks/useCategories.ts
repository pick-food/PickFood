import type { Category } from "../models/types";

const CATEGORIES: Category[] = [
  { id: "health",    label: "건강식품",   icon: "/images/categories/healthfood.png"    },
  { id: "drink",     label: "음료•차",    icon: "/images/categories/drink.png"         },
  { id: "fresh",     label: "신선식품",   icon: "/images/categories/freshfood.png"     },
  { id: "processed", label: "가공식품",   icon: "/images/categories/processedfood.png" },
  { id: "organic",   label: "유기농",     icon: "/images/categories/organic.png"       },
  { id: "simple",    label: "간편식",     icon: "/images/categories/simplefood.png"    },
  { id: "diet",      label: "다이어트",   icon: "/images/categories/diet.png"          },
  { id: "diabetes",  label: "당뇨관리",   icon: "/images/categories/Diabetes.png"      },
  { id: "gluten",    label: "글루텐프리", icon: "/images/categories/gluten-free.png"   },
  { id: "today",     label: "오늘특가",   icon: "/images/categories/todaysales.png"    },
];

export function useCategories() {
  return { categories: CATEGORIES };
}