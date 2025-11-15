// src/utils/constants.ts

// Ambil dari environment Vite (lihat .env.*)
// IMPORTANT: Vite hanya expose env vars yang dimulai dengan VITE_ prefix
const ENV = import.meta.env.MODE; // "development" | "staging" | "production"
const APP_NAME = import.meta.env.VITE_APP_NAME || "Default App";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dev-svc-products.vercel.app";
const MOCK_API_ENV = import.meta.env.VITE_MOCK_API === "true";

// Debug: Log configuration (akan dihapus di production)
if (ENV === "development") {
  console.log("🔧 Environment Config:", {
    MODE: ENV,
    APP_NAME,
    BASE_URL,
    MOCK_API: MOCK_API_ENV,
  });
}

// Flag mock API (aktif hanya di non-prod atau jika di-set di .env)
const MOCK_API = MOCK_API_ENV || !["staging", "production"].includes(ENV);

export const APP_CONFIG = {
  NAME: APP_NAME,
  BASE_URL,
  ENV,
  MOCK_API,
};

export const API_CONFIG = {
  BASE_URL: APP_CONFIG.BASE_URL + '/api/v1/',
  TIMEOUT: 60000,
  MOCK_API: false, // APP_CONFIG.MOCK_API,
  USE_REFRESH_TOKEN: false, // Set false untuk langsung logout saat 401
};

// Route pattern (optional – sesuaikan dengan React Router / file structure)
export const ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  TABS: {
    HOME: "/home",
    SETTINGS: "/settings",
  },
  ADMIN: {
    USERS: "/admin/user-management",
    PROFILE: "/admin/profile",
  },
};

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
};

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Unauthorized. Please login again.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input.",
};
