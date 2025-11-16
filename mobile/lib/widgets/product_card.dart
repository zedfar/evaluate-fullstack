import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/product.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback? onTap;

  const ProductCard({
    super.key,
    required this.product,
    this.onTap,
  });

  Color _getStockBgColor() {
    switch (product.stockStatus) {
      case 'red':
        return const Color(0xFFFEE2E2); // red-100
      case 'yellow':
        return const Color(0xFFFFEDD5); // orange-100
      case 'green':
        return const Color(0xFFDCFCE7); // green-100
      default:
        return Colors.grey[100]!;
    }
  }

  Color _getStockTextColor() {
    switch (product.stockStatus) {
      case 'red':
        return const Color(0xFFDC2626); // red-600
      case 'yellow':
        return const Color(0xFFEA580C); // orange-600
      case 'green':
        return const Color(0xFF16A34A); // green-600
      default:
        return Colors.grey[600]!;
    }
  }

  String _getStockLabel() {
    switch (product.stockStatus) {
      case 'red':
        return 'Habis';
      case 'yellow':
        return 'Terbatas';
      case 'green':
        return 'Tersedia';
      default:
        return 'Unknown';
    }
  }

  String _formatPrice(double price) {
    return NumberFormat('#,##0', 'id_ID').format(price);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[200]!),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image
            Container(
              height: 140,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12),
                  topRight: Radius.circular(12),
                ),
              ),
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12),
                  topRight: Radius.circular(12),
                ),
                child: product.imageUrl != null && product.imageUrl!.isNotEmpty
                    ? Image.network(
                        product.imageUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(
                            Icons.shopping_bag_outlined,
                            size: 48,
                            color: Colors.grey,
                          );
                        },
                      )
                    : const Icon(
                        Icons.shopping_bag_outlined,
                        size: 48,
                        color: Colors.grey,
                      ),
              ),
            ),

            // Product Info
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category Badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF), // blue-50
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        product.category?.name ?? 'Uncategorized',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF1D4ED8), // blue-700
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Product Name
                    Text(
                      product.name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: Colors.black,
                        height: 1.5,
                      ),
                    ),
                    const Spacer(),

                    // Price & Stock Section
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Price and Stock Badge Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            // Price
                            Expanded(
                              child: Text(
                                'Rp ${_formatPrice(product.price)}',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFFFF6B00), // orange-500
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 4),

                            // Stock Badge
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: _getStockBgColor(),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 6,
                                    height: 6,
                                    decoration: BoxDecoration(
                                      color: _getStockTextColor(),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    _getStockLabel(),
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w500,
                                      color: _getStockTextColor(),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),

                        // Stock Count
                        Text(
                          'Stok: ${product.stock} unit',
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
