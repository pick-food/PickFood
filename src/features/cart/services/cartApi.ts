import { apiClient } from '../../../shared/lib/apiClient';
import type { CartApiData } from '../models/types';

interface ApiResponse<T> { data: T }

export async function getCart(): Promise<CartApiData> {
  const res = await apiClient.get<ApiResponse<CartApiData>>('/cart');
  return res.data.data;
}

export async function addCartItems(
  items: Array<{ option_id: string; quantity: number }>
): Promise<void> {
  await apiClient.post('/cart/items', { items });
}

export async function deleteCartItems(ids: string[]): Promise<void> {
  await apiClient.delete('/cart/items', { data: { ids } });
}

export async function clearCart(): Promise<void> {
  await apiClient.delete('/cart/items/all');
}

export async function updateCartItemQuantity(id: string, quantity: number): Promise<void> {
  await apiClient.patch(`/cart/items/${id}`, { quantity });
}
