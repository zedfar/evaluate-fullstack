// src/types/user.types.ts

import type { User } from "./auth.types";

/** -----------------------------
 * USER MODEL (re-export dari auth.types)
 * ----------------------------- */
export type { User } from "./auth.types";

/** -----------------------------
 * CREATE USER INPUT
 * ----------------------------- */
export interface CreateUserData {
  email: string;
  username: string;
  full_name: string;
  password: string;
  role_id?: string; // optional, default ke 'user' di backend
}

/** -----------------------------
 * UPDATE USER INPUT
 * ----------------------------- */
export interface UpdateUserData {
  email?: string;
  username?: string;
  full_name?: string;
  password?: string;
  role_id?: string;
  is_active?: boolean;
}

/** -----------------------------
 * USER QUERY PARAMS
 * ----------------------------- */
export interface UserQueryParams {
  search?: string; // Search by username, email, or full_name
  sort_by?: 'username' | 'email' | 'full_name' | 'created_at';
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
 * PAGINATED USER RESPONSE
 * ----------------------------- */
export interface PaginatedUserResponse {
  data: User[];
  metadata: PaginationMetadata;
}

/** -----------------------------
 * USER LIST RESPONSE (Legacy - for backward compatibility)
 * ----------------------------- */
export interface UserListResponse {
  users: User[];
  total: number;
}
