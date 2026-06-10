import { useState, useEffect } from "react";
import { getMyAllergenGroups, getAllergens } from "../services/allergenApi";
import { getPFActiveAllergenNames, getPFActiveDiseaseNames } from "../../../data/pfData";

function flatAll(list: { id: string; name: string; children?: { id: string; name: string }[] }[]): { id: string; name: string }[] {
  return list.flatMap(a => a.children?.length ? [a, ...flatAll(a.children)] : [a]);
}

export function useMyAllergenSummary() {
  const [allergenNames, setAllergenNames] = useState<string[]>([]);
  const [diseaseNames,  setDiseaseNames]  = useState<string[]>([]);

  useEffect(() => {
    Promise.all([getMyAllergenGroups(), getAllergens()])
      .then(([groups, allergens]) => {
        if (groups.length > 0) {
          const flat  = flatAll(allergens);
          const ids   = [...new Set(groups.flatMap(g => g.allergen_ids))];
          const names = ids.map(id => flat.find(a => a.id === id)?.name).filter(Boolean) as string[];
          setAllergenNames(names);
        } else {
          setAllergenNames(getPFActiveAllergenNames());
          setDiseaseNames(getPFActiveDiseaseNames());
        }
      })
      .catch(() => {
        setAllergenNames(getPFActiveAllergenNames());
        setDiseaseNames(getPFActiveDiseaseNames());
      });
  }, []);

  return { allergenNames, diseaseNames };
}
