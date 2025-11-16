import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../providers/product_provider.dart';

class ProductDetailPage extends ConsumerStatefulWidget {
  final String productId;

  const ProductDetailPage({
    super.key,
    required this.productId,
  });

  @override
  ConsumerState<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends ConsumerState<ProductDetailPage> {
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    // Fetch product details
    Future.microtask(() {
      ref.read(productDetailProvider.notifier).fetchProduct(widget.productId);
    });
  }

  Color _getStockColor(int stock, int threshold) {
    if (stock == 0) return Colors.red;
    if (stock < threshold) return Colors.red;
    if (stock == threshold) return Colors.orange;
    return Colors.green;
  }

  String _getStockText(int stock, int threshold) {
    if (stock == 0) return 'Out of Stock';
    if (stock < threshold) return 'Low Stock';
    return 'In Stock';
  }

  void _incrementQuantity() {
    final product = ref.read(productDetailProvider).product;
    if (product != null && _quantity < product.stock) {
      setState(() {
        _quantity++;
      });
    }
  }

  void _decrementQuantity() {
    if (_quantity > 1) {
      setState(() {
        _quantity--;
      });
    }
  }

  void _handleBuy() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Added $_quantity item(s) to cart'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final productState = ref.watch(productDetailProvider);
    final currencyFormatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Detail'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: productState.isLoading
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
                          onPressed: () {
                            ref
                                .read(productDetailProvider.notifier)
                                .fetchProduct(widget.productId);
                          },
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                )
              : productState.product == null
                  ? const Center(child: Text('Product not found'))
                  : SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Product Image
                          Container(
                            width: double.infinity,
                            height: 300,
                            color: Colors.grey[200],
                            child: productState.product!.imageUrl != null
                                ? Image.network(
                                    productState.product!.imageUrl!,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) {
                                      return const Icon(
                                        Icons.image_not_supported,
                                        size: 80,
                                        color: Colors.grey,
                                      );
                                    },
                                  )
                                : const Icon(
                                    Icons.inventory_2,
                                    size: 80,
                                    color: Colors.grey,
                                  ),
                          ),

                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Product Name
                                Text(
                                  productState.product!.name,
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),

                                // Category
                                if (productState.product!.category != null)
                                  Chip(
                                    label: Text(
                                      productState.product!.category!.name,
                                    ),
                                    backgroundColor: Colors.blue[100],
                                  ),
                                const SizedBox(height: 16),

                                // Price
                                Text(
                                  currencyFormatter.format(
                                    productState.product!.price,
                                  ),
                                  style: const TextStyle(
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.blue,
                                  ),
                                ),
                                const SizedBox(height: 16),

                                // Stock Status
                                Row(
                                  children: [
                                    Container(
                                      width: 12,
                                      height: 12,
                                      decoration: BoxDecoration(
                                        color: _getStockColor(
                                          productState.product!.stock,
                                          productState
                                              .product!.lowStockThreshold,
                                        ),
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      _getStockText(
                                        productState.product!.stock,
                                        productState.product!.lowStockThreshold,
                                      ),
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: _getStockColor(
                                          productState.product!.stock,
                                          productState
                                              .product!.lowStockThreshold,
                                        ),
                                      ),
                                    ),
                                    const Spacer(),
                                    Text(
                                      '${productState.product!.stock} available',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 24),

                                // Description
                                if (productState.product!.description != null &&
                                    productState.product!.description!.isNotEmpty)
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Description',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        productState.product!.description!,
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: Colors.grey[700],
                                          height: 1.5,
                                        ),
                                      ),
                                      const SizedBox(height: 24),
                                    ],
                                  ),

                                // Creator Info
                                if (productState.product!.creator != null)
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Created by',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          CircleAvatar(
                                            backgroundColor: Colors.blue,
                                            child: Text(
                                              productState
                                                  .product!.creator!.username[0]
                                                  .toUpperCase(),
                                              style: const TextStyle(
                                                  color: Colors.white),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                productState
                                                    .product!.creator!.username,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              // Only show email if it exists
                                              if (productState.product!.creator!.email != null)
                                                Text(
                                                  productState
                                                      .product!.creator!.email!,
                                                  style: TextStyle(
                                                    fontSize: 12,
                                                    color: Colors.grey[600],
                                                  ),
                                                ),
                                            ],
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 24),
                                    ],
                                  ),

                                // Quantity Selector
                                if (productState.product!.stock > 0)
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Quantity',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          IconButton(
                                            onPressed: _decrementQuantity,
                                            icon: const Icon(Icons.remove_circle_outline),
                                            iconSize: 32,
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 24,
                                              vertical: 8,
                                            ),
                                            decoration: BoxDecoration(
                                              border: Border.all(
                                                color: Colors.grey[300]!,
                                              ),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Text(
                                              _quantity.toString(),
                                              style: const TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                          IconButton(
                                            onPressed: _incrementQuantity,
                                            icon: const Icon(Icons.add_circle_outline),
                                            iconSize: 32,
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 100),
                                    ],
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
      bottomNavigationBar: productState.product != null &&
              productState.product!.stock > 0
          ? SafeArea(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.3),
                      spreadRadius: 1,
                      blurRadius: 5,
                      offset: const Offset(0, -2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Total Price',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                          Text(
                            currencyFormatter.format(
                              productState.product!.price * _quantity,
                            ),
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                            ),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: _handleBuy,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 16,
                        ),
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text(
                        'Add to Cart',
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : null,
    );
  }
}
