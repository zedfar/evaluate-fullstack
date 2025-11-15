import { api } from "./api";
import { mockApi } from "./mockApi";
import { API_CONFIG } from "@/utils/constants";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "@/types/auth.types";
import { useAuthStore } from "@/store/auth";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;

    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const res = await client.post<AuthResponse>("/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    // Simpan tokens
    useAuthStore.getState().setTokens(res.access_token, res.refresh_token);
    
    // Fetch user data
    await useAuthStore.getState().fetchUser();

    return res;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    const res = await client.post<AuthResponse>("/auth/register", data);

    // Simpan tokens
    useAuthStore.getState().setTokens(res.access_token, res.refresh_token);
    
    // Fetch user data
    await useAuthStore.getState().fetchUser();

    return res;
  }

  async getCurrentUser(): Promise<User> {
    const client = API_CONFIG.MOCK_API ? mockApi : api;
    return await client.get<User>("/auth/me");
  }

  async logout(): Promise<void> {
    try {
      // Hit API logout (opsional, tergantung backend)
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Clear auth state di store
      useAuthStore.getState().clearAuth();
    }
  }

  async refreshToken(): Promise<string> {
    const { refreshToken } = useAuthStore.getState();
    
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    try {
      const res = await api.post<{ access_token: string }>("/auth/refresh", { 
        refresh_token: refreshToken 
      });

      // Update access token
      useAuthStore.getState().setTokens(res.access_token, refreshToken);

      return res.access_token;
    } catch (error) {
      // Jika refresh gagal, logout user
      useAuthStore.getState().clearAuth();
      throw error;
    }
  }
}

export const authService = new AuthService();