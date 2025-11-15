import '../models/user.dart';
import '../models/api_response.dart';
import 'api_service.dart';

class UserService {
  final ApiService _api = ApiService();

  // Get all users with filters and pagination
  Future<PaginatedResponse<User>> getUsers({
    String? search,
    String? sortBy,
    String? order,
    int? skip,
    int? limit,
  }) async {
    try {
      final queryParams = <String, dynamic>{};

      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (sortBy != null) queryParams['sort_by'] = sortBy;
      if (order != null) queryParams['order'] = order;
      if (skip != null) queryParams['skip'] = skip;
      if (limit != null) queryParams['limit'] = limit;

      final response = await _api.get<Map<String, dynamic>>(
        '/users',
        queryParameters: queryParams,
      );

      return PaginatedResponse<User>.fromJson(
        response,
        (json) => User.fromJson(json as Map<String, dynamic>),
      );
    } catch (e) {
      rethrow;
    }
  }

  // Get user by ID
  Future<User> getUserById(String id) async {
    try {
      final response = await _api.get<Map<String, dynamic>>('/users/$id');
      return User.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Create user
  Future<User> createUser({
    required String email,
    required String username,
    required String password,
    required String fullName,
    required String roleId,
  }) async {
    try {
      final response = await _api.post<Map<String, dynamic>>(
        '/users',
        data: {
          'email': email,
          'username': username,
          'password': password,
          'full_name': fullName,
          'role_id': roleId,
        },
      );

      return User.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Update user
  Future<User> updateUser(
    String id, {
    String? email,
    String? username,
    String? fullName,
    String? roleId,
    bool? isActive,
  }) async {
    try {
      final data = <String, dynamic>{};

      if (email != null) data['email'] = email;
      if (username != null) data['username'] = username;
      if (fullName != null) data['full_name'] = fullName;
      if (roleId != null) data['role_id'] = roleId;
      if (isActive != null) data['is_active'] = isActive;

      final response = await _api.put<Map<String, dynamic>>(
        '/users/$id',
        data: data,
      );

      return User.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Delete user
  Future<void> deleteUser(String id) async {
    try {
      await _api.delete('/users/$id');
    } catch (e) {
      rethrow;
    }
  }

  // Toggle user active status
  Future<User> toggleActiveStatus(String id, bool isActive) async {
    try {
      final response = await _api.put<Map<String, dynamic>>(
        '/users/$id',
        data: {'is_active': isActive},
      );

      return User.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }
}
