import { apiClient } from '../../../shared/lib/apiClient';

interface ApiResponse<T> { data: T }

export interface LikeItem {
  product_id: string;
  title: string;
  thumbnail_file_id: string;
  is_available: boolean;
  liked_at: string;
}

interface LikesData {
  items: LikeItem[];
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

export async function getMyLikes(page = 1, limit = 50): Promise<LikesData> {
  const res = await apiClient.get<ApiResponse<LikesData>>('/me/likes', { params: { page, limit } });
  return res.data.data;
}

export async function likeProduct(id: string): Promise<void> {
  await apiClient.post(`/products/${id}/like`);
}

export async function unlikeProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}/like`);
}
