import '../models/product.dart';
import '../models/api_response.dart';
import 'api_service.dart';

class ProductService {
  final ApiService _api = ApiService();

  // Get all products with filters and pagination
  Future<PaginatedResponse<Product>> getProducts({
    String? search,
    String? categoryId,
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
      if (categoryId != null && categoryId.isNotEmpty) {
        queryParams['category_id'] = categoryId;
      }
      if (sortBy != null) queryParams['sort_by'] = sortBy;
      if (order != null) queryParams['order'] = order;
      if (skip != null) queryParams['skip'] = skip;
      if (limit != null) queryParams['limit'] = limit;

      final response = await _api.get<Map<String, dynamic>>(
        '/products',
        queryParameters: queryParams,
      );

      return PaginatedResponse<Product>.fromJson(
        response,
        (json) => Product.fromJson(json as Map<String, dynamic>),
      );
    } catch (e) {
      rethrow;
    }
  }

  // Get product by ID
  Future<Product> getProductById(String id) async {
    try {
      final response = await _api.get<Map<String, dynamic>>('/products/$id');
      return Product.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Create product
  Future<Product> createProduct(CreateProductData data) async {
    try {
      final response = await _api.post<Map<String, dynamic>>(
        '/products',
        data: data.toJson(),
      );

      return Product.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Update product
  Future<Product> updateProduct(String id, UpdateProductData data) async {
    try {
      final response = await _api.put<Map<String, dynamic>>(
        '/products/$id',
        data: data.toJson(),
      );

      return Product.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  // Delete product
  Future<void> deleteProduct(String id) async {
    try {
      await _api.delete('/products/$id');
    } catch (e) {
      rethrow;
    }
  }

  // Update stock
  Future<Product> updateStock(String id, int stock) async {
    try {
      final response = await _api.put<Map<String, dynamic>>(
        '/products/$id',
        data: {'stock': stock},
      );

      return Product.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }
}
