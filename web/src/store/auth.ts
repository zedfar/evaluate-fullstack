import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import type { User } from "@/types/auth.types";

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	user: User | null;
	isAuthenticated: boolean;
	setTokens: (access: string, refresh: string) => void;
	setUser: (user: User | null) => void;
	login: (user: User, accessToken: string, refreshToken: string) => void;
	fetchUser: () => Promise<void>;
	logout: () => void;
	clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			accessToken: null,
			refreshToken: null,
			user: null,
			isAuthenticated: false,

			setTokens: (access, refresh) => {
				set({
					accessToken: access,
					refreshToken: refresh,
					isAuthenticated: true
				});
			},

			setUser: (user) => {
				set({
					user,
					isAuthenticated: !!user
				});
			},

			login: (user, accessToken, refreshToken) =>
				set({
					user,
					accessToken,
					refreshToken,
					isAuthenticated: true
				}),

			fetchUser: async () => {
				try {
					const user = await authService.getCurrentUser();
					set({ user, isAuthenticated: true });
				} catch (error) {
					set({ user: null, isAuthenticated: false });
					throw error;
				}
			},

			// Method untuk clear auth tanpa hit API
			clearAuth: () => {
				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					isAuthenticated: false
				});
			},

			// Method untuk logout dengan hit API
			logout: () => {
				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					isAuthenticated: false
				});
			},
		}),
		{
			name: "auth-storage",
			// Simpan accessToken, refreshToken, user, dan isAuthenticated
			partialize: (state) => ({
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				user: state.user,
				isAuthenticated: state.isAuthenticated
			}),
			// Hydration setelah persist dimuat
			onRehydrateStorage: () => (state) => {
				// Set isAuthenticated based on token availability
				if (state && state.accessToken && state.user) {
					state.isAuthenticated = true;
				}
			},
		}
	)
);