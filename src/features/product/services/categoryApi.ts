import { apiClient } from "../../../shared/lib/apiClient";

interface ApiResponse<T> {
  resultCode: string;
  data: T;
}

export interface Category {
  id: string;
  name: string;
  depth: number;
  path: string;
  sort_order: number;
  children?: string[];
}

export interface CategoryBreadcrumb {
  id: string;
  name: string;
  depth: number;
}

export interface CategoryWithBreadcrumb {
  id: string;
  name: string;
  depth: number;
  path: string;
  breadcrumb: CategoryBreadcrumb[];
}

export interface CookingMethod {
  id: string;
  code: string;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await apiClient.get<ApiResponse<Category[]>>("/categories");
  return res.data.data;
}

export async function searchCategories(query: string): Promise<CategoryWithBreadcrumb[]> {
  const res = await apiClient.get<ApiResponse<CategoryWithBreadcrumb[]>>("/categories/search", {
    params: { q: query },
  });
  return res.data.data;
}

export async function getCookingMethods(): Promise<CookingMethod[]> {
  const res = await apiClient.get<ApiResponse<CookingMethod[]>>("/cooking-methods");
  return res.data.data;
}
