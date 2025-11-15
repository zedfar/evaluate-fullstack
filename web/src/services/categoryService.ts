import { api } from "./api";
import { mockApi } from "./mockApi";
import { API_CONFIG } from "@/utils/constants";
import type { AxiosRequestConfig } from "axios";
import type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryQueryParams,
} from "@/types/category.types";

class CategoryService {
  /**
   * Get all categories with optional filtering and pagination
   */
  async getAll(
    params?: CategoryQueryParams,
    config?: AxiosRequestConfig
  ): Promise<Category[]> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<Category[]>("/categories", params, config);
  }

  /**
   * Get category detail by ID
   */
  async getById(id: string): Promise<Category> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<Category>(`/categories/${id}`);
  }

  /**
   * Create new category
   */
  async create(data: CreateCategoryData): Promise<Category> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.post<Category>("/categories", data);
  }

  /**
   * Update existing category (only creator can update)
   */
  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.put<Category>(`/categories/${id}`, data);
  }

  /**
   * Delete category by ID (only creator can delete)
   */
  async delete(id: string): Promise<void> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    await client.delete(`/categories/${id}`);
  }

  /**
   * Search categories by name
   */
  async search(
    searchTerm: string,
    params?: Omit<CategoryQueryParams, "search">
  ): Promise<Category[]> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<Category[]>("/categories", {
      params: {
        ...params,
        search: searchTerm,
      },
    });
  }
}

export const categoryService = new CategoryService();
