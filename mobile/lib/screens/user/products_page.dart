import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'dart:async';
import '../../providers/product_provider.dart';
import '../../config/app_config.dart';
import '../../widgets/product_card.dart';

class ProductsPage extends ConsumerStatefulWidget {
  const ProductsPage({super.key});

  @override
  ConsumerState<ProductsPage> createState() => _ProductsPageState();
}

class _ProductsPageState extends ConsumerState<ProductsPage> {
  final _searchController = TextEditingController();
  Timer? _debounce;

  String? _selectedCategoryId;
  String? _sortBy;
  String? _order = 'asc';
  int _currentPage = 1;
  final int _pageSize = AppConfig.defaultPageSize;

  @override
  void initState() {
    super.initState();
    // Fetch categories and products
    Future.microtask(() {
      ref.read(categoryListProvider.notifier).fetchCategories();
      _fetchProducts();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  void _fetchProducts() {
    final skip = (_currentPage - 1) * _pageSize;

    ref.read(productListProvider.notifier).fetchProducts(
          search: _searchController.text.isEmpty ? null : _searchController.text,
          categoryId: _selectedCategoryId,
          sortBy: _sortBy,
          order: _order,
          skip: skip,
          limit: _pageSize,
        );
  }

  void _onSearchChanged(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: AppConfig.searchDebounceDuration), () {
      _currentPage = 1;
      _fetchProducts();
    });
  }

  void _onCategoryChanged(String? categoryId) {
    setState(() {
      _selectedCategoryId = categoryId;
      _currentPage = 1;
    });
    _fetchProducts();
  }

  void _onSortChanged(String? sortBy) {
    setState(() {
      _sortBy = sortBy;
      _currentPage = 1;
    });
    _fetchProducts();
  }

  void _onOrderChanged(String? order) {
    setState(() {
      _order = order;
      _currentPage = 1;
    });
    _fetchProducts();
  }

  void _onPageChanged(int page) {
    setState(() {
      _currentPage = page;
    });
    _fetchProducts();
  }

  void _showFilterDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        final categoryState = ref.watch(categoryListProvider);
        String? tempCategoryId = _selectedCategoryId;
        String? tempSortBy = _sortBy;
        String? tempOrder = _order;

        return StatefulBuilder(
          builder: (context, setModalState) {
            return DraggableScrollableSheet(
              initialChildSize: 0.7,
              minChildSize: 0.5,
              maxChildSize: 0.9,
              expand: false,
              builder: (context, scrollController) {
                return Container(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Filters',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                      const Divider(),
                      Expanded(
                        child: ListView(
                          controller: scrollController,
                          children: [
                            // Category Filter
                            const Text(
                              'Category',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            DropdownButtonFormField<String>(
                              value: tempCategoryId,
                              decoration: const InputDecoration(
                                border: OutlineInputBorder(),
                                hintText: 'All Categories',
                              ),
                              items: [
                                const DropdownMenuItem(
                                  value: null,
                                  child: Text('All Categories'),
                                ),
                                ...categoryState.categories.map((category) {
                                  return DropdownMenuItem(
                                    value: category.id,
                                    child: Text(category.name),
                                  );
                                }),
                              ],
                              onChanged: (value) {
                                setModalState(() {
                                  tempCategoryId = value;
                                });
                              },
                            ),
                            const SizedBox(height: 16),

                            // Sort By
                            const Text(
                              'Sort By',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            DropdownButtonFormField<String>(
                              value: tempSortBy,
                              decoration: const InputDecoration(
                                border: OutlineInputBorder(),
                                hintText: 'Default',
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: null,
                                  child: Text('Default'),
                                ),
                                DropdownMenuItem(
                                  value: 'name',
                                  child: Text('Name'),
                                ),
                                DropdownMenuItem(
                                  value: 'price',
                                  child: Text('Price'),
                                ),
                                DropdownMenuItem(
                                  value: 'stock',
                                  child: Text('Stock'),
                                ),
                                DropdownMenuItem(
                                  value: 'created_at',
                                  child: Text('Date Created'),
                                ),
                              ],
                              onChanged: (value) {
                                setModalState(() {
                                  tempSortBy = value;
                                });
                              },
                            ),
                            const SizedBox(height: 16),

                            // Sort Order
                            const Text(
                              'Sort Order',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            DropdownButtonFormField<String>(
                              value: tempOrder,
                              decoration: const InputDecoration(
                                border: OutlineInputBorder(),
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: 'asc',
                                  child: Text('Ascending'),
                                ),
                                DropdownMenuItem(
                                  value: 'desc',
                                  child: Text('Descending'),
                                ),
                              ],
                              onChanged: (value) {
                                setModalState(() {
                                  tempOrder = value;
                                });
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                setState(() {
                                  _selectedCategoryId = null;
                                  _sortBy = null;
                                  _order = 'asc';
                                  _currentPage = 1;
                                });
                                _fetchProducts();
                                Navigator.pop(context);
                              },
                              child: const Text('Clear'),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () {
                                setState(() {
                                  _selectedCategoryId = tempCategoryId;
                                  _sortBy = tempSortBy;
                                  _order = tempOrder;
                                  _currentPage = 1;
                                });
                                _fetchProducts();
                                Navigator.pop(context);
                              },
                              child: const Text('Apply'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final productState = ref.watch(productListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search products...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _currentPage = 1;
                          _fetchProducts();
                        },
                      )
                    : null,
              ),
              onChanged: _onSearchChanged,
            ),
          ),

          // Products Grid
          Expanded(
            child: productState.isLoading
                ? const Center(child: CircularProgressIndicator())
                : productState.error != null
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.error_outline,
                                size: 48,
                                color: Colors.red,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                productState.error!,
                                textAlign: TextAlign.center,
                                style: const TextStyle(color: Colors.red),
                              ),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _fetchProducts,
                                child: const Text('Retry'),
                              ),
                            ],
                          ),
                        ),
                      )
                    : productState.products.isEmpty
                        ? const Center(
                            child: Text('No products found'),
                          )
                        : RefreshIndicator(
                            onRefresh: () async => _fetchProducts(),
                            child: GridView.builder(
                              padding: const EdgeInsets.all(16),
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: 0.75,
                                crossAxisSpacing: 12,
                                mainAxisSpacing: 12,
                              ),
                              itemCount: productState.products.length,
                              itemBuilder: (context, index) {
                                final product = productState.products[index];
                                return ProductCard(
                                  product: product,
                                  onTap: () => context.go('/products/${product.id}'),
                                );
                              },
                            ),
                          ),
          ),

          // Pagination
          if (productState.metadata != null && productState.metadata!.totalPages > 1)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.chevron_left),
                    onPressed: _currentPage > 1
                        ? () => _onPageChanged(_currentPage - 1)
                        : null,
                  ),
                  Text(
                    'Page $_currentPage of ${productState.metadata!.totalPages}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  IconButton(
                    icon: const Icon(Icons.chevron_right),
                    onPressed: _currentPage < productState.metadata!.totalPages
                        ? () => _onPageChanged(_currentPage + 1)
                        : null,
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
