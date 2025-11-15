import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product.dart';
import '../models/api_response.dart';
import '../services/product_service.dart';
import '../services/category_service.dart';

// Product list state
class ProductListState {
  final List<Product> products;
  final Metadata? metadata;
  final bool isLoading;
  final String? error;

  const ProductListState({
    this.products = const [],
    this.metadata,
    this.isLoading = false,
    this.error,
  });

  ProductListState copyWith({
    List<Product>? products,
    Metadata? metadata,
    bool? isLoading,
    String? error,
  }) {
    return ProductListState(
      products: products ?? this.products,
      metadata: metadata ?? this.metadata,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// Product list notifier
class ProductListNotifier extends StateNotifier<ProductListState> {
  final ProductService _productService = ProductService();

  ProductListNotifier() : super(const ProductListState());

  Future<void> fetchProducts({
    String? search,
    String? categoryId,
    String? sortBy,
    String? order,
    int? skip,
    int? limit,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final response = await _productService.getProducts(
        search: search,
        categoryId: categoryId,
        sortBy: sortBy,
        order: order,
        skip: skip,
        limit: limit,
      );

      state = ProductListState(
        products: response.data,
        metadata: response.metadata,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> deleteProduct(String id) async {
    try {
      await _productService.deleteProduct(id);
      // Remove from local state
      state = state.copyWith(
        products: state.products.where((p) => p.id != id).toList(),
      );
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}

// Product detail state
class ProductDetailState {
  final Product? product;
  final bool isLoading;
  final String? error;

  const ProductDetailState({
    this.product,
    this.isLoading = false,
    this.error,
  });

  ProductDetailState copyWith({
    Product? product,
    bool? isLoading,
    String? error,
  }) {
    return ProductDetailState(
      product: product ?? this.product,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// Product detail notifier
class ProductDetailNotifier extends StateNotifier<ProductDetailState> {
  final ProductService _productService = ProductService();

  ProductDetailNotifier() : super(const ProductDetailState());

  Future<void> fetchProduct(String id) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final product = await _productService.getProductById(id);
      state = ProductDetailState(
        product: product,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
}

// Category list state
class CategoryListState {
  final List<Category> categories;
  final bool isLoading;
  final String? error;

  const CategoryListState({
    this.categories = const [],
    this.isLoading = false,
    this.error,
  });

  CategoryListState copyWith({
    List<Category>? categories,
    bool? isLoading,
    String? error,
  }) {
    return CategoryListState(
      categories: categories ?? this.categories,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// Category list notifier
class CategoryListNotifier extends StateNotifier<CategoryListState> {
  final CategoryService _categoryService = CategoryService();

  CategoryListNotifier() : super(const CategoryListState());

  Future<void> fetchCategories() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final response = await _categoryService.getCategories(limit: 100);
      state = CategoryListState(
        categories: response.data,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
}

// Providers
final productListProvider =
    StateNotifierProvider<ProductListNotifier, ProductListState>((ref) {
  return ProductListNotifier();
});

final productDetailProvider =
    StateNotifierProvider<ProductDetailNotifier, ProductDetailState>((ref) {
  return ProductDetailNotifier();
});

final categoryListProvider =
    StateNotifierProvider<CategoryListNotifier, CategoryListState>((ref) {
  return CategoryListNotifier();
});
