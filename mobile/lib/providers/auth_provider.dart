import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../utils/storage_utils.dart';

// Auth state
class AuthState {
  final User? user;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.user,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    User? user,
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  bool get isAdmin => user?.role?.name.toLowerCase() == 'admin';
  bool get isUser => user?.role?.name.toLowerCase() == 'user';
}

// Auth notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService = AuthService();
  final StorageUtils _storage = StorageUtils();

  AuthNotifier() : super(const AuthState()) {
    // Check if user is already authenticated on initialization
    _checkAuthStatus();
  }

  // Check auth status from storage
  Future<void> _checkAuthStatus() async {
    state = state.copyWith(isLoading: true);

    try {
      final isAuth = await _storage.isAuthenticated();
      if (isAuth) {
        final user = await _storage.getUser();
        if (user != null) {
          state = AuthState(
            user: user,
            isAuthenticated: true,
            isLoading: false,
          );
          // Optionally fetch fresh user data
          await fetchCurrentUser();
        } else {
          state = const AuthState(isLoading: false);
        }
      } else {
        state = const AuthState(isLoading: false);
      }
    } catch (e) {
      state = const AuthState(isLoading: false);
    }
  }

  // Login
  Future<bool> login(String username, String password) async {
    print('🔐 Login attempt for username: $username');
    state = state.copyWith(isLoading: true, error: null);

    try {
      final credentials = LoginCredentials(
        username: username,
        password: password,
      );

      print('📤 Sending login request...');
      final authResponse = await _authService.login(credentials);
      print('✅ Login API success, got token and user: ${authResponse.metadata.username}');
      print('📦 Raw user data: ${authResponse.metadata.toJson()}');
      print('👤 User role: ${authResponse.metadata.role?.name}');
      print('🔑 Role ID: ${authResponse.metadata.roleId}');

      // Save tokens and user data
      print('💾 Saving auth data to storage...');
      print('🔑 Access Token: ${authResponse.accessToken.substring(0, 20)}...');
      print('🔄 Refresh Token: ${authResponse.refreshToken ?? "null (not provided by API)"}');

      await _storage.saveAccessToken(authResponse.accessToken);
      if (authResponse.refreshToken != null) {
        await _storage.saveRefreshToken(authResponse.refreshToken!);
      }
      await _storage.saveUser(authResponse.metadata);

      print('✅ Saved auth data to storage');

      state = AuthState(
        user: authResponse.metadata,
        isAuthenticated: true,
        isLoading: false,
      );
      print('✨ Auth state updated - isAuthenticated: ${state.isAuthenticated}, isAdmin: ${state.isAdmin}');

      return true;
    } catch (e, stackTrace) {
      print('❌ Login failed: $e');
      print('📍 Stack trace: $stackTrace');

      String errorMessage = 'Login failed';
      if (e.toString().contains('type') && e.toString().contains('subtype')) {
        errorMessage = 'Invalid response format from server. Please regenerate JSON code.';
      } else {
        errorMessage = e.toString();
      }

      state = state.copyWith(
        isLoading: false,
        error: errorMessage,
      );
      return false;
    }
  }

  // Register
  Future<bool> register({
    required String email,
    required String username,
    required String password,
    required String fullName,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final registerData = RegisterData(
        email: email,
        username: username,
        password: password,
        fullName: fullName,
      );

      final authResponse = await _authService.register(registerData);

      // Save tokens and user data
      await _storage.saveAccessToken(authResponse.accessToken);
      if (authResponse.refreshToken != null) {
        await _storage.saveRefreshToken(authResponse.refreshToken!);
      }
      await _storage.saveUser(authResponse.metadata);

      state = AuthState(
        user: authResponse.metadata,
        isAuthenticated: true,
        isLoading: false,
      );

      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  // Fetch current user
  Future<void> fetchCurrentUser() async {
    try {
      final user = await _authService.getCurrentUser();
      await _storage.saveUser(user);

      state = AuthState(
        user: user,
        isAuthenticated: true,
        isLoading: false,
      );
    } catch (e) {
      // If fetch fails, keep existing state
      state = state.copyWith(error: e.toString());
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      await _authService.logout();
    } catch (e) {
      // Ignore errors
    } finally {
      await _storage.clearAll();
      state = const AuthState(isAuthenticated: false);
    }
  }

  // Clear error
  void clearError() {
    state = state.copyWith(error: null);
  }
}

// Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
