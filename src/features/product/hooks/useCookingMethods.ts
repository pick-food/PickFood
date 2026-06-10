import { useState, useEffect } from "react";
import { getCookingMethods, type CookingMethod } from "../services/categoryApi";

const FALLBACK_METHODS: CookingMethod[] = [
  { id: 'cm1', code: 'grill',   name: '구이'       },
  { id: 'cm2', code: 'stirfry', name: '볶음'       },
  { id: 'cm3', code: 'simmer',  name: '조림'       },
  { id: 'cm4', code: 'soup',    name: '국·탕'      },
  { id: 'cm5', code: 'steam',   name: '찜'         },
  { id: 'cm6', code: 'raw',     name: '샐러드·날것' },
  { id: 'cm7', code: 'panfry',  name: '전·부침'    },
  { id: 'cm8', code: 'bake',    name: '오븐·베이킹' },
];

export function useCookingMethods() {
  const [methods, setMethods] = useState<CookingMethod[]>([]);

  useEffect(() => {
    getCookingMethods()
      .then(data => setMethods(data.length > 0 ? data : FALLBACK_METHODS))
      .catch(() => setMethods(FALLBACK_METHODS));
  }, []);

  return { methods };
}
