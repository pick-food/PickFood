import { useState, useEffect } from "react";
import { getAllergens } from "../services/allergenApi";
import type { Allergen } from "../services/allergenApi";
import { ALLERGEN_EMOJI as EMOJI_MAP } from "../constants/legalAllergens";

export interface AllergenWithEmoji extends Allergen {
  emoji: string;
}

function flattenAllergens(list: Allergen[]): Allergen[] {
  return list.flatMap(a =>
    a.children?.length ? [a, ...flattenAllergens(a.children)] : [a]
  );
}

export function useAllergens() {
  const [allergens, setAllergens] = useState<AllergenWithEmoji[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [tick, setTick]           = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllergens()
      .then(list => {
        const flat = flattenAllergens(list);
        setAllergens(flat.map(a => ({ ...a, emoji: EMOJI_MAP[a.name] ?? '⚠️' })));
      })
      .catch(() => setError("알레르기 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [tick]);

  const refetch = () => setTick(t => t + 1);

  return { allergens, loading, error, refetch };
}
