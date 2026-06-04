import { useState, useCallback } from "react";
import {
  getMyAllergenGroups,
  createAllergenGroup,
  updateAllergenGroup,
  deleteAllergenGroup,
} from "../services/allergenApi";
import type { AllergenGroup, AllergenGroupPayload } from "../services/allergenApi";

export function useAllergenGroups() {
  const [groups,  setGroups]  = useState<AllergenGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // ── GET /allergen-groups ─────────────────────────────────────────────────
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyAllergenGroups();
      setGroups(data);
    } catch {
      setError("알레르기 그룹을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── POST /allergen-groups ────────────────────────────────────────────────
  const createGroup = useCallback(async (payload: AllergenGroupPayload): Promise<AllergenGroup | null> => {
    setLoading(true);
    setError(null);
    try {
      const created = await createAllergenGroup(payload);
      setGroups(prev => [...prev, created]);
      return created;
    } catch {
      setError("알레르기 그룹 생성에 실패했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── PATCH /allergen-groups/{id} ──────────────────────────────────────────
  const updateGroup = useCallback(async (id: string, payload: AllergenGroupPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateAllergenGroup(id, payload);
      setGroups(prev => prev.map(g => g.id === id ? updated : g));
      return true;
    } catch {
      setError("알레르기 그룹 수정에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── DELETE /allergen-groups/{id} ─────────────────────────────────────────
  const deleteGroup = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteAllergenGroup(id);
      setGroups(prev => prev.filter(g => g.id !== id));
      return true;
    } catch {
      setError("알레르기 그룹 삭제에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}
