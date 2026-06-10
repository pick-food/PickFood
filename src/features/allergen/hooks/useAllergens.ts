import { useState, useEffect } from "react";
import { getAllergens } from "../services/allergenApi";
import type { Allergen } from "../services/allergenApi";

// 서버 응답에 emoji가 없으므로 이름으로 매핑
const EMOJI_MAP: Record<string, string> = {
  '난류':     '🥚', '계란': '🥚',
  '우유':     '🥛',
  '메밀':     '🌾',
  '땅콩':     '🥜',
  '대두':     '🫘',
  '밀':       '🌾',
  '고등어':   '🐟',
  '게':       '🦀',
  '새우':     '🦐',
  '돼지고기': '🐷',
  '복숭아':   '🍑',
  '토마토':   '🍅',
  '아황산류': '⚗️',
  '호두':     '🌰',
  '닭고기':   '🍗',
  '쇠고기':   '🥩',
  '오징어':   '🦑',
  '조개류':   '🦪',
  '잣':       '🌰',
  '참깨':     '🌿',
};

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
