import { apiClient } from "../../../shared/lib/apiClient";

interface ApiResponse<T> {
  resultCode: string;
  data: T;
}

// ── 타입 ──────────────────────────────────────────────────────────────────────

export interface Allergen {
  id: string;
  name: string;
}

export interface AllergenGroup {
  id: string;
  name: string;
  allergen_ids: string[];
}

export interface AllergenGroupPayload {
  name: string;
  allergen_ids: string[];
}

// ── 알레르기 유발물질 목록 조회  GET /allergens ───────────────────────────────
export async function getAllergens(): Promise<Allergen[]> {
  const res = await apiClient.get<ApiResponse<Allergen[]>>("/allergens");
  return res.data.data;
}

// ── 내 알레르기 그룹 목록 조회  GET /allergen-groups ─────────────────────────
export async function getMyAllergenGroups(): Promise<AllergenGroup[]> {
  const res = await apiClient.get<ApiResponse<AllergenGroup[]>>("/allergen-groups");
  return res.data.data;
}

// ── 알레르기 그룹 생성  POST /allergen-groups ─────────────────────────────────
export async function createAllergenGroup(payload: AllergenGroupPayload): Promise<AllergenGroup> {
  const res = await apiClient.post<ApiResponse<AllergenGroup>>("/allergen-groups", payload);
  return res.data.data;
}

// ── 알레르기 그룹 수정  PATCH /allergen-groups/{id} ──────────────────────────
export async function updateAllergenGroup(
  id: string,
  payload: AllergenGroupPayload
): Promise<AllergenGroup> {
  const res = await apiClient.patch<ApiResponse<AllergenGroup>>(
    `/allergen-groups/${id}`,
    payload
  );
  return res.data.data;
}

// ── 알레르기 그룹 삭제  DELETE /allergen-groups/{id} ─────────────────────────
export async function deleteAllergenGroup(id: string): Promise<void> {
  await apiClient.delete(`/allergen-groups/${id}`);
}
