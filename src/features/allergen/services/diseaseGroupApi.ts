import { apiClient } from '../../../shared/lib/apiClient';

interface ApiResponse<T> { data: T }

export interface DiseaseGroup {
  id: string;
  name: string;
  disease_ids: string[];
  is_active: boolean;
}

export interface DiseaseGroupPayload {
  name: string;
  disease_ids: string[];
  is_active?: boolean;
}

export async function getMyDiseaseGroups(): Promise<DiseaseGroup[]> {
  const res = await apiClient.get<ApiResponse<DiseaseGroup[]>>('/disease-groups');
  return res.data.data;
}

export async function createDiseaseGroup(payload: DiseaseGroupPayload): Promise<DiseaseGroup> {
  const res = await apiClient.post<ApiResponse<DiseaseGroup>>('/disease-groups', payload);
  return res.data.data;
}

export async function updateDiseaseGroup(id: string, payload: DiseaseGroupPayload): Promise<DiseaseGroup> {
  const res = await apiClient.patch<ApiResponse<DiseaseGroup>>(`/disease-groups/${id}`, payload);
  return res.data.data;
}

export async function deleteDiseaseGroup(id: string): Promise<void> {
  await apiClient.delete(`/disease-groups/${id}`);
}
