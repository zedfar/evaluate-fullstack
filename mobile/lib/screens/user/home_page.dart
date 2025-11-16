import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/product_provider.dart';
import '../../widgets/product_card.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final _searchController = TextEditingController();
  Timer? _debounce;
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    // Fetch featured products (first 8 items)
    Future.microtask(() {
      ref.read(productListProvider.notifier).fetchProducts(
            limit: 8,
            sortBy: 'created_at',
            order: 'desc',
          );
    });

    // Listen to search changes for debounce indicator
    _searchController.addListener(() {
      if (_debounce?.isActive ?? false) {
        setState(() => _isSearching = true);
      }
    });
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  void _handleSearch() {
    final query = _searchController.text.trim();
    if (_debounce?.isActive ?? false) _debounce!.cancel();

    setState(() => _isSearching = true);

    _debounce = Timer(const Duration(milliseconds: 500), () {
      setState(() => _isSearching = false);
      if (query.isNotEmpty) {
        context.go('/products?search=$query');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final productState = ref.watch(productListProvider);

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(productListProvider.notifier).fetchProducts(
                limit: 8,
                sortBy: 'created_at',
                order: 'desc',
              );
        },
        child: CustomScrollView(
          slivers: [
            // Hero Section with Background Image and Header
            SliverToBoxAdapter(
              child: Stack(
                children: [
                  // Hero Background with Image
                  Container(
                    height: 400,
                    decoration: const BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage(
                          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600',
                        ),
                        fit: BoxFit.cover,
                      ),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.4),
                      ),
                    ),
                  ),

                  // Header with Logo and User Menu
                  Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    child: SafeArea(
                      child: Container(
                        height: 60,
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Logo
                            GestureDetector(
                              onTap: () {},
                              child: Row(
                                children: [
                                  const Text(
                                    'LOGO',
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: Colors.white,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // User Menu
                            PopupMenuButton<String>(
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 8,
                                ),
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.keyboard_arrow_down,
                                      color: Colors.white,
                                      size: 16,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      authState.user?.username ?? 'User',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      width: 28,
                                      height: 28,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[300],
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(
                                        Icons.person,
                                        size: 16,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              itemBuilder: (context) => [
                                PopupMenuItem(
                                  value: 'logout',
                                  child: Row(
                                    children: const [
                                      Icon(Icons.logout, color: Colors.red),
                                      SizedBox(width: 12),
                                      Text(
                                        'Logout',
                                        style: TextStyle(
                                          color: Colors.red,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                              onSelected: (value) async {
                                if (value == 'logout') {
                                  final confirm = await showDialog<bool>(
                                    context: context,
                                    builder: (context) => AlertDialog(
                                      title: const Text('Logout'),
                                      content: const Text(
                                        'Apakah Anda yakin ingin keluar?',
                                      ),
                                      actions: [
                                        TextButton(
                                          onPressed: () =>
                                              Navigator.of(context).pop(false),
                                          child: const Text('Batal'),
                                        ),
                                        TextButton(
                                          onPressed: () =>
                                              Navigator.of(context).pop(true),
                                          style: TextButton.styleFrom(
                                            foregroundColor: Colors.red,
                                          ),
                                          child: const Text('Logout'),
                                        ),
                                      ],
                                    ),
                                  );

                                  if (confirm == true && mounted) {
                                    await ref
                                        .read(authProvider.notifier)
                                        .logout();
                                    if (mounted) {
                                      context.go('/login');
                                    }
                                  }
                                }
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Hero Content (Search Section)
                  Positioned(
                    bottom: 32,
                    left: 20,
                    right: 20,
                    child: Column(
                      children: [
                        // Text
                        const Text(
                          'Cari Furnitur Impian',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Cari furnitur mulai dari meja, lemari, hingga rak disini',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.white.withOpacity(0.8),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Search Bar
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                height: 52,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(26),
                                  border: Border.all(color: Colors.grey[200]!),
                                ),
                                child: TextField(
                                  controller: _searchController,
                                  decoration: InputDecoration(
                                    hintText: 'Cari produk',
                                    hintStyle: TextStyle(color: Colors.grey[500]),
                                    border: InputBorder.none,
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 20,
                                      vertical: 16,
                                    ),
                                    suffixIcon: _isSearching
                                        ? const Padding(
                                            padding: EdgeInsets.all(14.0),
                                            child: SizedBox(
                                              width: 18,
                                              height: 18,
                                              child: CircularProgressIndicator(
                                                strokeWidth: 2,
                                                color: Colors.grey,
                                              ),
                                            ),
                                          )
                                        : null,
                                  ),
                                  onChanged: (value) => _handleSearch(),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              width: 52,
                              height: 52,
                              decoration: BoxDecoration(
                                color: _searchController.text.trim().isNotEmpty
                                    ? const Color(0xFFFF6B00)
                                    : Colors.grey[300],
                                shape: BoxShape.circle,
                              ),
                              child: IconButton(
                                icon: const Icon(
                                  Icons.search,
                                  color: Colors.white,
                                ),
                                onPressed: _searchController.text.trim().isNotEmpty
                                    ? () {
                                        context.go(
                                          '/products?search=${_searchController.text.trim()}',
                                        );
                                      }
                                    : null,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Recommendations Section
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Rekomendasi',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w600,
                                color: Colors.black87,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Produk - produk pilihan terbaik dari kami',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.black54,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    OutlinedButton(
                      onPressed: () => context.go('/products'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 10,
                        ),
                        side: BorderSide(color: Colors.grey[300]!),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Lihat Semua Produk',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.black87,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Products Grid
            if (productState.isLoading)
              const SliverFillRemaining(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 48,
                        height: 48,
                        child: CircularProgressIndicator(
                          color: Color(0xFFFF6B00),
                          strokeWidth: 3,
                        ),
                      ),
                      SizedBox(height: 16),
                      Text(
                        'Loading products...',
                        style: TextStyle(color: Colors.black54),
                      ),
                    ],
                  ),
                ),
              )
            else if (productState.error != null)
              SliverFillRemaining(
                child: Center(
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
                          onPressed: () {
                            ref.read(productListProvider.notifier).fetchProducts(
                                  limit: 8,
                                  sortBy: 'created_at',
                                  order: 'desc',
                                );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFF6B00),
                          ),
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                ),
              )
            else if (productState.products.isEmpty)
              SliverFillRemaining(
                child: Center(
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
                      SizedBox(height: 8),
                      Text(
                        'Belum ada produk yang tersedia',
                        style: TextStyle(color: Colors.black54),
                      ),
                    ],
                  ),
                ),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.68,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final product = productState.products[index];
                      return ProductCard(
                        product: product,
                        onTap: () => context.go('/products/${product.id}'),
                      );
                    },
                    childCount: productState.products.length,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
