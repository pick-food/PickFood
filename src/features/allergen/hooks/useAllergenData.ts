import { useState, useEffect } from "react";
import { getMyAllergenGroups, getAllergens, type Allergen } from "../services/allergenApi";
import { PF_ALLERGENS, PF_DISEASES } from "../../../data/pfData";
import { useAuth } from "../../auth/store/useAuth";

export interface ResolvedGroup {
  id: string;
  name: string;
  allergenNames: string[];
}

export interface SimpleAllergen {
  id: string;
  name: string;
}

function flatAllergens(list: Allergen[]): SimpleAllergen[] {
  return list.flatMap(a => a.children?.length ? [a, ...flatAllergens(a.children)] : [{ id: a.id, name: a.name }]);
}

export function useAllergenData() {
  const { isLoggedIn } = useAuth();
  const [myGroups,         setMyGroups]         = useState<ResolvedGroup[]>([]);
  const [availableAllergens, setAvailableAllergens] = useState<SimpleAllergen[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      setMyGroups([]);
      setAvailableAllergens(PF_ALLERGENS.map(a => ({ id: a.id, name: a.name })));
      return;
    }
    Promise.all([getMyAllergenGroups(), getAllergens()])
      .then(([groups, allergens]) => {
        const flat = flatAllergens(allergens);
        const resolved: ResolvedGroup[] = groups.map(g => ({
          id:   g.id,
          name: g.name,
          allergenNames: g.allergen_ids
            .map(aid => flat.find(a => a.id === aid)?.name ?? '')
            .filter(Boolean),
        }));
        setMyGroups(resolved);
        setAvailableAllergens(flat.length > 0 ? flat : PF_ALLERGENS.map(a => ({ id: a.id, name: a.name })));
      })
      .catch(() => {
        setAvailableAllergens(PF_ALLERGENS.map(a => ({ id: a.id, name: a.name })));
      });
  }, [isLoggedIn]);

  // 지병 목록은 별도 API 없으므로 pfData 사용
  const availableDiseases = PF_DISEASES.map(d => ({ id: d.id, name: d.name }));

  return { myGroups, availableAllergens, availableDiseases };
}
