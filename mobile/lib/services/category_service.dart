import '../models/product.dart';
import '../models/api_response.dart';
import 'api_service.dart';

class CategoryService {
  final ApiService _api = ApiService();

  // Get all categories
  Future<PaginatedResponse<Category>> getCategories({
    String? search,
    int? skip,
    int? limit,
  }) async {
    try {
      final queryParams = <String, dynamic>{};

      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (skip != null) queryParams['skip'] = skip;
      if (limit != null) queryParams['limit'] = limit;

      final response = await _api.get<Map<String, dynamic>>(
        '/categories',
        queryParameters: queryParams,
      );

      return PaginatedResponse<Category>.fromJson(
        response,
        (json) => Category.fromJson(json as Map<String, dynamic>),
      );
    } catch (e) {
      rethrow;
    }
  }

  // Get category by ID
  Future<Category> getCategoryById(String id) async {
    try {
      final response = await _api.get<Map<String, dynamic>>('/categories/$id');
      return Category.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Create category
  Future<Category> createCategory({
    required String name,
    String? description,
  }) async {
    try {
      final response = await _api.post<Map<String, dynamic>>(
        '/categories',
        data: {
          'name': name,
          if (description != null) 'description': description,
        },
      );

      return Category.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Update category
  Future<Category> updateCategory(
    String id, {
    String? name,
    String? description,
  }) async {
    try {
      final data = <String, dynamic>{};

      if (name != null) data['name'] = name;
      if (description != null) data['description'] = description;

      final response = await _api.put<Map<String, dynamic>>(
        '/categories/$id',
        data: data,
      );

      return Category.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Delete category
  Future<void> deleteCategory(String id) async {
    try {
      await _api.delete('/categories/$id');
    } catch (e) {
      rethrow;
    }
  }
}
