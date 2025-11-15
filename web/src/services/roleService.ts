import { api } from "./api";
import { mockApi } from "./mockApi";
import { API_CONFIG } from "@/utils/constants";
import type { AxiosRequestConfig } from "axios";
import type {
  Role,
  CreateRoleData,
  UpdateRoleData,
  RoleQueryParams,
} from "@/types/role.types";

class RoleService {
  /**
   * Get all roles with optional filtering and pagination
   */
  async getAll(
    params?: RoleQueryParams,
    config?: AxiosRequestConfig
  ): Promise<Role[]> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<Role[]>("/roles", params, config);
  }

  /**
   * Get role detail by ID
   */
  async getById(id: string): Promise<Role> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<Role>(`/roles/${id}`);
  }

  /**
   * Create new role
   */
  async create(data: CreateRoleData): Promise<Role> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.post<Role>("/roles", data);
  }

  /**
   * Update existing role
   */
  async update(id: string, data: UpdateRoleData): Promise<Role> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.put<Role>(`/roles/${id}`, data);
  }

  /**
   * Delete role by ID
   */
  async delete(id: string): Promise<void> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    await client.delete(`/roles/${id}`);
  }

  /**
   * Search roles by name
   */
  async search(
    searchTerm: string,
    params?: Omit<RoleQueryParams, "search">
  ): Promise<Role[]> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<Role[]>("/roles", {
      params: {
        ...params,
        search: searchTerm,
      },
    });
  }
}

export const roleService = new RoleService();
