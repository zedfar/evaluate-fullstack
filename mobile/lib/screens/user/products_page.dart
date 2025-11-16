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
                            'Filter',
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
                              'Kategori',
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
                                hintText: 'Semua Kategori',
                              ),
                              items: [
                                const DropdownMenuItem(
                                  value: null,
                                  child: Text('Semua Kategori'),
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
                              'Urutkan Berdasarkan',
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
                                hintText: 'Standar',
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: null,
                                  child: Text('Standar'),
                                ),
                                DropdownMenuItem(
                                  value: 'name',
                                  child: Text('Nama'),
                                ),
                                DropdownMenuItem(
                                  value: 'price',
                                  child: Text('Harga'),
                                ),
                                DropdownMenuItem(
                                  value: 'stock',
                                  child: Text('Stok'),
                                ),
                                DropdownMenuItem(
                                  value: 'created_at',
                                  child: Text('Terbaru'),
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
                              'Urutan',
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
                                  child: Text('Naik (A-Z, 0-9)'),
                                ),
                                DropdownMenuItem(
                                  value: 'desc',
                                  child: Text('Turun (Z-A, 9-0)'),
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
                              child: const Text('Bersihkan'),
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
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFFF6B00),
                              ),
                              child: const Text('Terapkan'),
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
        title: const Text('Daftar Produk'),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black87,
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
                hintText: 'Cari produk...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFFFF6B00)),
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
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFFF6B00), width: 2),
                ),
              ),
              onChanged: _onSearchChanged,
            ),
          ),

          // Products Grid
          Expanded(
            child: productState.isLoading
                ? const Center(
                    child: SizedBox(
                      width: 48,
                      height: 48,
                      child: CircularProgressIndicator(
                        color: Color(0xFFFF6B00),
                        strokeWidth: 3,
                      ),
                    ),
                  )
                : productState.error != null
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.error_outline,
                                size: 64,
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
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFFF6B00),
                                ),
                                child: const Text('Coba Lagi'),
                              ),
                            ],
                          ),
                        ),
                      )
                    : productState.products.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(
                                  Icons.shopping_bag_outlined,
                                  size: 64,
                                  color: Colors.grey,
                                ),
                                SizedBox(height: 16),
                                Text(
                                  'Tidak ada produk ditemukan',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.black87,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: () async => _fetchProducts(),
                            color: const Color(0xFFFF6B00),
                            child: GridView.builder(
                              padding: const EdgeInsets.all(16),
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: 0.68,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
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
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Colors.grey[200]!)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Total: ${productState.metadata!.total} produk',
                    style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.chevron_left),
                        color: _currentPage > 1 ? const Color(0xFFFF6B00) : Colors.grey,
                        onPressed: _currentPage > 1
                            ? () => _onPageChanged(_currentPage - 1)
                            : null,
                      ),
                      Text(
                        'Hal $_currentPage / ${productState.metadata!.totalPages}',
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                      ),
                      IconButton(
                        icon: const Icon(Icons.chevron_right),
                        color: _currentPage < productState.metadata!.totalPages
                            ? const Color(0xFFFF6B00)
                            : Colors.grey,
                        onPressed: _currentPage < productState.metadata!.totalPages
                            ? () => _onPageChanged(_currentPage + 1)
                            : null,
                      ),
                    ],
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
