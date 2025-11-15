import { api } from "./api";
import { mockApi } from "./mockApi";
import { API_CONFIG } from "@/utils/constants";
import type { AxiosRequestConfig } from "axios";
import type {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductQueryParams,
  PaginatedProductResponse,
} from "@/types/product.types";

class ProductService {
  /**
   * Get all products with optional filtering and pagination
   * Returns paginated response with metadata
   */
  async getAll(
    params?: ProductQueryParams,
    config?: AxiosRequestConfig
  ): Promise<PaginatedProductResponse> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<PaginatedProductResponse>("/products", params, config);
  }

  /**
   * Get product detail by ID
   */
  async getById(id: string): Promise<Product> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<Product>(`/products/${id}`);
  }

  /**
   * Create new product
   */
  async create(data: CreateProductData): Promise<Product> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.post<Product>("/products", data);
  }

  /**
   * Update existing product
   */
  async update(id: string, data: UpdateProductData): Promise<Product> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.put<Product>(`/products/${id}`, data);
  }

  /**
   * Delete product by ID
   */
  async delete(id: string): Promise<void> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    await client.delete(`/products/${id}`);
  }

  /**
   * Get products by category
   */
  async getByCategory(
    categoryId: string,
    params?: Omit<ProductQueryParams, "category_id">
  ): Promise<Product[]> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<Product[]>("/products", {
      params: {
        ...params,
        category_id: categoryId,
      },
    });
  }

  /**
   * Search products by name
   */
  async search(
    searchTerm: string,
    params?: Omit<ProductQueryParams, "search">
  ): Promise<Product[]> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<Product[]>("/products", {
      params: {
        ...params,
        search: searchTerm,
      },
    });
  }
}

export const productService = new ProductService();
