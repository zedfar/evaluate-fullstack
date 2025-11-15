import { api } from "./api";
import { mockApi } from "./mockApi";
import { API_CONFIG } from "@/utils/constants";
import type { AxiosRequestConfig } from "axios";
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UserQueryParams,
  PaginatedUserResponse,
} from "@/types/user.types";

class UserService {
  /**
   * Get all users with optional filtering and pagination
   * Returns paginated response with metadata
   */
  async getAll(
    params?: UserQueryParams,
    config?: AxiosRequestConfig
  ): Promise<PaginatedUserResponse> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<PaginatedUserResponse>("/users", params, config);
  }

  /**
   * Get user detail by ID
   */
  async getById(id: string): Promise<User> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<User>(`/users/${id}`);
  }

  /**
   * Create new user (Admin only)
   */
  async create(data: CreateUserData): Promise<User> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.post<User>("/users", data);
  }

  /**
   * Update existing user
   */
  async update(id: string, data: UpdateUserData): Promise<User> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.put<User>(`/users/${id}`, data);
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<void> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    await client.delete(`/users/${id}`);
  }

  /**
   * Search users by username or email
   */
  async search(
    searchTerm: string,
    params?: Omit<UserQueryParams, "search">
  ): Promise<User[]> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<User[]>("/users", {
      params: {
        ...params,
        search: searchTerm,
      },
    });
  }

  /**
   * Toggle user active status
   */
  async toggleActive(id: string, isActive: boolean): Promise<User> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.put<User>(`/users/${id}`, { is_active: isActive });
  }
}

export const userService = new UserService();
