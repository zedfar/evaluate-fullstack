import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/product_provider.dart';
import '../../config/app_config.dart';

class DashboardPage extends ConsumerStatefulWidget {
  const DashboardPage({super.key});

  @override
  ConsumerState<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends ConsumerState<DashboardPage> {
  final _searchController = TextEditingController();
  String? _selectedCategoryId;
  String? _sortBy = 'created_at';
  String? _order = 'desc';
  int _currentPage = 1;
  final int _pageSize = AppConfig.adminPageSize;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(categoryListProvider.notifier).fetchCategories();
      _fetchProducts();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
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

  Future<void> _deleteProduct(String id, String name) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Product'),
        content: Text('Are you sure you want to delete "$name"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm == true && mounted) {
      try {
        await ref.read(productListProvider.notifier).deleteProduct(id);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Product deleted successfully'),
              backgroundColor: Colors.green,
            ),
          );
          _fetchProducts();
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to delete product: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final productState = ref.watch(productListProvider);
    final categoryState = ref.watch(categoryListProvider);
    final currencyFormatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Management'),
        actions: [
          IconButton(
            icon: const Icon(Icons.people),
            onPressed: () => context.go('/admin/users'),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Logout'),
                  content: const Text('Are you sure you want to logout?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(false),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(true),
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              );

              if (confirm == true && mounted) {
                await ref.read(authProvider.notifier).logout();
                if (mounted) context.go('/login');
              }
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Filters
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[100],
            child: Column(
              children: [
                // Search
                TextField(
                  controller: _searchController,
                  decoration: const InputDecoration(
                    hintText: 'Search products...',
                    prefixIcon: Icon(Icons.search),
                  ),
                  onSubmitted: (_) {
                    _currentPage = 1;
                    _fetchProducts();
                  },
                ),
                const SizedBox(height: 12),

                // Category and Sort
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedCategoryId,
                        decoration: const InputDecoration(
                          labelText: 'Category',
                          isDense: true,
                        ),
                        items: [
                          const DropdownMenuItem(
                            value: null,
                            child: Text('All'),
                          ),
                          ...categoryState.categories.map((cat) {
                            return DropdownMenuItem(
                              value: cat.id,
                              child: Text(cat.name),
                            );
                          }),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _selectedCategoryId = value;
                            _currentPage = 1;
                          });
                          _fetchProducts();
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _sortBy,
                        decoration: const InputDecoration(
                          labelText: 'Sort',
                          isDense: true,
                        ),
                        items: const [
                          DropdownMenuItem(value: 'name', child: Text('Name')),
                          DropdownMenuItem(value: 'price', child: Text('Price')),
                          DropdownMenuItem(value: 'stock', child: Text('Stock')),
                          DropdownMenuItem(
                              value: 'created_at', child: Text('Date')),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _sortBy = value;
                            _currentPage = 1;
                          });
                          _fetchProducts();
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Products List
          Expanded(
            child: productState.isLoading
                ? const Center(child: CircularProgressIndicator())
                : productState.error != null
                    ? Center(child: Text(productState.error!))
                    : productState.products.isEmpty
                        ? const Center(child: Text('No products found'))
                        : RefreshIndicator(
                            onRefresh: () async => _fetchProducts(),
                            child: ListView.builder(
                              itemCount: productState.products.length,
                              itemBuilder: (context, index) {
                                final product = productState.products[index];
                                Color stockColor = Colors.green;
                                if (product.stock == 0) {
                                  stockColor = Colors.red;
                                } else if (product.stock <
                                    product.lowStockThreshold) {
                                  stockColor = Colors.red;
                                } else if (product.stock ==
                                    product.lowStockThreshold) {
                                  stockColor = Colors.orange;
                                }

                                return Card(
                                  margin: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 8,
                                  ),
                                  child: ListTile(
                                    leading: Container(
                                      width: 50,
                                      height: 50,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[200],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: product.imageUrl != null
                                          ? ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                              child: Image.network(
                                                product.imageUrl!,
                                                fit: BoxFit.cover,
                                                errorBuilder:
                                                    (context, error, stack) {
                                                  return const Icon(
                                                    Icons.inventory_2,
                                                    color: Colors.grey,
                                                  );
                                                },
                                              ),
                                            )
                                          : const Icon(
                                              Icons.inventory_2,
                                              color: Colors.grey,
                                            ),
                                    ),
                                    title: Text(
                                      product.name,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    subtitle: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          currencyFormatter.format(product.price),
                                          style: const TextStyle(
                                            color: Colors.blue,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            Container(
                                              width: 8,
                                              height: 8,
                                              decoration: BoxDecoration(
                                                color: stockColor,
                                                shape: BoxShape.circle,
                                              ),
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              'Stock: ${product.stock}',
                                              style: TextStyle(
                                                color: stockColor,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    trailing: PopupMenuButton(
                                      itemBuilder: (context) => [
                                        const PopupMenuItem(
                                          value: 'view',
                                          child: Text('View'),
                                        ),
                                        const PopupMenuItem(
                                          value: 'edit',
                                          child: Text('Edit'),
                                        ),
                                        const PopupMenuItem(
                                          value: 'delete',
                                          child: Text('Delete'),
                                        ),
                                      ],
                                      onSelected: (value) {
                                        if (value == 'view') {
                                          context.go('/products/${product.id}');
                                        } else if (value == 'delete') {
                                          _deleteProduct(
                                              product.id, product.name);
                                        }
                                      },
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
          ),

          // Pagination
          if (productState.metadata != null)
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Total: ${productState.metadata!.total}'),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.chevron_left),
                        onPressed: _currentPage > 1
                            ? () {
                                setState(() => _currentPage--);
                                _fetchProducts();
                              }
                            : null,
                      ),
                      Text('Page $_currentPage of ${productState.metadata!.totalPages}'),
                      IconButton(
                        icon: const Icon(Icons.chevron_right),
                        onPressed:
                            _currentPage < productState.metadata!.totalPages
                                ? () {
                                    setState(() => _currentPage++);
                                    _fetchProducts();
                                  }
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
