// src/types/category.types.ts

/** -----------------------------
 * CATEGORY MODEL (sesuai response API)
 * ----------------------------- */
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/** -----------------------------
 * CREATE CATEGORY INPUT
 * ----------------------------- */
export interface CreateCategoryData {
  name: string;
  description?: string;
}

/** -----------------------------
 * UPDATE CATEGORY INPUT
 * ----------------------------- */
export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

/** -----------------------------
 * CATEGORY QUERY PARAMS
 * ----------------------------- */
export interface CategoryQueryParams {
  search?: string; // Search by category name
  skip?: number;
  limit?: number;
}
