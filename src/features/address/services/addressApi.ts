import { apiClient } from '../../../shared/lib/apiClient';

interface ApiResponse<T> { data: T }

export interface Address {
  id: string;
  user_id: string;
  alias: string;
  recipient_name: string;
  phone: string;
  zip_code: string;
  address1: string;
  address2: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressPayload {
  alias: string;
  recipient_name: string;
  phone: string;
  zip_code: string;
  address1: string;
  address2: string;
  is_default: boolean;
}

export async function getAddresses(): Promise<Address[]> {
  const res = await apiClient.get<ApiResponse<Address[]>>('/addresses/me');
  return res.data.data;
}

export async function createAddress(payload: AddressPayload): Promise<Address[]> {
  const res = await apiClient.post<ApiResponse<Address[]>>('/addresses/me', payload);
  return res.data.data;
}

export async function updateAddress(id: string, payload: AddressPayload): Promise<Address> {
  const res = await apiClient.patch<ApiResponse<Address>>(`/addresses/me/${id}`, payload);
  return res.data.data;
}

export async function deleteAddresses(ids: string[]): Promise<Address[]> {
  const res = await apiClient.delete<ApiResponse<Address[]>>('/addresses/me', { data: { ids } });
  return res.data.data;
}
