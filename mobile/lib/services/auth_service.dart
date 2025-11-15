import '../models/user.dart';
import '../models/api_response.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _api = ApiService();

  // Login
  Future<AuthResponse> login(LoginCredentials credentials) async {
    try {
      final response = await _api.postFormData<Map<String, dynamic>>(
        '/auth/login',
        data: credentials.toJson(),
      );

      return AuthResponse.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Register
  Future<AuthResponse> register(RegisterData data) async {
    try {
      final response = await _api.post<Map<String, dynamic>>(
        '/auth/register',
        data: data.toJson(),
      );

      return AuthResponse.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Get current user
  Future<User> getCurrentUser() async {
    try {
      final response = await _api.get<Map<String, dynamic>>('/auth/me');
      return User.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      await _api.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    }
  }

  // Refresh token
  Future<Map<String, dynamic>> refreshToken(String refreshToken) async {
    try {
      final response = await _api.post<Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refresh_token': refreshToken},
      );

      return response;
    } catch (e) {
      rethrow;
    }
  }
}
