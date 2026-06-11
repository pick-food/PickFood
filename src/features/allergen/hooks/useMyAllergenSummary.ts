import { useState, useEffect } from "react";
import { getMyAllergenGroups, getAllergens } from "../services/allergenApi";
import { useAuth } from "../../auth/store/useAuth";

function flatAll(list: { id: string; name: string; children?: { id: string; name: string }[] }[]): { id: string; name: string }[] {
  return list.flatMap(a => a.children?.length ? [a, ...flatAll(a.children)] : [a]);
}

export function useMyAllergenSummary() {
  const { isLoggedIn } = useAuth();
  const [allergenNames, setAllergenNames] = useState<string[]>([]);
  const [diseaseNames,  setDiseaseNames]  = useState<string[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      setAllergenNames([]);
      setDiseaseNames([]);
      return;
    }
    Promise.all([getMyAllergenGroups(), getAllergens()])
      .then(([groups, allergens]) => {
        if (groups.length > 0) {
          const flat  = flatAll(allergens);
          const ids   = [...new Set(groups.flatMap(g => g.allergen_ids))];
          const names = ids.map(id => flat.find(a => a.id === id)?.name).filter(Boolean) as string[];
          setAllergenNames(names);
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  return { allergenNames, diseaseNames };
}
