// src/types/role.types.ts

/** -----------------------------
 * ROLE MODEL (sesuai response API)
 * ----------------------------- */
export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

/** -----------------------------
 * CREATE ROLE INPUT
 * ----------------------------- */
export interface CreateRoleData {
  id: string; // Role ID adalah string (e.g., "admin", "user", "manager")
  name: string;
  description?: string;
}

/** -----------------------------
 * UPDATE ROLE INPUT
 * ----------------------------- */
export interface UpdateRoleData {
  name?: string;
  description?: string;
}

/** -----------------------------
 * ROLE QUERY PARAMS
 * ----------------------------- */
export interface RoleQueryParams {
  search?: string; // Search by role name
  skip?: number;
  limit?: number;
}
