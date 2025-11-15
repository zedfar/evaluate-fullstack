// src/types/auth.types.ts

/** -----------------------------
 * USER MODEL (sesuai response API)
 * ----------------------------- */
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role_id: string;
  role?: {
    id: string,
    name: string
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** -----------------------------
 * LOGIN / REGISTER INPUT TYPES
 * ----------------------------- */
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

/** -----------------------------
 * AUTH RESPONSE (dari API)
 * ----------------------------- */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  metadata: any;
}

/** -----------------------------
 * TOKEN PAYLOAD (JWT decoded)
 * ----------------------------- */
export interface TokenPayload {
  user_id: string;
  email: string;
  username: string;
  role_id: string;
  exp: number;
  iat?: number;
}
