// src/types/product.types.ts

/** -----------------------------
 * PRODUCT MODEL (sesuai response API)
 * ----------------------------- */
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
  stock_status?: 'red' | 'yellow' | 'green'; // Computed by API
  image_url?: string;
  category_id: string;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
  creator?: {
    id: string;
    username: string;
    email: string;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

/** -----------------------------
 * CREATE PRODUCT INPUT
 * ----------------------------- */
export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
  image_url?: string;
  category_id: string;
}

/** -----------------------------
 * UPDATE PRODUCT INPUT
 * ----------------------------- */
export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  low_stock_threshold?: number;
  image_url?: string;
  category_id?: string;
}

/** -----------------------------
 * PRODUCT QUERY PARAMS
 * ----------------------------- */
export interface ProductQueryParams {
  search?: string;
  category_id?: string;
  sort_by?: 'name' | 'stock' | 'price' | 'status' | 'created_at';
  order?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
}

/** -----------------------------
 * PAGINATION METADATA
 * ----------------------------- */
export interface PaginationMetadata {
  total: number;        // Total number of records (after filtering)
  skip: number;         // Number of records skipped
  limit: number;        // Number of records per page
  page: number;         // Current page number (1-indexed)
  total_pages: number;  // Total number of pages
}

/** -----------------------------
 * PAGINATED PRODUCT RESPONSE
 * ----------------------------- */
export interface PaginatedProductResponse {
  data: Product[];
  metadata: PaginationMetadata;
}
